import { CheckCircle, Package, Mail, MapPin, CreditCard } from "lucide-react";
import { MarketplaceHeader } from "@/components/marketplace/MarketplaceHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

const MOCK_ORDER = {
  orderNumber: "YUN-2025-0001234",
  date: new Date().toLocaleDateString("pt-BR"),
  estimatedDelivery: "25/01/2025",
  items: [
    {
      id: "1",
      name: "Smartphone XYZ Pro Max 256GB",
      price: 2499.99,
      quantity: 1,
      image: "https://picsum.photos/seed/order1/100/100",
    },
  ],
  subtotal: 2499.99,
  shipping: 25.9,
  discount: 0,
  total: 2525.89,
  paymentMethod: "Cartão de Crédito",
  address: {
    street: "Rua Exemplo, 123",
    neighborhood: "Centro",
    city: "São Paulo",
    state: "SP",
    cep: "01234-567",
  },
};

export default function OrderConfirmationPage() {
  return (
    <div>
      <MarketplaceHeader />
      <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto max-w-4xl px-4">
        {/* Cabeçalho de Sucesso */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="mb-2 text-3xl font-bold text-gray-900">
            Pedido Realizado com Sucesso!
          </h1>
          <p className="text-lg text-gray-600">
            Obrigado por comprar conosco. Seu pedido foi confirmado.
          </p>
        </div>

        {/* Número do Pedido */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
              <div>
                <p className="text-sm text-gray-600">Número do Pedido</p>
                <p className="text-2xl font-bold">{MOCK_ORDER.orderNumber}</p>
              </div>
              <Badge className="text-lg" variant="secondary">
                Pagamento Aprovado
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Próximos Passos */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Próximos Passos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-100">
                <Mail className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold">Confirmação por E-mail</h3>
                <p className="text-sm text-gray-600">
                  Enviamos um e-mail com todos os detalhes do seu pedido e as instruções de
                  acompanhamento.
                </p>
              </div>
            </div>

            <Separator />

            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-purple-100">
                <Package className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold">Preparação do Pedido</h3>
                <p className="text-sm text-gray-600">
                  O vendedor iniciará a preparação do seu pedido. Você receberá atualizações a
                  cada etapa.
                </p>
              </div>
            </div>

            <Separator />

            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-green-100">
                <MapPin className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold">Previsão de Entrega</h3>
                <p className="text-sm text-gray-600">
                  Estimamos que seu pedido chegará até{" "}
                  <span className="font-semibold">{MOCK_ORDER.estimatedDelivery}</span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detalhes do Pedido */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Detalhes do Pedido</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Produtos */}
            <div>
              <h3 className="mb-3 font-semibold">Produtos</h3>
              <div className="space-y-4">
                {MOCK_ORDER.items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-20 w-20 rounded-md object-cover"
                    />
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-600">Quantidade: {item.quantity}</p>
                      <p className="font-bold text-green-600">R$ {item.price.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Endereço de Entrega */}
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <h3 className="font-semibold">Endereço de Entrega</h3>
                </div>
                <div className="text-sm text-gray-600">
                  <p>{MOCK_ORDER.address.street}</p>
                  <p>{MOCK_ORDER.address.neighborhood}</p>
                  <p>
                    {MOCK_ORDER.address.city} - {MOCK_ORDER.address.state}
                  </p>
                  <p>CEP: {MOCK_ORDER.address.cep}</p>
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-gray-400" />
                  <h3 className="font-semibold">Pagamento</h3>
                </div>
                <div className="text-sm text-gray-600">
                  <p>{MOCK_ORDER.paymentMethod}</p>
                  <Badge variant="secondary" className="mt-2">
                    Aprovado
                  </Badge>
                </div>
              </div>
            </div>

            <Separator />

            {/* Resumo de Valores */}
            <div>
              <h3 className="mb-3 font-semibold">Resumo de Valores</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>R$ {MOCK_ORDER.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Frete</span>
                  <span>R$ {MOCK_ORDER.shipping.toFixed(2)}</span>
                </div>
                {MOCK_ORDER.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Desconto</span>
                    <span>- R$ {MOCK_ORDER.discount.toFixed(2)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-green-600">R$ {MOCK_ORDER.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Botões de Ação */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            className="flex-1"
            size="lg"
            onClick={() => (window.location.href = `/pedido/${MOCK_ORDER.orderNumber}`)}
          >
            <Package className="mr-2 h-5 w-5" />
            Acompanhar Pedido
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            size="lg"
            onClick={() => (window.location.href = "/")}
          >
            Continuar Comprando
          </Button>
        </div>

        {/* Informações Adicionais */}
        <Card className="mt-6 bg-blue-50">
          <CardContent className="p-6">
            <h3 className="mb-2 font-semibold">Precisa de ajuda?</h3>
            <p className="text-sm text-gray-600">
              Se tiver alguma dúvida sobre seu pedido, entre em contato com nosso suporte pelo
              e-mail{" "}
              <a href="mailto:suporte@marketplace.com" className="text-blue-600 hover:underline">
                suporte@marketplace.com
              </a>{" "}
              ou WhatsApp{" "}
              <a href="tel:+5511999999999" className="text-blue-600 hover:underline">
                (11) 99999-9999
              </a>
            </p>
          </CardContent>
        </Card>
      </div>
      </div>
    </div>
  );
};