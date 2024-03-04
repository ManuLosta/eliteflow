import DeleteUser from "~/components/delete-user";
import NewUserForm from "~/components/newuser-form";
import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from "~/components/ui/table";
import { api } from "~/trpc/server";

export default async function Users() {
  const users = await api.user.getAll.query();

  return (
    <div>
      <h1 className="text-2xl font-bold">Usuarios</h1>
      <div className="mt-10">
        <NewUserForm />
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Destino</TableHead>
              <TableHead>Fecha de creación</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.username}</TableCell>
                <TableCell>
                  {user.admin ? "Administrador" : "Gerente"}
                </TableCell>
                <TableCell>{user.destination_id || "-"}</TableCell>
                <TableCell>{user.createdAt.toLocaleDateString()}</TableCell>
                <TableCell className="flex gap-2">
                  <DeleteUser userId={user.id} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
