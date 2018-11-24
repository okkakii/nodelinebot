'use strict';

const express = require('express');
const line = require('@line/bot-sdk');
const PORT = process.env.PORT || 3000;

const config = {
    channelSecret: '',
    channelAccessToken: ''
};

const app = express();

app.post('/webhook', line.middleware(config), (req, res) => {
    console.log(req.body.events);
    Promise
        .all(req.body.events.map(handleEvent))
        .then((result) => res.json(result));
});

const client = new line.Client(config);

function handleEvent(event) {
    if (event.type !== 'message' || event.message.type !== 'text') {
        return Promise.resolve(null);
    }

    //const pattern = new RegExp(/^\d(\.\d+)?$/);
    //if (! /^\d(\.\d+)?$/.test(event.message.text)) {
    //    return client.replyMessage(event.replyToken, {
    //        type: 'text',
    //        text: "数字ではありません。"
    //    });
   // }

    if (!parseInt(event.message.text)) {
        return client.replyMessage(event.replyToken, {
            type: 'text',
            text: "数字ではありません。"
        });
    }

    const rate = 112;
    return client.replyMessage(event.replyToken, {
        type: 'text',
        text: "日本円" + event.message.text + "円は\n 米ドルで" +　event.message.text * rate + "です。" +
            "現在のレートは1米ドルあたり" + rate +"円です。"
    });
}

app.listen(PORT);
console.log(`Server running at ${PORT}`);