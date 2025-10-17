import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { ArrowRight, Coins, TrendingUp, ShoppingBag } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <nav className="border-b border-border bg-card/50 backdrop-blur">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-secondary" />
              <span className="text-xl font-bold">YunY</span>
            </div>
            <Button onClick={() => navigate(user ? '/dashboard' : '/auth')}>
              {user ? 'Dashboard' : 'Entrar'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-20">
        <div className="text-center space-y-6 mb-16">
          <div className="inline-block">
            <div className="h-20 w-20 mx-auto rounded-2xl bg-gradient-to-br from-primary via-secondary to-accent animate-pulse" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            YunY Nexus
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Plataforma completa de conversão de pontos e criptomoedas.
            Compre, venda e troque com segurança e facilidade.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" onClick={() => navigate('/auth')}>
              Começar Agora
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/marketplace')}>
              Ver Marketplace
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="p-6 rounded-xl border border-border bg-card hover:bg-accent/5 transition-colors">
            <Coins className="h-10 w-10 text-primary mb-4" />
            <h3 className="text-xl font-bold mb-2">Conversão Rápida</h3>
            <p className="text-muted-foreground">
              Converta seus pontos em criptomoedas instantaneamente com as melhores taxas do mercado.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-border bg-card hover:bg-accent/5 transition-colors">
            <TrendingUp className="h-10 w-10 text-secondary mb-4" />
            <h3 className="text-xl font-bold mb-2">Transações P2P</h3>
            <p className="text-muted-foreground">
              Envie e receba pontos de outros usuários com total segurança e transparência.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-border bg-card hover:bg-accent/5 transition-colors">
            <ShoppingBag className="h-10 w-10 text-accent mb-4" />
            <h3 className="text-xl font-bold mb-2">Marketplace</h3>
            <p className="text-muted-foreground">
              Use seus pontos para adquirir produtos e serviços no nosso marketplace exclusivo.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
