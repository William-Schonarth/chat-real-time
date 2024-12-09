"use client";

import { useEffect } from "react";
import { parseCookies } from "nookies";
import { toast } from "react-toastify";
import { Avatar, AvatarFallback } from "@/shared/components";
import { getAllUsers } from "@/shared/services";
import { IUser } from "@/shared/models";
import { connectSocket, SOCKET_ACTIONS } from "@/shared/infra";
import { useChatContext } from "@/shared/contexts";

export default function UserList() {
  const { users, selectedUser, setUsers, setSelectedUser } = useChatContext();

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const cookies = parseCookies();
    const token = cookies["token"];

    if (!token) return;

    const socket = connectSocket(token);

    socket?.on(
      SOCKET_ACTIONS.USER_ONLINE,
      (data: { userId: string; email: string }) => {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === data.userId ? { ...user, isOnline: true } : user
          )
        );

        if (selectedUser?.id === data.userId) {
          setSelectedUser((prevState) =>
            prevState ? { ...prevState, isOnline: true } : null
          );
        }
      }
    );

    socket?.on(SOCKET_ACTIONS.USER_OFFLINE, (data: { userId: string }) => {
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === data.userId ? { ...user, isOnline: false } : user
        )
      );

      if (selectedUser?.id === data.userId) {
        setSelectedUser((prevState) =>
          prevState ? { ...prevState, isOnline: false } : null
        );
      }
    });

    socket?.on(SOCKET_ACTIONS.USER_REGISTERED, () => {
      fetchUsers();
    });

    socket.on(SOCKET_ACTIONS.NOTIFICATION, (data) => {
      if (data.type === "new_message" && selectedUser?.id !== data.sender.id) {
        toast.info(`Nova mensagem de ${data.sender.name}`);
      }
    });

    socket.on(SOCKET_ACTIONS.ERROR_ROOM, () => {
      toast.error("Ocorreu um erro ao conectar com a sala");
    });

    return () => {
      socket?.off(SOCKET_ACTIONS.USER_ONLINE);
      socket?.off(SOCKET_ACTIONS.USER_OFFLINE);
      socket?.off(SOCKET_ACTIONS.USER_REGISTERED);
      socket?.off(SOCKET_ACTIONS.NOTIFICATION);
      socket?.off(SOCKET_ACTIONS.ERROR_ROOM);
    };
  }, [selectedUser]);

  async function fetchUsers() {
    await getAllUsers().then(({ data }) => {
      setUsers(data);

      if (!selectedUser && data?.length > 0) {
        setSelectedUser(data[0]);
      }
    });
  }

  function handleClickUser(user: IUser) {
    setSelectedUser(user);
  }

  return (
    <div className="flex-grow h-96 overflow-y-auto">
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">Usuários</h2>
        <ul className="space-y-2 ">
          {users.map((user) => (
            <li
              key={user.id}
              data-selected={user.id === selectedUser?.id}
              className="group flex items-center space-x-3 p-2 shadow bg-zinc-100 data-[selected=true]:bg-indigo-200 hover:bg-indigo-200 rounded-lg cursor-pointer duration-200 "
              onClick={() => handleClickUser(user)}
            >
              <Avatar
                data-selected={user.id === selectedUser?.id}
                className="bg-zinc-200 data-[selected=true]:bg-indigo-500 data-[selected=true]:text-zinc-50 duration-200"
              >
                <AvatarFallback>
                  {user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="truncate" title={user.username}>
                  {user.name}
                </span>
                <div className="flex items-center space-x-1">
                  <span
                    data-online={user.isOnline}
                    className="size-2 rounded-full bg-zinc-500 data-[online=true]:bg-green-500 duration-200"
                  />
                  <span
                    data-selected={user.id === selectedUser?.id}
                    className="text-sm text-zinc-500 data-[selected=true]:text-zinc-700 group-hover:text-zinc-700 duration-200"
                  >
                    {user.isOnline ? "Ativo" : "Inativo"}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
