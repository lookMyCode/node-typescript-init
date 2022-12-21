import { createClient, RedisClientType, SetOptions } from 'redis';


const OBJ_PREFIX = '__ROGJ__';
const OBJ_SEPARATOR = '__';

class Redis {
  private client = createClient();

  constructor() {
    this.connect();
    this.client.on('error', (err) => console.log('Redis Client Error', err));
  }

  async connect() {
    return await this.client.connect();
  }

  async disconnect() {
    return await this.client.disconnect();
  }

  async setData(key: string, value: string, options?: SetOptions) {
    return await this.client.set(key, value, options);
  }

  async getData(key: string): Promise<string|null> {
    return await this.client.get(key);
  }

  async exists(key: string) {
    return await !!this.client.exists(key);
  }

  async del(key: string) {
    return await this.client.del(key);
  }

  async hSet(collection: string, key: string, value: string) {
    return await this.client.hSet(collection, key, value);
  }

  async hGet(collection: string, key: string): Promise<string|undefined> {
    return await this.client.hGet(collection, key);
  }

  async hGetAll(collection: string) {
    return await this.client.hGetAll(collection);
  }

  async hExists(collection: string, key: string): Promise<boolean> {
    return await !!this.client.hExists(collection, key);
  }

  async hDel(collection: string, key: string) {
    return await this.client.hDel(collection, key);
  }

  async objSet(data: {
    collection: string,
    key: string,
    value: string,
    options?: SetOptions
  }) {
    return await this.setData(
      `${OBJ_PREFIX}${data.collection}${OBJ_SEPARATOR}${data.key}`, 
      data.value, 
      data.options
    );
  }

  async objGet(collection: string, key: string): Promise<string|null> {
    return await this.getData(`${OBJ_PREFIX}${collection}${OBJ_SEPARATOR}${key}`);
  }

  async objExists(collection: string, key: string): Promise<boolean> {
    return await this.exists(`${OBJ_PREFIX}${collection}${OBJ_SEPARATOR}${key}`);
  }

  async objGetAll(collection: string): Promise<{[key: string]: string|null}> {
    const fullPrefix = `${OBJ_PREFIX}${collection}${OBJ_SEPARATOR}`;
    const keys = await this.keys(`${fullPrefix}*`);
    const promises: Promise<[string, string|null]>[] = [];

    for (let i = 0, l = keys.length; i < l; i++) {
      const fn = async (): Promise<[string, string|null]> => {
        const key = keys[i];
        const value = await this.getData(key);
        return [
          key.substring(`${fullPrefix}`.length),
          value
        ];
      }

      promises.push(fn());
    }

    return Promise.all(promises)
      .then(result => {
        const obj: {[k: string]: string|null} = {};
        result.forEach(row => {
          obj[row[0]] = row[1];
        });
        
        return obj;
      });
  }

  async objDel(collection: string, key: string) {
    return await this.del(`${OBJ_PREFIX}${collection}${OBJ_SEPARATOR}${key}`);
  }

  async objClear(collection: string) {
    const fullPrefix = `${OBJ_PREFIX}${collection}${OBJ_SEPARATOR}`;
    const keys = await this.keys(`${fullPrefix}*`);
    const promises: Promise<number>[] = [];

    for (let i = 0, l = keys.length; i < l; i++) {
      promises.push(this.del(keys[i]));
    }

    return await Promise.all(promises)
      .then(result => {
        let sum = 0;

        for (let i = 0, l = result.length; i < l; i++) {
          sum += result[i];
        }

        return sum;
      });
  }

  async keys(pattern: string): Promise<string[]> {
    return await this.client.keys(pattern);
  }

  // static async getOnce(key: string): Promise<string|null> {
  //   await this.connect();
  //   const data = await this.getData(key);
  //   await this.disconnect();
  //   return data;
  // }

  // static async setOnce(key: string, value: string, options?: SetOptions) {
  //   await this.connect();
  //   await this.setData(key, value, options);
  //   await this.disconnect();
  // }

  // static async existsOnce(key: string) {
  //   await this.connect();
  //   const data = await this.exists(key);
  //   await this.disconnect();
  //   return data;
  // }
}

export default new Redis();
