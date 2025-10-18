import { useState } from "react";
import { Star, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";

export interface FilterOptions {
  categories: string[];
  priceRange: [number, number];
  minRating: number;
  freeShipping: boolean;
  sellers: string[];
}

interface FilterSidebarProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
  isMobile?: boolean;
}

const CATEGORIES = [
  "Eletrônicos",
  "Moda",
  "Casa e Decoração",
  "Esportes",
  "Livros",
  "Beleza",
  "Alimentos",
];

const SELLERS = [
  "Loja Premium",
  "Mega Store",
  "Tech Shop",
  "Fashion House",
  "Home Decor",
];

export function FilterSidebar({
  filters,
  onFilterChange,
  isMobile = false,
}: FilterSidebarProps) {
  const [localFilters, setLocalFilters] = useState(filters);

  const updateFilter = <K extends keyof FilterOptions>(key: K, value: FilterOptions[K]) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const emptyFilters: FilterOptions = {
      categories: [],
      priceRange: [0, 10000],
      minRating: 0,
      freeShipping: false,
      sellers: [],
    };
    setLocalFilters(emptyFilters);
    onFilterChange(emptyFilters);
  };

  const activeFiltersCount =
    localFilters.categories.length +
    localFilters.sellers.length +
    (localFilters.freeShipping ? 1 : 0) +
    (localFilters.minRating > 0 ? 1 : 0);

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Header com contador e limpar filtros */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          Filtros
          {activeFiltersCount > 0 && (
            <Badge className="ml-2" variant="secondary">
              {activeFiltersCount}
            </Badge>
          )}
        </h3>
        {activeFiltersCount > 0 && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="mr-1 h-4 w-4" />
            Limpar
          </Button>
        )}
      </div>

      <Separator />

      {/* Categorias */}
      <div>
        <h4 className="mb-3 font-medium">Categorias</h4>
        <div className="space-y-2">
          {CATEGORIES.map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox
                id={`category-${category}`}
                checked={localFilters.categories.includes(category)}
                onCheckedChange={(checked) => {
                  const newCategories = checked
                    ? [...localFilters.categories, category]
                    : localFilters.categories.filter((c) => c !== category);
                  updateFilter("categories", newCategories);
                }}
              />
              <Label
                htmlFor={`category-${category}`}
                className="cursor-pointer text-sm"
              >
                {category}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Faixa de Preço */}
      <div>
        <h4 className="mb-3 font-medium">Preço</h4>
        <div className="px-2">
          <Slider
            value={localFilters.priceRange}
            onValueChange={(value) =>
              updateFilter("priceRange", value as [number, number])
            }
            max={10000}
            step={100}
            className="mb-4"
          />
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>R$ {localFilters.priceRange[0]}</span>
            <span>R$ {localFilters.priceRange[1]}</span>
          </div>
        </div>
      </div>

      <Separator />

      {/* Avaliação */}
      <div>
        <h4 className="mb-3 font-medium">Avaliação Mínima</h4>
        <div className="space-y-2">
          {[4, 3, 2, 1].map((rating) => (
            <button
              key={rating}
              className={`flex w-full items-center space-x-2 rounded-md p-2 text-sm transition-colors ${
                localFilters.minRating === rating
                  ? "bg-primary text-white"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => updateFilter("minRating", rating)}
            >
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "fill-gray-300 text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span>e acima</span>
            </button>
          ))}
        </div>
      </div>

      <Separator />

      {/* Frete Grátis */}
      <div className="flex items-center space-x-2">
        <Checkbox
          id="free-shipping"
          checked={localFilters.freeShipping}
          onCheckedChange={(checked) =>
            updateFilter("freeShipping", checked as boolean)
          }
        />
        <Label htmlFor="free-shipping" className="cursor-pointer">
          Frete Grátis
        </Label>
      </div>

      <Separator />

      {/* Vendedores */}
      <div>
        <h4 className="mb-3 font-medium">Vendedor</h4>
        <div className="space-y-2">
          {SELLERS.map((seller) => (
            <div key={seller} className="flex items-center space-x-2">
              <Checkbox
                id={`seller-${seller}`}
                checked={localFilters.sellers.includes(seller)}
                onCheckedChange={(checked) => {
                  const newSellers = checked
                    ? [...localFilters.sellers, seller]
                    : localFilters.sellers.filter((s) => s !== seller);
                  updateFilter("sellers", newSellers);
                }}
              />
              <Label
                htmlFor={`seller-${seller}`}
                className="cursor-pointer text-sm"
              >
                {seller}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" className="w-full">
            Filtros
            {activeFiltersCount > 0 && (
              <Badge className="ml-2" variant="secondary">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80 overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Filtros</SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            <FilterContent />
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div className="w-64 rounded-lg border bg-white p-4">
      <FilterContent />
    </div>
  );
}
