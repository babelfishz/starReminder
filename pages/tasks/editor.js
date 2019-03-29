// pages/tasks/editor.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,

    task: '',

    title: '创建新任务',
    buttonText: '创建',
  },

  addTask: function (e) {
    //console.log(e);
    var name = e.detail.value.name;
    var description = e.detail.value.description;
    //console.log(name);
    var url = getApp().globalData.serverUrl + getApp().globalData.taskPath;
    var that = this;

    //console.log(url);
    wx.request({
      url: url,
      method: 'POST',
      data: {
        'id': that.data.task.id,
        'name': name,
        'description': description,
      },
      header: {
        'Authorization': "Bearer " + app.globalData.userToken,
      },
      success: function (res) {
        console.log(res);
        that.showModal('success');
      },
      fail: function (res) {
        console.log(res);
        that.showModal('fail');
      },
    });
  },

  resetTask: function (e) {
    this.setData({
      task: '',
    })
  },

  bindNavigateBack: function (e) {
    wx.navigateBack({
      delta: -1
    })
  },

  showModal(modalName) {
    console.log(modalName);
    this.setData({
      modalName: modalName,
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
    //console.log(options);
    let that = this;

    if (options.method == 'update') {
      let pages = getCurrentPages();
      let prevPage = pages[pages.length - 2];  //上一个页面
      let taskList = prevPage.data.taskList[options.idx];
      this.setData({
        task: prevPage.data.taskList[options.idx],
        title: '编辑任务',
        buttonText: '完成',
      });
    }

    //console.log(this.data.task);
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