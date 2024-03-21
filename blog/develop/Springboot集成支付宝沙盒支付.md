---
slug: learn-pay-zhifubao
title: Springboot集成支付宝沙盒支付
date: 2023-10-11
authors: mochi
tags: [学习, code, Java, Pay]
keywords: [学习, code, Java, Pay]
---
## 1.开发前准备

### 1.1 支付宝沙盒配置

#### 1.1.1 注册支付宝开发者账号，进入开发者控制台

    [https://openhome.alipay.com/platform/developerIndex.htm](https://openhome.alipay.com/platform/developerIndex.htm)

#### 1.1.2 沙盒入口

    [https://open.alipay.com/develop/sandbox/app](https://open.alipay.com/develop/sandbox/app)

    ![](https://ooo.0x0.ooo/2023/10/11/O108IM.png)

![](https://ooo.0x0.ooo/2023/10/11/O10uFG.png)

    将上面的APPID、支付宝网关消息、应用密钥和支付宝公钥保管好，下面会使用到。

## 2  集成沙盒支付

### 2.1 再pom.xml文件中添加下面依赖

```xml
<dependency>
    <groupId>com.alipay.sdk</groupId>
    <artifactId>alipay-easysdk</artifactId>
    <version>2.2.0</version>
</dependency>
<dependency>
   <groupId>com.alipay.sdk</groupId>
   <artifactId>alipay-sdk-java</artifactId>
   <version>4.22.110.ALL</version>
</dependency>
```

### 2.2 在application.yml 里面进行配置:

```yaml
alipay:
  appId: APPID
  appPrivateKey: 应用私钥 
  alipayPublicKey: 支付宝公钥
  notifyUrl: 后面再填
```

### 2.3 创建AlipayConfig.java

```java
import com.alipay.easysdk.factory.Factory;
import com.alipay.easysdk.kernel.Config;
import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;

@Data
@Component
@ConfigurationProperties(prefix = "alipay")
public class AliPayConfig {
    private String appId;
    private String appPrivateKey;
    private String alipayPublicKey;
    private String notifyUrl;

    @PostConstruct
    public void init(){
        //设置参数（全局只需要设置一次）
        Config config = new Config();
        config.protocol = "https";
        config.gatewayHost = "openapi-sandbox.dl.alipaydev.com";
        config.signType = "RSA2";
        config.appId = this.appId;
        config.merchantPrivateKey = this.appPrivateKey;
        config.alipayPublicKey = this.alipayPublicKey;
        config.notifyUrl = this.notifyUrl;
        Factory.setOptions(config);
        System.out.println("=====支付宝SDK初始化成功=====");
    }
}
```

### 2.4 支付接口

#### 2.4.1 新建一个AliPay.java

```java
import lombok.Data;

@Data
public class AliPay {
    private String traceNo;
    private double totalAmount;
    private String subject;
    private String alipayTraceNo;
}
```

#### 2.4.2 新建一个AliPayController.java

```java
import cn.hutool.json.JSONObject;
import com.alipay.api.AlipayApiException;
import com.alipay.api.AlipayClient;
import com.alipay.api.DefaultAlipayClient;
import com.alipay.api.request.AlipayTradePagePayRequest;
import com.alipay.easysdk.factory.Factory;
import com.example.learnrabbitmq.config.AliPayConfig;
import com.example.learnrabbitmq.model.AliPay;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.HashMap;
import java.util.Map;

/**
 * Author: 刘春江
 * Date: 2023/10/10 13:02
 */
@RestController
@RequestMapping("alipay")
@Transactional(rollbackFor = Exception.class)
public class AliPayController {

    @Resource
    AliPayConfig aliPayConfig;

    private static final String GATEWAY_URL ="https://openapi-sandbox.dl.alipaydev.com/gateway.do";
    private static final String FORMAT ="JSON";
    private static final String CHARSET ="UTF-8";
    private static final String SIGN_TYPE ="RSA2";

    @GetMapping("pay")
    public void pay(AliPay aliPay, HttpServletResponse httpResponse) throws IOException {
        AlipayClient alipayClient = new DefaultAlipayClient(GATEWAY_URL, aliPayConfig.getAppId(),
                aliPayConfig.getAppPrivateKey(), FORMAT, CHARSET, aliPayConfig.getAlipayPublicKey(), SIGN_TYPE);

        // 2. 创建 Request并设置Request参数
        AlipayTradePagePayRequest request = new AlipayTradePagePayRequest();  // 发送请求的 Request类
        request.setNotifyUrl(aliPayConfig.getNotifyUrl());
        JSONObject bizContent = new JSONObject();
        bizContent.set("out_trade_no", aliPay.getTraceNo());  // 我们自己生成的订单编号
        bizContent.set("total_amount", aliPay.getTotalAmount()); // 订单的总金额
        bizContent.set("subject", aliPay.getSubject());   // 支付的名称
        bizContent.set("product_code", "FAST_INSTANT_TRADE_PAY");  // 固定配置
        request.setBizContent(bizContent.toString());

        // 执行请求，拿到响应的结果，返回给浏览器
        String form = "";
        try {
            form = alipayClient.pageExecute(request).getBody(); // 调用SDK生成表单
        } catch (AlipayApiException e) {
            e.printStackTrace();
        }
        httpResponse.setContentType("text/html;charset=" + CHARSET);
        httpResponse.getWriter().write(form);// 直接将完整的表单html输出到页面
        httpResponse.getWriter().flush();
        httpResponse.getWriter().close();
    }

  
```

### 2.5 接口测试

    测试的url格式:

```plaintext
http://localhost:你的端口/alipay/pay?subject=任意填&traceNo=任意填&totalAmount=填数字
age：http://localhost:8081/alipay/pay?subject=test&traceNo=666&totalAmount=1000
```

    成功截图：

    ![](https://ooo.0x0.ooo/2023/10/11/O10IR1.png)

然后使用沙盒账号中的买家账号进行登录

![](https://ooo.0x0.ooo/2023/10/11/O1039I.png)

成功界面：

![](https://ooo.0x0.ooo/2023/10/11/O10wUD.png)

### 2.6 回调接口

    在AliPayController.java添加以下代码

```java
@PostMapping("/notify")
    public String payNotify(HttpServletRequest request) throws Exception {
        if (request.getParameter("trade_status").equals("TRADE_SUCCESS")) {
            System.out.println("=========支付宝异步回调========");

            Map<String, String> params = new HashMap<>();
            Map<String, String[]> requestParams = request.getParameterMap();
            for (String name : requestParams.keySet()) {
                params.put(name, request.getParameter(name));
                // System.out.println(name + " = " + request.getParameter(name));
            }

            String tradeNo = params.get("out_trade_no");
            String gmtPayment = params.get("gmt_payment");
            String alipayTradeNo = params.get("trade_no");
            // 支付宝验签
            if (Factory.Payment.Common().verifyNotify(params)) {
                // 验签通过
                System.out.println("交易名称: " + params.get("subject"));
                System.out.println("交易状态: " + params.get("trade_status"));
                System.out.println("支付宝交易凭证号: " + params.get("trade_no"));
                System.out.println("商户订单号: " + params.get("out_trade_no"));
                System.out.println("交易金额: " + params.get("total_amount"));
                System.out.println("买家在支付宝唯一id: " + params.get("buyer_id"));
                System.out.println("买家付款时间: " + params.get("gmt_payment"));
                System.out.println("买家付款金额: " + params.get("buyer_pay_amount"));

            }
        }
        return "success";
    }
}
```

 使用该接口必须在外网的条件下，这里作者使用内外穿透来实现。

内外穿透：[https://natapp.cn/](https://natapp.cn/)

观看该文档：[https://natapp.cn/article/natapp_newbie](https://natapp.cn/article/natapp_newbie)

本地端口改为自己的端口。

得到地址之后在application.yml中的notifyUrl去添加。

再次调用pay接口，支付完成后后台会打印出以下内容。

![](https://ooo.0x0.ooo/2023/10/11/O1cMyF.png)

## 这就是全篇内容了，感谢您的阅读，菠萝屋祝你愉快的度过每一天。
