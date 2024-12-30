import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="w-full max-w-md space-y-8 p-8 bg-gray-800/50 rounded-lg backdrop-blur-sm border border-gray-700">
        <div>
          <h2 className="text-center text-3xl font-bold tracking-tight text-white">
            Login
          </h2>
        </div>
        
        <LoginForm />

        <div className="flex flex-col gap-4">
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
                <DialogDescription className="text-gray-400">
                  Preencha os dados abaixo para criar sua conta
                </DialogDescription>
              </DialogHeader>
              <RegisterForm />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default Login;