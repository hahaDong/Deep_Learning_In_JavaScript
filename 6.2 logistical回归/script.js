import * as tfvis from "@tensorflow/tfjs-vis";
import * as tf from "@tensorflow/tfjs";
import {getData} from "./data";

window.onload = async () => {
    const data = getData(400)
    //数据可视化
    tfvis.render.scatterplot(
        {name:"逻辑回归"},
        {
            values:[
                data.filter(point => point.label === 1),
                data.filter(point => point.label === 0)
            ]
        }
    );
    //定义模型
    const model = tf.sequential();
    model.add(tf.layers.dense({
        units:1,
        inputShape:[2],
        activation:"sigmoid"
    }))
    model.compile({loss:tf.losses.logLoss,optimizer:tf.train.adam(0.01)});

    const inputs = tf.tensor(data.map(point => [point.x,point.y]));
    const labels = tf.tensor(data.map(point => point.label));
    await model.fit(inputs,labels,{
        batchSize:40,
        epochs:50,
        callbacks:tfvis.show.fitCallbacks(
            {name:"训练过程"},
            ["loss"]
        )
    })

    window.predict = (form) => {
        const pred = model.predict(tf.tensor([[form.x.value*1,form.y.value*1]]))
        alert(`${pred.dataSync()[0]}`)
    }


}
