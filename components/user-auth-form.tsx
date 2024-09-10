"use client";import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader } from "lucide-react";
import Messages from "@/app/login/messages";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export default function Login({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");

  const formAction = "/auth/sign-in"; // Acción original del formulario

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    setIsLoading(true);

    // Simula una demora antes de quitar la carga
    setTimeout(() => {
      // setIsLoading(false);
      
      // Ejecuta la acción original del formulario después de la demora
      const form = document.createElement("form");
      form.action = formAction;
      form.method = "post";
      
      // Agrega los datos de inicio de sesión al formulario
      const emailInput = document.createElement("input");
      emailInput.type = "email";
      emailInput.name = "email";
      emailInput.value = email;
      form.appendChild(emailInput);
      
      const passwordInput = document.createElement("input");
      passwordInput.type = "password";
      passwordInput.name = "password";
      passwordInput.value = password;
      form.appendChild(passwordInput);
      
      document.body.appendChild(form);
      form.submit();
    }, 1000);
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form action={formAction} method="post" onSubmit={onSubmit}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              Email
            </Label>
            <Input
              placeholder="name@beerz.delivery"
              type="email"
              name="email"
              value={email}
              autoCapitalize="none"
              autoComplete="none"
              autoCorrect="off"
              disabled={isLoading}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Label className="sr-only" htmlFor="password">
              Password
            </Label>
            <Input
              type="password"
              name="password"
              value={password}
              placeholder="••••••••"
              autoCapitalize="none"
              autoComplete="none"
              autoCorrect="off"
              disabled={isLoading}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button disabled={isLoading}>
            {isLoading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
            Iniciar Sesion
          </Button>
   
        </div>
        <Messages />
      </form>
    </div>
  );
}
