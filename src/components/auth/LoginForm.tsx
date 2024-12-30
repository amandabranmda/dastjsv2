import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Login error:", error);
        throw error;
      }

      navigate("/");
      toast({
        description: "Login realizado com sucesso!",
      });
    } catch (error: any) {
      console.error("Login error details:", error);
      toast({
        variant: "destructive",
        description: "Credenciais inválidas",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="mt-8 space-y-6" onSubmit={handleLogin}>
      <div className="space-y-4 rounded-md">
        <div>
          <Input
            type="email"
            required
            className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <Input
            type="password"
            required
            className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-[#10B981] to-[#0EA5E9] hover:opacity-90 transition-opacity"
      >
        {loading ? "Entrando..." : "Entrar"}
      </Button>
    </form>
  );
}