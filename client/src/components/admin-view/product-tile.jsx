import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Edit, Trash2, Tag, Package } from "lucide-react";
import { Badge } from "../ui/badge";

function AdminProductTile({
  product,
  onEdit,
  onDelete,
  viewMode = "grid"
}) {
  return (
    <Card className="w-full max-w-sm mx-auto rounded-2xl shadow-lg border-0 bg-white hover:shadow-xl transition-all duration-300 group">
      <div className="relative overflow-hidden rounded-2xl">
        <img
          src={product?.image}
          alt={product?.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Stock Status Badge */}
        <div className="absolute top-3 left-3">
          <Badge className={`${
            product?.totalStock > 0 
              ? "bg-green-500 text-white" 
              : "bg-red-500 text-white"
          } font-semibold text-xs`}>
            {product?.totalStock > 0 ? `${product.totalStock} in stock` : 'Out of stock'}
          </Badge>
        </div>

        {/* Sale Badge */}
        {product?.salePrice > 0 && (
          <div className="absolute top-3 right-3">
            <Badge className="bg-orange-500 text-white font-semibold text-xs">
              <Tag className="h-3 w-3 mr-1" />
              Sale
            </Badge>
          </div>
        )}

        {/* Category Badge */}
        <div className="absolute bottom-3 left-3">
          <Badge variant="outline" className="bg-white/90 backdrop-blur-sm text-gray-700 border-gray-300 text-xs">
            <Package className="h-3 w-3 mr-1" />
            {product?.category}
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 leading-tight">
          {product?.title}
        </h2>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
          {product?.description}
        </p>

        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center space-x-2">
            <span className={`${
              product?.salePrice > 0 ? "line-through text-gray-400" : "text-orange-600"
            } text-lg font-bold`}>
              ${product?.price}
            </span>
            {product?.salePrice > 0 && (
              <span className="text-lg font-bold text-orange-600">${product?.salePrice}</span>
            )}
          </div>
          
          {/* Rating */}
          {product?.averageReview > 0 && (
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              <span className="text-sm text-gray-600 font-medium">{product.averageReview}</span>
            </div>
          )}
        </div>

        {/* Brand */}
        {product?.brand && (
          <div className="text-xs text-gray-500 font-medium">
            Brand: <span className="text-gray-700">{product.brand}</span>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="p-6 pt-0 flex justify-between items-center gap-2">
        <Button
          onClick={() => onEdit(product)}
          variant="outline"
          className="flex-1 border-2 border-gray-300 text-gray-700 hover:border-orange-500 hover:text-orange-600 transition-all duration-300 font-semibold"
          size="sm"
        >
          <Edit className="h-4 w-4 mr-2" />
          Edit
        </Button>
        <Button 
          onClick={() => onDelete(product?._id)}
          variant="outline"
          className="flex-1 border-2 border-red-300 text-red-600 hover:border-red-500 hover:bg-red-50 transition-all duration-300 font-semibold"
          size="sm"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}

export default AdminProductTile;