import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { yunYAuth } from '@/services/yunYAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/layout/Navbar';
import { ArrowUpRight, ArrowDownRight, Users, ShoppingBag } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useIsMobile } from '@/hooks/use-mobile';

interface Transacao {
  id: string;
  tipo: string;
  pontos: number;
  valor: number;
  created_at: string;
  status: string;
  cotacao: number;
  destinatario_id: string;
  produto_id: string;
  user_id: string;
}

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [saldo, setSaldo] = useState<number | null>(null);
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  const loadDashboardData = useCallback(async () => {
    if (!user) return;
    
    try {
      // TODO: Implementar endpoints para buscar saldo e transações na API YunY
      // Por enquanto, simular dados
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Dados simulados
      setSaldo(1500.50);
      setTransacoes([
        {
          id: '1',
          tipo: 'deposito',
          valor: 100,
          pontos: 100,
          cotacao: 1,
          status: 'concluida',
          created_at: new Date().toISOString(),
          user_id: user.id,
          destinatario_id: null,
          produto_id: null
        },
        {
          id: '2',
          tipo: 'saque',
          valor: 50,
          pontos: 50,
          cotacao: 1,
          status: 'pendente',
          created_at: new Date(Date.now() - 86400000).toISOString(),
          user_id: user.id,
          destinatario_id: null,
          produto_id: null
        }
      ]);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user, loadDashboardData]);

  if (authLoading || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Bem-vindo de volta à YunY</p>
        </div>

        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-6 sm:mb-8">
          <Card className="col-span-1 sm:col-span-2 lg:col-span-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Saldo em Pontos</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-32" />
              ) : (
                <div className="text-2xl font-bold">{saldo?.toFixed(2) || '0.00'} pts</div>
              )}
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:bg-accent/10 transition-colors" onClick={() => navigate('/transacoes/comprar')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Comprar Pontos</CardTitle>
              <ArrowUpRight className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <Button variant="outline" size="sm" className="w-full">
                Comprar
              </Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:bg-accent/10 transition-colors" onClick={() => navigate('/transacoes/vender')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Vender Pontos</CardTitle>
              <ArrowDownRight className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <Button variant="outline" size="sm" className="w-full">
                Vender
              </Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:bg-accent/10 transition-colors" onClick={() => navigate('/marketplace')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Marketplace</CardTitle>
              <ShoppingBag className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <Button variant="outline" size="sm" className="w-full">
                Ver Produtos
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Transações Recentes</CardTitle>
            <CardDescription>Suas últimas 5 transações</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : transacoes.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                Nenhuma transação encontrada
              </p>
            ) : (
              <div className="space-y-4">
                {transacoes.map((transacao) => (
                  <div
                    key={transacao.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border border-border space-y-2 sm:space-y-0"
                  >
                    <div className="flex items-center space-x-4">
                      {transacao.tipo === 'compra' ? (
                        <ArrowUpRight className="h-5 w-5 text-success flex-shrink-0" />
                      ) : (
                        <ArrowDownRight className="h-5 w-5 text-destructive flex-shrink-0" />
                      )}
                      <div>
                        <p className="font-medium capitalize">{transacao.tipo}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(transacao.created_at).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="font-medium">{transacao.pontos.toFixed(2)} pts</p>
                      <p className="text-sm text-muted-foreground">
                        R$ {transacao.valor.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
