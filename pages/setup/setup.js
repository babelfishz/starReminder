//index.js
//获取应用实例
const app = getApp();

Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Title: app.globalData.title,

    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),

    userName:app.globalData.userName,
    password: app.globalData.password,
    
    isAlpEnabled: 'false',
    alpUserName: app.globalData.alpUserName,
    alpUserPassword:app.globalData.alpUserPassword,
  },

  //事件处理函数
  createUser:function(){
    let url = app.globalData.serverUrl + '/api/auth/signup';
    wx.request({
      url: url,
      data: {
        'name': 'lionfish',
        'email': 'test@example.com',
        'password': '123456',
        'password_confirmation':'123456',
      },
      header: {

      },
      method: 'POST',
      success: function (res) {
        console.log(res);
      },
      fail: function (res) { },
      complete: function (res) { },
    })

  },

  saveSetup: function (e) {
    //console.log(e);
    let userConfig = new Object();
    userConfig.userName = e.detail.value.userName;
    userConfig.password = e.detail.value.password;
    userConfig.token = null;

    try {
      wx.setStorageSync("userConfig", userConfig);
      wx.showToast({
        title: '保存成功',
        icon: 'none',
      })

      app.globalData.userName = userConfig.userName;
      app.globalData.password = userConfig.password;
      app.globalData.userToken = userConfig.token;

      /*wx.reLaunch({
        url: '../scheduler/scheduler',
      })*/
    } catch (e) {
      wx.showToast({
        title: '保存失败，请重试',
        icon: 'none',
      })
    }
  },

  /*test:function(e){
    let url= app.globalData.serverUrl + '/api/auth/activity'
    wx.request({
      url: url,
      method: 'GET',
      data: {
        'withAssigment': 'no',
      },
      header: {
        'Authorization': "Bearer " + app.globalData.userToken,
      },
      success: function (res) {
        console.log(res);
      },
    });
  },*/

  saveAlpSetup:function(e){
    //console.log(e);
    let alpUserInfo = new Object();
    alpUserInfo.userName = e.detail.value.userName;
    alpUserInfo.password = e.detail.value.password;
    
    try{
      wx.setStorageSync("alpUserInfo", alpUserInfo);
      wx.showToast({
        title: '保存成功',
        icon: 'none',
      })
    }catch(e){
        wx.showToast({
          title: '保存失败，请重试',
          icon: 'none',
        })
    }
  },

  isAlpEnabled(e) {
    let isAlpEnabled = e.detail.value;
    this.setData({isAlpEnabled:isAlpEnabled});
    app.globalData.alpEnabled = isAlpEnabled;
    wx.setStorageSync('isAlpEnabled', isAlpEnabled);
  },

  onShow:function(e){
    this.getTabBar().setData({selected:3});
  },

  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }

    //console.log(app.globalData);
    this.setData({isAlpEnabled:app.globalData.alpEnabled});
  },

  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
})
