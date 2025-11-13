import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { brandOptionsMap, categoryOptionsMap } from "@/config";
import { Badge } from "../ui/badge";
import { ShoppingCart, Eye, Zap } from "lucide-react";

function ShoppingProductTile({
  product,
  handleGetProductDetails,
  handleAddtoCart,
}) {
  return (
    <Card className="w-full max-w-sm mx-auto group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-border/50 bg-card/50 backdrop-blur-sm">
      <div onClick={() => handleGetProductDetails(product?._id)} className="relative">
        {/* Image Container */}
        <div className="relative overflow-hidden rounded-t-lg bg-gradient-to-br from-muted/50 to-muted/20">
          <img
            src={product?.image}
            alt={product?.title}
            className="w-full h-[280px] object-cover transition-all duration-500 group-hover:scale-105"
          />
          
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
            <Button 
              variant="secondary" 
              size="sm" 
              className="bg-background/90 backdrop-blur-sm border border-border hover:bg-accent hover:text-accent-foreground transition-all duration-200"
            >
              <Eye className="w-4 h-4 mr-2" />
              Quick View
            </Button>
          </div>

          {/* Status Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product?.totalStock === 0 ? (
              <Badge variant="destructive" className="px-3 py-1 font-semibold shadow-lg animate-pulse">
                Out Of Stock
              </Badge>
            ) : product?.totalStock < 10 ? (
              <Badge className="bg-amber-500 hover:bg-amber-600 text-white px-3 py-1 font-semibold shadow-lg">
                <Zap className="w-3 h-3 mr-1" />
                {`Only ${product?.totalStock} left`}
              </Badge>
            ) : product?.salePrice > 0 ? (
              <Badge className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white px-3 py-1 font-semibold shadow-lg">
                🔥 Sale
              </Badge>
            ) : null}
          </div>
        </div>

        <CardContent className="p-5 space-y-3">
          {/* Title */}
          <h2 className="text-lg font-bold text-foreground line-clamp-2 leading-tight group-hover:text-primary transition-colors duration-200">
            {product?.title}
          </h2>

          {/* Category and Brand */}
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground bg-muted/50 px-2 py-1 rounded-md border border-border">
              {categoryOptionsMap[product?.category]}
            </span>
            <span className="text-sm text-muted-foreground bg-muted/50 px-2 py-1 rounded-md border border-border">
              {brandOptionsMap[product?.brand]}
            </span>
          </div>

          {/* Price Section */}
          <div className="flex items-center gap-2 pt-2">
            <span
              className={`${
                product?.salePrice > 0 
                  ? "line-through text-muted-foreground text-sm" 
                  : "text-xl font-bold text-foreground"
              } transition-all duration-200`}
            >
              ${product?.price}
            </span>
            {product?.salePrice > 0 && (
              <>
                <span className="text-xl font-bold text-primary bg-primary/10 px-2 py-1 rounded-md border border-primary/20">
                  ${product?.salePrice}
                </span>
                <Badge variant="outline" className="text-xs text-green-600 border-green-500/50 bg-green-500/10">
                  Save ${(product?.price - product?.salePrice).toFixed(2)}
                </Badge>
              </>
            )}
          </div>
        </CardContent>
      </div>

      {/* Add to Cart Footer */}
      <CardFooter className="p-5 pt-0">
        {product?.totalStock === 0 ? (
          <Button 
            variant="outline" 
            className="w-full opacity-60 cursor-not-allowed border-border text-muted-foreground"
            disabled
          >
            <ShoppingCart className="w-4 h-4 mr-2 opacity-50" />
            Out Of Stock
          </Button>
        ) : (
          <Button
            onClick={(e) => {
              e.stopPropagation();
              handleAddtoCart(product?._id, product?.totalStock);
            }}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2.5 transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] border border-primary/20"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Add to Cart
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export default ShoppingProductTile;