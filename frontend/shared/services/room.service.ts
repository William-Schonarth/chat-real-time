import { API } from "../infra/axios";

export async function getRoomId({ receiverId }: { receiverId: string }) {
  return await API.post("/api/rooms/getOrCreate", { receiverId });
}

export async function getRoomMessages({ roomId }: { roomId: string }) {
  return await API.get("/api/rooms/messages", {
    params: {
      roomId,
    },
  });
}
