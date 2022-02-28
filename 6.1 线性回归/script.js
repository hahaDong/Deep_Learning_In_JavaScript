import * as tf from"@tensorflow/tfjs";
import * as tfvis from "@tensorflow/tfjs-vis";
import $ from "jquery";

window.onload = async ()=>{
    msg.loading("正在训练数据，请稍后...")
    const xs = [1,2,3,4,5,6];
    const ys = [1,3,5,7,9,11];
    //数据可视化
    tfvis.render.scatterplot(
        {name:"线性回归数据集",tab:'数据集展示'},
        {values:xs.map((x,i) => ({x,y:ys[i]}))},
        {xAxisDomain:[0,8], yAxisDomain:[0,15]}
    )

    //模型搭建
    const model = tf.sequential();
    model.add(tf.layers.dense({units:1,inputShape:[1]}));
    model.compile({
        loss:tf.losses.meanSquaredError,
        optimizer:tf.train.sgd(0.01),
        metrics:["accuracy"]

    });

    const inputs = tf.tensor(xs);
    const labels = tf.tensor(ys);
    await model.fit(inputs,labels,{
        batchSize:4,
        epochs:10,
        callbacks : tfvis.show.fitCallbacks(
            {name:"训练过程",tab:"训练数据"},
            ["loss","acc"]
            )
    })
    msg.success("训练完成")

    $("#btn").click(function (){
        var input_val = Number($("#ipt").val())
        const output = model.predict(tf.tensor([input_val]));
        alert(`预测结果为：${output.dataSync()[0]}`)
    })


}
