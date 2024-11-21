import { Home, MessageSquare, Settings, Users, Activity, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";

const menuItems = [
  { icon: Home, label: "Dashboard", path: "/" },
  { icon: MessageSquare, label: "Mensagens", path: "/messages" },
  { icon: Users, label: "Contatos", path: "/contacts" },
  { icon: Activity, label: "Relatórios", path: "/reports" },
  { icon: Settings, label: "Configurações", path: "/settings" },
  { icon: HelpCircle, label: "Ajuda", path: "/help" },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <div className="h-screen w-64 bg-card/70 backdrop-blur-md border-r border-white/10 p-4 fixed left-0 top-0">
      <div className="flex flex-col h-full">
        <div className="mb-8">
          <h2 className="text-xl font-bold">Zaps Dashboard</h2>
        </div>
        
        <nav className="flex-1">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={cn(
                      "flex items-center gap-3 px-4 py-2 rounded-lg transition-colors",
                      "hover:bg-white/10",
                      isActive && "bg-white/10 text-primary"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </div>
  );
}