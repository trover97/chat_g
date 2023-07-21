import axios, { AxiosRequestConfig } from "axios";

declare global {
  interface Window {
    _env_: any;
  }
}

const baseURL = "http://94.228.124.35:8000/search";

axios.defaults.baseURL = baseURL;

export const api = async (axiosProps: AxiosRequestConfig) => {
  try {
    const { data } = await axios(axiosProps);

    return data;
  } catch (error) {
    throw error;
  }
};

class ApiService {
  get: (url: string, params?: any) => any;

  post: (url: string, data?: any, params?: any) => any;

  put: (url: string, data?: any, params?: any) => any;

  delete: (url: string, data?: any, options?: any) => any;

  constructor() {
    this.get = async (url: string, params: any) => axios.get(url, params);

    this.post = async (url, data, options) => {
      return axios.post(url, data, options);
    };

    this.put = async (url, data, options) => {
      return axios.put(url, data, options);
    };

    this.delete = async (url, data) => {
      return axios.delete(url, {
        data: data,
      });
    };
  }

  async sendQuestion(data: FormData) {
    return axios({ data, method: "post" });
  }
}

export default new ApiService();
