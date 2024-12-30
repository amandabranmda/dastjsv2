import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerName, setRegisterName] = useState("");
  const [registerLoading, setRegisterLoading] = useState(false);
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

      if (error) throw error;

      navigate("/");
      toast({
        description: "Login realizado com sucesso!",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        description: error.message || "Erro ao fazer login",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterLoading(true);

    try {
      const { data: { user }, error } = await supabase.auth.signUp({
        email: registerEmail,
        password: registerPassword,
        options: {
          data: {
            full_name: registerName,
          }
        }
      });

      if (error) throw error;

      // Add user to the users table for chip responsibility
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
        description: "Cadastro realizado com sucesso! Verifique seu email para confirmar o cadastro.",
      });
      setRegisterEmail("");
      setRegisterPassword("");
      setRegisterName("");
    } catch (error: any) {
      toast({
        variant: "destructive",
        description: error.message || "Erro ao fazer cadastro",
      });
    } finally {
      setRegisterLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="w-full max-w-md space-y-8 p-8 bg-gray-800/50 rounded-lg backdrop-blur-sm border border-gray-700">
        <div>
          <h2 className="text-center text-3xl font-bold tracking-tight text-white">
            Login
          </h2>
        </div>
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

          <div className="flex flex-col gap-4">
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#10B981] to-[#0EA5E9] hover:opacity-90 transition-opacity"
            >
              {loading ? "Entrando..." : "Entrar"}
            </Button>

            <Dialog>
              <DialogTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full border-gray-600 text-white hover:bg-gray-700/50"
                >
                  Criar conta
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md bg-gray-800/90 border-gray-700">
                <DialogHeader>
                  <DialogTitle className="text-white">Criar nova conta</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleRegister} className="space-y-4">
                  <Input
                    type="text"
                    required
                    className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400"
                    placeholder="Nome completo"
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
              </DialogContent>
            </Dialog>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;