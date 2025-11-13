import { Minus, Plus, Trash } from "lucide-react";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { deleteCartItem, updateCartQuantity } from "@/store/shop/cart-slice";
import { useToast } from "../ui/use-toast";

function UserCartItemsContent({ cartItem }) {
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { productList } = useSelector((state) => state.shopProducts);
  const dispatch = useDispatch();
  const { toast } = useToast();

  function handleUpdateQuantity(getCartItem, typeOfAction) {
    if (typeOfAction == "plus") {
      let getCartItems = cartItems.items || [];

      if (getCartItems.length) {
        const indexOfCurrentCartItem = getCartItems.findIndex(
          (item) => item.productId === getCartItem?.productId
        );

        const getCurrentProductIndex = productList.findIndex(
          (product) => product._id === getCartItem?.productId
        );
        const getTotalStock = productList[getCurrentProductIndex].totalStock;

        if (indexOfCurrentCartItem > -1) {
          const getQuantity = getCartItems[indexOfCurrentCartItem].quantity;
          if (getQuantity + 1 > getTotalStock) {
            toast({
              title: `Only ${getQuantity} quantity can be added for this item`,
              variant: "destructive",
            });
            return;
          }
        }
      }
    }

    dispatch(
      updateCartQuantity({
        userId: user?.id,
        productId: getCartItem?.productId,
        quantity:
          typeOfAction === "plus"
            ? getCartItem?.quantity + 1
            : getCartItem?.quantity - 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: "Cart item updated successfully",
        });
      }
    });
  }

  function handleCartItemDelete(getCartItem) {
    dispatch(
      deleteCartItem({ userId: user?.id, productId: getCartItem?.productId })
    ).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: "Item removed from cart",
        });
      }
    });
  }

  const itemPrice = cartItem?.salePrice > 0 ? cartItem?.salePrice : cartItem?.price;
  const totalPrice = (itemPrice * cartItem?.quantity).toFixed(2);

  return (
    <div className="flex items-center space-x-4 p-4 bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300">
      <img
        src={cartItem?.image}
        alt={cartItem?.title}
        className="w-16 h-16 rounded-xl object-cover border border-gray-200"
      />
      <div className="flex-1 space-y-2">
        <h3 className="font-bold text-gray-900 text-sm leading-tight">
          {cartItem?.title}
        </h3>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-2 py-1">
            <Button
              variant="ghost"
              className="h-7 w-7 rounded-lg hover:bg-gray-200 transition-colors"
              size="icon"
              disabled={cartItem?.quantity === 1}
              onClick={() => handleUpdateQuantity(cartItem, "minus")}
            >
              <Minus className="w-3 h-3" />
            </Button>
            <span className="font-semibold text-gray-900 min-w-6 text-center">
              {cartItem?.quantity}
            </span>
            <Button
              variant="ghost"
              className="h-7 w-7 rounded-lg hover:bg-gray-200 transition-colors"
              size="icon"
              onClick={() => handleUpdateQuantity(cartItem, "plus")}
            >
              <Plus className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-end space-y-2">
        <p className="font-bold text-orange-600 text-lg">
          ${totalPrice}
        </p>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleCartItemDelete(cartItem)}
          className="h-8 w-8 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <Trash className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

export default UserCartItemsContent;