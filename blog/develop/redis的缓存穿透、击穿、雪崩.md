---
slug: learn-Reids-cache
title: redis的缓存穿透、击穿、雪崩
date: 2024-02-21
authors: mochi
tags: [学习, code, Java, Redis]
keywords: [学习, code, Java, Redis]
image: https://pic.crazytaxii.com/Redis_Logo.png
---
<!-- truncate -->

## 1.缓存穿透(redis和mysql都 不存在的数据)

    查询一个**不存在**的数据，mysql查询不到数据也不会直接写入缓存，就会导致每次请求都查数据库。

    解决方法：

    1.缓存空数据，查询返回的数据为空，仍把这个空结果进行缓存

    优点：简单方便

    缺点：消耗内存，可能会发生不一致的问题（不存在的数据存在了，但是缓存中未修改）

    2.布隆过滤器

    bitmap(位图): 相当于是一个以（bit）位为单位的数组，数组中每个单位只能存储二进制0或1

    布隆过滤器作用: 布隆过滤器可以用于检索一个元素是否在一个集合中

    优点：内存占用较少，没有多余key

    缺点：实现复杂，存在误判

    3.增强id的复杂度，避免被猜测id规律

    4.做好数据的基础格式校验

    5.加强用户权限校验

    6.做好热点参数的限流

## 2.缓存击穿（热点访问并重建复杂的key失效）

    热点Key问题，就是一个被**高并发访问**并且**缓存重建业务较复杂**的key突然失效了，无数的请求访问会在瞬间给数据库带来巨大的冲击。

    解决方法：

    1.互斥锁

    2.逻辑过期

## 3.缓存雪崩（大量key过期或者Redis宕机）

    指在同一时段大量的缓存key同时失效或者Redis服务宕机，导致大量请求到达数据库，带来巨大压力。

    解决方法：

    1.给不同的Key的TTL添加随机值

    2.利用Redis集群提高服务的可用性

    3.给缓存业务添加降级限流策略

    4.给业务添加多级缓存

## 4.实现Redis缓存工具类， 解决缓存穿透和击穿

