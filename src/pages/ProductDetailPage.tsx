import { useState } from "react";
import { useParams } from "react-router-dom";
import {
  Star,
  ShoppingCart,
  Heart,
  Share2,
  Truck,
  ShieldCheck,
  ChevronRight,
  Store,
  MessageCircle,
  ChevronLeft,
} from "lucide-react";
import { MarketplaceHeader } from "@/components/marketplace/MarketplaceHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ProductCard } from "@/components/marketplace/ProductCard";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";

// Mock de produto
const MOCK_PRODUCT = {
  id: "1",
  name: "Smartphone XYZ Pro Max 256GB - 5G - Câmera Tripla 108MP",
  price: 2499.99,
  originalPrice: 3299.99,
  images: [
    "https://picsum.photos/seed/prod1/800/800",
    "https://picsum.photos/seed/prod2/800/800",
    "https://picsum.photos/seed/prod3/800/800",
    "https://picsum.photos/seed/prod4/800/800",
  ],
  rating: 4.5,
  reviewCount: 1247,
  storeName: "Tech Shop Premium",
  storeRating: 4.8,
  storeFollowers: "50k",
  isFreeShipping: true,
  stock: 15,
  variations: {
    color: ["Preto", "Branco", "Azul", "Vermelho"],
    storage: ["128GB", "256GB", "512GB"],
  },
  description: `
    O Smartphone XYZ Pro Max é o topo de linha que você esperava. 
    Com processador de última geração, câmera profissional de 108MP e bateria de longa duração.
    
    Recursos principais:
    • Display AMOLED 6.7" 120Hz
    • Processador Octa-Core 3.2GHz
    • 12GB RAM
    • Bateria 5000mAh com carregamento rápido
    • Sistema de câmera tripla profissional
    • 5G habilitado
    • Resistente à água (IP68)
  `,
  specifications: {
    Marca: "XYZ",
    Modelo: "Pro Max",
    "Sistema Operacional": "Android 14",
    Processador: "Snapdragon 8 Gen 3",
    RAM: "12GB",
    "Câmera Principal": "108MP",
    Bateria: "5000mAh",
    Tela: '6.7" AMOLED',
    Peso: "198g",
  },
};

// Mock de avaliações
const MOCK_REVIEWS = [
  {
    id: "1",
    author: "João Silva",
    avatar: "https://i.pravatar.cc/150?img=1",
    rating: 5,
    date: "15/01/2025",
    comment: "Excelente produto! Superou minhas expectativas. A câmera é incrível!",
    helpful: 42,
  },
  {
    id: "2",
    author: "Maria Santos",
    avatar: "https://i.pravatar.cc/150?img=2",
    rating: 4,
    date: "10/01/2025",
    comment: "Muito bom, mas a bateria poderia durar um pouco mais.",
    helpful: 28,
  },
  {
    id: "3",
    author: "Pedro Costa",
    avatar: "https://i.pravatar.cc/150?img=3",
    rating: 5,
    date: "05/01/2025",
    comment: "Entrega rápida e produto de qualidade. Recomendo!",
    helpful: 35,
  },
];

// Mock de produtos relacionados
const RELATED_PRODUCTS = Array.from({ length: 4 }, (_, i) => ({
  id: `related-${i}`,
  name: `Produto Relacionado ${i + 1}`,
  price: Math.random() * 500 + 100,
  image: `https://picsum.photos/seed/rel-${i}/400/400`,
  storeName: "Loja Premium",
  rating: 4 + Math.random(),
  reviewCount: Math.floor(Math.random() * 200) + 50,
  isFreeShipping: true,
}));

