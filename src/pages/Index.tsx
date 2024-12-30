import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Cpu } from "lucide-react";
import { useState } from "react";
import { PasswordDialog } from "@/components/PasswordDialog";

const Index = () => {
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#1A1F2C] to-[#2D3748] p-4 sm:p-6 md:p-8 space-y-6 overflow-hidden">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      
      <div className="relative">
        <div className="flex flex-col items-center justify-center gap-4 mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Zaps Dashboard
          </h1>
        </div>

        <div className="grid grid-cols-1 gap-4 max-w-md mx-auto px-4 sm:px-0">
          <Link to="/instances" className="w-full">
            <Button 
              variant="secondary" 
              className="w-full gap-2 text-lg py-6 bg-[#9b87f5] hover:bg-[#8b77e5] transition-colors"
            >
              <Cpu className="w-5 h-5" />
              Gerenciar Instâncias
            </Button>
          </Link>
        </div>
      </div>

      <PasswordDialog 
        isOpen={isPasswordDialogOpen}
        onClose={() => setIsPasswordDialogOpen(false)}
      />
    </div>
  );
};

export default Index;