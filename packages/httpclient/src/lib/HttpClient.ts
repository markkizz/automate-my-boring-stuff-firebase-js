import axios, { AxiosInstance, AxiosRequestConfig, Method, AxiosResponse } from "axios"
import queryString from "query-string"
import { isFalsyValue } from "../utils"

export class HttpClient {

  private readonly _httpClient: AxiosInstance
  private readonly _defaultConfig: AxiosRequestConfig = {
    paramsSerializer: (param: unknown) => queryString.stringify(param, {
      skipEmptyString: true,
      skipNull: true
    })
  }

  private _requestInterceptor!: number
  private _responseInterceptor!: number

  constructor(config: AxiosRequestConfig) {
    this._httpClient = axios.create(config)
    this.initInterceptor()
  }

  public static create(config: AxiosRequestConfig) {
    return new HttpClient(config)
  }

  private initInterceptor() {
    this._requestInterceptor = this._httpClient.interceptors.request.use(
      (config) => {
        return config
      },
      (error) => Promise.reject(error)
    )

    this._responseInterceptor = this._httpClient.interceptors.response.use(
      (response) => response,
      (error) => Promise.reject(error)
    )
  }

  public registerRequestInterceptor(
    onFulfilled?: (value: AxiosRequestConfig) => AxiosRequestConfig | Promise<AxiosRequestConfig>,
    onRejected?: (error: unknown) => unknown
  ) {
    this.disbleDefaultRequestInterceptor()
    this._requestInterceptor = this._httpClient.interceptors.request.use(onFulfilled, onRejected)
  }

  public registerResponseInterceptor(
    onFulfilled?: (value: AxiosResponse) => AxiosResponse | Promise<AxiosResponse>,
    onRejected?: (error: unknown) => unknown
  ) {
    this.disableDefaultResponseInterceptor()
    this._responseInterceptor = this._httpClient.interceptors.response.use(onFulfilled, onRejected)
  }

  public disbleDefaultRequestInterceptor() {
    !isFalsyValue(this._requestInterceptor) && this._httpClient.interceptors.request.eject(this._requestInterceptor)
    return this
  }

  public disableDefaultResponseInterceptor() {
    !isFalsyValue(this._responseInterceptor) && this._httpClient.interceptors.response.eject(this._responseInterceptor)
    return this
  }

  public async request<TRequest = unknown, TResponse = unknown>(
    method: Method = "get",
    url: string,
    options: AxiosRequestConfig = {},
    data?: TRequest
  ) {
    const config = {
      ...this._defaultConfig,
      ...{
        url,
        method,
        data
      },
      ...options
    }

    config.headers = Object.keys(config.headers).reduce((_headers, key) => {
      if (!isFalsyValue(config.headers[key])) {
        const newHeaders = {
          ..._headers,
          [key]: config.headers[key]
        }
        return newHeaders
      }
      return _headers
    }, {})

    return this._httpClient.request<TResponse>(config)
  }


  public get<TResponse = unknown>(url: string, requestOptions?: AxiosRequestConfig) {
    return this.request<unknown, TResponse>("get", url, requestOptions)
  }

  public post<TRequest = unknown, TResponse = unknown>(
    url: string,
    data?: TRequest,
    requestOptions?: AxiosRequestConfig
  ) {
    return this.request<TRequest, TResponse>("post", url, requestOptions, data)
  }

  public head<TResponse = unknown>(url: string, requestOptions?: AxiosRequestConfig) {
    return this.request<unknown, TResponse>("head", url, requestOptions)
  }

  public put<TRequest = unknown, TResponse = unknown>(
    url: string,
    data?: TRequest,
    requestOptions?: AxiosRequestConfig
  ) {
    return this.request<TRequest, TResponse>("put", url, requestOptions, data)
  }

  public delete<TResponse = unknown, TRequest = unknown>(
    url: string,
    data?: TRequest,
    requestOptions?: AxiosRequestConfig) {
    return this.request<unknown, TResponse>("delete", url, requestOptions, data)
  }

  public patch<TRequest = unknown, TResponse = unknown>(
    url: string,
    data?: TRequest,
    requestOptions?: AxiosRequestConfig

  ) {
    return this.request<TRequest, TResponse>("patch", url, requestOptions, data)
  }

}