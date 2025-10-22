import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate, useParams } from 'react-router-dom';
import { yunYAuth } from '@/services/yunYAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Layout } from '@/components/layout/Layout';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Copy, CheckCircle2, XCircle, Clock } from 'lucide-react';

interface PointsOrder {
  orderId: string;
  userId: string;
  requestedAmount: number;
  feeAmount: number;
  totalAmount: number;
  pointsAmount: number;
  qrCode: string;
  qrImageUrl: string;
  expiresAt: string;
  alfredTransactionId: string;
}

interface OrderStatusResponse {
  orderId: string;
  status: string;
  statusChanged: boolean;
  alfredTransactionId: string;
  pointsAmount: number;
  requestedAmount: number;
  totalAmount: number;
}

const Transacoes = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { tipo } = useParams<{ tipo: string }>();
  
  const [valor, setValor] = useState('');
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<PointsOrder | null>(null);
  const [orderStatus, setOrderStatus] = useState<string>('');
  const [statusChanged, setStatusChanged] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Constantes da API
  const FEE_PERCENTAGE = 0.05; // 5%
  const MIN_AMOUNT = 1;
  const MAX_AMOUNT = 10000;
  const POLLING_INTERVAL = 5000; // 5 segundos
  const POLLING_TIMEOUT = 20 * 60 * 1000; // 20 minutos

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  // Limpar polling ao desmontar componente
  useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Atualizar tempo restante
  useEffect(() => {
    if (order?.expiresAt) {
      const interval = setInterval(() => {
        const now = new Date().getTime();
        const expires = new Date(order.expiresAt).getTime();
        const remaining = Math.max(0, expires - now);
        setTimeRemaining(remaining);
        
        if (remaining === 0) {
          clearInterval(interval);
          stopPolling();
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [order?.expiresAt]);

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const calcularTotal = (valorSolicitado: number) => {
    const taxa = valorSolicitado * FEE_PERCENTAGE;
    const total = valorSolicitado + taxa;
    return { taxa, total };
  };

  const checkOrderStatus = async (orderId: string) => {
    try {
      const response = await yunYAuth.authenticatedRequest<OrderStatusResponse>(`/points/orders/${orderId}/status`, {
        method: 'GET',
      });

      setOrderStatus(response.status);
      
      if (response.statusChanged) {
        setStatusChanged(true);
        toast({
          title: 'Status atualizado',
          description: `Status da ordem: ${response.status}`,
        });
      }

      // Status finais - parar polling
      const FINAL_STATUSES = ['COMPLETED', 'FAILED', 'CANCELLED', 'EXPIRED'];
      if (FINAL_STATUSES.includes(response.status)) {
        stopPolling();
        
        if (response.status === 'COMPLETED') {
          toast({
            title: 'Pagamento confirmado! 🎉',
            description: `${response.pointsAmount} pontos creditados na sua conta.`,
          });
          setTimeout(() => navigate('/dashboard'), 2000);
        } else if (response.status === 'FAILED') {
          toast({
            title: 'Pagamento falhou',
            description: 'Tente novamente ou entre em contato com o suporte.',
            variant: 'destructive',
          });
        } else if (response.status === 'EXPIRED') {
          toast({
            title: 'PIX expirado',
            description: 'O tempo limite para pagamento foi atingido.',
            variant: 'destructive',
          });
        }
      }

      return response;
    } catch (error) {
      console.error('Erro ao verificar status:', error);
      return null;
    }
  };

  const startPolling = (orderId: string) => {
    // Polling a cada 5 segundos
    pollingIntervalRef.current = setInterval(() => {
      checkOrderStatus(orderId);
    }, POLLING_INTERVAL);

    // Timeout de 20 minutos
    timeoutRef.current = setTimeout(() => {
      stopPolling();
      toast({
        title: 'Tempo esgotado',
        description: 'O tempo para pagamento expirou. Crie uma nova ordem.',
        variant: 'destructive',
      });
    }, POLLING_TIMEOUT);
  };

  const stopPolling = () => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const copiarCodigoPix = () => {
    if (order?.qrCode) {
      navigator.clipboard.writeText(order.qrCode);
      toast({
        title: 'Copiado!',
        description: 'Código PIX copiado para área de transferência.',
      });
    }
  };

  const handleComprar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !valor) return;

    const valorNum = parseFloat(valor);
    
    // Validação de valores
    if (valorNum < MIN_AMOUNT || valorNum > MAX_AMOUNT) {
      toast({
        title: 'Valor inválido',
        description: `Valor deve estar entre R$ ${MIN_AMOUNT} e R$ ${MAX_AMOUNT}`,
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const orderData = await yunYAuth.authenticatedRequest<PointsOrder>('/points/orders', {
        method: 'POST',
        body: JSON.stringify({
          requestedAmount: valorNum,
          paymentMethod: 'PIX',
          description: 'Compra de pontos YunY',
        }),
      });

      setOrder(orderData);
      setOrderStatus('PENDING');
      
      toast({
        title: 'Ordem criada!',
        description: 'Escaneie o QR Code ou copie o código PIX para pagar.',
      });

      // Iniciar polling do status
      startPolling(orderData.orderId);
      
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      toast({
        title: 'Erro ao criar ordem',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVender = async (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: 'Em breve',
      description: 'Funcionalidade de venda de pontos será implementada em breve.',
    });
  };

  if (authLoading || !user) return null;

  const { taxa, total } = valor ? calcularTotal(parseFloat(valor)) : { taxa: 0, total: 0 };
  const pontosCalculados = valor ? parseFloat(valor).toFixed(2) : '0.00';

  // Se já existe uma ordem, mostrar interface de pagamento
  if (order && orderStatus !== 'COMPLETED') {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-6 sm:py-8">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Pagamento PIX</CardTitle>
                <CardDescription>
                  Escaneie o QR Code ou copie o código para pagar
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Status da ordem */}
                <Alert>
                  <Clock className="h-4 w-4" />
                  <AlertDescription className="flex items-center justify-between">
                    <span>
                      Status: <strong>{orderStatus}</strong>
                      {statusChanged && ' (Atualizado)'}
                    </span>
                    {timeRemaining > 0 && (
                      <span className="text-sm font-mono">
                        Expira em: {formatTime(timeRemaining)}
                      </span>
                    )}
                  </AlertDescription>
                </Alert>

                {/* QR Code */}
                <div className="flex justify-center">
                  <img 
                    src={order.qrImageUrl} 
                    alt="QR Code PIX" 
                    className="w-64 h-64 border rounded-lg"
                  />
                </div>

                {/* Código PIX Copia e Cola */}
                <div className="space-y-2">
                  <Label>Código PIX Copia e Cola</Label>
                  <div className="flex gap-2">
                    <Input 
                      value={order.qrCode} 
                      readOnly 
                      className="font-mono text-xs"
                    />
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={copiarCodigoPix}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Resumo da compra */}
                <div className="p-4 rounded-lg bg-muted space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Valor solicitado:</span>
                    <span>R$ {order.requestedAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Taxa (5%):</span>
                    <span>R$ {order.feeAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold border-t pt-2">
                    <span>Total a pagar:</span>
                    <span>R$ {order.totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-primary font-bold">
                    <span>Pontos a receber:</span>
                    <span>{order.pointsAmount.toFixed(2)} pontos</span>
                  </div>
                </div>

                {/* Botão de cancelar/voltar */}
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    stopPolling();
                    setOrder(null);
                    setValor('');
                    setOrderStatus('');
                  }}
                >
                  Nova Ordem
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
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
                Conversão: 1 real = 1 ponto | Taxa de serviço: 5%
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
                        min={MIN_AMOUNT}
                        max={MAX_AMOUNT}
                        placeholder="100.00"
                        value={valor}
                        onChange={(e) => setValor(e.target.value)}
                        required
                        className="text-base"
                      />
                      <p className="text-xs text-muted-foreground">
                        Valor mínimo: R$ {MIN_AMOUNT} | Máximo: R$ {MAX_AMOUNT.toLocaleString('pt-BR')}
                      </p>
                    </div>
                    <div className="p-4 sm:p-6 rounded-lg bg-muted space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Valor solicitado:</span>
                        <span className="font-medium">R$ {valor || '0.00'}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Taxa de serviço (5%):</span>
                        <span className="font-medium">R$ {taxa.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-bold border-t pt-2">
                        <span>Total a pagar:</span>
                        <span>R$ {total.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-primary font-bold text-lg mt-2 pt-2 border-t">
                        <span>Pontos a receber:</span>
                        <span>{pontosCalculados} pontos</span>
                      </div>
                    </div>
                    <Button type="submit" className="w-full" size="lg" disabled={loading}>
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Criando ordem...
                        </>
                      ) : (
                        'Gerar PIX para Pagamento'
                      )}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="vender">
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      Funcionalidade de venda de pontos em desenvolvimento.
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Transacoes;
