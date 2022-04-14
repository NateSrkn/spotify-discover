import axios, { AxiosInstance, AxiosPromise, AxiosRequestConfig } from "axios";
import { mutate } from "swr";

export const request = (options: AxiosRequestConfig): AxiosPromise<any> => {
  const defaultOptions: AxiosRequestConfig = {
    method: "get",
  };
  return axios({
    baseURL: "https://api.spotify.com/v1/",
    ...defaultOptions,
    ...options,
    params: {
      ...defaultOptions.params,
      ...options.params,
    },
  });
};

export const fetcher = <T = any>(
  config: AxiosRequestConfig,
  instance: AxiosInstance = axios
): Promise<T> => instance(config).then((res) => res.data);

export const spotify = axios.create({
  baseURL: "https://api.spotify.com/v1/",
});

export const prefetch = (url: string, instance: AxiosInstance = axios) => {
  mutate(url, () => fetcher({ url }, instance));
};
