import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

export function RegisterForm() {
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerName, setRegisterName] = useState("");
  const [registerLoading, setRegisterLoading] = useState(false);
  const { toast } = useToast();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterLoading(true);

    try {
      const { data: { user }, error } = await supabase.auth.signUp({
        email: registerEmail,
        password: registerPassword,
        options: {
          data: {
            name: registerName,
          },
        }
      });

      if (error) throw error;

      if (user) {
        const { error: profileError } = await supabase
          .from('users')
          .insert([
            {
              id: user.id,
              name: registerName,
              email: registerEmail,
            }
          ]);

        if (profileError) throw profileError;
      }

      toast({
        description: "Cadastro realizado com sucesso!",
      });
      setRegisterEmail("");
      setRegisterPassword("");
      setRegisterName("");
    } catch (error: any) {
      console.error("Registration error:", error);
      toast({
        variant: "destructive",
        description: error.message || "Erro ao fazer cadastro. Tente novamente.",
      });
    } finally {
      setRegisterLoading(false);
    }
  };

  return (
    <form onSubmit={handleRegister} className="space-y-4">
      <Input
        type="text"
        required
        className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400"
        placeholder="Nome"
        value={registerName}
        onChange={(e) => setRegisterName(e.target.value)}
      />
      <Input
        type="email"
        required
        className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400"
        placeholder="Email"
        value={registerEmail}
        onChange={(e) => setRegisterEmail(e.target.value)}
      />
      <Input
        type="password"
        required
        className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400"
        placeholder="Senha"
        value={registerPassword}
        onChange={(e) => setRegisterPassword(e.target.value)}
      />
      <Button
        type="submit"
        disabled={registerLoading}
        className="w-full bg-gradient-to-r from-[#10B981] to-[#0EA5E9] hover:opacity-90 transition-opacity"
      >
        {registerLoading ? "Cadastrando..." : "Cadastrar"}
      </Button>
    </form>
  );
}