import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { User, LogOut, Settings, LayoutDashboard, ShoppingBag, ShoppingCart, Menu, HelpCircle, FileText, MessageCircle, Phone } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useState } from 'react';

export const Navbar = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);

  const navigationItems = [
    {
      label: 'Dashboard',
      icon: LayoutDashboard,
      path: '/dashboard',
    },
    {
      label: 'Marketplace',
      icon: ShoppingBag,
      path: '/busca',
    },
    {
      label: 'Transações',
      icon: null,
      path: '/transacoes',
    },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  if (isMobile && user) {
    return (
      <nav className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container mx-auto px-4">
          <div className="flex h-14 items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-secondary" />
              <span className="text-xl font-bold">YunY</span>
            </Link>

            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon" onClick={() => navigate('/carrinho')}>
                <ShoppingCart className="h-5 w-5" />
              </Button>
              
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-72">
                  <SheetHeader>
                    <SheetTitle>Menu</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6 space-y-4">
                    {navigationItems.map((item) => (
                      <Button
                        key={item.path}
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => handleNavigation(item.path)}
                      >
                        {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                        {item.label}
                      </Button>
                    ))}
                    
                    <div className="border-t pt-4">
                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => handleNavigation('/perfil')}
                      >
                        <Settings className="mr-2 h-4 w-4" />
                        Configurações
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-destructive"
                        onClick={() => {
                          signOut();
                          setIsOpen(false);
                        }}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Sair
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-secondary" />
            <span className="text-xl font-bold">YunY</span>
          </Link>

          <div className="flex items-center space-x-2 md:space-x-4">
            {user ? (
              <>
                {!isMobile && (
                  <>
                    <Button variant="ghost" onClick={() => navigate('/dashboard')} className="hidden md:flex">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Dashboard
                    </Button>
                    <Button variant="ghost" onClick={() => navigate('/busca')} className="hidden lg:flex">
                      <ShoppingBag className="mr-2 h-4 w-4" />
                      Marketplace
                    </Button>
                    <Button variant="ghost" onClick={() => navigate('/transacoes')} className="hidden lg:flex">
                      Transações
                    </Button>
                  </>
                )}
                
                <Button variant="ghost" size="icon" onClick={() => navigate('/carrinho')}>
                  <ShoppingCart className="h-5 w-5" />
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    
                    {isMobile && (
                      <>
                        <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                          <LayoutDashboard className="mr-2 h-4 w-4" />
                          Dashboard
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate('/busca')}>
                          <ShoppingBag className="mr-2 h-4 w-4" />
                          Marketplace
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate('/transacoes')}>
                          Transações
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                      </>
                    )}
                    
                    <DropdownMenuItem onClick={() => navigate('/perfil')}>
                      <Settings className="mr-2 h-4 w-4" />
                      Configurações
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={signOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Sair
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button onClick={() => navigate('/auth')}>Entrar</Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
