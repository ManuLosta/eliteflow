import { getServerAuthSession } from "~/server/auth";

export default async function NavBar({ title }: { title: string }) {
  const session = await getServerAuthSession();

  return (
    <nav className="flex items-center justify-between border-b px-10 py-4">
      <h1 className="text-2xl font-bold">{title}</h1>
      <p>{session?.user.destination}</p>
    </nav>
  );
}
