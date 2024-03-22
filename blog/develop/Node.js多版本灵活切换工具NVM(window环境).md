---
slug: node-nvm
title: Node.js多版本灵活切换工具NVM(window环境)
date: 2024-03-23
authors: mochi
tags: [node, code, nvm]
keywords: [node, code, nvm]
---
<!-- truncate -->

## 1.前提

    在实际开发工作中，会经常切换各种不同的项目，且项目的node版本不一致。而node版本不一致会导致项目中的一些语法报错，为此需要借助nvm管理工具。

    **注意：**如果我们之前安装过nodejs，请将其卸载，打开控制面板即可卸载本地node。

## 2.NVM下载和安装

下载地址: [Releases · coreybutler/nvm-windows (github.com)](https://github.com/coreybutler/nvm-windows/releases "Releases · coreybutler/nvm-windows (github.com)")

![img](https://img-blog.csdnimg.cn/direct/b687e2d6c7a5492c8995fa1c464413d3.png "下载图片")

下载好进行安装，一直next就好了。

安装完成后。命令行执行nvm -v查看版本：

![img](https://img-blog.csdnimg.cn/direct/5da4ecd1ed1a4233aa60852c1c659538.png)

## 3.NVM命令介绍

* 安装特定版本的Node.js

  ```
  nvm install <version>
  ```
* 卸载特定版本的Node.js

  ```
  nvm uninstall <version>
  ```
* 切换Node.js版本

  ```
  nvm use <version>
  ```
* 查看已安装的Node.js

  ```
  nvm list
  ```

## 4.校验是否可用

    在命令行输入node -v查看版本成功即可。

## 5.结尾

感谢您的阅读，祝你生活愉快！😸😸😸
