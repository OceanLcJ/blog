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

## 四、加载翻译文件

### 1、翻译文件

说明
我的翻译文件放在了“public”目录中，但，其实，翻译文件也可以放在其它目录中，只要在i18n.js文件中配置好想应的路径即可。

翻译文件是一个json文件，json文件可以是嵌套格式，也可以不嵌套。这两种，最终，在引用时会稍有不同。

（不嵌套）

```txt
{
  "aaa": "hi",
}
```

（嵌套）

```txt
{
  "bbb":{
        "aaa":"hi",
        } 
}
```

### 2、i18n.js文件

说明：
这个文件，是导入翻译文件的，关键是配置翻译文件的路径，要和你的翻译文件所在的路径保持一致。

路径中的${locale}表示语言。

```txt
import { getRequestConfig } from "next-intl/server";

// Create this configuration once per request and 
// make it available to all Server Components.
export default getRequestConfig(async ({ locale }) => ({
  // Load translations for the active locale.
  messages: (await import(`./public/locales/${locale}/common.json`)).default,
}));
```

### 3、next.config.js的配置

```txt
/** @type {import('next').NextConfig} */
const nextConfig = {}
const withNextIntl = require("next-intl/plugin")("./i18n.js");

module.exports =withNextIntl( nextConfig)
```

## 五、实现翻译

#### layout.js中的代码

```txt
import "./globals.css";
import { NextIntlClientProvider, useMessages } from 'next-intl';
import { locales } from '@/navigation';
import Header from '@/components/Header'
import Footer from '@/components/Footer'
export default function RootLayout({
  children, params: { locale }
}) {
  if (!locales.includes(locale)) {
    notFound();
  } 
       const messages = useMessages();

  return (
    <html lang={locale}>
      <NextIntlClientProvider locale={locale} messages={messages}>
      <body><Header />{children}<Footer /></body>
      </NextIntlClientProvider>
    </html>
  );
}
```

#### page.js中的代码

参数locale表示当前的语言。

如果翻译文件是不嵌套的方式，则const t = useTranslations();

如果翻译文件是嵌套的方式，则根据文件结构和实际需要，用类似：const t = useTranslations(“bbb“);

```txt
import { useTranslations } from 'next-intl';
import { Link } from '@/navigation';
export default function Home({ params: { locale } }) {
  const t = useTranslations();

  return (<>   
<Link href={"/"}><h1>{t("aaa")}</h1></Link>
</>)
```

## 六、语言切换器

```txt
"use client";
import { useLocale } from "next-intl";
import { localeItems, useRouter, usePathname, defaultLocale } from '@/navigation';
export default function LangSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  console.log(locale)

  const handleChange = (e) => {
    router.push(pathname, { locale: e.target.value });
  };
 
  return (
    <div>
      <select
      value={locale}
        onChange={handleChange}
        className="h-8 m-2 p-1 rounded border-current"
      >
        <option value={locale} > {GetLangData(locale).name}</option>

        {localeItems.map((item) => {

          if (item.code === locale) return null
          return (<option key={item.code} value={item.code}>
            {item.name}
          </option>)
        })}
      </select>
    </div>
  );
}
export function GetLangData(defaultLocale) {
  var res = {}
  {
    localeItems.map(locale => {
      if (locale.code === defaultLocale) {
        console.log(locale)
        res = locale
      }
    })
  }
  return res

}
```

## 七、SEO和搜索引擎友好

#### 1、Meta data

nextjs的APP路由器，生成页面的title和Meta data，我尝试了三种方式：

##### 第一种方式：在layout.js中直接使用：expert const metadata={}

##### 第二种方式：在page.js中使用动态生成Meta data

可参考：[Optimizing: Metadata | Next.js (nextjs.org)](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)

##### 第三种方式：直接在page.js中写title标签和Meta标签

所以，page.js的代码改成了这样：

```txt

import { useTranslations } from 'next-intl';
import { Link } from '@/navigation';
export default function Home({ params: { locale } }) {
  const t = useTranslations();

  return (<>  
          <title>{t("site-name")}</title>
        <meta name="keyword" content={t("site-name")}></meta>
        <meta name="description" content={t("site-description")}></meta>
        <meta property="og:type" content="website"></meta>
        <meta property="og:title" content={t("site-name")}></meta>
        <meta property="og:description" content={t("site-description")}></meta>
        <meta property="og:site_name" content={t("site-name")}></meta>
        <meta property="og:image" content="/images/xxx.png"></meta>
        <meta property="og:image:width" content="512"></meta>
        <meta property="og:image:height" content="512"></meta>
        <meta property="og:image:alt" content=""></meta>
 
<Link href={"/"}><h1>{t("aaa")}</h1></Link>
</>)

```

#### 2、多语言导航：让搜索引擎更容易发现多语言URL

语言切换器是前端渲染的，所以，我在页面的底部，也就是组件Footer.js中增加了后端渲染的多语言导航。点击相应的语言就会进入此语言的网站首页。
Footer.js代码如下：

```txt
import Link from 'next/link'
import { localeItems,defaultLocale } from '@/navigation';


export default function Footer(){


  return (<>
    <div className="divider"></div>
    <footer className="footer footer-center p-10 bg-base-200 text-base-content rounded">
      <nav className="flex flex-wrap gap-4">

     {localeItems.map(locale => {
          if (locale.code === defaultLocale) return(<Link className="link link-hover" href="/"  key={locale.code}>{locale.name}</Link>)
          const thehref="/"+locale.code
          return (<Link className="link link-hover" href={thehref} key={locale.code}> {locale.name}</Link>)
        })} 
  </nav> 
      <aside className='p-6 text-center'>
        <p>Copyright © 2024 - All right reserved by xxx.com</p>
      </aside>
     
    </footer>
  </>
    
  )
}
```

## 八、总结

国际化路由、翻译文件的结构和引入、翻译的实现。无论哪种国际化方案，都会涉及到这三个方面。虽然都不叫麻烦，但总的来说，next-intl相对还是简单一些。

## 九、参考

[A Deep Dive into Next.js App Router Localization with next-intl](https://phrase.com/blog/posts/next-js-app-router-localization-next-intl/)

[A complete guide for setting up next-intl with the App Router](https://i18nexus.com/tutorials/nextjs/next-intl)
