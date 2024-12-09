"use client";

import { useContextProvider } from "@/shared/hooks/useContextProvider";
import ChatContextProvider from "@/shared/contexts/chat.context";
import UserInfo from "./_components/UserInfo";
import UserList from "./_components/UserList";
import Chat from "./_components/Chat";

function ChatPageImpl() {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white shadow grid grid-cols-3 rounded-3xl w-full md:w-11/12 lg:w-10/12 xl:w-9/12 2xl:w-7/12 h-5/6 overflow-hidden">
        <div className="col-span-1 flex flex-col border-r border-gray-200">
          <UserList />
          <UserInfo />
        </div>
        <div className="col-span-2">
          <Chat />
        </div>
      </div>
    </div>
  );
}

const ChatPage = () =>
  useContextProvider(ChatContextProvider, <ChatPageImpl />);

export default ChatPage;
