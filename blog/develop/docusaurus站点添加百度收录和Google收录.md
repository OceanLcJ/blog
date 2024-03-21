---
slug: seo-baidu-google
title: docusaurus站点添加百度收录和Google收录
date: 2024-03-21
authors: mochi
tags: [随笔, code, seo]
keywords: [随笔, code, seo]
---
<!-- truncate -->


## 一、添加百度收录

### 1. 通过百度搜索到你的站点查看是否搜录

    ``text             site:www.example.com(你的域名)         ``
    一般来说你没有收录就是这样的结果
    ![未收录截图](https://img2.imgtp.com/2024/03/21/dIiUwaee.jpg)

### 2.登录[百度站长平台](https://ziyuan.baidu.com/linksubmit/url?sitename=http%3A%2F%2Fsite%3Awww.baidu2.com)

    将自己的域名填入，然后根据提示提交即可。

### 3.进行验证

    选择HTML文件验证,将文件放入到static文件夹下。

## 二、添加Google收录

### 1.登录[Google站长平台](https://search.google.com/search-console/about)

### 2.添加站点

    选择网页前缀，将自己的域名填入，然后根据提示提交即可。

### 3.添加验证

    选择HTML文件验证,将文件放入到static文件夹下。
