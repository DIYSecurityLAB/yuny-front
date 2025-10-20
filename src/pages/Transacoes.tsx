import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Navbar } from '@/components/layout/Navbar';
import { toast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Transacoes = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { tipo } = useParams<{ tipo: string }>();
  
  const [valor, setValor] = useState('');
  const [cotacao] = useState(1.5); // Cotação simulada
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  const handleComprar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !valor) return;

    setLoading(true);
    try {
      const valorNum = parseFloat(valor);
      const pontosComprados = valorNum * cotacao;

      // Buscar saldo atual
      const { data: pontosData } = await supabase
        .from('pontos')
        .select('saldo')
        .eq('user_id', user.id)
        .single();

      const saldoAtual = pontosData?.saldo || 0;

      // Criar transação
      const { error: transacaoError } = await supabase.from('transacoes').insert({
        user_id: user.id,
        tipo: 'compra',
        valor: valorNum,
        pontos: pontosComprados,
        cotacao: cotacao,
        status: 'concluida',
      });

      if (transacaoError) throw transacaoError;

      // Atualizar saldo
      const { error: updateError } = await supabase
        .from('pontos')
        .update({ saldo: saldoAtual + pontosComprados })
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      toast({
        title: 'Compra realizada!',
        description: `Você comprou ${pontosComprados.toFixed(2)} pontos.`,
      });

      navigate('/dashboard');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      toast({
        title: 'Erro na compra',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVender = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !valor) return;

    setLoading(true);
    try {
      const pontosNum = parseFloat(valor);
      const valorResgate = pontosNum / cotacao;

      // Verificar saldo
      const { data: pontosData } = await supabase
        .from('pontos')
        .select('saldo')
        .eq('user_id', user.id)
        .single();

      if (!pontosData || pontosData.saldo < pontosNum) {
        toast({
          title: 'Saldo insuficiente',
          description: 'Você não tem pontos suficientes.',
          variant: 'destructive',
        });
        return;
      }

      // Criar transação
      const { error: transacaoError } = await supabase.from('transacoes').insert({
        user_id: user.id,
        tipo: 'venda',
        valor: valorResgate,
        pontos: pontosNum,
        cotacao: cotacao,
        status: 'concluida',
      });

      if (transacaoError) throw transacaoError;

      // Atualizar saldo
      const { error: updateError } = await supabase
        .from('pontos')
        .update({ saldo: pontosData.saldo - pontosNum })
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      toast({
        title: 'Venda realizada!',
        description: `Você vendeu ${pontosNum.toFixed(2)} pontos por R$ ${valorResgate.toFixed(2)}.`,
      });

      navigate('/dashboard');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      toast({
        title: 'Erro na venda',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || !user) return null;

  const pontosCalculados = valor ? (parseFloat(valor) * cotacao).toFixed(2) : '0.00';
  const valorCalculado = valor ? (parseFloat(valor) / cotacao).toFixed(2) : '0.00';

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">Transações</h1>
            <p className="text-muted-foreground">Compre ou venda pontos</p>
          </div>

          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-lg sm:text-xl">Nova Transação</CardTitle>
              <CardDescription>
                Cotação atual: 1 real = {cotacao.toFixed(2)} pontos
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              <Tabs defaultValue={tipo || 'comprar'}>
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="comprar" className="text-xs sm:text-sm">
                    Comprar Pontos
                  </TabsTrigger>
                  <TabsTrigger value="vender" className="text-xs sm:text-sm">
                    Vender Pontos
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="comprar">
                  <form onSubmit={handleComprar} className="space-y-4 sm:space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="valor-compra">Valor em Reais (R$)</Label>
                      <Input
                        id="valor-compra"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="100.00"
                        value={valor}
                        onChange={(e) => setValor(e.target.value)}
                        required
                        className="text-base"
                      />
                    </div>
                    <div className="p-4 sm:p-6 rounded-lg bg-muted">
                      <p className="text-sm text-muted-foreground mb-1">Você receberá</p>
                      <p className="text-xl sm:text-2xl font-bold text-primary">{pontosCalculados} pontos</p>
                    </div>
                    <Button type="submit" className="w-full" size="lg" disabled={loading}>
                      {loading ? 'Processando...' : 'Comprar Pontos'}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="vender">
                  <form onSubmit={handleVender} className="space-y-4 sm:space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="valor-venda">Quantidade de Pontos</Label>
                      <Input
                        id="valor-venda"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="100.00"
                        value={valor}
                        onChange={(e) => setValor(e.target.value)}
                        required
                        className="text-base"
                      />
                    </div>
                    <div className="p-4 sm:p-6 rounded-lg bg-muted">
                      <p className="text-sm text-muted-foreground mb-1">Você receberá</p>
                      <p className="text-xl sm:text-2xl font-bold text-success">R$ {valorCalculado}</p>
                    </div>
                    <Button type="submit" className="w-full" size="lg" disabled={loading}>
                      {loading ? 'Processando...' : 'Vender Pontos'}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Transacoes;
