# webrtc-test

#### 介绍
express+socket.io+webrtc实现一对一视频通话

#### 软件架构
软件架构说明


#### 安装教程

1.  这里是两个项目，client是前端，server是信令服务器
2.  npm install
3.  前端：npm run serve 信令服务器：node app

#### 使用说明

1.  信令服务器的证书是openssl生成的，启动之后要访问一下 socket的链接地址 来信任证书
2.  （注意这里是修改服务端ip与端口）服务端口默认使用8081，地址为本机ip 前端项目可在client/vue.config.js里修改要连接到的 socket服务端口与地址（地址现在是默认获取本机ip的，尽量不要修改，端口可以在server/app.js与vue.config.js中自行修改）
3.  最好在谷歌浏览器里运行


#### 参与贡献

1.  Fork 本仓库
2.  新建 Feat_xxx 分支
3.  提交代码
4.  新建 Pull Request


#### 特技

1.  使用 Readme\_XXX.md 来支持不同的语言，例如 Readme\_en.md, Readme\_zh.md
2.  Gitee 官方博客 [blog.gitee.com](https://blog.gitee.com)
3.  你可以 [https://gitee.com/explore](https://gitee.com/explore) 这个地址来了解 Gitee 上的优秀开源项目
4.  [GVP](https://gitee.com/gvp) 全称是 Gitee 最有价值开源项目，是综合评定出的优秀开源项目
5.  Gitee 官方提供的使用手册 [https://gitee.com/help](https://gitee.com/help)
6.  Gitee 封面人物是一档用来展示 Gitee 会员风采的栏目 [https://gitee.com/gitee-stars/](https://gitee.com/gitee-stars/)
