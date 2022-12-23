import DmTelegramBot from "../services/dm-telegram-bot/DmTelegramBot.js";


export default class App {
  telegram = new DmTelegramBot(process.env.TELEGRAM_BOT_TOKEN as string);

  constructor() {
    this.subscribeUpdates();
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
