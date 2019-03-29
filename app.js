//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    //var logs = wx.getStorageSync('logs') || []
    //logs.unshift(Date.now())
    //wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })

    /* 读取缓存的用户登录信息 */
    try {
      let userConfig = wx.getStorageSync('userConfig');
      //console.log(userConfig);

      if(userConfig){
        this.globalData.userName = userConfig.userName;
        this.globalData.password = userConfig.password;
        this.globalData.userToken = userConfig.token;
      }else{
        //this.globalData.userName = '';
        //this.globalData.userPassword = '';
        //this.globalData.userToken = null;
      }
      //console.log('read user config:',this.globalData);
    } catch (e) {
      //this.globalData.userName = '';
      //this.globalData.userPassword = '';      
      //this.globalData.userToken = null;
    }

    /*try{
      this.globalData.userToken = wx.getStorageSync('userToken');
    }catch(e){
      this.globalData.userToken = '';
    }*/
    
    // 获取系统状态栏信息
    wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;
        let custom = wx.getMenuButtonBoundingClientRect();
        this.globalData.Custom = custom;
        this.globalData.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
      }
    })

    /*获取缓存的ALP设置*/
    try {
      const value = wx.getStorageSync('isAlpEnabled');
      //console.log(value);
      //if (value) {
        this.globalData.alpEnabled = value;
      //}
    } catch (e) {
        this.globalData.alpEnabled = false;
    }

    try {
      const alpConfig = wx.getStorageSync('alpConfig');
      if (alpConfig) {
        if (alpConfig.token != null) {
          this.globalData.alpToken = alpConfig.token;
          this.globalData.alpUser = alpConfig.user;
          this.globalData.alpLogin = true;
        }
      }
    } catch (e) {
      console.log(e);
    }
    
    //console.log(this.globalData.alpEnabled );
    
  },

  globalData: {
    userInfo: null,

    title:'星星日程',

    serverUrl: "http://47.74.251.157",
    taskPath: '/api/task',
    activityPath: '/api/activity',
    assignmentPath: '/api/assignment', 
    loginPath:'/api/auth/login',

    userName:'presto@163.com',
    password: '123456',
    userLogin:false,
    userToken:'',

    /*for local data cache*/
    dataChanged: false, 

    /*ALP user related*/
    alpEnabled: true,
    alpUserName: 'jiazhang1@gmail.com',
    alpUserPassword: 'aaaaaaaa',

    alpUrl:"http://39.104.90.32:19090",
    alpLoginPath: "/api/login",
    alpUserTaskPath:"/api/userTask",
    alpUploadPath:"/api/upload",

    alpLogin: false,
    alpUser: null,
    alpToken: null,
  }
})