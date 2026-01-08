import { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your LinkShort account",
};

export default function LoginPage() {
  return <LoginForm />;
}
