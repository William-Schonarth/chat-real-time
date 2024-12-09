"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { destroyCookie, parseCookies } from "nookies";
import { Avatar, AvatarFallback } from "@/shared/components";
import { logout } from "@/shared/services";
import { IUser } from "@/shared/models";
import { ERoutes } from "@/shared/utils";

export default function UserInfo() {
  const router = useRouter();

  const [currentUser, setCurrentUser] = useState<IUser>({} as IUser);

  useEffect(() => {
    const cookies = parseCookies();
    const user = cookies["user"];

    if (user) {
      setCurrentUser(JSON.parse(user));
    }
  }, []);

  async function handleClickLogout() {
    await logout().then(() => {
      destroyCookie(null, "token");
      destroyCookie(null, "user");

      router.push(ERoutes.LOGIN);
    });
  }

  return (
    <div className="p-4 h-20 border-t border-gray-200 bg-indigo-100 ">
      <div className="flex justify-between items-center ">
        <div className="flex items-center space-x-3">
          <Avatar className="bg-indigo-500 text-zinc-50">
            <AvatarFallback>
              {currentUser.name?.charAt(0)?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold" title={currentUser.username}>
              {currentUser.name}
            </h3>
            <div className="flex items-center space-x-1">
              <span
                data-online={currentUser.isOnline}
                className="size-2 rounded-full bg-zinc-500 data-[online=true]:bg-green-500"
              />
              <span className="text-sm text-zinc-500">
                {currentUser.isOnline ? "Ativo" : "Inativo"}
              </span>
            </div>
          </div>
        </div>
        <span title="Sair" onClick={handleClickLogout}>
          <LogOut
            size={28}
            className="cursor-pointer hover:bg-zinc-300 p-1 rounded-full duration-200"
          />
        </span>
      </div>
    </div>
  );
}
