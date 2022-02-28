const tf = require("@tensorflow/tfjs-core")
const tfl = require("@tensorflow/tfjs-layers")
const tfbc = require("@tensorflow/tfjs-backend-cpu")


Page({
  data:{
    res_num:" "
  },
  async onReady(){
    const camera = wx.createCameraContext(this)
    const net = await this.loadModel()
    let count = 0
    const listener = camera.onCameraFrame((frame)=>{
      count++
      if(count == 10){
        if(net){
          wx.hideToast()
          this.predict(net,frame)
        }
        count = 0
      }
    })
    listener.start()
  },
  async loadModel(){
   wx.showToast({
     title: '正在加载模型...',
     icon:"loading"
   })
    const net = await tfl.loadLayersModel("https://www.shipudong.com/otherFiles/DLModels/mnist/model.json")
    net.summary()
    return net 
  },
  async predict(net,frame){
    const imgData = {
      data:new Uint8Array(frame.data),
      width:frame.width,
      height:frame.height
    }
  
    const x = tf.tidy(() => {
      const imgTensor = tf.browser.fromPixels(imgData)
      console.log(imgTensor.shape);
      const d = Math.floor((frame.height-frame.width)/2)
      const imgSlice = imgTensor.slice([d,0,0],[frame.width,-1,1])

      console.log(imgSlice.shape);
      const imgResize = tf.image.resizeBilinear(imgSlice,[28,28])
      // return imgResize.mean(2)
      return imgResize
    })
    
    const y = await net.predict(x.expandDims(0)).argMax(1)

    const res = y.dataSync()[0]
    console.log(res);
    // console.log(res);
    
    this.setData({
      result:"Loading successful",
      res_num:res
    })
  },
  onShareAppMessage: function (res) {
    return {
      title: 'hahaAI',
    }
  },
  onShareTimeline(){
    title:"hahaAI"
  }
})