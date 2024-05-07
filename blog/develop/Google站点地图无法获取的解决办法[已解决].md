---
slug: google-sitmap
title: Google站点地图无法获取的解决办法[已解决]
date: 2024-05-07
authors: mochi
tags: [疑难杂症, code, google]
keywords: [疑难杂症, code, google]
---
您是否一直试图将您的站点地图添加到 [Google Search Console](https://search.google.com/search-console/welcome) 并且 Google 说 “无法获取” 无法读取此站点地图！

<!-- truncate -->

### 问题描述

    就像下图这样，真是给折磨了好久一直显示 google 站点地图错误无法获取。
    
    ![](https://img2.imgtp.com/2024/05/07/lUNpvMM4.jpg)

    ![](https://img2.imgtp.com/2024/05/07/YKXzR6kc.jpg)

### 解决方案
#### 方法一:

        第一步是确保可以获取您的站点地图，自己打开你的网站地图的链接地址，或者可以通过 Google Search Console 的网址检查中输入您的站点地图来完成。只需确保在页面获取下看到 “成功” 即可。

        现在您已经确认您的站点地图实际上可以被获取，让我们将状态从令人恼火的 “无法获取” 更改为令人赏心悦目的绿色 “成功” 消息。

        第二部您需要做的就是添加一个新的站点地图并在你的网站域名之后放置两个正斜杠 /，并在 .xml 之后放置另一个正斜杠，比如我的网站地图就是：https://www.blog.mochiworld.cn//sitemap.xml/

    ![](https://img2.imgtp.com/2024/05/07/x1WdVeHX.jpg)

    ![](https://img2.imgtp.com/2024/05/07/WLtKyVEi.jpg)

    然后只需再次提交您的站点地图，即可看到期待已久的成功站点地图提交状态！  怎么样，快去试试吧。

#### 方法二：

    还有不行的可以试着提交 www 和不带 www 的两种域名的谷歌站点地图，根据我的测试，也可以成功。

#### 方法三:
    一些 wordpress 用插件生成的网站地图，是站点地图索引的，您可以使用站点地图索引文件同时提交多个谷歌站点地图，也可以提交成功。

