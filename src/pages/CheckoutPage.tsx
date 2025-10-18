import { useState } from "react";
import { Check, ChevronLeft, Lock, CreditCard, MapPin, User } from "lucide-react";
import { MarketplaceHeader } from "@/components/marketplace/MarketplaceHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

type CheckoutStep = "identification" | "address" | "payment" | "review";

const MOCK_CART = {
  items: [
    {
      id: "1",
      name: "Smartphone XYZ Pro Max 256GB",
      price: 2499.99,
      quantity: 1,
      image: "https://picsum.photos/seed/checkout1/100/100",
    },
  ],
  subtotal: 2499.99,
  shipping: 25.9,
  discount: 0,
  total: 2525.89,
};

export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState<CheckoutStep>("identification");
  const [completedSteps, setCompletedSteps] = useState<CheckoutStep[]>([]);

  // Estado do formulário
  const [formData, setFormData] = useState({
    // Identificação
    email: "",
    password: "",
    // Endereço
    cep: "",
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
    // Pagamento
    paymentMethod: "credit-card",
    cardNumber: "",
    cardName: "",
    cardExpiry: "",
    cardCVV: "",
  });

  const [shippingMethod, setShippingMethod] = useState("sedex");
  const [isGuest, setIsGuest] = useState(false);

  const steps: { id: CheckoutStep; title: string; icon: React.ElementType }[] = [
    { id: "identification", title: "Identificação", icon: User },
    { id: "address", title: "Endereço", icon: MapPin },
    { id: "payment", title: "Pagamento", icon: CreditCard },
    { id: "review", title: "Revisão", icon: Check },
  ];

  const currentStepIndex = steps.findIndex((s) => s.id === currentStep);

  const handleNext = () => {
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps([...completedSteps, currentStep]);
    }
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex].id);
    }
  };

  const handleBack = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex].id);
    }
  };

  const handleFinish = () => {
    // Simula finalização do pedido
    window.location.href = "/pedido-confirmado";
  };

  const searchCEP = async () => {
    // Mock: simula busca de CEP
    if (formData.cep.length === 8) {
      setFormData({
        ...formData,
        street: "Rua Exemplo",
        neighborhood: "Centro",
        city: "São Paulo",
        state: "SP",
      });
    }
  };

  return (
    <div>
      <MarketplaceHeader />
      <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto max-w-6xl px-4">
        {/* Cabeçalho com Segurança */}
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Checkout</h1>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Lock className="h-4 w-4" />
            <span>Compra 100% Segura</span>
          </div>
        </div>

        {/* Barra de Progresso */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isCompleted = completedSteps.includes(step.id);
              const isCurrent = step.id === currentStep;
              const isAccessible = index <= currentStepIndex || isCompleted;

              return (
                <div key={step.id} className="flex flex-1 items-center">
                  <button
                    className={`flex items-center gap-2 ${
                      isAccessible ? "cursor-pointer" : "cursor-not-allowed opacity-50"
                    }`}
                    onClick={() => isAccessible && setCurrentStep(step.id)}
                    disabled={!isAccessible}
                  >
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full ${
                        isCompleted
                          ? "bg-green-500 text-white"
                          : isCurrent
                          ? "bg-primary text-white"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {isCompleted ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                    </div>
                    <span
                      className={`hidden md:block ${
                        isCurrent ? "font-semibold" : ""
                      }`}
                    >
                      {step.title}
                    </span>
                  </button>
                  {index < steps.length - 1 && (
                    <div
                      className={`mx-2 h-0.5 flex-1 ${
                        isCompleted ? "bg-green-500" : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Formulário */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                {/* Etapa 1: Identificação */}
                {currentStep === "identification" && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="mb-4 text-2xl font-bold">Como deseja continuar?</h2>

                      <Tabs defaultValue="login" className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                          <TabsTrigger value="login">Entrar</TabsTrigger>
                          <TabsTrigger value="register">Cadastrar</TabsTrigger>
                          <TabsTrigger value="guest" onClick={() => setIsGuest(true)}>
                            Convidado
                          </TabsTrigger>
                        </TabsList>

                        <TabsContent value="login" className="space-y-4">
                          <div>
                            <Label htmlFor="email">E-mail</Label>
                            <Input
                              id="email"
                              type="email"
                              placeholder="seu@email.com"
                              value={formData.email}
                              onChange={(e) =>
                                setFormData({ ...formData, email: e.target.value })
                              }
                            />
                          </div>
                          <div>
                            <Label htmlFor="password">Senha</Label>
                            <Input
                              id="password"
                              type="password"
                              placeholder="••••••••"
                              value={formData.password}
                              onChange={(e) =>
                                setFormData({ ...formData, password: e.target.value })
                              }
                            />
                          </div>
                          <a href="#" className="text-sm text-blue-600 hover:underline">
                            Esqueci minha senha
                          </a>
                        </TabsContent>

                        <TabsContent value="register" className="space-y-4">
                          <div>
                            <Label>Nome Completo</Label>
                            <Input placeholder="Seu nome completo" />
                          </div>
                          <div>
                            <Label>E-mail</Label>
                            <Input type="email" placeholder="seu@email.com" />
                          </div>
                          <div>
                            <Label>Senha</Label>
                            <Input type="password" placeholder="••••••••" />
                          </div>
                          <div>
                            <Label>Confirmar Senha</Label>
                            <Input type="password" placeholder="••••••••" />
                          </div>
                        </TabsContent>

                        <TabsContent value="guest" className="space-y-4">
                          <p className="text-sm text-gray-600">
                            Continue sua compra informando apenas os dados essenciais.
                          </p>
                          <div>
                            <Label>E-mail</Label>
                            <Input
                              type="email"
                              placeholder="Para enviarmos as informações do pedido"
                              value={formData.email}
                              onChange={(e) =>
                                setFormData({ ...formData, email: e.target.value })
                              }
                            />
                          </div>
                        </TabsContent>
                      </Tabs>

                      {/* Login Social */}
                      <div className="mt-6">
                        <div className="relative">
                          <Separator />
                          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-sm text-gray-500">
                            ou continue com
                          </span>
                        </div>
                        <div className="mt-4 grid grid-cols-2 gap-3">
                          <Button variant="outline">
                            <img
                              src="https://www.google.com/favicon.ico"
                              alt="Google"
                              className="mr-2 h-4 w-4"
                            />
                            Google
                          </Button>
                          <Button variant="outline">
                            <img
                              src="https://www.facebook.com/favicon.ico"
                              alt="Facebook"
                              className="mr-2 h-4 w-4"
                            />
                            Facebook
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Etapa 2: Endereço */}
                {currentStep === "address" && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold">Endereço de Entrega</h2>

                    <div className="grid gap-4">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-2">
                          <Label htmlFor="cep">CEP</Label>
                          <Input
                            id="cep"
                            placeholder="00000-000"
                            value={formData.cep}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                cep: e.target.value.replace(/\D/g, ""),
                              })
                            }
                            maxLength={8}
                          />
                        </div>
                        <Button onClick={searchCEP} variant="outline" className="self-end">
                          Buscar
                        </Button>
                      </div>

                      <div>
                        <Label htmlFor="street">Rua</Label>
                        <Input
                          id="street"
                          value={formData.street}
                          onChange={(e) =>
                            setFormData({ ...formData, street: e.target.value })
                          }
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="number">Número</Label>
                          <Input
                            id="number"
                            value={formData.number}
                            onChange={(e) =>
                              setFormData({ ...formData, number: e.target.value })
                            }
                          />
                        </div>
                        <div className="col-span-2">
                          <Label htmlFor="complement">Complemento</Label>
                          <Input
                            id="complement"
                            placeholder="Apto, Bloco, etc."
                            value={formData.complement}
                            onChange={(e) =>
                              setFormData({ ...formData, complement: e.target.value })
                            }
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="neighborhood">Bairro</Label>
                        <Input
                          id="neighborhood"
                          value={formData.neighborhood}
                          onChange={(e) =>
                            setFormData({ ...formData, neighborhood: e.target.value })
                          }
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-2">
                          <Label htmlFor="city">Cidade</Label>
                          <Input
                            id="city"
                            value={formData.city}
                            onChange={(e) =>
                              setFormData({ ...formData, city: e.target.value })
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor="state">Estado</Label>
                          <Input
                            id="state"
                            placeholder="UF"
                            maxLength={2}
                            value={formData.state}
                            onChange={(e) =>
                              setFormData({ ...formData, state: e.target.value.toUpperCase() })
                            }
                          />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Opções de Frete */}
                    <div>
                      <h3 className="mb-4 font-semibold">Método de Envio</h3>
                      <RadioGroup value={shippingMethod} onValueChange={setShippingMethod}>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between rounded-md border p-4">
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="sedex" id="sedex" />
                              <Label htmlFor="sedex" className="cursor-pointer">
                                <div>
                                  <p className="font-medium">Sedex</p>
                                  <p className="text-sm text-gray-600">2-3 dias úteis</p>
                                </div>
                              </Label>
                            </div>
                            <span className="font-bold">R$ 25,90</span>
                          </div>

                          <div className="flex items-center justify-between rounded-md border p-4">
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="pac" id="pac" />
                              <Label htmlFor="pac" className="cursor-pointer">
                                <div>
                                  <p className="font-medium">PAC</p>
                                  <p className="text-sm text-gray-600">5-7 dias úteis</p>
                                </div>
                              </Label>
                            </div>
                            <span className="font-bold">R$ 15,50</span>
                          </div>

                          <div className="flex items-center justify-between rounded-md border p-4">
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="express" id="express" />
                              <Label htmlFor="express" className="cursor-pointer">
                                <div>
                                  <p className="font-medium">Expresso</p>
                                  <p className="text-sm text-gray-600">1-2 dias úteis</p>
                                </div>
                              </Label>
                            </div>
                            <span className="font-bold">R$ 35,00</span>
                          </div>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                )}

                {/* Etapa 3: Pagamento */}
                {currentStep === "payment" && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold">Método de Pagamento</h2>

                    <RadioGroup
                      value={formData.paymentMethod}
                      onValueChange={(value) =>
                        setFormData({ ...formData, paymentMethod: value })
                      }
                    >
                      <div className="space-y-4">
                        {/* Cartão de Crédito */}
                        <div className="rounded-md border p-4">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="credit-card" id="credit-card" />
                            <Label htmlFor="credit-card" className="cursor-pointer font-medium">
                              Cartão de Crédito
                            </Label>
                          </div>

                          {formData.paymentMethod === "credit-card" && (
                            <div className="mt-4 space-y-4">
                              <div>
                                <Label>Número do Cartão</Label>
                                <Input
                                  placeholder="1234 5678 9012 3456"
                                  value={formData.cardNumber}
                                  onChange={(e) =>
                                    setFormData({ ...formData, cardNumber: e.target.value })
                                  }
                                  maxLength={19}
                                />
                              </div>
                              <div>
                                <Label>Nome no Cartão</Label>
                                <Input
                                  placeholder="Como está no cartão"
                                  value={formData.cardName}
                                  onChange={(e) =>
                                    setFormData({ ...formData, cardName: e.target.value })
                                  }
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label>Validade</Label>
                                  <Input
                                    placeholder="MM/AA"
                                    value={formData.cardExpiry}
                                    onChange={(e) =>
                                      setFormData({ ...formData, cardExpiry: e.target.value })
                                    }
                                    maxLength={5}
                                  />
                                </div>
                                <div>
                                  <Label>CVV</Label>
                                  <Input
                                    placeholder="123"
                                    type="password"
                                    value={formData.cardCVV}
                                    onChange={(e) =>
                                      setFormData({ ...formData, cardCVV: e.target.value })
                                    }
                                    maxLength={4}
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* PIX */}
                        <div className="rounded-md border p-4">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="pix" id="pix" />
                            <Label htmlFor="pix" className="cursor-pointer font-medium">
                              PIX
                            </Label>
                            <Badge variant="secondary">Aprovação Instantânea</Badge>
                          </div>
                          {formData.paymentMethod === "pix" && (
                            <p className="mt-2 text-sm text-gray-600">
                              O QR Code será gerado após a confirmação do pedido
                            </p>
                          )}
                        </div>

                        {/* Boleto */}
                        <div className="rounded-md border p-4">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="boleto" id="boleto" />
                            <Label htmlFor="boleto" className="cursor-pointer font-medium">
                              Boleto Bancário
                            </Label>
                          </div>
                          {formData.paymentMethod === "boleto" && (
                            <p className="mt-2 text-sm text-gray-600">
                              Pagamento em até 3 dias úteis após a geração
                            </p>
                          )}
                        </div>
                      </div>
                    </RadioGroup>

                    {/* Selos de Segurança */}
                    <div className="rounded-md bg-gray-50 p-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Lock className="h-4 w-4" />
                        <span>Suas informações estão seguras e criptografadas</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Etapa 4: Revisão */}
                {currentStep === "review" && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold">Revisão do Pedido</h2>

                    {/* Produtos */}
                    <div>
                      <h3 className="mb-3 font-semibold">Produtos</h3>
                      <Card>
                        <CardContent className="p-4">
                          {MOCK_CART.items.map((item) => (
                            <div key={item.id} className="flex gap-4">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="h-20 w-20 rounded-md object-cover"
                              />
                              <div className="flex-1">
                                <p className="font-medium">{item.name}</p>
                                <p className="text-sm text-gray-600">Qtd: {item.quantity}</p>
                                <p className="font-bold text-green-600">
                                  R$ {item.price.toFixed(2)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    </div>

                    {/* Endereço */}
                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <h3 className="font-semibold">Endereço de Entrega</h3>
                        <Button variant="link" size="sm" onClick={() => setCurrentStep("address")}>
                          Editar
                        </Button>
                      </div>
                      <Card>
                        <CardContent className="p-4 text-sm">
                          <p>{formData.street}, {formData.number}</p>
                          {formData.complement && <p>{formData.complement}</p>}
                          <p>{formData.neighborhood}</p>
                          <p>{formData.city} - {formData.state}</p>
                          <p>CEP: {formData.cep}</p>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Pagamento */}
                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <h3 className="font-semibold">Método de Pagamento</h3>
                        <Button variant="link" size="sm" onClick={() => setCurrentStep("payment")}>
                          Editar
                        </Button>
                      </div>
                      <Card>
                        <CardContent className="p-4 text-sm">
                          {formData.paymentMethod === "credit-card" && (
                            <p>Cartão de Crédito terminado em {formData.cardNumber.slice(-4)}</p>
                          )}
                          {formData.paymentMethod === "pix" && <p>PIX</p>}
                          {formData.paymentMethod === "boleto" && <p>Boleto Bancário</p>}
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )}

                {/* Botões de Navegação */}
                <div className="mt-8 flex gap-4">
                  {currentStepIndex > 0 && (
                    <Button variant="outline" onClick={handleBack}>
                      <ChevronLeft className="mr-2 h-4 w-4" />
                      Voltar
                    </Button>
                  )}
                  <Button
                    className="ml-auto"
                    onClick={currentStep === "review" ? handleFinish : handleNext}
                  >
                    {currentStep === "review" ? "Confirmar Pagamento" : "Continuar"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Resumo do Pedido - Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Resumo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {MOCK_CART.items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-16 w-16 rounded-md object-cover"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium line-clamp-2">{item.name}</p>
                      <p className="text-sm text-gray-600">Qtd: {item.quantity}</p>
                    </div>
                  </div>
                ))}

                <Separator />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>R$ {MOCK_CART.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Frete</span>
                    <span>R$ {MOCK_CART.shipping.toFixed(2)}</span>
                  </div>
                  {MOCK_CART.discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Desconto</span>
                      <span>- R$ {MOCK_CART.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-green-600">R$ {MOCK_CART.total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
