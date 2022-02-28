import * as tf from "@tensorflow/tfjs";
import { file2img } from "./utils";
import { IMAGENET_CLASSES } from "./classes"

window.onload = async () => {
    const model = await tf.loadLayersModel("https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_0.25_224/model.json")
    console.log(model)
    model.summary()
    window.predict = async (file) => {
        const img = await file2img(file)
        document.body.appendChild(img)
        const pred = tf.tidy(() => {
            const input = tf.browser.fromPixels(img)
                .toFloat()
                .sub(255/2)
                .div(255/2)
                .reshape([1,224,224,3])
            return model.predict(input)
        })

        setTimeout(()=>{
            alert(IMAGENET_CLASSES[pred.argMax(1).dataSync()[0]])
        },0)
    }



}
