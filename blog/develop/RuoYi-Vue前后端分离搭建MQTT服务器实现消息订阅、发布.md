---
slug: learn-MQTT-Init
title: RuoYi-Vue前后端分离搭建MQTT服务器实现消息订阅、发布
date: 2023-09-21
authors: mochi
tags: [学习, code, Java, MQTT]
keywords: [学习, code, Java, MQTT]
---
<!-- truncate -->


## 1.在RuoYi-Vue项目的ruoyi-common模块下的pom.xml加入jar依赖

```xml
<!--mqtt依赖-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-integration</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.integration</groupId>
            <artifactId>spring-integration-stream</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.integration</groupId>
            <artifactId>spring-integration-mqtt</artifactId>
        </dependency>
```

## 2.在ruoyi-admin模块下的application.yml加入以下配置，加在spring下。

```yaml
  # mqtt
  mqtt:
    username: admin # 用户名
    password: admin # 密码
    hostUrl: tcp://broker.emqx.io:1883 # tcp://ip:端口
    clientId: mqttx_c428cc57111 # 客户端id 随便填，但是不可以和其他的mqtt的相同，要不然会导致另外一个疯狂重连
    defaultTopic: topic,topic1,update # 订阅主题
    timeout: 100 # 超时时间 （单位：秒）
    keepalive: 60 # 心跳 （单位：秒）
    enabled: true # 是否使用mqtt功能
```

## 3.在Ruoyi-common\src\main\java\com\superVisualization\common\utils目录下新建mqtt文件夹，添加以下三个文件

### MqttConfig.java

```java

@Component
@ConfigurationProperties("spring.mqtt")
public class MqttConfig {
    @Autowired
    private MqttPushClient mqttPushClient;
 
    /**
     * 用户名
     */
    private String username;
    /**
     * 密码
     */
    private String password;
    /**
     * 连接地址
     */
    private String hostUrl;
    /**
     * 客户Id
     */
    private String clientId;
    /**
     * 默认连接话题
     */
    private String defaultTopic;
    /**
     * 超时时间
     */
    private int timeout;
    /**
     * 保持连接数
     */
    private int keepalive;
    /**
     * mqtt功能使能
     */
    private boolean enabled;
 
    public String getUsername() {
        return username;
    }
 
    public void setUsername(String username) {
        this.username = username;
    }
 
    public String getPassword() {
        return password;
    }
 
    public void setPassword(String password) {
        this.password = password;
    }
 
    public String getHostUrl() {
        return hostUrl;
    }
 
    public void setHostUrl(String hostUrl) {
        this.hostUrl = hostUrl;
    }
 
    public String getClientId() {
        return clientId;
    }
 
    public void setClientId(String clientId) {
        this.clientId = clientId;
    }
 
    public String getDefaultTopic() {
        return defaultTopic;
    }
 
    public void setDefaultTopic(String defaultTopic) {
        this.defaultTopic = defaultTopic;
    }
 
    public int getTimeout() {
        return timeout;
    }
 
    public void setTimeout(int timeout) {
        this.timeout = timeout;
    }
 
    public int getKeepalive() {
        return keepalive;
    }
 
    public void setKeepalive(int keepalive) {
        this.keepalive = keepalive;
    }
 
    public boolean isEnabled() {
        return enabled;
    }
 
    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }
 
    @Bean
    public MqttPushClient getMqttPushClient() {
        if(enabled == true){
            String mqtt_topic[] = StringUtils.split(defaultTopic, ",");
            mqttPushClient.connect(hostUrl, clientId, username, password, timeout, keepalive);//连接
            for(int i=0; i<mqtt_topic.length; i++){
                mqttPushClient.subscribe(mqtt_topic[i], 0);//订阅主题
            }
        }
        return mqttPushClient;
    }
}
```

### MqttPushClient.java

