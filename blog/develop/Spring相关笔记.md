---
slug: spring-learning
title: Spring性格笔记
date: 2024-01-12
authors: mochi
tags: [spring, 面试, 笔记]
keywords: [spring, 面试, 笔记]
image: https://springdoc.cn/logo-512.webp
---

## 一、Spring框架中的单例bean是现场安全的吗？

​ 不是线程安全的

​ Spring框架中有一个@Scope注解，默认的值就是singleton，单例的。

​ 因为一般在spring的bean的中都是注入无状态的对象，没有线程安全问题，如果在bean中定义了可修改的成员变量，是要考虑线程安全问题的，可以使用多例或者加锁来解决。

## 二、什么是AOP？

​ AOP称为面向切面编程，用于将那些与业务无关，但却对多个对象产生影响的公共行为和逻辑，抽取并封装为一个可重用的模块，这个模块被命名为“切面”（Aspect），减少系统中的重复代码，降低了模块间的耦合度，同时提高了系统的可维护性。

​ 常见的AOP使用场景：

- 记录操作日志
- 缓存处理
- Spring中内置的事务处理

核心是：使用aop中环绕通知+切点表达式(找到要记录日志的方法), 通过环绕通知的参数获取请求方法的参数(类、方法、注解、请求方式等)，获取到这些参数以后，保存到数据库。

## 三、Spring中的事务是如何实现的

​ Spring支持编程式事务管理和声明式事务管理两种方式。

- 编程式事务控制：需使用TranscationTemplate来进行实现，对业务代码有侵入性，项目中很少使用。

- 声明式事务管理：声明式事务管理建立在AOP之上的。其本质式通过AOP功能，对方法前后进行拦截，将事务处理的功能编织到拦截的方法中，也就是在目标方法开始之前加入一个事务，在执行完目标方法之后根据执行情况提交或者回滚事务。

  ```java
  @Around("pointcut()")
  public Object around(ProceedingJoinPoint joinPoint) throws Throwable{
   try{
    //开始事务
    //执行业务代码
    Object proceed = joinPoint.proceed();
    //提交事务
    return proceed;
   }catch (Exception e){
    e.printStackTrace();
    //回滚事务
   }
  }
  ```

## 四、Spring中事务失效的场景有哪些？

1. 异常捕获处理

   原因：事务通知只有捉到了目标抛出的异常，才能进行后续的回滚处理，如果目标自己处理掉异常，事务通知无法知悉。

   解决：在catch块添加throw new RuntimeException(e)抛出

2. 抛出检查异常

   原因：Spring默认只会回滚非检查异常

   解决：配置rollbackFor属性 @Transcational(rollbackFor = Exception.class)

3. 非public方法

   原因：Spring为方法创建代理、添加事务通知、前提条件都是该方法时public的

   解决：改为public方法

## 五、Spring的bean的生命周期

1. 通过BeanDefinition获取bean的定义信息
2. 调用构造函数实例化bean
3. bean的依赖注入
4. 处理Aware接口(BeanNameAware、BeanFactoryAware、ApplicationContextAware)
5. Bean的后置处理器BeanPostProcessor-前置
6. 初始化方法(InitializingBean、init-method)
7. Bean的后置处理器BeanPostProcessor-后置
8. 销毁Bean

## 六、Spring中的循环引用

​ 循环引用就是两个或两个以上的bean互相持有对方，最终形成闭环。比如A依赖于B，B依赖于A。

​ spring框架依据三级缓存已经解决了大部分的循环依赖

1. 一级缓存：单例池，缓存已经经历了完整的生命周期，已经初始化完成的bean对象。

2. 二级缓存：缓存早期的bean对象（生命周期还没有走完）

3. 三级缓存：缓存的时ObjectFactory，表示对象工厂，用来创建某个对象的。

   衍生：

   构造方法出现了循环引用怎么解决？

   场景：A依赖于B，B依赖于A，注入方式是构造函数。

   原因：由于bean的生命周期中构造函数是第一个执行的，spring框架并不能解决构造函数的依赖注入

   解决方法：

   使用@Lazy进行懒加载，什么时候需要对象再进行bean对象的创建

   ```java
   public A（@Lazy B b）{
    this.b = b;
   }
   ```

## 七、Springboot自动配置原理

   1. 在Spring Boot项目中的引导类上有一个注解@SpringBootApplication，这个注解是对三个注解进行了封装，分别是：

      - @SpringBootConfiguration
      - @EnableAutoConfiguration
      - @ComponentScan

   2. 其中@EnableAutoConfiguration是实现自动化配置的核心注解。该注解通过@Import注解导入对应的配置选择器。

      内部就是读取了该项目和该项目引用的Jar包的classpath路径下META-INF/spring.factories文件中的所配置的类和全类名。在这些配置类中所定义的Bean会根据条件注解所指定的条件来决定是否需要将其导入到Spring容器中。

   3. 条件判断会有像@ConditionalOnClass这样的注解，判断是否有对应的class文件，如果有则加载该类，把这个配置类的所以的Bean放入spring容器中使用。
