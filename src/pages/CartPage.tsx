import { useState } from "react";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

interface CartItem {
  id: string;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  storeName: string;
  variations?: {
    color?: string;
    size?: string;
  };
}

// Mock de itens no carrinho
const MOCK_CART_ITEMS: CartItem[] = [
  {
    id: "1",
    name: "Smartphone XYZ Pro Max 256GB",
    image: "https://picsum.photos/seed/cart1/200/200",
    price: 2499.99,
    originalPrice: 3299.99,
    quantity: 1,
    storeName: "Tech Shop Premium",
    variations: { color: "Preto", size: "256GB" },
  },
  {
    id: "2",
    name: "Fone de Ouvido Bluetooth Premium",
    image: "https://picsum.photos/seed/cart2/200/200",
    price: 299.99,
    quantity: 2,
    storeName: "Audio Store",
    variations: { color: "Branco" },
  },
  {
    id: "3",
    name: "Capa Protetora Para Smartphone",
    image: "https://picsum.photos/seed/cart3/200/200",
    price: 49.99,
    originalPrice: 79.99,
    quantity: 1,
    storeName: "Acessórios Plus",
  },
];

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>(MOCK_CART_ITEMS);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discount: number;
  } | null>(null);
  const [cep, setCep] = useState("");
  const [shippingOptions, setShippingOptions] = useState<
    { name: string; price: number; days: string }[] | null
  >(null);
  const [selectedShipping, setSelectedShipping] = useState<number>(0);

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCartItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (id: string) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
  };

  const applyCoupon = () => {
    // Mock: simula aplicação de cupom
    if (couponCode.toUpperCase() === "DESC10") {
      setAppliedCoupon({ code: couponCode, discount: 10 });
    } else if (couponCode) {
      alert("Cupom inválido!");
    }
  };

  const calculateShipping = () => {
    // Mock: simula cálculo de frete
    if (cep.length === 8 || cep.length === 9) {
      setShippingOptions([
        { name: "Sedex", price: 25.9, days: "2-3 dias úteis" },
        { name: "PAC", price: 15.5, days: "5-7 dias úteis" },
        { name: "Expresso", price: 35.0, days: "1-2 dias úteis" },
      ]);
    } else {
      alert("CEP inválido!");
    }
  };

  // Cálculos
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const discount = appliedCoupon
    ? (subtotal * appliedCoupon.discount) / 100
    : 0;
  const shipping =
    shippingOptions && selectedShipping !== null
      ? shippingOptions[selectedShipping]?.price || 0
      : 0;
  const total = subtotal - discount + shipping;

  if (cartItems.length === 0) {
    return (
      <Layout>
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-12">
            <ShoppingBag className="mx-auto mb-4 h-16 w-16 text-gray-400" />
            <h2 className="mb-2 text-2xl font-bold">Seu carrinho está vazio</h2>
            <p className="mb-6 text-gray-600">
              Adicione produtos para continuar comprando
            </p>
            <Button onClick={() => (window.location.href = "/")}>
              Continuar Comprando
            </Button>
          </CardContent>
        </Card>
      </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <h1 className="mb-8 text-3xl font-bold">Carrinho de Compras</h1>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Lista de Produtos */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Itens no Carrinho ({cartItems.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id}>
                    <div className="flex gap-4">
                      {/* Imagem */}
                      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md bg-gray-100">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      {/* Informações */}
                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-medium">{item.name}</h3>
                              <p className="text-sm text-gray-600">{item.storeName}</p>
                              {item.variations && (
                                <div className="mt-1 flex gap-2 text-sm text-gray-600">
                                  {item.variations.color && (
                                    <span>Cor: {item.variations.color}</span>
                                  )}
                                  {item.variations.size && (
                                    <span>• {item.variations.size}</span>
                                  )}
                                </div>
                              )}
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeItem(item.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="mt-2 flex items-center gap-2">
                            {item.originalPrice && (
                              <span className="text-sm text-gray-500 line-through">
                                R$ {item.originalPrice.toFixed(2)}
                              </span>
                            )}
                            <span className="text-lg font-bold text-green-600">
                              R$ {item.price.toFixed(2)}
                            </span>
                          </div>
                        </div>

                        {/* Controles de Quantidade */}
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-12 text-center font-medium">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                          <span className="ml-auto font-medium">
                            R$ {(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Separator className="mt-4" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Calcular Frete */}
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Calcular Frete</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Input
                    placeholder="Digite seu CEP"
                    value={cep}
                    onChange={(e) => setCep(e.target.value.replace(/\D/g, ""))}
                    maxLength={8}
                  />
                  <Button onClick={calculateShipping}>Calcular</Button>
                </div>

                {shippingOptions && (
                  <div className="mt-4 space-y-2">
                    {shippingOptions.map((option, idx) => (
                      <div
                        key={idx}
                        className={`cursor-pointer rounded-md border p-3 transition-colors ${
                          selectedShipping === idx
                            ? "border-primary bg-primary/5"
                            : "hover:bg-gray-50"
                        }`}
                        onClick={() => setSelectedShipping(idx)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{option.name}</p>
                            <p className="text-sm text-gray-600">{option.days}</p>
                          </div>
                          <span className="font-bold">R$ {option.price.toFixed(2)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Resumo do Pedido */}
          <div>
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Resumo do Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Cupom de Desconto */}
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Cupom de Desconto
                  </label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Digite o cupom"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      disabled={!!appliedCoupon}
                    />
                    <Button
                      onClick={applyCoupon}
                      disabled={!!appliedCoupon || !couponCode}
                    >
                      Aplicar
                    </Button>
                  </div>
                  {appliedCoupon && (
                    <Badge className="mt-2" variant="secondary">
                      Cupom {appliedCoupon.code} aplicado ({appliedCoupon.discount}%)
                      <button
                        className="ml-2"
                        onClick={() => {
                          setAppliedCoupon(null);
                          setCouponCode("");
                        }}
                      >
                        ×
                      </button>
                    </Badge>
                  )}
                </div>

                <Separator />

                {/* Valores */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span>R$ {subtotal.toFixed(2)}</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Desconto</span>
                      <span>- R$ {discount.toFixed(2)}</span>
                    </div>
                  )}

                  {shipping > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Frete</span>
                      <span>R$ {shipping.toFixed(2)}</span>
                    </div>
                  )}

                  <Separator />

                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-green-600">R$ {total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex-col gap-2">
                <Button
                  className="w-full"
                  size="lg"
                  onClick={() => (window.location.href = "/checkout")}
                >
                  Finalizar Compra
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => (window.location.href = "/")}
                >
                  Continuar Comprando
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
      </div>
    </Layout>
  );
}