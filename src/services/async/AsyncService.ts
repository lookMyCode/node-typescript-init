type Cb<T> = (item: T, index: number) => any;

export default class AsyncService {
  
  static async forEachSync<T>(arr: T[], cb: Cb<T>): Promise<void> {
    const fn = async (arr: T[], cb: Cb<T>, i: number = 0) => {
      if (!arr.length) return;

      const [item, ...newArr] = arr;
      await cb(item, i);
      await fn(newArr, cb, i + 1);
    }

    await fn(arr, cb);
  }

  static async filterSync<T>(arr: T[], cb: Cb<T>): Promise<T[]> {
    const newArr: T[] = [];

    await this.forEachSync.call(this, arr, async (item: any, index) => {
      const result = await cb(item, index);
      if (result) newArr.push(item);
    });
    
    return newArr;
  }
}