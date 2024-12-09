import axios from "axios";
import { parseCookies } from "nookies";
import { EPublicEndpoints } from "../utils/routes";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000",
});

API.interceptors.request.use(
  (request) => {
    if (
      Object.values(EPublicEndpoints).some((endpoint) =>
        (request.url ?? "").includes(endpoint)
      )
    ) {
      return request;
    }

    const cookies = parseCookies();
    const token = cookies["token"];

    if (token) {
      request.headers["Authorization"] = `Bearer ${token}`;
    } else {
      throw new axios.Cancel("User not authenticated");
    }

    return request;
  },
  (error) => Promise.reject(error)
);

API.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

export { API };
