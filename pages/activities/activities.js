// pages/activities/activities.js
const app = getApp()

Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Title: app.globalData.title,

    activityList: [],

    targerActivityIndex:'',
  },

  listActivity:function(){
    var url = getApp().globalData.serverUrl + getApp().globalData.activityPath;
    var that = this;

    wx.request({
      url: url,
      method: 'GET',
      data: {
        'withAssigment': 'no',
      },
      success: function (res) {
        //console.log(res.data);
        that.setData({ activityList:res.data});
      },
    });
  },

  updateActivity:function(e){
    console.log(e);
    let index = e.currentTarget.dataset.idx;
    wx.navigateTo({
      url: './editor?method=update&idx='+index,
    })
  },

  deleteActivity:function(e){
    
    var that = this;
    var idx = that.data.targerActivityIndex;
    var id = that.data.activityList[idx].id;

    that.hideModal();

    var url = getApp().globalData.serverUrl + getApp().globalData.activityPath + "/" + id;

    wx.request({
      url: url,
      method: 'DELETE',
      data: {
        //'id': id,
      },
      success: function (res) {
        console.log(res.data);
        that.listActivity();
      },
    });
  },

  showModal(e) {
    console.log(e);
    this.setData({
      modalName: e.currentTarget.dataset.target,
      targerActivityIndex:e.currentTarget.dataset.idx,
    })
  },

  hideModal(e) {
    this.setData({
      modalName: null
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },

  /**
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getTabBar().setData({ selected: 2 });
    this.listActivity();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})