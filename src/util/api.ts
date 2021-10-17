import axios, { AxiosPromise, AxiosRequestConfig } from "axios";

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
