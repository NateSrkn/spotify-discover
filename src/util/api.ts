import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { mutate } from "swr";

export const fetcher = <T = any>(
  options: AxiosRequestConfig,
  instance: AxiosInstance = axios
): Promise<T> => instance(options).then((res) => res.data);

export const spotify = axios.create({
  baseURL: "https://api.spotify.com/v1/",
});

export const prefetch = (url: string, instance: AxiosInstance = axios) => {
  mutate(url, () => fetcher({ url }, instance));
};
