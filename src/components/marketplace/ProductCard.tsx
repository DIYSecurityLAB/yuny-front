import { Star, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  id: string;
  image: string;
  name: string;
  price: number;
  originalPrice?: number;
  storeName: string;
  rating: number;
  reviewCount: number;
  isFreeShipping?: boolean;
  onAddToCart?: () => void;
  onClick?: () => void;
}

export function ProductCard({
  image,
  name,
  price,
  originalPrice,
  storeName,
  rating,
  reviewCount,
  isFreeShipping,
  onAddToCart,
  onClick,
}: ProductCardProps) {
  const discount = originalPrice
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  return (
    <Card
      className="group cursor-pointer overflow-hidden transition-all hover:shadow-lg"
      onClick={onClick}
    >
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
        />
        {discount > 0 && (
          <Badge className="absolute left-2 top-2 bg-red-500">
            -{discount}%
          </Badge>
        )}
        {isFreeShipping && (
          <Badge className="absolute right-2 top-2 bg-green-500">
            Frete Grátis
          </Badge>
        )}
      </div>

      <CardContent className="p-4">
        <h3 className="mb-2 line-clamp-2 min-h-[2.5rem] text-sm font-medium text-gray-900">
          {name}
        </h3>

        <div className="mb-2 flex items-center gap-1 text-sm text-gray-600">
          <span>{storeName}</span>
        </div>

        <div className="mb-3 flex items-center gap-1">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "fill-gray-200 text-gray-200"
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500">({reviewCount})</span>
        </div>

        <div className="flex flex-col gap-1">
          {originalPrice && (
            <span className="text-xs text-gray-500 line-through">
              R$ {originalPrice.toFixed(2)}
            </span>
          )}
          <span className="text-2xl font-bold text-green-600">
            R$ {price.toFixed(2)}
          </span>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart?.();
          }}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Adicionar ao Carrinho
        </Button>
      </CardFooter>
    </Card>
  );
}
