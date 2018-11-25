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

const handleEvent = event => {
    if (event.type !== 'message' || event.message.type !== 'text') {
        return Promise.resolve(null);
    }

    let num = Number(event.message.text);

    if (Number.isNaN(num)) {
        return client.replyMessage(event.replyToken, {
            type: 'text',
            text: "数値ではありません。数値のみ入力ください。"});
    }

    const rate = 112;
    const currencychanged = num * rate;
    return client.replyMessage(event.replyToken, {
        type: 'text',
        text: `${event.message.text.toLocaleString()}米ドルは日本円に換算すると、\n${currencychanged.toLocaleString()}円です。\n現在のレートは1米ドルあたり${rate}円です。`
    });
};

app.listen(PORT);
console.log(`Server running at ${PORT}`);