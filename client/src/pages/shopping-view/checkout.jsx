import Address from "@/components/shopping-view/address";
import img from "../../assets/account.jpg";
import { useDispatch, useSelector } from "react-redux";
import UserCartItemsContent from "@/components/shopping-view/cart-items-content";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { createNewOrder, clearPaymentData } from "@/store/shop/order-slice";
import { useToast } from "@/components/ui/use-toast";

function ShoppingCheckout() {
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const { paymentUrl, paymentData, isLoading } = useSelector((state) => state.shopOrder);
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
  const [isPaymentStart, setIsPaymentStart] = useState(false);
  const dispatch = useDispatch();
  const { toast } = useToast();

  const totalCartAmount =
    cartItems && cartItems.items && cartItems.items.length > 0
      ? cartItems.items.reduce(
          (sum, currentItem) =>
            sum +
            (currentItem?.salePrice > 0
              ? currentItem?.salePrice
              : currentItem?.price) *
              currentItem?.quantity,
          0
        )
      : 0;

  // Function to submit eSewa form programmatically
  const submitEsewaForm = (paymentData) => {
    console.log("Submitting eSewa form with data:", paymentData);
    
    // Create a form element
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = paymentData.paymentUrl || 'https://rc-epay.esewa.com.np/api/epay/main/v2/form';
    
    // Add all payment data as hidden inputs
    Object.keys(paymentData).forEach(key => {
      if (paymentData[key] !== undefined && paymentData[key] !== null) {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = paymentData[key];
        form.appendChild(input);
      }
    });
    
    // Add the form to the body and submit it
    document.body.appendChild(form);
    console.log("Submitting form to:", form.action);
    form.submit();
  };

  // Handle auto-redirect when payment data is available
  useEffect(() => {
    if (paymentData && Object.keys(paymentData).length > 0) {
      console.log("Payment data available, submitting form...");
      submitEsewaForm(paymentData);
    } else if (paymentUrl) {
      console.log("Payment URL available, redirecting...");
      window.location.href = paymentUrl;
    }
  }, [paymentData, paymentUrl]);

  function handleInitiatePayment() {
    if (!cartItems || cartItems.length === 0) {
      toast({
        title: "Your cart is empty. Please add items to proceed",
        variant: "destructive",
      });
      return;
    }
    if (currentSelectedAddress === null) {
      toast({
        title: "Please select one address to proceed.",
        variant: "destructive",
      });
      return;
    }

    const orderData = {
      userId: user?.id,
      cartId: cartItems?._id,
      cartItems: cartItems.items.map((singleCartItem) => ({
        productId: singleCartItem?.productId,
        title: singleCartItem?.title,
        image: singleCartItem?.image,
        price:
          singleCartItem?.salePrice > 0
            ? singleCartItem?.salePrice
            : singleCartItem?.price,
        quantity: singleCartItem?.quantity,
      })),
      addressInfo: {
        addressId: currentSelectedAddress?._id,
        address: currentSelectedAddress?.address,
        city: currentSelectedAddress?.city,
        pincode: currentSelectedAddress?.pincode,
        phone: currentSelectedAddress?.phone,
        notes: currentSelectedAddress?.notes,
      },
      orderStatus: "pending",
      paymentMethod: "esewa",
      paymentStatus: "pending",
      totalAmount: totalCartAmount,
      orderDate: new Date(),
      orderUpdateDate: new Date(),
      paymentId: "",
      payerId: "",
    };

    console.log("Creating order with data:", orderData);
    setIsPaymentStart(true);
    
    // Clear any previous payment data
    dispatch(clearPaymentData());
    
    dispatch(createNewOrder(orderData)).then((data) => {
      console.log("Order creation response:", data);
      if (data?.payload?.success) {
        console.log("Order created successfully, waiting for auto-redirect...");
        // The useEffect will handle the redirect automatically
      } else {
        setIsPaymentStart(false);
        toast({
          title: "Failed to create order",
          description: data?.payload?.message || "Please try again",
          variant: "destructive",
        });
      }
    }).catch((error) => {
      console.error("Order creation error:", error);
      setIsPaymentStart(false);
      toast({
        title: "Payment failed to initiate",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    });
  }

  return (
    <div className="flex flex-col">
      <div className="relative h-[300px] w-full overflow-hidden">
        <img src={img} className="h-full w-full object-cover object-center" alt="Checkout Banner" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5 p-5">
        <Address
          selectedId={currentSelectedAddress}
          setCurrentSelectedAddress={setCurrentSelectedAddress}
        />
        <div className="flex flex-col gap-4">
          {cartItems && cartItems.items && cartItems.items.length > 0
            ? cartItems.items.map((item) => (
                <UserCartItemsContent key={item.productId} cartItem={item} />
              ))
            : (
              <div className="text-center text-muted-foreground py-8">
                Your cart is empty
              </div>
            )}

          {cartItems && cartItems.items && cartItems.items.length > 0 && (
            <>
              <div className="mt-8 space-y-4">
                <div className="flex justify-between">
                  <span className="font-bold">Total</span>
                  <span className="font-bold">${totalCartAmount.toFixed(2)}</span>
                </div>
              </div>
              <div className="mt-4 w-full">
                <Button 
                  onClick={handleInitiatePayment} 
                  className="w-full"
                  disabled={isPaymentStart || isLoading}
                >
                  {isPaymentStart || isLoading
                    ? "Processing eSewa Payment..."
                    : "Checkout with eSewa"}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ShoppingCheckout;