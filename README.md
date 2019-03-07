# vue-music-app

> 基于 Vue+ vuex + vue-router + vue-axios +better-scroll + Stylus + ES6 等开发一款移动端音乐 WebApp，UI 界面参考了安卓版的网易云音乐、flex 布局适配常见移动端。

## 预览

#### 推荐、排行榜、歌手

![](doc\1.jpg)

#### 歌单详情

![](doc\2.jpg)

#### 播放器、播放列表

![](doc\3.jpg)

#### 搜索页面、个人中心

![](doc\4.jpg)

## 开发目的

学习开发一个完整的Vue 项目,了解ES6的模块化编程的好处,理解到Vue组件多处复用的便利性,以及一些网页优化和代码编写技巧.

## 技术栈

**前端**

- `Vue`：用于构建用户界面的 MVVM 框架
- `vue-router`：为单页面应用提供的路由系统，使用了 `Lazy Loading Routes` 技术来实现异步加载优化性能
- `vuex`：Vue 集中状态管理，在多个组件共享某些状态时非常便捷
- `vue-lazyload`：实现图片懒加载，节省用户流量，优化页面加载速度
- `better-scroll`：解决移动端各种滚动场景需求的插件，使移动端滑动体验更加流畅
- `Stylus`：css 预编译处理器
- `ES6`：ECMAScript 新一代语法，模块化、解构赋值、Promise、Class 等方法非常好用

**后端**

- `Node.js`：利用 Express 搭建的本地测试服务器
- `vue-axios`：用来请求后端 API 音乐数据
- `NeteaseCloudMusicApi`：网易云音乐 NodeJS 版 API，提供音乐数据

**其他工具**

- `lyric-parser`:  解析歌词的第三方插件
- `good-storage`:  更方便地操作LocalStorage和SessionStorage
- `faseclick`:  消除 click 移动游览器 300ms 的延时
- `vue-cli`:  Vue 脚手架工具，快速初始化项目代码

## 实现功能

播放器内核、推荐页面、热榜页面、歌手页面、歌单详情、歌手详情、排行榜详情、搜索页面、播放列表、用户中心等功能

### 推荐页面

推荐页分成三个部分，分别是 banner 轮播图、推荐歌单、推荐歌曲，数据都是使用 `axios` 请求 API 获取得到的，图片都使用 `vue-lazyload` 实现懒加载。

轮播图：使用 `better-scroll` 实现，具体可以看这里 [Slide](https://ustbhuangyi.github.io/better-scroll/doc/zh-hans/options-advanced.html#```snap```) 

推荐歌单，推荐歌曲：使用 `vuex` 管理数据，方便组件之间的数据交互（播放器播放歌曲)

### 排行榜页面

同样是通过 API 获取到排行榜的数据，但是因为 API 获取到的是排行榜中所有歌曲的数据，加载比较慢,有些影响用户体验.

### 歌手页面

实现歌手列表的左右联动,本身的实现也是基于`Better-scroll`提供的事件,监听`scroll`相关的变量,设置对应的`CSS`样式即可

### 歌曲列表组件

用来显示歌曲列表，在很多的地方都进行了复用，例如：歌单详情页、排行榜详情页、歌手详情页等

### 歌单详情页

通过歌单的 ID 来获取歌单中的歌曲数据,复用歌曲列表组件来显示歌曲。

### 排行榜详情、歌手详情

和歌单详情几乎类似,没有什么可说的

### 播放器

实现功能：顺序播放、单曲循环、随机播放、收藏等。

播放、暂停使用 HTML5 的 audio 实现。

数据、播放状态、播放历史、喜爱歌曲等方面使用了 `vuex` 来进行管理,可以实现多处数据的复用,真的很便捷

歌词部分获取到网易的歌词数据，然后使用 第三方库 [`lyric-parser`](https://github.com/ustbhuangyi/lyric-parser) 进行处理。实现显示歌词、拖动进度条歌词同步滚动、歌词跟随歌曲进度高亮。

通过 `localstorage` 存储喜欢歌曲、播放历史数据。

显示和管理当前播放歌曲，可以用来删除列表中的歌曲、以及选择播放歌曲。由于网易云接口需要等歌曲完全加载完，加载过程给予用户提示,或者实现边加载,缓存一部分就进行播放等方式。

### 搜索功能

实现功能：搜索歌手、歌单、歌曲、热门搜索、数据节流、上拉刷新、保存搜索记录。

通过关键字请求 API 获取搜索数据，显示歌手、歌曲。

实现了上刷新，因为搜索可以设置请求数据的条数，所以可以用来实现上刷新的功能。

通过节流函数实现数据节流，通过 `localstorage` 存储搜索数据。

### 用户中心

将在本地存储的数据显示出来，方便用户使用，后期准备添加更多功能。

## 最后

如果觉得我的项目还不错的话 :clap:，就给个 star :star: 鼓励一下吧~

## Build Setup

克隆代码到本地之后，需要运行 [NeteaseCloudMusicApi](https://binaryify.github.io/NeteaseCloudMusicApi/#/?id=neteasecloudmusicapi)起一个音乐的 API 接口

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```
