const TelegramBot = require('node-telegram-bot-api');
const request = require('request');


const token = '781263230:AAGkvaOWbm1ou9sLknomLThTklZbT66vaLw';

const bot = new TelegramBot(token, {polling: true});

bot.onText(/\/curs/, (msg, match) => {

  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Какая валюта Вас интересует?', {
      reply_markup: {
          inline_keyboard: [
              [
                  {
                      text: '€ - EUR',
                      callback_data: 'EUR' 
                  },
                  {
                    text: '$ - USD',
                    callback_data: 'USD' 
                },
                {
                    text: '₽ - RUB',
                    callback_data: 'RUB' 
                }
              ]
          ]
      }
  });
});
bot.on('callback_query',query => {
    const id =  query.message.chat.id;

    request('http://www.nbrb.by/API/ExRates/Rates?Periodicity=0', function(error,responce,body) {
        const data = JSON.parse(body)
            const result = data.filter(item => item.Cur_Abbreviation === query.data)[0];
            const flag = {
                'EUR':'🇪🇺',
                'USD':'🇺🇸',
                'RUB':'🇷🇺'
            }
            let md = ` 
                *${flag[result.Cur_Abbreviation]} ${result.Cur_Scale} ${result.Cur_Abbreviation}  💱   🇧🇾 BYN*
* Стоимость: ${result.Cur_OfficialRate} BYN *
              
            `
        
            bot.sendMessage(id, md, {parse_mode:'Markdown'});
    })
})
