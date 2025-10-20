import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Filter } from "lucide-react";
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
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { useIsMobile, useScreenSize } from "@/hooks/use-mobile";

// Mock de produtos para demonstração
const MOCK_PRODUCTS = Array.from({ length: 24 }, (_, i) => ({
  id: `product-${i}`,
  name: `Produto Incrível ${i + 1} - Descrição detalhada do produto`,
  price: Math.random() * 500 + 50,
  originalPrice: Math.random() > 0.5 ? Math.random() * 700 + 100 : undefined,
  image: `https://picsum.photos/seed/${i}/400/400`,
  storeName: ["Loja Premium", "Mega Store", "Tech Shop", "Fashion House"][
    Math.floor(Math.random() * 4)
  ],
  rating: Math.random() * 2 + 3,
  reviewCount: Math.floor(Math.random() * 500) + 10,
  isFreeShipping: Math.random() > 0.5,
  category: ["Eletrônicos", "Moda", "Casa e Decoração", "Esportes"][
    Math.floor(Math.random() * 4)
  ],
}));

const SEARCH_SUGGESTIONS = [
  "iPhone 14 Pro",
  "Notebook Dell",
  "Tênis Nike",
  "Smart TV 55 polegadas",
  "Cadeira Gamer",
  "Fone Bluetooth",
];

type SortOption = "relevance" | "price-asc" | "price-desc" | "best-sellers" | "newest";

export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const isMobile = useIsMobile();
  const screenSize = useScreenSize();
  
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [sortBy, setSortBy] = useState<SortOption>("relevance");
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<FilterOptions>({
    categories: [],
    priceRange: [0, 10000],
    minRating: 0,
    freeShipping: false,
    sellers: [],
  });

  // Responsividade para itens por página
  const getItemsPerPage = () => {
    switch (screenSize) {
      case 'mobile':
        return 8;
      case 'tablet':
        return 12;
      default:
        return 16;
    }
  };

  const itemsPerPage = getItemsPerPage();

  // Responsividade para colunas do grid
  const getGridCols = () => {
    switch (screenSize) {
      case 'mobile':
        return 'grid-cols-1 xs:grid-cols-2';
      case 'tablet':
        return 'grid-cols-2 sm:grid-cols-3';
      default:
        return 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5';
    }
  };

  // Filtragem e ordenação dos produtos
  const filteredProducts = MOCK_PRODUCTS.filter((product) => {
    // Filtro de busca
    if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Filtro de categoria
    if (filters.categories.length > 0 && !filters.categories.includes(product.category)) {
      return false;
    }

    // Filtro de preço
    if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
      return false;
    }

    // Filtro de avaliação
    if (product.rating < filters.minRating) {
      return false;
    }

    // Filtro de frete grátis
    if (filters.freeShipping && !product.isFreeShipping) {
      return false;
    }

    // Filtro de vendedor
    if (filters.sellers.length > 0 && !filters.sellers.includes(product.storeName)) {
      return false;
    }

    return true;
  }).sort((a, b) => {
    switch (sortBy) {
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      case "best-sellers":
        return b.reviewCount - a.reviewCount;
      case "newest":
        return 0; // Mock: produtos já estão em ordem
      default:
        return 0;
    }
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setSearchParams({ q: query });
    setCurrentPage(1);
  };

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header do Marketplace */}
      <MarketplaceHeader />

      <div className="container mx-auto px-4 py-4 sm:py-6">
        <div className="flex gap-4 lg:gap-6">
          {/* Sidebar de Filtros - Desktop */}
          {!isMobile && (
            <aside className="sticky top-24 h-fit min-w-[240px] lg:min-w-[280px]">
              <FilterSidebar
                filters={filters}
                onFilterChange={handleFilterChange}
              />
            </aside>
          )}

          {/* Área Principal */}
          <main className="flex-1 min-w-0">
            {/* Cabeçalho com resultados e ordenação */}
            <div className="mb-4 sm:mb-6 flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold">
                  {searchQuery ? `Resultados para "${searchQuery}"` : "Todos os Produtos"}
                </h1>
                <p className="text-sm text-gray-600">
                  {filteredProducts.length} produtos encontrados
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                {/* Botão de Filtros - Mobile */}
                {isMobile && (
                  <FilterSidebar
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    isMobile
                  />
                )}

                {/* Ordenação */}
                <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
                  <SelectTrigger className="w-full sm:w-[200px]">
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
            {paginatedProducts.length > 0 ? (
              <>
                <div className={`grid gap-3 sm:gap-4 ${getGridCols()}`}>
                  {paginatedProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      {...product}
                      onClick={() => window.location.href = `/produto/${product.id}`}
                      onAddToCart={() => console.log("Adicionar ao carrinho:", product.id)}
                    />
                  ))}
                </div>

                {/* Paginação */}
                {totalPages > 1 && (
                  <div className="mt-6 sm:mt-8 flex justify-center">
                    <Pagination>
                      <PaginationContent className="flex-wrap gap-1">
                        <PaginationItem>
                          <PaginationPrevious
                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                            className={`${currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"} text-xs sm:text-sm`}
                          />
                        </PaginationItem>

                        {/* Mostrar menos páginas em mobile */}
                        {[...Array(Math.min(isMobile ? 3 : 5, totalPages))].map((_, i) => {
                          const pageNumber = i + 1;
                          return (
                            <PaginationItem key={pageNumber}>
                              <PaginationLink
                                onClick={() => setCurrentPage(pageNumber)}
                                isActive={currentPage === pageNumber}
                                className="cursor-pointer text-xs sm:text-sm"
                              >
                                {pageNumber}
                              </PaginationLink>
                            </PaginationItem>
                          );
                        })}

                        {totalPages > (isMobile ? 3 : 5) && <PaginationEllipsis />}

                        <PaginationItem>
                          <PaginationNext
                            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                            className={`${currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"} text-xs sm:text-sm`}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </>
            ) : (
              <div className="py-12 sm:py-16 text-center">
                <p className="text-lg text-gray-600 mb-4">Nenhum produto encontrado</p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("");
                    setFilters({
                      categories: [],
                      priceRange: [0, 10000],
                      minRating: 0,
                      freeShipping: false,
                      sellers: [],
                    });
                  }}
                >
                  Limpar Filtros
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
