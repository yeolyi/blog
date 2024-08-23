type TimedValue<T> = {
  value: T;
  timestamp: number;
};

type DataFetcher<T> = () => Promise<T>;

export class Cache<T> {
  #timeout: number;
  #dataFetcher: DataFetcher<T>;

  #value?: TimedValue<T>;
  #promise?: Promise<TimedValue<T>>;

  constructor(dataFetcher: DataFetcher<T>, timeout: number) {
    this.#dataFetcher = dataFetcher;
    this.#timeout = timeout;
  }

  async get() {
    if (this.#value && Date.now() - this.#value.timestamp < this.#timeout) {
      return this.#value.value;
    }

    if (this.#promise) {
      return await this.#promise;
    }

    this.#promise = (async () => {
      let value = await this.#dataFetcher();
      return { value, timestamp: Date.now() };
    })();

    return await this.#promise;
  }
}
