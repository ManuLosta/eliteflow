import { getServerAuthSession } from "~/server/auth";

export default async function Home() {
  const session = await getServerAuthSession();

  return (
    <div className="container mt-4">Login as {session?.user.username}</div>
  );
}
