import React from "react";
import NavBar from "~/components/navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NavBar title="Usuarios" />
      <div className="container mt-10">{children}</div>
    </>
  );
}
