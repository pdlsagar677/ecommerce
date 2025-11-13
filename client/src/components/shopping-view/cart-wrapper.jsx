import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import UserCartItemsContent from "./cart-items-content";
import { ShoppingBag, ArrowRight, Sparkles } from "lucide-react";
import { Badge } from "../ui/badge";

function UserCartWrapper({ cartItems, setOpenCartSheet }) {
  const navigate = useNavigate();

  const totalCartAmount =
    cartItems && cartItems.length > 0
      ? cartItems.reduce(
          (sum, currentItem) =>
            sum +
            (currentItem?.salePrice > 0
              ? currentItem?.salePrice
              : currentItem?.price) *
              currentItem?.quantity,
          0
        )
      : 0;

  const totalItems = cartItems?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <SheetContent className="sm:max-w-lg w-full flex flex-col p-0 bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <SheetHeader className="p-6 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 w-10 h-10 rounded-xl flex items-center justify-center">
              <ShoppingBag className="h-5 w-5 text-white" />
            </div>
            <div>
              <SheetTitle className="text-xl font-black bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Shopping Cart
              </SheetTitle>
              <p className="text-sm text-gray-500 mt-1">
                {totalItems} item{totalItems !== 1 ? 's' : ''} in cart
              </p>
            </div>
          </div>
          <Badge className="bg-orange-500 text-white px-3 py-1 font-semibold">
            ${totalCartAmount.toFixed(2)}
          </Badge>
        </div>
      </SheetHeader>

      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {cartItems && cartItems.length > 0 ? (
          cartItems.map((item, index) => (
            <UserCartItemsContent 
              key={item.productId || `cart-item-${index}`}
              cartItem={item} 
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center py-16">
            <div className="bg-gradient-to-r from-gray-100 to-gray-200 w-20 h-20 rounded-2xl flex items-center justify-center mb-4">
              <ShoppingBag className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Your cart is empty
            </h3>
            <p className="text-gray-600 mb-6 max-w-sm">
              Looks like you haven't added any items to your cart yet. Start shopping to discover amazing products!
            </p>
            <Button
              onClick={() => setOpenCartSheet(false)}
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold"
            >
              Start Shopping
            </Button>
          </div>
        )}
      </div>

      {/* Footer - Checkout Section */}
      {cartItems && cartItems.length > 0 && (
        <div className="border-t border-gray-200 bg-white p-6 space-y-4">
          {/* Order Summary */}
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-semibold text-gray-900">${totalCartAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Shipping</span>
              <span className="text-green-600 font-semibold">Free</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Tax</span>
              <span className="font-semibold text-gray-900">${(totalCartAmount * 0.1).toFixed(2)}</span>
            </div>
            <div className="border-t border-gray-200 pt-3">
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total</span>
                <span className="text-orange-600">${(totalCartAmount * 1.1).toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <Sparkles className="h-3 w-3 text-green-500" />
              <span>Secure checkout</span>
            </div>
            <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
            <div className="flex items-center space-x-1">
              <Sparkles className="h-3 w-3 text-green-500" />
              <span>Free returns</span>
            </div>
          </div>

          {/* Checkout Button */}
          <Button
            onClick={() => {
              navigate("/shop/checkout");
              setOpenCartSheet(false);
            }}
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            size="lg"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>

          {/* Continue Shopping */}
          <Button
            variant="outline"
            onClick={() => setOpenCartSheet(false)}
            className="w-full border-2 border-gray-300 text-gray-700 hover:border-orange-500 hover:text-orange-600 transition-all duration-300 font-semibold"
          >
            Continue Shopping
          </Button>
        </div>
      )}
    </SheetContent>
  );
}

export default UserCartWrapper;