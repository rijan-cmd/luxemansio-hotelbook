import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { setUser } from "@/lib/booking-store";
import { toast } from "sonner";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [{ title: "Create account — Luxemansio" }, { name: "robots", content: "noindex" }],
  }),
  component: Register,
});

function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) return toast.error("Please complete all fields");
    setUser({ name, email });
    toast.success("Account created!");
    navigate({ to: "/account" });
  };

  return (
    <div className="container-page py-16">
      <div className="mx-auto max-w-md rounded-2xl bg-card p-8 ring-1 ring-border shadow-lg">
        <h1 className="font-display text-3xl text-navy">Create your account</h1>
        <p className="mt-1 text-sm text-muted-foreground">Save preferences and manage bookings in one place.</p>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <Label>Full name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label>Email</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label>Password</Label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1" />
          </div>
          <Button type="submit" className="w-full bg-navy text-navy-foreground hover:bg-navy/90">Create account</Button>
        </form>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account? <Link to="/login" className="text-navy font-medium hover:text-gold">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
