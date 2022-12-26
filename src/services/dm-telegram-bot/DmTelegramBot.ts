import { ITelegramUpdate } from './../../app/interfaces/TelegramUpdate.js';
import { BehaviorSubject, filter, Observable } from 'rxjs';
import { HttpClient } from './../http/HttpClient.js';
import redis from '../redis/Redis.js';
import AsyncService from '../async/AsyncService.js';


const CHAT_UPDATES_TABLE_NAME = 'chat_updates';
const REFISTER_UPDATE_EX = 60*60*48;

export default class DmTelegramBot {
  private token!: string;
  private http!: HttpClient;

  private _update?: ITelegramUpdate;
  private _update$ = new BehaviorSubject(this._update);

  private _command?: ITelegramUpdate;
  private _command$ = new BehaviorSubject(this._update);

  constructor(token: string) {
    this.token = token;
    this.http = new HttpClient({baseURL: `https://api.telegram.org/bot${this.token}`});

    setInterval(() => {
      this.getUpdates()
        .then(async result => {
          result.forEach(async x => {
            console.log(x)
            const isNew = await this.checkNewUpdate(x);
            if (!isNew) return;

            this.registerUpdate(x);
            this.update = x;
          });
        });
    }, 3000);
  }

  get update$(): Observable<ITelegramUpdate> {
    return this._update$
      .asObservable()
      .pipe(
        filter(update => !!update)
      ) as Observable<ITelegramUpdate>;
  }

  private set update(update: ITelegramUpdate) {
    this._update = JSON.parse(JSON.stringify(update));
    this._update$.next(this._update);

    const t = update.message.text.trim() || '';
    if (t.charAt(0) === '/') {
      this.command = JSON.parse(JSON.stringify(update));
    }
  }

  get command$(): Observable<ITelegramUpdate|undefined> {
    return this._command$.asObservable();
  }

  private set command(command: ITelegramUpdate) {
    this._command = JSON.parse(JSON.stringify(command));
    this._command$.next(this._command);
  }

  getMe() {
    return this.http.get('/getMe')
      .then(res => res.data);
  }

  sendMessage(chatId: number, message: string, other: any = {}) {
    this.http
      .post('/sendMessage', {
        chat_id: chatId,
        text: message,
        ...other
      })
      .then(res => res.data);
  }

  private async getUpdates(): Promise<ITelegramUpdate[]> {
    return await this.http.get('/getUpdates')
      .then(res => res.data.result);
  }

  private async checkNewUpdate(update: ITelegramUpdate): Promise<boolean> {
    const exist = await redis.objGet(CHAT_UPDATES_TABLE_NAME, update.message.message_id.toString());
    return !exist;
  }

  private async registerUpdate(update: ITelegramUpdate) {
    redis.objSet({
      collection: CHAT_UPDATES_TABLE_NAME,
      key: update.message.message_id.toString(),
      value: JSON.stringify(update),
      options: {
        EX: REFISTER_UPDATE_EX
      }
    });
  }
}