```java
/**
 * @Title: CacheClient
 * @Author ocean
 * @Package com.hmdp.utils
 * @Date 2024/2/25 19:11
 * @description: Redis缓存工具类， 解决缓存穿透和击穿
 */
@Slf4j
@Component
public class CacheClient {
    private final  StringRedisTemplate stringRedisTemplate;

    public CacheClient(StringRedisTemplate stringRedisTemplate) {
        this.stringRedisTemplate = stringRedisTemplate;
    }
  
    private static final ExecutorService CACHE_REBUILD_EXECUTOR = Executors.newFixedThreadPool(10);

    public void set(String key, Object value, Long time, TimeUnit unit){
        stringRedisTemplate.opsForValue().set(key, JSONUtil.toJsonStr(value), time, unit);
    }
  
    public void setWithLogicalExpire(String key, Object value, Long time, TimeUnit unit) {
        // 设置逻辑过期
        RedisData redisData = new RedisData();
        redisData.setData(value);
        redisData.setExpireTime(LocalDateTime.now().plusSeconds(unit.toSeconds(time)));
        // 写入Redis
        stringRedisTemplate.opsForValue().set(key, JSONUtil.toJsonStr(redisData));
    }
  
    //缓存null解决缓存穿透问题
    public <R, ID> R queryWithPassThrough(String keyPrefix, ID id, Class<R> type, Function<ID, R> dbFallback, Long time, TimeUnit unit){
        String key = keyPrefix + id;
        //1.从redis查询对应缓存
        String json = stringRedisTemplate.opsForValue().get(key);
        //2.判断是否存在
        if (StrUtil.isNotBlank(json)){
            //3.存在直接返回
            return JSONUtil.toBean(json, type);
        }

        // 判断命中的是否为空值
        if (json != null){
            // 返回一个null
            return null;
        }

        // 4.不存在，根据id查询数据库
        R r = dbFallback.apply(id);
	   	// 5.不存在返回null
        if (r == null){
            // 将null写入redis
            stringRedisTemplate.opsForValue().set(key, "", RedisConstants.CACHE_NULL_TTL, TimeUnit.MINUTES);
            // 返回一个null
            return null;
        }
		//6.存在写入redis
        this.setWithLogicalExpire(key, r, time, unit);
        return r;
    }
  
    //使用互斥锁解决缓存击穿问题
    public <R, ID> R queryWithMutex(String keyPrefix, ID id, Class<R> type, Function<ID, R> dbFallback, Long time, TimeUnit unit) {
        String key = keyPrefix + id;
        // 1.从redis查询对应缓存
        String shopJson = stringRedisTemplate.opsForValue().get(key);
        // 2.判断是否存在
        if (StrUtil.isNotBlank(shopJson)) {
            // 3.存在，直接返回
            return JSONUtil.toBean(shopJson, type);
        }
        // 判断命中的是否是空值
        if (shopJson != null) {
            // 返回一个错误信息
            return null;
        }

        // 4.实现缓存重建
        // 4.1.获取互斥锁
        String lockKey = LOCK_SHOP_KEY + id;
        R r = null;
        try {
            boolean isLock = tryLock(lockKey);
            // 4.2.判断是否获取成功
            if (!isLock) {
                // 4.3.获取锁失败，休眠并重试
                Thread.sleep(50);
                return queryWithMutex(keyPrefix, id, type, dbFallback, time, unit);
            }
            // 4.4.获取锁成功，根据id查询数据库
            r = dbFallback.apply(id);
            // 5.不存在，返回错误
            if (r == null) {
                // 将空值写入redis
                stringRedisTemplate.opsForValue().set(key, "", CACHE_NULL_TTL, TimeUnit.MINUTES);
                // 返回错误信息
                return null;
            }
            // 6.存在，写入redis
            this.set(key, r, time, unit);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }finally {
            // 7.释放锁
            unlock(lockKey);
        }
        // 8.返回
        return r;
    }
  
    //逻辑过期解决缓存击穿问题
    public <R, ID> R queryWithLogicalExpire(String keyPrefix, ID id, Class<R> type, Function<ID, R> dbFallback, Long time, TimeUnit unit)	{
        String key = keyPrefix + id;
        //1.从redis查询对应缓存
        String json = stringRedisTemplate.opsForValue().get(key);
        //2.判断逻辑过期缓存是否存在
        if (StrUtil.isBlank(json)){
            // 3.不存在，直接返回
            return null;
        }
        // 4. 存在，需要先把json反序列化为对象
        RedisData redisData = JSONUtil.toBean(json, RedisData.class);
        R r = JSONUtil.toBean((JSONObject) redisData.getData(), type);
        LocalDateTime expireTime = redisData.getExpireTime();
         // 5.判断是否过期
        if (expireTime.isAfter(LocalDateTime.now())){
            / 5.1.未过期，直接返回店铺信息
            return r;
        }
        // 5.2.已过期，需要缓存重建
        // 6.缓存重建
        // 6.1.获取互斥锁
        String lockKey = RedisConstants.LOCK_SHOP_KEY + id;
        boolean isLock = tryLock(lockKey);
        // 6.2.判断是否获取锁成功
        if (isLock){
            // 6.3.成功，开启独立线程，实现缓存重建
            CACHE_REBUILD_EXECUTOR.submit(() -> {
                try {
                    // 查询数据库
                    R r1 = dbFallback.apply(id);
                    // 重建缓存
                    this.setWithLogicalExpire(key, r1, time, unit);
                } catch (Exception e) {
                    throw new RuntimeException(e);
                }finally {
                    // 释放锁
                    unlock(lockKey);
                }

            });
        }
		// 6.4.返回过期的商铺信息
        return r;
    }
  
    private boolean tryLock(String key) {
        Boolean flag = stringRedisTemplate.opsForValue().setIfAbsent(key, "1", 10, TimeUnit.SECONDS);
        return BooleanUtil.isTrue(flag);
    }

    private void unlock(String key) {
        stringRedisTemplate.delete(key);
    }
}
```
