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

    isAlpEnabled: 'false',
    alpUserName: app.globalData.alpUserName,
    alpUserPassword:app.globalData.alpUserPassword,
  },

  //事件处理函数
  bindViewTap: function() {
    /*wx.navigateTo({
      url: '../logs/logs'
    })*/
  },

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
