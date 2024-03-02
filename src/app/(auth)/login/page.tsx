import LoginForm from "~/components/login-form"; 
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Iniciar sesión",
};

export default function Login() {
  return (
    <div className="container flex items-center justify-center h-[100vh]">
      <LoginForm />
    </div>
  );
}
