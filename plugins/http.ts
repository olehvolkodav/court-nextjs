import { $errorActions } from "@/store/error.store";
import Axios, { AxiosError } from "axios";
import Cookies from 'js-cookie';

interface GraphQLOptions {
  query: string;
  variables?: Record<string, any>
}

const axios = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, //use env later,
  headers: {
    'Accept': 'application/json'
  }
});

axios.interceptors.response.use(function (response) {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  return response;
}, function (error: AxiosError<any>) {
  if (error?.response?.status === 422 && error?.response?.data.errors) {
    $errorActions.setErrors(error.response.data.errors);
  }

  return Promise.reject(error);
});

axios.interceptors.request.use(function (config) {
  // only on client side
  const token = Cookies.get('court_auth_token');

  if (!!token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const $http = axios;

export const $gql = async(params: GraphQLOptions | string) => {
  const payload = typeof params === 'string' ? {query: params} : params;

  try {
    const res = await $http.post('/graphql', payload);

    if (res.data?.errors?.length) {
      return Promise.reject(res.data.errors)
    }

    return Promise.resolve(res.data.data);
  } catch (error) {
    return Promise.reject(error);
  }
}

export const gqlFetcher = (options: GraphQLOptions) => $http.post('/graphql', options).then(res => res.data.data);