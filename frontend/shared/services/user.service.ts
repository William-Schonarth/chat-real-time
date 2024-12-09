import { API } from "../infra/axios";
import { IUser } from "../models";

export async function getAllUsers() {
  return await API.get<IUser[]>("/api/users");
}
