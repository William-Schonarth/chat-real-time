import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { format, formatDistance, isToday } from "date-fns";
import { ptBR } from "date-fns/locale";
import { parseCookies } from "nookies";
import { Avatar, AvatarFallback, Button, Input } from "@/shared/components";
import { connectSocket, getSocket, SOCKET_ACTIONS } from "@/shared/infra";
import { useChatContext } from "@/shared/contexts";
import { IMessage } from "@/shared/models";
import { getRoomId, getRoomMessages } from "@/shared/services";

export default function Chat() {
  const { selectedUser } = useChatContext();

  const [messages, setMessages] = useState<IMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [roomId, setRoomId] = useState<string | null>(null);
  const chatBox = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedUser) {
      fetchRoomId(selectedUser.id);
    }
  }, [selectedUser]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const cookies = parseCookies();
    const token = cookies["token"];
    const user = cookies["user"];

    if (!token) return;

    const socket = connectSocket(token);

    if (roomId) {
      socket.emit(SOCKET_ACTIONS.JOIN_ROOM, roomId);

      socket.on(SOCKET_ACTIONS.MESSAGE, (msg: IMessage) => {
        if (
          msg.userId === selectedUser?.id ||
          msg.userId === JSON.parse(user).id
        ) {
          setMessages((prevState) => [...prevState, msg]);
        }
      });

      socket?.on(SOCKET_ACTIONS.ERROR_MESSAGE, (e: any) => {
        toast.error("Ocorreu um erro para enviar/receber uma mensagem");
      });
    }

    return () => {
      socket?.off(SOCKET_ACTIONS.MESSAGE);
    };
  }, [roomId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  async function fetchRoomId(receiverId: string) {
    await getRoomId({ receiverId }).then(async ({ data }) => {
      setRoomId(data.roomId);
      await fetchRoomMessages(data.roomId);
    });
  }

  async function fetchRoomMessages(roomId: string) {
    await getRoomMessages({ roomId }).then(({ data }) => {
      setMessages(data);
    });
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();

    if (newMessage.trim()) {
      const socket = getSocket();
      socket?.emit(SOCKET_ACTIONS.MESSAGE, {
        roomId,
        content: newMessage.trim(),
      });

      setNewMessage("");
    }
  };

  function formatDate(date: string) {
    const now = new Date();
    const parsedDate = new Date(date);

    if (isToday(parsedDate)) {
      const relativeTime = formatDistance(parsedDate, now, {
        locale: ptBR,
        addSuffix: true,
      });
      return `Hoje, ${relativeTime}`;
    }

    return format(parsedDate, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
  }

  const scrollToBottom = () => {
    if (chatBox.current) {
      chatBox.current.scrollTop = chatBox.current.scrollHeight;
    }
  };

  return (
    <div className="h-full flex flex-col mt-0">
      <div className="p-4 border-b border-gray-200 bg-indigo-100 shadow">
        {selectedUser && (
          <div className="flex items-center space-x-4">
            <Avatar className="size-12 bg-indigo-500 text-zinc-50">
              <AvatarFallback>{selectedUser.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-semibold">{selectedUser.name}</h2>
              <div className="flex items-center space-x-1">
                <span
                  data-online={selectedUser.isOnline}
                  className="size-2 rounded-full bg-zinc-500 data-[online=true]:bg-green-500 duration-200"
                />
                <span className="text-sm text-zinc-500">
                  {selectedUser.isOnline ? "Ativo" : "Inativo"}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div ref={chatBox} className="flex-grow p-4 h-96 overflow-y-auto">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.userId === selectedUser?.id
                  ? "justify-start"
                  : "justify-end"
              }`}
            >
              <div
                className={`min-w-44 max-w-xs px-4 space-y-1 py-2 rounded-lg shadow ${
                  message.userId === selectedUser?.id
                    ? "bg-gray-200"
                    : "bg-indigo-500 text-white"
                }`}
              >
                <p>{message.content}</p>

                <p
                  className={`text-xs text-end ${
                    message.userId === selectedUser?.id
                      ? "text-zinc-500"
                      : "text-zinc-200"
                  }`}
                >
                  {formatDate(message.createdAt)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <form
        onSubmit={handleSendMessage}
        className="p-4 h-20 border-t border-gray-200 "
      >
        <div className="flex space-x-2">
          <Input
            type="text"
            placeholder="Digite sua mensagem..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <Button type="submit">Enviar</Button>
        </div>
      </form>
    </div>
  );
}
