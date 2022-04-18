import axios, { AxiosInstance, AxiosPromise, AxiosRequestConfig } from "axios";
import { mutate } from "swr";
import queryString from "query-string";

const createFetcher = () => {
  const cache = new Map();
  return async <T = any>(
    options: { useCache?: boolean } & AxiosRequestConfig,
    instance: AxiosInstance = axios
  ): Promise<T> => {
    const { useCache = true, ...config } = options;
    const key = `${config.url}?${queryString.stringify(config.params)}`;

    if (useCache && cache.has(key)) {
      return cache.get(key);
    }
    const response = await instance(config).then((res) => res.data);
    if (useCache) {
      cache.set(key, response);
    }
    return response;
  };
};
export const fetcher = createFetcher();

export const spotify = axios.create({
  baseURL: "https://api.spotify.com/v1/",
});

export const prefetch = (url: string, instance: AxiosInstance = axios) => {
  mutate(url, () => fetcher({ url }, instance));
};
