前后端地址:https://github.com/dohaof/Sweatflix

打包平台 ：Windows

额外实现：（1）收藏功能，非管理员用户可以收藏运动场馆，在场馆列表中可以查看收藏的场馆，并且可以同搜索功能配合使用

（2）即时通知功能，用户在收藏运动场馆有新的可预约时间段或者评论被点赞时会收到通知，而且基于WebScoket实现新消息的通知，客户端不需要发送请求，服务端就可以通知客户端有新消息。

数据库文件：SFDataBase.db

注意后端需要当前目录下有数据库文件才可以运行

以及源代码中删去了阿里云OSS的密钥（否则被检测到会限制API使用），需在application.properties中填上