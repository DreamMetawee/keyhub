import axios, { AxiosInstance } from "axios";
import Cookies from "js-cookie";


const API_ENDPOINT: string = process.env.NEXT_PUBLIC_API_ENDPOINT || "";

export const api: AxiosInstance = axios.create({
  baseURL: API_ENDPOINT,
});

export const AuthSending = (): AxiosInstance => {
  const token: string | undefined = Cookies.get("token");

  const instance = axios.create({
    baseURL: API_ENDPOINT,
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
  });

  return instance;
};
