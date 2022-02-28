import * as tfvis from "@tensorflow/tfjs-vis";
import * as tf from "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-vis"
import { getData } from "./data";

window.onload = async () => {
    const data = getData(500)
    console.log(data)
    tfvis.render.scatterplot(
        {name:"XOR数据集",tab:"数据集展示"},
        {
            values:[
                data.filter(point => point.label === 1),
                data.filter(point => point.label === 0)
            ]
        }
    )
    const model = tf.sequential();
    model.add(tf.layers.dense({
        units:8,
        inputShape:[2],
        activation:"relu"
    }))
    model.add(tf.layers.dense({
        units:1,
        activation:"sigmoid"
    }))

    const inputs = tf.tensor(data.map(point => [point.x,point.y]))

    const labels = tf.tensor(data.map(point => [point.label]))

    model.compile({
        loss:tf.losses.logLoss,
        optimizer:tf.train.adam(0.01),
        metrics:["accuracy"]
    })
    await model.fit(inputs,labels,{
        batchSize:50,
        epochs:10,
        callbacks:tfvis.show.fitCallbacks(
            {name:"XOR数据训练过程",tab:"训练数据"},
            ["loss","acc"]
        )
    })
    window.predict = (form) => {
        const output = model.predict(tf.tensor([[form.x.value*1,form.y.value*1]]))
        alert(`预测结果为：${output.dataSync()[0]}`)
    }
}
