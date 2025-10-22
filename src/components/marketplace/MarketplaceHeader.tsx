import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  ChevronDown,
  Heart,
  Package,
  HelpCircle,
  LogOut,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/hooks/useAuth";

const CATEGORIES = [
  "Eletrônicos",
  "Moda",
  "Casa e Decoração",
  "Esportes",
  "Livros",
  "Beleza",
  "Alimentos",
  "Brinquedos",
];

const SEARCH_SUGGESTIONS = [
  "iPhone 14 Pro",
  "Notebook Dell",
  "Tênis Nike",
  "Smart TV 55 polegadas",
  "Cadeira Gamer",
  "Fone Bluetooth",
];

export function MarketplaceHeader() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { user, signOut } = useAuth();

  const [searchQuery, setSearchQuery] = useState("");
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(3); // Mock - substituir por estado real
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSearch = (query: string) => {
    if (query.trim()) {
      navigate(`/busca?q=${encodeURIComponent(query)}`);
      setShowMobileSearch(false);
      setShowSuggestions(false);
    }
  };

  const filteredSuggestions = SEARCH_SUGGESTIONS.filter((s) =>
    s.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Menu Lateral (Sidebar) para Mobile
  const SidebarMenu = () => (
    <div className="space-y-6">
      {/* Usuário */}
      <div className="space-y-2">
        {user ? (
          <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white">
              <User className="h-6 w-6" />
            </div>
            <div>
              <p className="font-medium">Olá, {user.nome || user.email?.split("@")[0]}</p>
              <Link
                to="/perfil"
                className="text-sm text-blue-600 hover:underline"
                onClick={() => setSidebarOpen(false)}
              >
                Ver perfil
              </Link>
            </div>
          </div>
        ) : (
          <Button
            className="w-full"
            onClick={() => {
              navigate("/auth");
              setSidebarOpen(false);
            }}
          >
            <User className="mr-2 h-4 w-4" />
            Entrar ou Cadastrar
          </Button>
        )}
      </div>

      {/* Categorias */}
      <div>
        <h3 className="mb-3 px-2 text-sm font-semibold text-gray-600">
          CATEGORIAS
        </h3>
        <div className="space-y-1">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              className="w-full rounded-md px-4 py-2 text-left hover:bg-gray-100"
              onClick={() => {
                navigate(`/categoria/${category.toLowerCase().replace(/\s/g, "-")}`);
                setSidebarOpen(false);
              }}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <hr />

      {/* Minha Conta */}
      {user && (
        <>
          <div>
            <h3 className="mb-3 px-2 text-sm font-semibold text-gray-600">
              MINHA CONTA
            </h3>
            <div className="space-y-1">
              <button
                className="flex w-full items-center gap-3 rounded-md px-4 py-2 hover:bg-gray-100"
                onClick={() => {
                  navigate("/pedido/lista");
                  setSidebarOpen(false);
                }}
              >
                <Package className="h-5 w-5" />
                Meus Pedidos
              </button>
              <button
                className="flex w-full items-center gap-3 rounded-md px-4 py-2 hover:bg-gray-100"
                onClick={() => {
                  navigate("/favoritos");
                  setSidebarOpen(false);
                }}
              >
                <Heart className="h-5 w-5" />
                Favoritos
              </button>
              <button
                className="flex w-full items-center gap-3 rounded-md px-4 py-2 hover:bg-gray-100"
                onClick={() => {
                  navigate("/perfil");
                  setSidebarOpen(false);
                }}
              >
                <Settings className="h-5 w-5" />
                Configurações
              </button>
            </div>
          </div>

          <hr />
        </>
      )}

      {/* Ajuda */}
      <div>
        <h3 className="mb-3 px-2 text-sm font-semibold text-gray-600">AJUDA</h3>
        <div className="space-y-1">
          <button
            className="flex w-full items-center gap-3 rounded-md px-4 py-2 hover:bg-gray-100"
            onClick={() => {
              navigate("/ajuda");
              setSidebarOpen(false);
            }}
          >
            <HelpCircle className="h-5 w-5" />
            Central de Ajuda
          </button>
          <button
            className="flex w-full items-center gap-3 rounded-md px-4 py-2 hover:bg-gray-100"
            onClick={() => {
              navigate("/contato");
              setSidebarOpen(false);
            }}
          >
            Fale Conosco
          </button>
        </div>
      </div>

      {user && (
        <>
          <hr />
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              signOut();
              setSidebarOpen(false);
            }}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </Button>
        </>
      )}
    </div>
  );

  // Barra de Busca (Componente Reutilizável)
  const SearchBar = ({ fullScreen = false }) => (
    <div className={`relative ${fullScreen ? "w-full" : ""}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
        <Input
          type="text"
          placeholder="Buscar produtos, marcas ou categorias..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setShowSuggestions(true);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch(searchQuery);
            }
          }}
          onFocus={() => setShowSuggestions(true)}
          className={`pl-10 ${fullScreen ? "h-12 text-lg" : "h-10"}`}
        />
        {searchQuery && (
          <button
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            onClick={() => {
              setSearchQuery("");
              setShowSuggestions(false);
            }}
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Sugestões */}
      {showSuggestions && searchQuery && filteredSuggestions.length > 0 && (
        <div className="absolute z-50 mt-1 w-full rounded-md border bg-white shadow-lg">
          {filteredSuggestions.map((suggestion, index) => (
            <button
              key={index}
              className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-gray-50"
              onClick={() => {
                setSearchQuery(suggestion);
                handleSearch(suggestion);
              }}
            >
              <Search className="h-4 w-4 text-gray-400" />
              <span>{suggestion}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );

  // ==================== MOBILE ====================
  if (isMobile) {
    return (
      <>
        {/* Header Principal Mobile */}
        <header className="sticky top-0 z-50 bg-white shadow-sm">
          <div className="flex h-14 items-center justify-between px-4">
            {/* Menu Hambúrguer */}
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 overflow-y-auto">
                <SheetHeader className="mb-6">
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <SidebarMenu />
              </SheetContent>
            </Sheet>

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-secondary" />
              <span className="text-xl font-bold">YunY</span>
            </Link>

            {/* Ações Direita */}
            <div className="flex items-center gap-2">
              {/* Busca */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowMobileSearch(true)}
              >
                <Search className="h-5 w-5" />
              </Button>

              {/* Usuário */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(user ? "/perfil" : "/auth")}
              >
                <User className="h-5 w-5" />
              </Button>

              {/* Carrinho */}
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={() => navigate("/carrinho")}
              >
                <ShoppingCart className="h-5 w-5" />
                {cartItemCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs"
                  >
                    {cartItemCount}
                  </Badge>
                )}
              </Button>
            </div>
          </div>

          {/* Busca Mobile Full Screen */}
          {showMobileSearch && (
            <div className="fixed inset-0 z-50 bg-white p-4">
              <div className="mb-4 flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowMobileSearch(false)}
                >
                  <X className="h-6 w-6" />
                </Button>
                <SearchBar fullScreen />
              </div>
            </div>
          )}
        </header>
      </>
    );
  }

  // ==================== DESKTOP ====================
  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      {/* Top Bar */}
      <div className="border-b border-gray-200">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-secondary" />
            <span className="text-2xl font-bold">YunY Marketplace</span>
          </Link>

          {/* Barra de Busca Central */}
          <div className="mx-8 flex-1 max-w-2xl">
            <SearchBar />
          </div>

          {/* Ações Direita */}
          <div className="flex items-center gap-4">
            {/* Ajuda */}
            <Button variant="ghost" onClick={() => navigate("/ajuda")}>
              <HelpCircle className="mr-2 h-4 w-4" />
              Ajuda
            </Button>

            {/* Usuário */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost">
                    <User className="mr-2 h-4 w-4" />
                    Olá, {user.nome || user.email?.split("@")[0]}
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/perfil")}>
                    <User className="mr-2 h-4 w-4" />
                    Meu Perfil
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/pedido/lista")}>
                    <Package className="mr-2 h-4 w-4" />
                    Meus Pedidos
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/favoritos")}>
                    <Heart className="mr-2 h-4 w-4" />
                    Favoritos
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/perfil")}>
                    <Settings className="mr-2 h-4 w-4" />
                    Configurações
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button onClick={() => navigate("/auth")}>
                <User className="mr-2 h-4 w-4" />
                Entrar
              </Button>
            )}

            {/* Carrinho */}
            <Button
              variant="outline"
              className="relative"
              onClick={() => navigate("/carrinho")}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Carrinho
              {cartItemCount > 0 && (
                <Badge
                  variant="destructive"
                  className="ml-2 rounded-full px-2 py-0.5"
                >
                  {cartItemCount}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Barra de Navegação Secundária (Categorias) */}
      <div className="border-b border-gray-100 bg-gray-50">
        <div className="container mx-auto px-4">
          <nav className="flex h-12 items-center gap-6">
            {/* Dropdown Todas as Categorias */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="font-medium">
                  <Menu className="mr-2 h-4 w-4" />
                  Todas as Categorias
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                {CATEGORIES.map((category) => (
                  <DropdownMenuItem
                    key={category}
                    onClick={() =>
                      navigate(`/categoria/${category.toLowerCase().replace(/\s/g, "-")}`)
                    }
                  >
                    {category}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Links Rápidos de Categorias */}
            {CATEGORIES.slice(0, 6).map((category) => (
              <Link
                key={category}
                to={`/categoria/${category.toLowerCase().replace(/\s/g, "-")}`}
                className="text-sm text-gray-700 hover:text-primary"
              >
                {category}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
