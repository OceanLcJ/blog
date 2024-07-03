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

## 二、目录结构

```txt
|app
..[locale]
...layout.js
...page.js
|components
..LangSwitcher.js
|public
..locales
...en
....common.json
...es
....common.json
|i18n.js
|navigation.js
|middleware.js
|next.config.js
```

## 三、国际化路由

### 1、novigation.js

这是个配置文件，这个文件中配置的项目会在其它一些文件中调用。

```txt
import { createSharedPathnamesNavigation } from 'next-intl/navigation';

export const locales = ['en', 'de', 'es', 'ja','ko','it','pt'];
export const localePrefix = 'as-needed';
export const defaultLocale= "en";
export const localeItems= [
  { name: "English",code: "en", iso: "en-US", dir: "ltr" },
  { name: "español",code: "es", iso: "es-ES", dir: "ltr" },
  { name: "中文",code: "zh_cn", iso: "zh-CN", dir: "ltr" },
  { name: "Deutsch",code: "de", iso: "de-DE", dir: "ltr" },
  { name: "Italiano",code: "it", iso: "it-IT", dir: "ltr" },
  { name: "日本語",code: "ja", iso: "ja-JP", dir: "ltr" },
  { name: "한국인",code: "ko", iso: "ko-KR", dir: "ltr" },
  { name: "Português",code: "pt", iso: "pt-PT", dir: "ltr" },
]

export const { Link, redirect, usePathname, useRouter } =
  createSharedPathnamesNavigation({ locales, localePrefix });
```

### 2、[locale]目录

app目录中的页面文件全部放到[locale]目录中。

### 3、中间件：middleware.js

#### 说明

实现以下样式的URL

默认语言的URL：

首页为：www.xxx.com

内页为：www.xxx.com/about

其它语言的URL：（以西班牙语为例）

首页为：www.xxx.com/es

内页为：www.xxx.com/es/about

另外，如果URL中输入了默认语言，比如默认语言为英语，用户输入URL：www.xxx.com/en

那么，将自动转到www.xxx.com

#### 代码

```txt
import createMiddleware from "next-intl/middleware";
import { defaultLocale, localePrefix, locales } from '@/navigation';
export default createMiddleware({
    locales,
    localePrefix ,
    defaultLocale,
    localeDetection: false,
    
  });
  
  export const config = {
    // Skip all paths that should not be internationalized.
    // This skips the folders "api", "_next" and all files
    // with an extension (e.g. favicon.ico)
    matcher: ["/((?!api|_next|.*\\..*).*)"],
  };
```



## 八、总结

国际化路由、翻译文件的结构和引入、翻译的实现。无论哪种国际化方案，都会涉及到这三个方面。虽然都不叫麻烦，但总的来说，next-intl相对还是简单一些。

## 九、参考

[A Deep Dive into Next.js App Router Localization with next-intl](https://phrase.com/blog/posts/next-js-app-router-localization-next-intl/)

[A complete guide for setting up next-intl with the App Router](https://i18nexus.com/tutorials/nextjs/next-intl)
