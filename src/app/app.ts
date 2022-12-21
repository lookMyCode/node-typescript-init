import DmTelegramBot from "../services/dm-telegram-bot/DmTelegramBot.js";
import redis from "../services/redis/Redis.js";


export default class App {
  telegram = new DmTelegramBot(process.env.TELEGRAM_BOT_TOKEN as string);

  constructor() {
    this.subscribeUpdates();

    this.telegram.onMessage((msg:  any) => {
      console.log(msg);
    });

    (async () => {
      await redis.objSet({
        collection: 'test',
        key: 'first',
        value: 'first value'
      });

      await redis.objSet({
        collection: 'test',
        key: 'second',
        value: 'second value'
      });
      let value = await redis.objGetAll('test');
      console.log(value)
      const n = await redis.objClear('test');
      console.log(n);
      value = await redis.objGetAll('test');
      console.log(value)
    })();
  }

  subscribeUpdates() {
    this.telegram.updates$
      .subscribe(result => {
        console.log(JSON.stringify(result, null, 2));
        this.telegram.sendMessage(1303685551, 'Got it', {
          reply_markup: JSON.stringify({
            inline_keyboard: [
              [
                {
                  text: 'Nie mocno poważne', 
                  callback_data: JSON.stringify({
                    type: 'validity',
                    value: 'Nie mocno poważne'
                  })
                },
              ],
              [
                {
                  text: 'Poważne', 
                  callback_data: JSON.stringify({
                    type: 'validity',
                    value: 'Poważne'
                  })
                },
              ],
            ]
          })
        })
      });
  }
}
