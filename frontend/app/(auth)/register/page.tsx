import { Metadata } from "next";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: "Register",
  description: "Create your LinkShort account",
};

export default function RegisterPage() {
  return <RegisterForm />;
}