export default function ProductDetailPage() {
  const { productId } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(MOCK_PRODUCT.variations.color[0]);
  const [selectedStorage, setSelectedStorage] = useState(MOCK_PRODUCT.variations.storage[1]);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const discount = Math.round(
    ((MOCK_PRODUCT.originalPrice - MOCK_PRODUCT.price) / MOCK_PRODUCT.originalPrice) * 100
  );

  // Distribuição de avaliações
  const ratingDistribution = [
    { stars: 5, count: 850, percentage: 68 },
    { stars: 4, count: 280, percentage: 22 },
    { stars: 3, count: 75, percentage: 6 },
    { stars: 2, count: 25, percentage: 2 },
    { stars: 1, count: 17, percentage: 2 },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <MarketplaceHeader />
      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-sm text-gray-600">
          <a href="/" className="hover:text-gray-900">
            Início
          </a>
          <ChevronRight className="h-4 w-4" />
          <a href="/categoria/eletronicos" className="hover:text-gray-900">
            Eletrônicos
          </a>
          <ChevronRight className="h-4 w-4" />
          <span className="font-medium text-gray-900">Smartphones</span>
        </nav>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Galeria de Imagens */}
          <div className="space-y-4">
            {/* Imagem Principal */}
            <div className="relative aspect-square overflow-hidden rounded-lg bg-white">
              <img
                src={MOCK_PRODUCT.images[selectedImage]}
                alt={MOCK_PRODUCT.name}
                className="h-full w-full object-contain p-4"
              />
              {discount > 0 && (
                <Badge className="absolute left-4 top-4 bg-red-500 text-lg">
                  -{discount}%
                </Badge>
              )}

              {/* Navegação de imagens */}
              <Button
                variant="outline"
                size="icon"
                className="absolute left-2 top-1/2 -translate-y-1/2"
                onClick={() =>
                  setSelectedImage((prev) =>
                    prev === 0 ? MOCK_PRODUCT.images.length - 1 : prev - 1
                  )
                }
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2"
                onClick={() =>
                  setSelectedImage((prev) =>
                    prev === MOCK_PRODUCT.images.length - 1 ? 0 : prev + 1
                  )
                }
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Miniaturas */}
            <div className="grid grid-cols-4 gap-2">
              {MOCK_PRODUCT.images.map((img, idx) => (
                <button
                  key={idx}
                  className={`aspect-square overflow-hidden rounded-md border-2 bg-white ${
                    selectedImage === idx ? "border-primary" : "border-gray-200"
                  }`}
                  onClick={() => setSelectedImage(idx)}
                >
                  <img src={img} alt="" className="h-full w-full object-contain p-1" />
                </button>
              ))}
            </div>
          </div>

          {/* Informações do Produto */}
          <div className="space-y-6">
            <div>
              <h1 className="mb-2 text-3xl font-bold text-gray-900">
                {MOCK_PRODUCT.name}
              </h1>

              {/* Avaliações */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor(MOCK_PRODUCT.rating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "fill-gray-200 text-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-medium">{MOCK_PRODUCT.rating}</span>
                </div>
                <Separator orientation="vertical" className="h-4" />
                <a href="#reviews" className="text-sm text-blue-600 hover:underline">
                  {MOCK_PRODUCT.reviewCount} avaliações
                </a>
                <Separator orientation="vertical" className="h-4" />
                <span className="text-sm text-gray-600">
                  {MOCK_PRODUCT.stock} em estoque
                </span>
              </div>
            </div>

            <Separator />

            {/* Preço */}
            <div>
              {MOCK_PRODUCT.originalPrice && (
                <span className="text-lg text-gray-500 line-through">
                  R$ {MOCK_PRODUCT.originalPrice.toFixed(2)}
                </span>
              )}
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-green-600">
                  R$ {MOCK_PRODUCT.price.toFixed(2)}
                </span>
                <span className="text-gray-600">ou 12x de R$ 208,33</span>
              </div>
            </div>

            <Separator />

            {/* Variações - Cor */}
            <div>
              <h3 className="mb-3 font-medium">Cor: {selectedColor}</h3>
              <div className="flex gap-2">
                {MOCK_PRODUCT.variations.color.map((color) => (
                  <Button
                    key={color}
                    variant={selectedColor === color ? "default" : "outline"}
                    onClick={() => setSelectedColor(color)}
                  >
                    {color}
                  </Button>
                ))}
              </div>
            </div>

            {/* Variações - Armazenamento */}
            <div>
              <h3 className="mb-3 font-medium">Armazenamento: {selectedStorage}</h3>
              <div className="flex gap-2">
                {MOCK_PRODUCT.variations.storage.map((storage) => (
                  <Button
                    key={storage}
                    variant={selectedStorage === storage ? "default" : "outline"}
                    onClick={() => setSelectedStorage(storage)}
                  >
                    {storage}
                  </Button>
                ))}
              </div>
            </div>

            <Separator />

            {/* Quantidade */}
            <div>
              <h3 className="mb-3 font-medium">Quantidade</h3>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  -
                </Button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.min(MOCK_PRODUCT.stock, quantity + 1))}
                  disabled={quantity >= MOCK_PRODUCT.stock}
                >
                  +
                </Button>
              </div>
            </div>

            {/* Botões de Ação */}
            <div className="flex gap-3">
              <Button className="flex-1" size="lg">
                <ShoppingCart className="mr-2 h-5 w-5" />
                Adicionar ao Carrinho
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => setIsWishlisted(!isWishlisted)}
              >
                <Heart
                  className={`h-5 w-5 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`}
                />
              </Button>
              <Button variant="outline" size="lg">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>

            {/* Benefícios */}
            <Card>
              <CardContent className="space-y-3 p-4">
                <div className="flex items-center gap-3 text-sm">
                  <Truck className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium">Frete Grátis</p>
                    <p className="text-gray-600">Entrega em 2-5 dias úteis</p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center gap-3 text-sm">
                  <ShieldCheck className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium">Garantia de 12 meses</p>
                    <p className="text-gray-600">Direto com o fabricante</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Informações do Vendedor */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Store className="h-10 w-10 text-gray-400" />
                    <div>
                      <p className="font-medium">{MOCK_PRODUCT.storeName}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{MOCK_PRODUCT.storeRating}</span>
                        <span>•</span>
                        <span>{MOCK_PRODUCT.storeFollowers} seguidores</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Ver Loja
                    </Button>
                    <Button variant="outline" size="sm">
                      <MessageCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Tabs de Informações */}
        <div className="mt-12">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description">Descrição</TabsTrigger>
              <TabsTrigger value="specifications">Especificações</TabsTrigger>
              <TabsTrigger value="reviews" id="reviews">
                Avaliações ({MOCK_PRODUCT.reviewCount})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-6">
              <Card>
                <CardContent className="prose max-w-none p-6">
                  <pre className="whitespace-pre-wrap font-sans">
                    {MOCK_PRODUCT.description}
                  </pre>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="specifications" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <table className="w-full">
                    <tbody>
                      {Object.entries(MOCK_PRODUCT.specifications).map(([key, value], idx) => (
                        <tr key={key} className={idx % 2 === 0 ? "bg-gray-50" : ""}>
                          <td className="px-4 py-3 font-medium">{key}</td>
                          <td className="px-4 py-3">{value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6 space-y-6">
              {/* Resumo de Avaliações */}
              <Card>
                <CardContent className="p-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="flex flex-col items-center justify-center border-r">
                      <div className="text-5xl font-bold">{MOCK_PRODUCT.rating}</div>
                      <div className="mt-2 flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-6 w-6 ${
                              i < Math.floor(MOCK_PRODUCT.rating)
                                ? "fill-yellow-400 text-yellow-400"
                                : "fill-gray-200 text-gray-200"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="mt-1 text-sm text-gray-600">
                        {MOCK_PRODUCT.reviewCount} avaliações
                      </p>
                    </div>

                    <div className="space-y-2">
                      {ratingDistribution.map((dist) => (
                        <div key={dist.stars} className="flex items-center gap-2">
                          <span className="w-8 text-sm">{dist.stars}★</span>
                          <Progress value={dist.percentage} className="h-2 flex-1" />
                          <span className="w-12 text-right text-sm text-gray-600">
                            {dist.count}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Lista de Avaliações */}
              <div className="space-y-4">
                {MOCK_REVIEWS.map((review) => (
                  <Card key={review.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <Avatar>
                          <AvatarImage src={review.avatar} />
                          <AvatarFallback>{review.author[0]}</AvatarFallback>
                        </Avatar>

                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">{review.author}</p>
                              <div className="flex items-center gap-2">
                                <div className="flex">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-4 w-4 ${
                                        i < review.rating
                                          ? "fill-yellow-400 text-yellow-400"
                                          : "fill-gray-200 text-gray-200"
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-sm text-gray-600">{review.date}</span>
                              </div>
                            </div>
                          </div>

                          <p className="mt-3 text-gray-700">{review.comment}</p>

                          <div className="mt-3 flex items-center gap-4">
                            <Button variant="ghost" size="sm">
                              👍 Útil ({review.helpful})
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Escrever Avaliação */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="mb-4 text-lg font-semibold">Escrever uma avaliação</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="mb-2 block text-sm font-medium">Sua avaliação</label>
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-6 w-6 cursor-pointer text-gray-300" />
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium">Comentário</label>
                      <Textarea placeholder="Compartilhe sua experiência com este produto..." />
                    </div>
                    <Button>Enviar Avaliação</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Produtos Relacionados */}
        <div className="mt-12">
          <h2 className="mb-6 text-2xl font-bold">Produtos Relacionados</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {RELATED_PRODUCTS.map((product) => (
              <ProductCard
                key={product.id}
                {...product}
                onClick={() => window.scrollTo(0, 0)}
                onAddToCart={() => console.log("Adicionar:", product.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
