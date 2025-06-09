
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Pin, PinOff, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ProductDetailsModal } from "./ProductDetailsModal";

interface ProductCardProps {
  product: any;
  isPinned: boolean;
  quantityInput: string;
  onTogglePin: (productId: number) => void;
  onQuantityChange: (productId: number, value: string) => void;
  onAddToCart: (product: any, quantity?: number) => void;
  onAddCustomQuantity: (product: any) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isPinned,
  quantityInput,
  onTogglePin,
  onQuantityChange,
  onAddToCart,
  onAddCustomQuantity
}) => {
  const { toast } = useToast();
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const handleQuantityInputChange = (value: string) => {
    // Allow decimal numbers
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      onQuantityChange(product.id, value);
    }
  };

  const handleAddCustomQuantity = () => {
    const quantity = parseFloat(quantityInput);
    
    if (quantityInput && !isNaN(quantity) && quantity > 0) {
      onAddCustomQuantity(product);
    } else {
      toast({
        title: "Invalid Quantity",
        description: "Please enter a valid quantity",
        variant: "destructive"
      });
    }
  };

  const handleQuickAdd = () => {
    const quantity = quantityInput && !isNaN(parseFloat(quantityInput)) ? parseFloat(quantityInput) : 1;
    onAddToCart(product, quantity);
  };

  return (
    <>
      <Card className={`hover:shadow-md transition-all duration-200 h-full ${
        isPinned 
          ? 'border-blue-300 bg-blue-50 dark:border-blue-600 dark:bg-blue-900/20' 
          : 'border-border bg-card'
      } relative`}>
        {/* Pin Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onTogglePin(product.id)}
          className="absolute top-1 right-1 h-5 w-5 p-0 z-10"
        >
          {isPinned ? 
            <Pin className="h-2.5 w-2.5 text-blue-600" /> : 
            <PinOff className="h-2.5 w-2.5 text-muted-foreground" />
          }
        </Button>

        {/* Details Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsDetailsOpen(true)}
          className="absolute top-1 right-7 h-5 w-5 p-0 z-10"
          title="View product details"
        >
          <Info className="h-2.5 w-2.5 text-muted-foreground hover:text-blue-600" />
        </Button>
        
        <CardContent className="p-2 h-full flex flex-col">
          <div className="flex-1 space-y-2">
            {/* Product Info */}
            <div className="space-y-0.5">
              <h3 className="font-medium text-card-foreground text-xs leading-tight line-clamp-2 min-h-[2rem] pr-12">
                {product.name}
              </h3>
              <p className="text-[10px] text-muted-foreground">SKU: {product.sku}</p>
            </div>
            
            {/* Price and Stock */}
            <div className="space-y-0.5">
              <div className="text-sm font-bold text-blue-600">
                PKR {product.price.toLocaleString()}
              </div>
              <div className="text-[10px] text-muted-foreground">
                {product.stock} {product.unit} available
              </div>
            </div>
          </div>

          {/* Actions - Always at bottom */}
          <div className="space-y-1.5 mt-auto">
            {/* Quantity Input */}
            <div className="flex items-center gap-1">
              <Input
                type="text"
                placeholder={`Qty (${product.unit})`}
                value={quantityInput}
                onChange={(e) => handleQuantityInputChange(e.target.value)}
                className="h-6 text-[10px] flex-1 bg-background border-input px-1"
                disabled={product.stock <= 0}
              />
              <Button
                onClick={handleAddCustomQuantity}
                className="h-6 w-6 p-0 bg-green-600 hover:bg-green-700 text-white flex-shrink-0"
                disabled={product.stock <= 0 || !quantityInput}
              >
                <Plus className="h-2.5 w-2.5" />
              </Button>
            </div>
            
            {/* Quick Add Button */}
            <Button
              onClick={handleQuickAdd}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white text-[10px] h-6"
              disabled={product.stock <= 0}
            >
              Quick Add ({quantityInput || '1'} {product.unit})
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Product Details Modal */}
      <ProductDetailsModal
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        product={product}
      />
    </>
  );
};
