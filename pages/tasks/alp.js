// pages/tasks/alp.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,

    /*videoSrc: 'http://39.104.90.32:19090/video/jiazhang1@gmail.com/wxbf2f58706983f17a.o6zAJs7bYrJOHpob5IODEZp6Y8wY.vb3htt3LG5ao1693ae6b2d43986a259cd4812ab3a065.mp4',*/

    unfoldHistory: false,
    videoSrc: null,
    loadModal:false,
  },

  uploadFileToALP:function(e){
    let that = this;

    //console.log(e);
    wx.chooseVideo({
      sourceType: [],
      success: function(res) {
        //console.log(res);
        let filePath = res.tempFilePath;
        console.log(filePath);

        let url = app.globalData.alpUrl + app.globalData.alpUploadPath;
        //console.log(url);

        wx.uploadFile({
          url: url,
          filePath: filePath,
          name: 'file',
          header: {
            'content-type': 'multipart/form-data',            
            'token': app.globalData.alpToken,
          },
          formData: {},
          success: function(res) {
            console.log(res);
            let videoSrc = app.globalData.alpUrl + JSON.parse(res.data).message;
            console.log(videoSrc);
            that.setData({ videoSrc: videoSrc});
            that.showModal('uploadSuccess');
          },
          fail: function(res) {
            that.setData({
              videoSrc:null, 
              loadModal: false 
            });
            that.showModal('uploadFail');
          },
          complete: function(res) {
            that.setData({ loadModal: false });
          },
        });

        that.setData({loadModal:true});
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  toggleTaskHistory:function(){
    this.setData({ unfoldHistory: !this.data.unfoldHistory});
  },

  submitTaskProgress:function(e){
    this.setData({ unfoldHistory: !this.data.unfoldHistory });
  },

  showModal(modalName) {
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
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];  //上一个页面
    var that = this;

    that.setData({ alpTask: prevPage.data.alpTaskList[options.idx] });
    console.log(that.data.alpTask);
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