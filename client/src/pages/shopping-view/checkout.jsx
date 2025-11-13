import Address from "@/components/shopping-view/address";
import img from "../../assets/account.jpg";
import { useDispatch, useSelector } from "react-redux";
import UserCartItemsContent from "@/components/shopping-view/cart-items-content";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { createNewOrder, clearPaymentData } from "@/store/shop/order-slice";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, CreditCard, Package, MapPin } from "lucide-react";

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
    
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = paymentData.paymentUrl || 'https://rc-epay.esewa.com.np/api/epay/main/v2/form';
    
    Object.keys(paymentData).forEach(key => {
      if (paymentData[key] !== undefined && paymentData[key] !== null) {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = paymentData[key];
        form.appendChild(input);
      }
    });
    
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
    
    dispatch(clearPaymentData());
    
    dispatch(createNewOrder(orderData)).then((data) => {
      console.log("Order creation response:", data);
      if (data?.payload?.success) {
        console.log("Order created successfully, waiting for auto-redirect...");
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
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Header */}
      <div className="relative h-64 w-full overflow-hidden">
        <img 
          src={img} 
          className="h-full w-full object-cover object-center" 
          alt="Checkout Banner" 
        />
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/90 to-orange-600/80"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl font-black mb-4">Checkout</h1>
            <p className="text-xl opacity-90">Complete your purchase securely</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 -mt-8 relative z-10">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left Column - Address & Items */}
          <div className="xl:col-span-2 space-y-6">
            {/* Address Section */}
            <Card className="rounded-2xl shadow-lg border-0 bg-white">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="bg-gradient-to-r from-orange-500 to-orange-600 w-10 h-10 rounded-xl flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Delivery Address</h2>
                    <p className="text-gray-600">Select your delivery address</p>
                  </div>
                </div>
                <Address
                  selectedId={currentSelectedAddress}
                  setCurrentSelectedAddress={setCurrentSelectedAddress}
                />
              </CardContent>
            </Card>

            {/* Order Items Section */}
            <Card className="rounded-2xl shadow-lg border-0 bg-white">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="bg-gradient-to-r from-orange-500 to-orange-600 w-10 h-10 rounded-xl flex items-center justify-center">
                    <Package className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Order Summary</h2>
                    <p className="text-gray-600">Review your items</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {cartItems && cartItems.items && cartItems.items.length > 0
                    ? cartItems.items.map((item) => (
                        <UserCartItemsContent key={item.productId} cartItem={item} />
                      ))
                    : (
                      <div className="text-center text-gray-500 py-8">
                        <Package className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                        <p>Your cart is empty</p>
                      </div>
                    )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Order Summary */}
          <div className="xl:col-span-1">
            <Card className="rounded-2xl shadow-lg border-0 bg-white sticky top-8">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="bg-gradient-to-r from-orange-500 to-orange-600 w-10 h-10 rounded-xl flex items-center justify-center">
                    <CreditCard className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Payment Summary</h2>
                    <p className="text-gray-600">Complete your payment</p>
                  </div>
                </div>

                {cartItems && cartItems.items && cartItems.items.length > 0 && (
                  <div className="space-y-6">
                    {/* Order Breakdown */}
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="text-gray-900">${totalCartAmount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Shipping</span>
                        <span className="text-green-600">Free</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Tax</span>
                        <span className="text-gray-900">$0.00</span>
                      </div>
                      <div className="border-t border-gray-200 pt-3">
                        <div className="flex justify-between text-lg font-bold">
                          <span>Total</span>
                          <span className="text-orange-600">${totalCartAmount.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Security Badge */}
                    <div className="flex items-center space-x-2 text-sm text-gray-600 bg-gray-50 rounded-xl p-3">
                      <Shield className="h-4 w-4 text-green-500" />
                      <span>Secure payment with eSewa</span>
                    </div>

                    {/* Checkout Button */}
                    <Button 
                      onClick={handleInitiatePayment} 
                      className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                      disabled={isPaymentStart || isLoading}
                      size="lg"
                    >
                      {isPaymentStart || isLoading ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Processing Payment...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <CreditCard className="h-5 w-5" />
                          <span>Pay with eSewa</span>
                        </div>
                      )}
                    </Button>

                    {/* Requirements */}
                    <div className="text-xs text-gray-500 text-center space-y-1">
                      <p>• Please select a delivery address</p>
                      <p>• You will be redirected to eSewa for payment</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShoppingCheckout;