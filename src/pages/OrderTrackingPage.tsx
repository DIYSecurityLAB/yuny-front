import { useState } from "react";
import { useParams } from "react-router-dom";
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  MapPin,
  MessageCircle,
  AlertCircle,
  ChevronRight,
  Store,
} from "lucide-react";
import { MarketplaceHeader } from "@/components/marketplace/MarketplaceHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

type OrderStatus = "received" | "confirmed" | "preparing" | "shipped" | "delivered";

interface TimelineStep {
  id: OrderStatus;
  title: string;
  description: string;
  icon: React.ElementType;
  date?: string;
  completed: boolean;
}

const MOCK_ORDER = {
  orderNumber: "YUN-2025-0001234",
  date: "17/01/2025",
  status: "shipped" as OrderStatus,
  estimatedDelivery: "25/01/2025",
  trackingCode: "BR123456789YN",
  carrier: "Correios - Sedex",
  items: [
    {
      id: "1",
      name: "Smartphone XYZ Pro Max 256GB",
      price: 2499.99,
      quantity: 1,
      image: "https://picsum.photos/seed/track1/100/100",
      seller: "Tech Shop Premium",
    },
  ],
  total: 2525.89,
  address: {
    street: "Rua Exemplo, 123",
    neighborhood: "Centro",
    city: "São Paulo",
    state: "SP",
    cep: "01234-567",
  },
  timeline: [
    {
      id: "received",
      title: "Pedido Recebido",
      description: "Seu pedido foi recebido e está sendo processado",
      icon: Package,
      date: "17/01/2025 14:30",
      completed: true,
    },
    {
      id: "confirmed",
      title: "Pagamento Confirmado",
      description: "O pagamento foi aprovado com sucesso",
      icon: CheckCircle,
      date: "17/01/2025 14:35",
      completed: true,
    },
    {
      id: "preparing",
      title: "Em Separação",
      description: "O vendedor está preparando seu pedido",
      icon: Clock,
      date: "18/01/2025 09:15",
      completed: true,
    },
    {
      id: "shipped",
      title: "Enviado",
      description: "Seu pedido está a caminho",
      icon: Truck,
      date: "19/01/2025 16:20",
      completed: true,
    },
    {
      id: "delivered",
      title: "Entregue",
      description: "Seu pedido foi entregue",
      icon: CheckCircle,
      completed: false,
    },
  ] as TimelineStep[],
};

export default function OrderTrackingPage() {
  const { orderNumber } = useParams();
  const [showContactForm, setShowContactForm] = useState(false);

  const currentStepIndex = MOCK_ORDER.timeline.findIndex(
    (step) => step.id === MOCK_ORDER.status
  );
  const progress = ((currentStepIndex + 1) / MOCK_ORDER.timeline.length) * 100;

  return (
    <div>
      <MarketplaceHeader />
      <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto max-w-6xl px-4">
        {/* Cabeçalho */}
        <div className="mb-6">
          <nav className="mb-4 flex items-center gap-2 text-sm text-gray-600">
            <a href="/" className="hover:text-gray-900">
              Início
            </a>
            <ChevronRight className="h-4 w-4" />
            <a href="/meus-pedidos" className="hover:text-gray-900">
              Meus Pedidos
            </a>
            <ChevronRight className="h-4 w-4" />
            <span className="font-medium text-gray-900">{MOCK_ORDER.orderNumber}</span>
          </nav>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold">Acompanhar Pedido</h1>
              <p className="text-gray-600">Pedido #{MOCK_ORDER.orderNumber}</p>
            </div>
            <Badge className="text-lg" variant="secondary">
              {MOCK_ORDER.status === "delivered" ? "Entregue" : "Em Trânsito"}
            </Badge>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Área Principal */}
          <div className="space-y-6 lg:col-span-2">
            {/* Barra de Progresso */}
            <Card>
              <CardContent className="p-6">
                <div className="mb-4 flex items-center justify-between text-sm">
                  <span className="font-medium">Progresso do Pedido</span>
                  <span className="text-gray-600">{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-3" />
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Status do Pedido</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {MOCK_ORDER.timeline.map((step, index) => {
                    const Icon = step.icon;
                    const isActive = index === currentStepIndex;
                    const isCompleted = step.completed;

                    return (
                      <div key={step.id} className="relative">
                        {/* Linha conectora */}
                        {index < MOCK_ORDER.timeline.length - 1 && (
                          <div
                            className={`absolute left-5 top-12 h-full w-0.5 ${
                              isCompleted ? "bg-green-500" : "bg-gray-200"
                            }`}
                          />
                        )}

                        <div className="flex gap-4">
                          {/* Ícone */}
                          <div
                            className={`relative z-10 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${
                              isCompleted
                                ? "bg-green-500 text-white"
                                : isActive
                                ? "bg-blue-500 text-white"
                                : "bg-gray-200 text-gray-600"
                            }`}
                          >
                            <Icon className="h-5 w-5" />
                          </div>

                          {/* Conteúdo */}
                          <div className="flex-1 pb-6">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3
                                  className={`font-semibold ${
                                    isActive ? "text-blue-600" : ""
                                  }`}
                                >
                                  {step.title}
                                </h3>
                                <p className="text-sm text-gray-600">{step.description}</p>
                              </div>
                              {step.date && (
                                <span className="text-sm text-gray-500">{step.date}</span>
                              )}
                            </div>

                            {/* Informações adicionais para status "Enviado" */}
                            {isActive && step.id === "shipped" && (
                              <div className="mt-3 rounded-md bg-blue-50 p-4">
                                <div className="space-y-2 text-sm">
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Transportadora:</span>
                                    <span className="font-medium">{MOCK_ORDER.carrier}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Código de Rastreamento:</span>
                                    <span className="font-mono font-medium">
                                      {MOCK_ORDER.trackingCode}
                                    </span>
                                  </div>
                                  <Button
                                    variant="link"
                                    size="sm"
                                    className="mt-2 h-auto p-0"
                                    onClick={() =>
                                      window.open(
                                        `https://www.correios.com.br/rastreamento/${MOCK_ORDER.trackingCode}`,
                                        "_blank"
                                      )
                                    }
                                  >
                                    Rastrear no site da transportadora →
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Produtos */}
            <Card>
              <CardHeader>
                <CardTitle>Itens do Pedido</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {MOCK_ORDER.items.map((item) => (
                    <div key={item.id}>
                      <div className="flex gap-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-24 w-24 rounded-md object-cover"
                        />
                        <div className="flex-1">
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="text-sm text-gray-600">
                            Vendido por: {item.seller}
                          </p>
                          <p className="text-sm text-gray-600">Quantidade: {item.quantity}</p>
                          <p className="mt-1 font-bold text-green-600">
                            R$ {item.price.toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <Separator className="mt-4" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Endereço de Entrega */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Endereço de Entrega
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm">
                  <p>{MOCK_ORDER.address.street}</p>
                  <p>{MOCK_ORDER.address.neighborhood}</p>
                  <p>
                    {MOCK_ORDER.address.city} - {MOCK_ORDER.address.state}
                  </p>
                  <p>CEP: {MOCK_ORDER.address.cep}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6 lg:col-span-1">
            {/* Resumo */}
            <Card>
              <CardHeader>
                <CardTitle>Resumo do Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Data do Pedido:</span>
                    <span className="font-medium">{MOCK_ORDER.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Previsão de Entrega:</span>
                    <span className="font-medium">{MOCK_ORDER.estimatedDelivery}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span className="text-green-600">R$ {MOCK_ORDER.total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Informações do Vendedor */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Store className="h-5 w-5" />
                  Vendedor
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="font-medium">{MOCK_ORDER.items[0].seller}</p>
                  <p className="text-sm text-gray-600">Vendedor verificado</p>
                </div>

                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setShowContactForm(!showContactForm)}
                  >
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Entrar em Contato
                  </Button>

                  {showContactForm && (
                    <div className="rounded-md bg-gray-50 p-3 text-sm">
                      <p className="mb-2 text-gray-600">
                        Entre em contato pelo e-mail ou WhatsApp:
                      </p>
                      <p className="font-medium">contato@techshop.com</p>
                      <p className="font-medium">(11) 98765-4321</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Problemas com o Pedido */}
            <Card className="border-orange-200 bg-orange-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-900">
                  <AlertCircle className="h-5 w-5" />
                  Problemas?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-gray-700">
                  Se você tiver algum problema com seu pedido, estamos aqui para ajudar.
                </p>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    Reportar um Problema
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    Solicitar Cancelamento
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    Alterar Endereço
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Botões de Ação */}
            <div className="space-y-2">
              <Button className="w-full" onClick={() => (window.location.href = "/")}>
                Continuar Comprando
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => (window.location.href = "/meus-pedidos")}
              >
                Ver Todos os Pedidos
              </Button>
            </div>
          </div>
        </div>
      </div>
       </div>
    </div>
  );
}
