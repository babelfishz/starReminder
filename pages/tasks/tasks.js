// pages/tasks/tasks.js
const app = getApp();

Page({
  data: {
      StatusBar: app.globalData.StatusBar,
      CustomBar: app.globalData.CustomBar,
      Title: app.globalData.title,

      myTaskList:[],
      alpTaskList:[],
      tempList:[],
      taskList:[],

      targetTaskIndex:'',
  },

  listTask:function(){
    let that = this;
    if (app.globalData.alpEnabled == true && app.globalData.alpLogin == true) {
      that.getAlpUserTask();
    } else {
      that.data.tempList = [];
      that.getMyTask();
    }  
  },

  getAlpUserTask: function () {
    let that = this;
    let url = app.globalData.alpUrl + app.globalData.alpUserTaskPath + '/' + app.globalData.alpUser._id;

    wx.request({
      url: url,
      method: 'GET',
      header: {
        'content-type': 'application/json',
        'token': app.globalData.alpToken,
      },
      success: function (res) {
        //console.log("alp",res.data);
        that.data.alpTaskList = res.data;

        let taskList = [];
        let i = 0;
        while (res.data[i]) {
          let task = new Object();
          task.source = 'alp';
          task.id = res.data[i]._id,
          task.taskName = res.data[i].task_title;
          task.description = res.data[i].task_content;
          task.piggyBack = i;
          taskList.push(task);
          i++;
        }
        that.data.tempList= taskList;

        that.getMyTask();
        //console.log(that.data);
      },
      fail:function(res){
        console.log("get alp task fail", res);
        that.getMytask();
      }
    });
  },

  getMyTask: function () {
    /*get self assigned task*/
    var url = getApp().globalData.serverUrl + getApp().globalData.taskPath;
    var that = this;

    wx.request({
      url: url,
      method: 'GET',
      data: {
      },
      header: {
        'Authorization': "Bearer " + app.globalData.userToken,
      },
      success: function (res) {
        that.data.myTaskList = res.data;
        //console.log(res.data);

        let i = 0;
        let taskList = that.data.tempList;
        while (res.data[i]) {
          let task = new Object();
          task.source = 'self';
          task.id = res.data[i].id;
          task.taskName = res.data[i].taskName;
          task.description = res.data[i].description;
          task.piggyBack = i;
          taskList.push(task);
          i++;
        }
        that.setData({ taskList: taskList });
        //console.log(that.data);
      },
    });
  },

  deleteTask: function (e) {
    var that = this;
    that.hideModal();

    var idx = that.data.targetTaskIndex;
    var id = that.data.taskList[idx].id;
    var url = getApp().globalData.serverUrl + getApp().globalData.taskPath + "/" + id;

    wx.request({
      url: url,
      method: 'DELETE',
      data: {
        //'id': id,
      },
      header: {
        'Authorization': "Bearer " + app.globalData.userToken,
      },
      success: function (res) {
        console.log(res.data);
        that.listTask();
      },
    });
  },

  assignTask:function(e){
    var idx = e.currentTarget.dataset.idx;
    wx.navigateTo({
      url: "./assign?idx="+idx,
    })  
  },

  updateTask: function (e) {
    let index = e.currentTarget.dataset.idx;

    if (app.globalData.alpEnabled && this.data.taskList[index].source == 'alp'){
        wx.navigateTo({
            url: './alp?idx=' + index,
        })            
    }else{
        wx.navigateTo({
          url: './editor?method=update&idx=' + index,
        })    
    }
  },

  showModal(e) {
    this.data.targetTaskIndex = e.currentTarget.dataset.idx;
    this.setData({
      modalName: e.currentTarget.dataset.target,
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
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getTabBar().setData({ selected: 1 });
    this.listTask();
    //console.log(this.data);
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