import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { setUser } from "@/lib/booking-store";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [{ title: "Login — Luxemansio" }, { name: "robots", content: "noindex" }],
  }),
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return toast.error("Enter your email and password");
    const name = email.split("@")[0].replace(/\b\w/g, (c) => c.toUpperCase());
    setUser({ name, email });
    toast.success("Welcome back!");
    navigate({ to: "/account" });
  };

  return (
    <div className="container-page py-16">
      <div className="mx-auto max-w-md rounded-2xl bg-card p-8 ring-1 ring-border shadow-lg">
        <h1 className="font-display text-3xl text-navy">Welcome back</h1>
        <p className="mt-1 text-sm text-muted-foreground">Sign in to manage your bookings.</p>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <Label>Email</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label>Password</Label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1" />
          </div>
          <Button type="submit" className="w-full bg-navy text-navy-foreground hover:bg-navy/90">Sign in</Button>
        </form>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          New to Luxemansio? <Link to="/register" className="text-navy font-medium hover:text-gold">Create an account</Link>
        </p>
      </div>
    </div>
  );
}
