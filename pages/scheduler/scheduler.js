// pages/scheduler/scheduler.js
const app = getApp();

Page({

  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Title: app.globalData.title,

    sysH: '',

    /*display current date and time*/ 
    year:'',
    month:'',
    day:'',

    /*login*/
    userLogin: false,

    activityList: [],
    alpTasks:[],
  },

  getUserToken: function () {
    let url = app.globalData.serverUrl + '/api/auth/login';
    let that = this;
    
    wx.request({
      url: url,
      data: {
        'email': app.globalData.userName,
        'password': app.globalData.password,
        //'remember_me': true,
      },
      method: 'POST',
      success: function (res) {
        console.log(res);
        //app.globalData.userLogin = true;
        app.globalData.userToken = res.data.access_token;
        that.setData({userLogin:true});
        that.showActivity();

        try{
          let userConfig = wx.getStorageSync('userConfig');
          userConfig.token = res.data.access_token;
          wx.setStorageSync('userConfig', userConfig);
          //let result = wx.getStorageSync('userConfig');
          //console.log('userConfig written', result);
        }catch(e){
          console.log(e);
        }
      },
      fail: function (res) { 
        console.log(res);
        app.globalData.userLogin = false;
        wx.showToast({
          title: '登录失败，请检查设置',
          icon: 'none',
        })      
        },
      complete: function (res) { },
    })
  },

  showActivity: function () {
    if (app.globalData.userToken == null) return;

    var url = getApp().globalData.serverUrl + getApp().globalData.activityPath;
    var that = this;

    wx.request({
      url: url,
      method: 'GET',
      data: {
        'withAssignment': 'yes',
      },
      header: {
        'Authorization': "Bearer " + app.globalData.userToken,
      },
      success: function (res) {
        //console.log("response:",res.data);
        //that.setData({ activityList: res.data });
        //console.log(that.data.activityList);
        if(res.statusCode != 200) return;

        var i = 0;
        var activityList = [];
        while(res.data[i])
        {
          //console.log("activity",i, res.data[i]);
          var activity = res.data[i].activity;
          if (that.timeInRange(activity.startTime, activity.endTime)){

            let item = new Object();
            item.activity = res.data[i].activity;
            item.tasks = [];

            let j=0;
            while (res.data[i].tasks[j]){
              let task = res.data[i].tasks[j];
              
              if(task.taskSource == 'self'){
                item.tasks.push(task);
              }
              
              if (task.taskSource == 'alp' && app.globalData.alpEnabled && app.globalData.alpLogin == true){
                let alpTasks = that.data.alpTasks;
                var alpTask = alpTasks.find((v) => {
                  return v._id == task.taskId;
                });
                if(alpTask){
                  task.taskName = alpTask.task_title;
                  task.description = alpTask.task_content;
                  item.tasks.push(task);
                }else{
                  console.log('Alp task has been deleted',task);
                  that.pruneAlpAssignment(task.activityId, task.taskId);
                }
              }
              j++;
            }
            activityList.push(item);
          }
          i++;
        }
        that.setData({ activityList: activityList});        
      },
    });
  },

  getAlpUserToken:function(){
    let url = app.globalData.alpUrl + app.globalData.alpLoginPath;
    let that = this;
    wx.request({
      url: url,
      method: 'POST',
      data: {
        'user_email': app.globalData.alpUserName,
        'user_password': app.globalData.alpUserPassword,
      },
      success: function (res) {
        //console.log(res.data);
        app.globalData.alpToken = res.data.token;
        app.globalData.alpUser = res.data.user;
        app.globalData.alpLogin = true;
        that.getAlpUserTask();

        try{
          let alpConfig = new Object();
          alpConfig.token = res.data.token;
          alpConfig.user = res.data.user;
          wx.setStorageSync('alpConfig', alpConfig);
        }catch(e){
          console.log(e);
        }
      },
      fail: function (res) {
        console.log(res);
        //app.globalData.alpLogin = false;
      }
    });
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
        //console.log("alp task list in scheduler",res.data);
        that.data.alpTasks = res.data;
        that.showActivity();
      },
    });
  },

  pruneAlpAssignment:function(activityId, taskId){
      console.log("activityId=",activityId, "taskId=",taskId);
  },

  timeInRange:function (beginTime, endTime) {
    var strb = beginTime.split(":");
    if (strb.length != 2) {
       return false;
    }

    var stre = endTime.split(":");
    if (stre.length != 2) {
      return false;
    }

    var b = new Date();
    var e = new Date();
    var n = new Date();

    b.setHours(strb[0]);
    b.setMinutes(strb[1]);
    e.setHours(stre[0]);
    e.setMinutes(stre[1]);

    /*显示前一个小时和后一个小时的活动*/
    if(b.getHours() > 1 ) b.setHours(b.getHours() - 1);
    if(e.getHours() < 23) e.setHours(e.getHours() + 1);

    if (n.getTime() - b.getTime() > 0 && n.getTime() - e.getTime() < 0) {
        //console.log("在时间范围内");
        return true;
    } else {
        //console.log("当前时间是：" + n.getHours() + ":" + n.getMinutes() + "，不在该时间范围内！");
        return false;
    }
  },

  getDateTime:function(){
    var date = new Date();
    this.setData({
      year:date.getFullYear(),
      month:date.getMonth()+1,
      day:date.getDate(),
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var res = wx.getSystemInfoSync();
    this.setData({sysH:res.screenHeight});
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
    var that = this;
    that.getTabBar().setData({ selected: 0 });

    /*登录到星星日程*/
    if (app.globalData.userToken == null) {
      this.getUserToken();
    }

    /*登录到ALP系统*/
    if (app.globalData.alpEnabled && app.globalData.alpLogin != true) {
      this.getAlpUserToken();
    } 

    that.getDateTime();
    that.showActivity();

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
      //this.getDateTime();
      //this.showActivity();
      this.onLoad();
      wx.stopPullDownRefresh();      
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