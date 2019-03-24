// pages/tasks/assign.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    task:'',
    activityList: [],
    activityChoosed:[],
  },

  listActivity: function () {
    var url = getApp().globalData.serverUrl + getApp().globalData.activityPath;
    var that = this;

    wx.request({
      url: url,
      method: 'GET',
      data: {
        'withAssignment': 'yes',
      },
      success: function (res) {
        //console.log(res);
        var activityList = res.data;
        var taskId = that.data.task.id;
        var taskSource = that.data.task.source;

        var i=0;
        while(activityList[i]){
          activityList[i].checked = false;
          var j=0;
          var tasks = activityList[i].tasks;
          while(tasks[j])
          {
            if(tasks[j].taskSource==taskSource && tasks[j].taskId == taskId){
              activityList[i].checked = true;
              break;
            }
            j++;
          }
          i++;
        };
        //console.log(activityList);

        that.setData({ activityList: activityList });
      },
    });
  },

  submitAssignment:function(e){
    var that = this;

    var url = getApp().globalData.serverUrl + getApp().globalData.assignmentPath;
    var chosen = JSON.stringify(that.data.activityChoosed);

    wx.request({
      url: url,
      method: 'POST',
      data: {
        'source': that.data.task.source,
        'taskId': that.data.task.id,
        'chosen': chosen ,
      },
      success: function (res) {
        //console.log(res);
        wx.navigateBack({
          delta: 1
        })
      },
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];  //上一个页面
    var that = this;

    that.setData({ task: prevPage.data.taskList[options.idx]});
    that.listActivity();

    //console.log(that.data);
  },

  checkboxChange:function(e){
      //console.log(e);
      var that = this;
      that.setData({activityChoosed:e.detail.value});
      //console.log(that.data);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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