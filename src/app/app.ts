import { TEXTS } from './texts.js';
import { ITelegramUpdate } from './interfaces/TelegramUpdate.js';
import { ChatModel } from './../models/Chat.js';
import DmTelegramBot from "../services/dm-telegram-bot/DmTelegramBot.js";
import { LANGS } from './constants/constants.js';
import { Lang } from './types/types.js';


export default class App {
  telegram = new DmTelegramBot(process.env.TELEGRAM_BOT_TOKEN as string);

  constructor() {
    this.subscribeCommands();
  }

  subscribeCommands() {
    this.telegram.command$
      .subscribe(data => {
        if (!data) return;

        const t = data.message.text;
        
        if (t === '/start') {
          this.onStart(data);
        }
      });
  }

  async onStart(data: ITelegramUpdate) {
    let chat = await ChatModel.findOne({chatId: data?.message.chat.id}).exec();
    if (!chat) {
      chat = new ChatModel({
        chatId: data?.message.chat.id,
        lang: data?.message.from.language_code,
        stage: 'START'
      });

      await chat.save();
    }

    let lang: Lang = chat.lang as Lang;
    if (!LANGS.includes(lang)) {
      lang = 'en';
      chat.lang = lang;
      await chat.save();
    }

    const text = TEXTS[lang].START_MESSAGE;
    this.telegram.sendMessage(chat.chatId, text, {
      reply_markup: JSON.stringify({
        inline_keyboard: [
          [
            {
              text: 'Українська', 
              callback_data: JSON.stringify({
                type: 'SELECT_LANG',
                value: 'uk'
              })
            },
            {
              text: 'Polska', 
              callback_data: JSON.stringify({
                type: 'SELECT_LANG',
                value: 'pl'
              })
            },
          ],
          [
            {
              text: 'English', 
              callback_data: JSON.stringify({
                type: 'SELECT_LANG',
                value: 'en'
              })
            },
            {
              text: 'Русский', 
              callback_data: JSON.stringify({
                type: 'SELECT_LANG',
                value: 'ru'
              })
            },
          ],
          [
            {
              text: TEXTS[lang].CURRENT_LANG, 
              callback_data: JSON.stringify({
                type: 'SELECT_LANG',
                value: 'CURRENT'
              })
            },
          ],
        ]
      })
    });
  }

  subscribeUpdates() {
    this.telegram.update$
      .subscribe((update) => {
        console.log(update)

        // this.telegram.sendMessage(1303685551, 'Got it', {
        //   reply_markup: JSON.stringify({
        //     inline_keyboard: [
        //       [
        //         {
        //           text: 'Nie mocno poważne', 
        //           callback_data: JSON.stringify({
        //             type: 'validity',
        //             value: 'Nie mocno poważne'
        //           })
        //         },
        //       ],
        //       [
        //         {
        //           text: 'Poważne', 
        //           callback_data: JSON.stringify({
        //             type: 'validity',
        //             value: 'Poważne'
        //           })
        //         },
        //       ],
        //     ]
        //   })
        // })
      });
  }
}
