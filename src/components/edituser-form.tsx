"use client";

import { Loader2, PencilIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogClose,
} from "./ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "~/trpc/react";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Button, buttonVariants } from "./ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  username: z.string().min(2, {
    message: "El usuario debe tener al menos 2 caracteres.",
  }),
  password: z.string().min(4, {
    message: "La contraseña debe tener al menos 4 caracteres.",
  }),
  role: z.enum(["admin", "manager"]),
  destination: z.string().optional(),
});

interface User {
  id: string;
  username: string;
  password: string;
  admin: boolean;
  destination_id?: string | null;
}

export default function EditUserForm({ user }: { user: User }) {
  const destinations = api.destination.getAll.useQuery();
  const mutation = api.user.update.useMutation();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: user.username,
      password: user.password,
      role: user.admin ? "admin" : "manager",
      destination: user.destination_id || "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    await mutation.mutateAsync({ id: user.id, ...values });
    router.refresh();
    setLoading(false);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="me-5 flex font-bold">
        <PencilIcon className="me-2" size={20} />
        Editar
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Editar usuario</DialogTitle>
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
                    <Input {...field} type="password" autoComplete="off" />
                  </FormControl>
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
            <div className="flex items-center justify-end gap-2">
              <DialogClose className={buttonVariants({ variant: "secondary" })}>
                Cancelar
              </DialogClose>
              {!loading ? (
                <Button type="submit">Editar</Button>
              ) : (
                <Button variant="default" disabled>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Espera
                </Button>
              )}
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
