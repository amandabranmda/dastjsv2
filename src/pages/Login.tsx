import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isRegistering) {
        if (!name.trim()) {
          toast.error("Por favor, insira seu nome");
          setIsLoading(false);
          return;
        }

        if (password.length < 6) {
          toast.error("A senha deve ter pelo menos 6 caracteres");
          setIsLoading(false);
          return;
        }

        // Registra o usuário
        const { data: authData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name: name,
            },
          },
        });

        if (signUpError) {
          toast.error(signUpError.message);
          setIsLoading(false);
          return;
        }

        if (authData.user) {
          // Cria o perfil do usuário
          const { error: profileError } = await supabase
            .from('profiles')
            .insert({ 
              id: authData.user.id, 
              name: name 
            });

          if (profileError) {
            toast.error("Erro ao criar perfil do usuário");
            setIsLoading(false);
            return;
          }

          toast.success("Cadastro realizado com sucesso!");
          setName("");
          setEmail("");
          setPassword("");
          navigate("/");
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) {
          toast.error(signInError.message);
          setIsLoading(false);
          return;
        }

        toast.success("Login realizado com sucesso!");
        navigate("/");
      }
    } catch (error: any) {
      toast.error(error.message || "Ocorreu um erro durante a autenticação");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black p-4">
      <Card className="w-full max-w-md p-6 bg-black/50 backdrop-blur-sm border-white/10">
        <div className="space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold text-white">
              {isRegistering ? "Cadastro" : "Login"}
            </h1>
            <p className="text-gray-400">
              {isRegistering
                ? "Crie sua conta para continuar"
                : "Entre com suas credenciais para continuar"}
            </p>
          </div>
          <form onSubmit={handleAuth} className="space-y-4">
            {isRegistering && (
              <div className="space-y-2">
                <Input
                  type="text"
                  placeholder="Nome"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-white/5 border-white/10 text-white"
                  required={isRegistering}
                />
              </div>
            )}
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/5 border-white/10 text-white"
                required
              />
            </div>
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white/5 border-white/10 text-white"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-[#10B981] to-[#0EA5E9] hover:opacity-90 transition-opacity"
              disabled={isLoading}
            >
              {isLoading
                ? isRegistering
                  ? "Cadastrando..."
                  : "Entrando..."
                : isRegistering
                ? "Cadastrar"
                : "Entrar"}
            </Button>
          </form>
          <div className="text-center">
            <Button
              variant="link"
              className="text-gray-400 hover:text-white"
              onClick={() => {
                setIsRegistering(!isRegistering);
                setName("");
              }}
            >
              {isRegistering
                ? "Já tem uma conta? Faça login"
                : "Não tem uma conta? Cadastre-se"}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Login;