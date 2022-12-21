import axios, { AxiosInstance, AxiosResponse } from "axios";


interface IHttpClientConstructorConfig {
  baseURL?: string,
  headers?: {[k: string]: string}
}

interface IHttpRequestConfig {
  headers?: {[k: string]: string},
  maxRedirects?: number,
  withCredentials?: boolean,
}

interface IResponse {
  data?: any,
  headers?: {[k: string]: string},
  status: number,
  statusText: string,
}


const DEFAULT_HTTP_CLIENT_CONSTRUCTOR_CONFIG: IHttpClientConstructorConfig = {
  baseURL: '',
  headers: {
    'Content-Type': 'application/json'
  }
}

const DEFAULT_HTTP_REQUEST_CONFIG: IHttpRequestConfig = {
  headers: {
    ...(DEFAULT_HTTP_CLIENT_CONSTRUCTOR_CONFIG.headers || {})
  }
}

export class HttpClient {
  private instance!: AxiosInstance;

  constructor(config?: IHttpClientConstructorConfig) {
    config = config || {};
    config = {
      ...DEFAULT_HTTP_CLIENT_CONSTRUCTOR_CONFIG,
      ...config,
      headers: {
        ...(DEFAULT_HTTP_CLIENT_CONSTRUCTOR_CONFIG?.headers || {}),
        ...(config?.headers || {}),
      }
    }

    this.instance = axios.create({
      baseURL: config.baseURL,
      headers: {'Content-Type': 'application/json'}
    });
  }

  async get(url: string, config?: IHttpRequestConfig): Promise<IResponse> {
    return this.instance
      .get(url, {
        ...DEFAULT_HTTP_REQUEST_CONFIG,
        ...(config || {}),
        headers: {
          ...DEFAULT_HTTP_REQUEST_CONFIG.headers,
          ...(config?.headers || {}),
        },
      })
      .then(resp => {
        return {
          data: resp.data,
          headers: resp.headers as any,
          status: resp.status,
          statusText: resp.statusText,
        }
      });
  }

  async post(url: string, data: any, config?: IHttpRequestConfig): Promise<IResponse> {
    return this.instance
      .post(url, data, {
        ...DEFAULT_HTTP_REQUEST_CONFIG,
        ...(config || {}),
        headers: {
          ...DEFAULT_HTTP_REQUEST_CONFIG.headers,
          ...(config?.headers || {}),
        },
      })
      .then(resp => {
        return {
          data: resp.data,
          headers: resp.headers as any,
          status: resp.status,
          statusText: resp.statusText,
        }
      });
  }
}
