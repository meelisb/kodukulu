import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgot, setIsForgot] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isForgot) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        toast.success("Parooli taastamise link saadeti e-postile!");
        setIsForgot(false);
      } else if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        toast.success("Konto loodud! Oled nüüd sisse logitud.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      }
    } catch (error: any) {
      const msg =
        error.message === "Invalid login credentials"
          ? "Vale e-post või parool"
          : error.message === "User already registered"
            ? "See e-post on juba registreeritud"
            : error.message === "Password should be at least 6 characters"
              ? "Parool peab olema vähemalt 6 tähemärki"
              : error.message;
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground">Kodukulu</h1>
          <p className="mt-2 text-muted-foreground">
            {isForgot ? "Parooli taastamine" : isSignUp ? "Loo uus konto" : "Logi sisse"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">E-post</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="sinu@email.ee"
              required
              className="h-11 text-base"
            />
          </div>

          {!isForgot && (
            <div className="space-y-2">
              <Label htmlFor="password">Parool</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="h-11 text-base"
              />
            </div>
          )}

          {!isSignUp && !isForgot && (
            <div className="text-right">
              <button
                type="button"
                onClick={() => setIsForgot(true)}
                className="text-sm text-muted-foreground hover:text-primary"
              >
                Unustasid parooli?
              </button>
            </div>
          )}

          <Button type="submit" className="h-11 w-full text-base" disabled={loading}>
            {loading
              ? "Palun oota..."
              : isForgot
                ? "Saada taastamislink"
                : isSignUp
                  ? "Loo konto"
                  : "Logi sisse"}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          {isForgot ? (
            <button
              type="button"
              onClick={() => setIsForgot(false)}
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              Tagasi sisselogimisele
            </button>
          ) : (
            <>
              {isSignUp ? "Konto juba olemas?" : "Pole veel kontot?"}{" "}
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                {isSignUp ? "Logi sisse" : "Loo konto"}
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
