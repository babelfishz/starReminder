//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

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

    // 获取系统状态栏信息
    wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;
        let custom = wx.getMenuButtonBoundingClientRect();
        this.globalData.Custom = custom;
        this.globalData.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
      }
    })

    try {
      const value = wx.getStorageSync('isAlpEnabled');
      //console.log(value);
      //if (value) {
        this.globalData.alpEnabled = value;
      //}
    } catch (e) {
        this.globalData.alpEnabled = false;
    }
    
    //console.log(this.globalData.alpEnabled );
    
  },

  globalData: {
    userInfo: null,

    title:'星星日程',

    serverUrl: "http://47.74.251.157/",
    taskPath: 'api/task',
    activityPath: 'api/activity',
    assignmentPath: 'api/assignment',  

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