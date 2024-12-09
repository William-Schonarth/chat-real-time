import { API } from "../infra/axios";
import { IUser } from "../models";

export async function login(data: { username: string; password: string }) {
  return await API.post("/api/auth/login", data);
}

export async function registerUser(data: {
  name: string;
  username: string;
  password: string;
}) {
  return await API.post<{ token: string; user: IUser }>(
    "/api/auth/register",
    data
  );
}

export async function logout() {
  return await API.post("/api/auth/logout");
}
