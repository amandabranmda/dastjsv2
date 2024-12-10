import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface PasswordDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PasswordDialog({ isOpen, onClose }: PasswordDialogProps) {
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password === "face") {
      navigate("/roas");
      onClose();
    } else {
      toast({
        title: "Erro",
        description: "Digite a senha correta",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Digite a senha</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-white/5 border-emerald-600/20 text-white"
          />
          <div className="flex justify-end">
            <Button type="submit" className="bg-[#0EA5E9] hover:bg-[#0284C7]">
              Acessar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}