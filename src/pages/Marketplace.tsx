import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/layout/Navbar';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/hooks/use-toast';
import type { Produto } from '@/domain/entities/Produto';

const Marketplace = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    loadProdutos();
  }, []);

  const loadProdutos = async () => {
    try {
      const { data, error } = await supabase
        .from('produtos')
        .select('*')
        .eq('ativo', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setProdutos(data);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleComprar = async (produto: Produto) => {
    if (!user) return;

    try {
      // Verificar saldo
      const { data: pontosData } = await supabase
        .from('pontos')
        .select('saldo')
        .eq('user_id', user.id)
        .single();

      if (!pontosData || pontosData.saldo < produto.preco_pontos) {
        toast({
          title: 'Saldo insuficiente',
          description: 'Você não tem pontos suficientes para esta compra.',
          variant: 'destructive',
        });
        return;
      }

      // Criar transação
      const { error: transacaoError } = await supabase.from('transacoes').insert({
        user_id: user.id,
        tipo: 'marketplace',
        valor: produto.preco_pontos,
        pontos: produto.preco_pontos,
        cotacao: 1,
        status: 'concluida',
        produto_id: produto.id,
      });

      if (transacaoError) throw transacaoError;

      // Atualizar saldo
      const { error: updateError } = await supabase
        .from('pontos')
        .update({ saldo: pontosData.saldo - produto.preco_pontos })
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      toast({
        title: 'Compra realizada!',
        description: `${produto.nome} foi adquirido com sucesso.`,
      });

      navigate('/dashboard');
    } catch (error: any) {
      toast({
        title: 'Erro na compra',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  if (authLoading || !user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Marketplace</h1>
          <p className="text-muted-foreground">Troque seus pontos por produtos incríveis</p>
        </div>

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-48 w-full rounded-lg" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-4" />
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : produtos.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <p className="text-muted-foreground">Nenhum produto disponível no momento</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {produtos.map((produto) => (
              <Card key={produto.id} className="overflow-hidden">
                {produto.imagem_url && (
                  <div className="aspect-video overflow-hidden bg-muted">
                    <img
                      src={produto.imagem_url}
                      alt={produto.nome}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                <CardHeader>
                  <CardTitle>{produto.nome}</CardTitle>
                  {produto.categoria && (
                    <CardDescription>{produto.categoria}</CardDescription>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  {produto.descricao && (
                    <p className="text-sm text-muted-foreground">{produto.descricao}</p>
                  )}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-primary">
                        {produto.preco_pontos.toFixed(0)} pts
                      </p>
                      {produto.preco_cripto && (
                        <p className="text-sm text-muted-foreground">
                          {produto.preco_cripto.toFixed(4)} BTC
                        </p>
                      )}
                    </div>
                    <Button onClick={() => handleComprar(produto)}>Comprar</Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Estoque: {produto.estoque} unidades
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Marketplace;
