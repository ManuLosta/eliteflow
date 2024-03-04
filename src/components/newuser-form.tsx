"use client";

import { useForm } from "react-hook-form";
import { Button, buttonVariants } from "./ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "./ui/input";
import { cn } from "~/lib/utils";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectValue,
  SelectItem,
} from "./ui/select";
import { api } from "~/trpc/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

const formSchema = z
  .object({
    username: z.string().min(2, {
      message: "El usuario debe tener al menos 2 caracteres.",
    }),
    password: z.string().min(4, {
      message: "La contraseña debe tener al menos 4 caracteres.",
    }),
    repeatPassword: z.string(),
    role: z.enum(["admin", "manager"]),
    destination: z.string().optional(),
  })
  .refine((data) => data.password === data.repeatPassword, {
    message: "Las contraseñas no coinciden.",
    path: ["repeatPassword"],
  });

export default function NewUserForm() {
  const [open, setOpen] = useState(false);
  const destinations = api.destination.getAll.useQuery();
  const mutation = api.user.create.useMutation();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
      repeatPassword: "",
      destination: undefined,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    mutation.mutate(values);

    if (mutation.error) {
      form.setError("username", { message: mutation.error.message });
    } else {
      setOpen(false);
      router.refresh();
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className={cn(buttonVariants({ variant: "default" }), "mb-4")}
      >
        Nuevo Usuario
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Crear nuevo usuario</DialogTitle>
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre de usuario</FormLabel>
                  <FormControl>
                    <Input {...field} autoComplete="off" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contraseña</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="repeatPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Repetir contraseña</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-between">
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem className="w-1/2 pr-2">
                    <FormLabel>Rol</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Elegir rol" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="admin">Administrador</SelectItem>
                        <SelectItem value="manager">Gerente</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="destination"
                render={({ field }) => (
                  <FormItem className="w-1/2 pl-2">
                    <FormLabel>Destino</FormLabel>
                    <Select
                      disabled={form.watch("role") === "admin"}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Elegir destino" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {destinations.data?.length !== 0 ? (
                          destinations.data?.map((destination) => (
                            <SelectItem
                              key={destination.id}
                              value={destination.id}
                            >
                              {destination.description}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="loading">Cargando...</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit">Crear</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
