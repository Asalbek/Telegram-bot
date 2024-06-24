const TelegramBot = require('node-telegram-bot-api');
const axios=require("axios");
const express=require('express');
const app=express();
app.get('/', (req, res)=>{
    res.send('hello world');
})
const port=3000;
app.listen(port, ()=>{
    console.log(`Server running  at http://localhost:${port}`);
})
const token = '6744425021:AAEF5AN7xY6rNVLh7LloeVB2nPmwol5QnyI';

const bot = new TelegramBot(token, {polling: true});
const obj= {};
const gameOption = {
    reply_markup: {
        inline_keyboard: [
            [
                {
                    text: "1", 
                    callback_data: '1',
                },
                {
                    text: "2", 
                    callback_data: '2',
                },
                {
                    text: "3", 
                    callback_data: '3',
                }
                
            ],
            [
                {
                    text: "4", 
                    callback_data: '4',
                },
                {
                    text: "5", 
                    callback_data: '5',
                },
                {
                    text: "6", 
                    callback_data: '6',
                }
                
            ],
            [
                {
                    text: "7", 
                    callback_data: '7',
                },
                {
                    text: "8", 
                    callback_data: '8',
                },
                {
                    text: "9", 
                    callback_data: '9',
                }
                
            ],
            [
                {
                    text: "0", 
                    callback_data: '0',
                }
            ]
        ]
    }
};

const startGame=async chatId=>{
    await bot.sendMessage(chatId, "Let's play a game!");
    const randomNumber=Math.floor(Math.random()*10);
    obj[chatId]=randomNumber;
    await bot.sendMessage(chatId, "Kompyuter bir son o'yladi shuni taxmin qilib korchi bir kuraylik karomatizni:", gameOption)
}

const againOption= {
    reply_markup: {
        inline_keyboard: [
            [
                {
                    text: 'Start again',
                    callback_data: '/again',
                }
            ]
        ]
    }
}

bot.setMyCommands([
    {command:'/start', description: "Start"},
    {command: '/info', description: "Information about us"},
    {command: '/game', description: "Play a game"},
    {command: '/menu', description: "Menu"}
]);

bot.on('message', async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;

    if (text === "/start"){
        return bot.sendMessage(chatId, "Assalomu aleykum botimizga xush kelibsiz");
    }

    if (text === "/info"){
        return bot.sendMessage(chatId, `We are Honey company which produces honey every year and makes a fortune :), your name is ${msg.from?.first_name}`);
    }

    if (text === "/game"){
        return startGame(chatId)
    }

    if(text === "/menu"){
        const options = {
            reply_markup: JSON.stringify({
                inline_keyboard: [
                    [{text: '1-dars', callback_data: '1'}, {text: '2-dars', callback_data: '2'}],
                    [{text: '3-dars', callback_data: '3'}, {text: '4-dars', callback_data: '4'}],
                ]
            })
        };
        return bot.sendMessage(chatId,`Choose one of them: `, options);
    }
});

bot.on("callback_query", async msg=>{
    const data=msg.data
    const chatId=msg.message.chat.id;
    if(data==obj[chatId]){
        return bot.sendMessage(
            chatId,
            `Congratulations you chose correct answer ${obj[chatId]} sonni egallagan edi`
        ); 
    }else if(data === "/again"){
        return startGame(chatId);
    }else {
        return bot.sendMessage(
            chatId,
            `You are wrong you chose ${data}, computer have chosen  ${[obj [chatId]]} `, againOption
        );
    }
})