```java
@Component
public class MqttPushClient {
    private static final Logger logger = LoggerFactory.getLogger(MqttPushClient.class);
 
    @Autowired
    private PushCallback pushCallback;
 
    private static MqttClient client;
 
    private static MqttClient getClient() {
        return client;
    }
 
    private static void setClient(MqttClient client) {
        MqttPushClient.client = client;
    }
 
    /**
     * 客户端连接
     *
     * @param host      ip+端口
     * @param clientID  客户端Id
     * @param username  用户名
     * @param password  密码
     * @param timeout   超时时间
     * @param keepalive 保留数
     */
    public void connect(String host, String clientID, String username, String password, int timeout, int keepalive) {
        MqttClient client;
        try {
            client = new MqttClient(host, clientID, new MemoryPersistence());
            MqttConnectOptions options = new MqttConnectOptions();
            options.setCleanSession(true);
            options.setUserName(username);
            options.setPassword(password.toCharArray());
            options.setConnectionTimeout(timeout);
            options.setKeepAliveInterval(keepalive);
            MqttPushClient.setClient(client);
            try {
                client.setCallback(pushCallback);
                client.connect(options);
            } catch (Exception e) {
                e.printStackTrace();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
 
    /**
     * 发布
     *
     * @param qos         连接方式
     * @param retained    是否保留
     * @param topic       主题
     * @param pushMessage 消息体
     */
    public AjaxResult publish(int qos, boolean retained, String topic, String pushMessage) {
        MqttMessage message = new MqttMessage();
        message.setQos(qos);
        message.setRetained(retained);
        message.setPayload(pushMessage.getBytes());
        MqttTopic mTopic = MqttPushClient.getClient().getTopic(topic);
        if (null == mTopic) {
            logger.error("topic not exist");
        }
        MqttDeliveryToken token;
        try {
            token = mTopic.publish(message);
            token.waitForCompletion();
            return success();
        } catch (MqttPersistenceException e)  {
            e.printStackTrace();
            return error();
        } catch (MqttException e) {
            e.printStackTrace();
            return error();
        }
    }
 
    /**
     * 订阅某个主题
     *
     * @param topic 主题
     * @param qos   连接方式
     */
    public void subscribe(String topic, int qos) {
        logger.info("开始订阅主题" + topic);
        try {
            MqttPushClient.getClient().subscribe(topic, qos);
        } catch (MqttException e) {
            e.printStackTrace();
        }
    }
 
}
```

### PushCallback.java

```java
(Throwable throwable) {
        // 连接丢失后，一般在这里面进行重连
        logger.info("连接断开，可以做重连");
        if (client == null || !client.isConnected()) {
            mqttConfig.getMqttPushClient();
        }
    }
 
    @Override
    public void messageArrived(String topic, MqttMessage mqttMessage) throws Exception {
        // subscribe后得到的消息会执行到这里面
        logger.info("接收消息主题 : " + topic);
        logger.info("接收消息Qos : " + mqttMessage.getQos());
        logger.info("接收消息内容 : " + new String(mqttMessage.getPayload()));
 
        _topic = topic;
        _qos = mqttMessage.getQos()+"";
        _msg = new String(mqttMessage.getPayload());
    }
 
    @Override
    public void deliveryComplete(IMqttDeliveryToken iMqttDeliveryToken) {
        logger.info("deliveryComplete---------" + iMqttDeliveryToken.isComplete());
    }
 
    //别的Controller层会调用这个方法来  获取  接收到的硬件数据
    public String receive() {
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("topic", _topic);
        jsonObject.put("qos", _qos);
        jsonObject.put("msg", _msg);
        return jsonObject.toString();
    }
 
}
```

## 4.安装[MQTT X测试工具](https://www.emqx.com/zh/try?product=MQTTX)

![这是下载界面的图片](https://ooo.0x0.ooo/2023/10/06/O1KtQb.png)

打开软件，新建连接，点击connect连接。

![](https://ooo.0x0.ooo/2023/10/06/O1K43l.png)

#### 1.模仿客户端定义服务器主题发送消息

    主题(topic)

    ![](https://ooo.0x0.ooo/2023/10/06/O1KHig.png)

#### 2.客户端发布消息给服务端

    在原来的mqtt文件夹添加以下文件

    MqttController.java

```java
@RestController
@RequestMapping("/mqtt")
public class MqttController {

    /**
     * 测试推送消息
     */
    @ResponseBody
    @GetMapping("/push")
    public AjaxResult push(@Param("qos") int qos, @Param("retained") boolean retained, @Param("topic") String topic, @Param("msg") String pushMessage){
        MqttPushClient mqttPushClient = new MqttPushClient();
        return  mqttPushClient.publish(qos, retained, topic, pushMessage);
    }
}
```

    首先在MQTT X软件里面订阅主题（update）

    ![](https://ooo.0x0.ooo/2023/10/06/O1KL4B.png)

    ![](https://ooo.0x0.ooo/2023/10/06/O1KE2s.png)

然后使用postman进行调用

![](https://ooo.0x0.ooo/2023/10/06/O1KQbK.png)

MQTT X接收到的内容

![](https://ooo.0x0.ooo/2023/10/06/O1KSma.png)

## 谢谢你的阅读，菠萝屋祝你有美好的一天！！！
