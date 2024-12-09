"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";
import { setCookie } from "nookies";
import { Button, Input } from "@/shared/components";
import { login } from "@/shared/services";
import { ERoutes, getError } from "@/shared/utils";

export default function LoginPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState<boolean>(false);

  const loginSchema = z.object({
    username: z
      .string()
      .min(3, { message: "O usuário deve ter no mínimo 3 caracteres" }),
    password: z
      .string()
      .min(6, { message: "A senha deve ter no mínimo 6 caracteres" }),
  });

  type TLoginSchema = z.infer<typeof loginSchema>;

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<TLoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: TLoginSchema) {
    await login(data)
      .then(({ data: response }) => {
        if (response.token) {
          setCookie(null, "token", response.token);
        }
        if (response.user) {
          setCookie(null, "user", JSON.stringify(response.user));
        }

        router.push(ERoutes.CHAT);
      })
      .catch((e) => {
        if (e.status === 401) {
          setError("username", {
            message: "Usuário ou senha incorreto",
          });
          setError("password", {
            message: "Usuário ou senha incorreto",
          });
        } else {
          toast.error("Ocorreu um erro ao efetuar login");
        }
      });
  }

  function handleClickRegister() {
    router.push(ERoutes.REGISTER);
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white shadow flex flex-col space-y-10 rounded-3xl w-full md:w-7/12 lg:w-5/12 xl:w-3/12 2xl:w-3/12">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="px-5 md:px-10 2xl:px-14 pt-10 flex flex-col"
        >
          <div className="ml-2 flex flex-col items-center mb-10">
            <h1 className="text-2xl font-bold">Acesse sua conta</h1>
            <h3 className="text-sm text-zinc-500">Insira suas credenciais</h3>
          </div>
          <Input
            label="Usuário"
            {...register("username")}
            errors={getError(errors, "username")}
          />
          <div className="flex items-center">
            <Input
              label="Senha"
              type={showPassword ? "text" : "password"}
              errors={getError(errors, "password")}
              {...register("password")}
            />
            <button
              type="button"
              className="-ml-10 mt-1.5 text-zinc-500 hover:text-zinc-600 hover:cursor-pointer"
              onClick={() => setShowPassword((prevState) => !prevState)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <Button variant="secondary" type="submit" className="mt-1">
            Acessar
          </Button>
        </form>
        <span
          className="w-full py-3 text-center bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-b-3xl duration-200 hover:cursor-pointer"
          onClick={handleClickRegister}
        >
          Criar nova conta
        </span>
      </div>
    </div>
  );
}
