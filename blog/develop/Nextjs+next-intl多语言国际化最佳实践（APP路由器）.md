---
slug: next-intl-lang-routing
title: Nextjs+next-intl多语言国际化最佳实践（APP路由器）
date: 2024-06-30
authors: mochi
tags: [nextjs, code, 前端]
keywords: [nextjs, code, 前端]
---

Nextjs有两种路由器：APP路由器和Page路由器。但Page路由器将会是Nextjs逐渐淘汰的路由器。所以，最近，基于APP路由器，对Nextjs做了国际化。

<!--truncate-->

## 一、Nextjs国际化解决方案的选择

1、i18next + react-i18next + i18next-resources-to-backend + next-i18n-router
似乎大多数都在用这个，我试了一下，挺复杂，还没成功，所以放弃了。

2、next-i18n-router react-intl
看着也挺复杂，由于有1的阴影，放弃了。

3、next-intl
next-intl 是一个完整的nextjs的国际化方案，无须其它软件包。而且配置相对简单。更重要的是，我配置成功了，没遇到莫名其妙的问题。

所以，就是它了。

