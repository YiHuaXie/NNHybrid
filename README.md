# NNHybrid

## 项目介绍

基于React Native+Redux实现的一个混合开发App，目前只兼容iOS，后续会对功能再进行完善，并且兼容Andriod。

这个项目是用来学习RN的练手项目，我自己也是边看边写的，所以项目还是会有比较多的问题，如果您有任何问题或者建议，欢迎留言反馈，我会第一时间进行回复，谢谢！

## 项目运行

### 环境配置

+ 最好有一个vpn
+ 首先本地要具备RN的环境（项目中的React版本号为0.58.6）
+ `npm install`
+ `react-native link`
+ 进入NNHybridiOS目录下， `pod install`，最好先`pod repo update`再进行`pod install`

### 运行

这里使用真机iPhone7进行调试

+ 使用VSCode打开项目，接着执行`npm start`；
+ 使用Xcode打开NNHybridiOS，进入到`RNContainerViewController`，将里面的IP地址切换成你电脑的IP，确保手机和电脑在同一个局域网中；
+ 替换掉调试的证书和SDK的key，目前项目中只使用了高德地图；
+ 接着就像运行平常的项目一样运行即可。

## 项目效果图

<img width="150" height="451.2" src="https://nnhybrid.oss-cn-hangzhou.aliyuncs.com/home.jpg"/><img width="150" height="504.6" src="https://nnhybrid.oss-cn-hangzhou.aliyuncs.com/apartment.jpg"/><img width="150" height="480" src="https://nnhybrid.oss-cn-hangzhou.aliyuncs.com/houseDetail.jpg"/>

<img width="150" height="266.8" src="https://nnhybrid.oss-cn-hangzhou.aliyuncs.com/cityListPage.jpg"/><img width="150" height="266.8" src="https://nnhybrid.oss-cn-hangzhou.aliyuncs.com/share.jpg"/><img width="150" height="266.8" src="https://nnhybrid.oss-cn-hangzhou.aliyuncs.com/addressOnMap.jpg"/>





