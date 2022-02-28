// pages/posenet/index.js
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
import { Classifier } from './models';
const { appWidth, appHeight } = getApp().globalData;

Page({
  classifier: null,
  ctx: null,
  /**
   * 页面的初始数据
   */
  data: {
    devicePosition: 'front',
    predicting: false
  },
  switchCamera(){
    let devicePosition = this.data.devicePosition === 'front' ? 'back' : 'front';
    this.setData({ devicePosition });
  },
  onCameraError(err) {
    console.log('onCameraError>>', err);
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    const context = wx.createCameraContext(this);
    this.ctx = wx.createCanvasContext('pose', this);
    this.initClassifier();
    let count = 0;
    const listener = context.onCameraFrame(frame => {
      count++;
      if (count === 2) { // 控制帧数
        if (this.classifier && this.classifier.isReady()) {
          this.executeClassify(frame);
        }
        count = 0;
      }
    });
    listener.start();
  },

  initClassifier() {
    wx.showLoading({ title: '模型正在加载...' });
    this.classifier = new Classifier({ width: appWidth, height: appHeight });
    this.classifier.load().then(() => {
      wx.hideLoading();
    }).catch(err => {
      console.log('模型加载报错：', err);
      Toast.loading({
        message: '网络连接异常',
        forbidClick: true,
        loadingType: 'spinner',
      });
    })
  },

  executeClassify(frame) {
    if (this.classifier && this.classifier.isReady() && !this.data.predicting) {
      this.setData({
        predicting: true
      }, () => {
        this.classifier.singlePoseDetect(frame).then((pose) => {
          const nosePosition = pose.keypoints[0].position;
          this.classifier.drawSinglePose(this.ctx, pose);
          this.setData({
            predicting: false,
            nosePosition: Math.round(nosePosition.x) + ', ' + Math.round(nosePosition.y)
          })
        }).catch((err) => {
          console.log(err, err.stack);
        });
      });
    }
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    if (this.classifier && this.classifier.isReady()) {
      this.classifier.dispose();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: 'hahaAI',
      desc: '石璞东',
    }
  },
  onShareTimeline: function (res) {
    return {
      title: 'hahaAI',
      desc: '石璞东',
    }
  } 
})