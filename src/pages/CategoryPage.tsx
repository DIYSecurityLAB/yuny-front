import { useState } from "react";
import { useParams } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { MarketplaceHeader } from "@/components/marketplace/MarketplaceHeader";
import { FilterSidebar, FilterOptions } from "@/components/marketplace/FilterSidebar";
import { ProductCard } from "@/components/marketplace/ProductCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";

// Mock de categorias e subcategorias
const CATEGORIES_DATA = {
  eletronicos: {
    name: "Eletrônicos",
    subcategories: ["Smartphones", "Notebooks", "TVs", "Áudio", "Câmeras"],
    banner: "https://picsum.photos/seed/electronics/1200/300",
  },
  moda: {
    name: "Moda",
    subcategories: ["Roupas", "Calçados", "Acessórios", "Bolsas", "Relógios"],
    banner: "https://picsum.photos/seed/fashion/1200/300",
  },
  "casa-decoracao": {
    name: "Casa e Decoração",
    subcategories: ["Móveis", "Decoração", "Cama e Banho", "Cozinha", "Iluminação"],
    banner: "https://picsum.photos/seed/home/1200/300",
  },
};

// Mock de produtos
const MOCK_PRODUCTS = Array.from({ length: 20 }, (_, i) => ({
  id: `product-${i}`,
  name: `Produto da Categoria ${i + 1} - Descrição completa`,
  price: Math.random() * 500 + 50,
  originalPrice: Math.random() > 0.5 ? Math.random() * 700 + 100 : undefined,
  image: `https://picsum.photos/seed/cat-${i}/400/400`,
  storeName: ["Loja Premium", "Mega Store", "Tech Shop"][Math.floor(Math.random() * 3)],
  rating: Math.random() * 2 + 3,
  reviewCount: Math.floor(Math.random() * 500) + 10,
  isFreeShipping: Math.random() > 0.5,
}));

type SortOption = "relevance" | "price-asc" | "price-desc" | "best-sellers" | "newest";

export default function CategoryPage() {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const isMobile = useIsMobile();

  const category = CATEGORIES_DATA[categorySlug as keyof typeof CATEGORIES_DATA];
  
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("relevance");
  const [filters, setFilters] = useState<FilterOptions>({
    categories: [],
    priceRange: [0, 10000],
    minRating: 0,
    freeShipping: false,
    sellers: [],
  });

  if (!category) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Categoria não encontrada</h1>
          <p className="mt-2 text-gray-600">A categoria que você procura não existe.</p>
        </div>
      </div>
    );
  }

  const filteredProducts = MOCK_PRODUCTS.filter((product) => {
    if (filters.categories.length > 0) return false; // Lógica de filtro
    if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) return false;
    if (product.rating < filters.minRating) return false;
    if (filters.freeShipping && !product.isFreeShipping) return false;
    if (filters.sellers.length > 0 && !filters.sellers.includes(product.storeName)) return false;
    return true;
  }).sort((a, b) => {
    switch (sortBy) {
      case "price-asc": return a.price - b.price;
      case "price-desc": return b.price - a.price;
      case "best-sellers": return b.reviewCount - a.reviewCount;
      default: return 0;
    }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header do Marketplace */}
      <MarketplaceHeader />

      {/* Banner da Categoria */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 md:h-64">
        <img
          src={category.banner}
          alt={category.name}
          className="h-full w-full object-cover opacity-30"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-4xl font-bold text-white md:text-5xl">{category.name}</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-sm text-gray-600">
          <a href="/" className="hover:text-gray-900">
            Início
          </a>
          <ChevronRight className="h-4 w-4" />
          <span className="font-medium text-gray-900">{category.name}</span>
          {selectedSubcategory && (
            <>
              <ChevronRight className="h-4 w-4" />
              <span className="font-medium text-gray-900">{selectedSubcategory}</span>
            </>
          )}
        </nav>

        {/* Subcategorias */}
        <div className="mb-6 flex flex-wrap gap-2">
          <Badge
            variant={selectedSubcategory === null ? "default" : "outline"}
            className="cursor-pointer px-4 py-2"
            onClick={() => setSelectedSubcategory(null)}
          >
            Todos
          </Badge>
          {category.subcategories.map((sub) => (
            <Badge
              key={sub}
              variant={selectedSubcategory === sub ? "default" : "outline"}
              className="cursor-pointer px-4 py-2"
              onClick={() => setSelectedSubcategory(sub)}
            >
              {sub}
            </Badge>
          ))}
        </div>

        <div className="flex gap-6">
          {/* Sidebar de Filtros - Desktop */}
          {!isMobile && (
            <aside className="sticky top-24 h-fit">
              <FilterSidebar filters={filters} onFilterChange={setFilters} />
            </aside>
          )}

          {/* Área Principal */}
          <main className="flex-1">
            {/* Cabeçalho */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-gray-600">
                {filteredProducts.length} produtos encontrados
              </p>

              <div className="flex items-center gap-2">
                {isMobile && (
                  <FilterSidebar filters={filters} onFilterChange={setFilters} isMobile />
                )}

                <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Ordenar por" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Relevância</SelectItem>
                    <SelectItem value="price-asc">Menor Preço</SelectItem>
                    <SelectItem value="price-desc">Maior Preço</SelectItem>
                    <SelectItem value="best-sellers">Mais Vendidos</SelectItem>
                    <SelectItem value="newest">Lançamentos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Grid de Produtos */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  {...product}
                  onClick={() => (window.location.href = `/produto/${product.id}`)}
                  onAddToCart={() => console.log("Adicionar ao carrinho:", product.id)}
                />
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
