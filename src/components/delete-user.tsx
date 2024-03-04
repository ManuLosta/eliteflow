"use client";

import { api } from "~/trpc/react";
import { Button, buttonVariants } from "./ui/button";
import {
  Dialog,
  DialogTitle,
  DialogTrigger,
  DialogContent,
  DialogClose,
} from "./ui/dialog";
import { Loader2, Trash2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteUser({ userId }: { userId: string }) {
  const [loading, setLoading] = useState(false);
  const mutation = api.user.delete.useMutation();
  const router = useRouter();

  const handleDelete = async () => {
    setLoading(true);
    await mutation.mutateAsync({ id: userId });
    router.refresh();
  };

  return (
    <Dialog>
      <DialogTrigger className="flex items-center gap-2 font-bold text-destructive">
        <Trash2Icon size={20} />
        Eliminar
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Eliminar usuario</DialogTitle>
        <p>¿Estás seguro que deseas eliminar este usuario?</p>
        <div className="mt-4 flex justify-end gap-2">
          <DialogClose className={buttonVariants({ variant: "secondary" })}>
            Cancelar
          </DialogClose>
          {!loading ? (
            <Button onClick={() => handleDelete()} variant="destructive">
              Eliminar
            </Button>
          ) : (
            <Button variant="destructive" disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Espera
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
