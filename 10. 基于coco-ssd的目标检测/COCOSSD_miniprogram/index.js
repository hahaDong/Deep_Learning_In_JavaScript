// pages/coco-ssd/index.js
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
import { Classifier } from './models';
const { appWidth, appHeight} = getApp().globalData;

Page({
  classifier: null,
  ctx: null,
  data: {
    predicting: false
  },

 
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.ctx = wx.createCanvasContext('ssdDetect');
    const context = wx.createCameraContext(this);
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
  
  /**
   * 初始化 SSD models
   */
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

  /**
   * 构建模型
   */
  executeClassify: function (frame) {
    if (this.classifier && this.classifier.isReady() && !this.data.predicting) {
      this.setData({
        predicting: true
      }, () => {
        this.classifier.detect(frame).then(res => {
          this.classifier.drawBoxes(this.ctx, res);
          this.data.predicting = false;
        }).catch((err) => {
          console.log(err)
        })
      })
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