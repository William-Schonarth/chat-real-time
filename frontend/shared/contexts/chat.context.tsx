"use client";

import { createContext, ReactNode, useContext, useState } from "react";
import { IUser } from "@/shared/models";

interface IChatContextProps {
  users: IUser[];
  setUsers: React.Dispatch<React.SetStateAction<IUser[]>>;
  selectedUser: IUser | null;
  setSelectedUser: React.Dispatch<React.SetStateAction<IUser | null>>;
}

const chatContext = createContext<IChatContextProps>({
  users: [],
  setUsers: () => {},
  selectedUser: null,
  setSelectedUser: () => {},
});

export default function ChatContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [users, setUsers] = useState<IUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);

  return (
    <chatContext.Provider
      value={{ users, setUsers, selectedUser, setSelectedUser }}
    >
      {children}
    </chatContext.Provider>
  );
}

export const useChatContext = () =>
  useContext(chatContext) as IChatContextProps;
