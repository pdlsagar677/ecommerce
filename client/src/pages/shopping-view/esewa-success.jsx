import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { capturePayment } from "@/store/shop/order-slice";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle, XCircle, Clock, ArrowRight, Home, ShoppingBag } from "lucide-react";

function EsewaSuccessPage() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    let transactionId = params.get("transactionId");
    let orderId = params.get("orderId");

    console.log("eSewa Success Page - URL Params:", { transactionId, orderId });

    // If no orderId in URL, try to get it from session storage
    if (!orderId) {
      try {
        const storedOrderId = sessionStorage.getItem("currentOrderId");
        if (storedOrderId) {
          orderId = JSON.parse(storedOrderId);
          console.log("Retrieved orderId from session storage:", orderId);
        }
      } catch (error) {
        console.error("Error reading orderId from session storage:", error);
      }
    }

    // If we have eSewa data in the URL, parse it
    if (location.search.includes('data=')) {
      try {
        const dataParam = params.get('data');
        if (dataParam) {
          const decodedData = JSON.parse(atob(dataParam));
          console.log("Decoded eSewa data:", decodedData);
          
          transactionId = decodedData.transaction_uuid;
          // Extract orderId from transaction_uuid (format: ESEWA_ORDERID_TIMESTAMP)
          if (decodedData.transaction_uuid) {
            const parts = decodedData.transaction_uuid.split('_');
            if (parts.length >= 2) {
              orderId = parts[1]; // The second part is the orderId
              console.log("Extracted orderId from transaction_uuid:", orderId);
            }
          }
        }
      } catch (error) {
        console.error("Error parsing eSewa data:", error);
      }
    }

    console.log("Final values for capture:", { transactionId, orderId });

    if (transactionId && orderId) {
      // Clean the orderId - remove any query parameters
      const cleanOrderId = orderId.split('?')[0];
      console.log("Cleaned orderId:", cleanOrderId);

      dispatch(capturePayment({ 
        orderId: cleanOrderId, 
        transactionId, 
        paymentMethod: "esewa" 
      }))
        .then((data) => {
          console.log("Payment capture response:", data);
          if (data?.payload?.success) {
            setIsSuccess(true);
            setIsProcessing(false);
            
            // Clear session storage
            sessionStorage.removeItem("currentOrderId");
          } else {
            setErrorMessage(data?.payload?.message || "Payment capture failed");
            setIsSuccess(false);
            setIsProcessing(false);
          }
        })
        .catch((error) => {
          console.error("Payment capture error:", error);
          setErrorMessage(error.payload?.message || error.message || "Payment processing failed");
          setIsSuccess(false);
          setIsProcessing(false);
        });
    } else {
      console.error("Missing transactionId or orderId");
      setErrorMessage("Invalid payment response. Missing required parameters.");
      setIsProcessing(false);
      setIsSuccess(false);
    }
  }, [location, dispatch, navigate]);

  if (isProcessing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="p-8 max-w-md w-full rounded-2xl shadow-xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Clock className="h-10 w-10 text-white animate-pulse" />
            </div>
            <CardTitle className="text-2xl font-black bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Processing Payment
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="space-y-2">
              <p className="text-gray-600 font-medium">Please wait while we confirm your payment</p>
              <p className="text-sm text-gray-500">This may take a few moments...</p>
            </div>
            <div className="flex justify-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center p-4">
        <Card className="p-8 max-w-md w-full rounded-2xl shadow-xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <div className="bg-gradient-to-r from-red-500 to-orange-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <XCircle className="h-10 w-10 text-white" />
            </div>
            <CardTitle className="text-2xl font-black text-red-600">
              Payment Failed
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="space-y-3">
              <p className="text-gray-700 font-medium">{errorMessage}</p>
              <p className="text-sm text-gray-500">Please try again or contact support if the issue persists</p>
            </div>
            <div className="space-y-3">
              <Button 
                onClick={() => navigate("/shop/checkout")}
                className="w-full bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white font-semibold py-3 rounded-xl shadow-lg transition-all duration-300"
                size="lg"
              >
                Try Again
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button 
                onClick={() => navigate("/shop/home")}
                variant="outline"
                className="w-full border-2 border-gray-300 text-gray-700 hover:border-orange-500 hover:text-orange-600 font-semibold py-3 rounded-xl transition-all duration-300"
                size="lg"
              >
                <Home className="mr-2 h-4 w-4" />
                Continue Shopping
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <Card className="p-8 max-w-md w-full rounded-2xl shadow-xl border-0 bg-white/95 backdrop-blur-sm">
        <CardHeader className="text-center pb-6">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-10 w-10 text-white" />
          </div>
          <CardTitle className="text-2xl font-black text-green-600">
            Payment Successful!
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div className="space-y-3">
            <p className="text-gray-700 font-medium">Your payment has been confirmed successfully</p>
            <p className="text-sm text-gray-500">Thank you for your purchase! Your order is being processed.</p>
          </div>
          <div className="space-y-3">
            <Button 
              onClick={() => navigate("/shop/account")}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 rounded-xl shadow-lg transition-all duration-300"
              size="lg"
            >
              <ShoppingBag className="mr-2 h-4 w-4" />
              View My Orders
            </Button>
            <Button 
              onClick={() => navigate("/shop/home")}
              variant="outline"
              className="w-full border-2 border-gray-300 text-gray-700 hover:border-green-500 hover:text-green-600 font-semibold py-3 rounded-xl transition-all duration-300"
              size="lg"
            >
              <Home className="mr-2 h-4 w-4" />
              Continue Shopping
            </Button>
          </div>
          <div className="pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              A confirmation email has been sent to your registered email address
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default EsewaSuccessPage;