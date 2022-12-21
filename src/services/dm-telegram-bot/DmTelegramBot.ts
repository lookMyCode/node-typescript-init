import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from './../http/HttpClient.js';


export default class DmTelegramBot {
  private token!: string;
  private http!: HttpClient;
  private _updates: any[] = [];
  private _updates$ = new BehaviorSubject(this._updates);
  private checkedUpdatesIds: number[] = [];
  private onMessageCbs: Function[] = [];

  constructor(token: string) {
    this.token = token;
    this.http = new HttpClient({baseURL: `https://api.telegram.org/bot${this.token}`});

    setInterval(() => {
      this.getUpdates()
        .then(result => {
          result = result.filter((x: any) => !this.checkedUpdatesIds.includes(x.update_id));
          if (!result?.length) return;

          this.updates = result;
          result.forEach((x: any) => {
            this.checkedUpdatesIds.push(x.update_id);
          });
        });
    }, 3000);

    this.updates$
      .subscribe(result => {
        result.forEach(x => {
          this.onMessageCbs.forEach(cb => {
            cb(x);
          });
        });
      });
  }

  set updates(updates: any[]) {
    this._updates = JSON.parse(JSON.stringify(updates));
    this._updates$.next(this._updates);
  }

  get updates$(): Observable<any[]> {
    return this._updates$.asObservable();
  }

  getMe() {
    return this.http.get('/getMe')
      .then(res => res.data);
  }

  getUpdates() {
    return this.http.get('/getUpdates')
      .then(res => res.data.result);
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

  onMessage(cb: Function) {
    this.onMessageCbs.push(cb);
  }
}