import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { capturePayment } from "@/store/shop/order-slice";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

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
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="p-6 max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-center">Processing eSewa Payment...</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p>Please wait while we confirm your payment.</p>
            <div className="mt-4 animate-pulse">⏳</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="p-6 max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-red-600 text-center">Payment Failed!</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-muted-foreground mb-4">{errorMessage}</p>
            <div className="space-y-3">
              <Button 
                onClick={() => navigate("/shop/checkout")}
                className="w-full"
              >
                Try Again
              </Button>
              <Button 
                onClick={() => navigate("/shop/home")}
                variant="outline"
                className="w-full"
              >
                Continue Shopping
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="p-6 max-w-md w-full">
        <CardHeader>
          <CardTitle className="text-green-600 text-center">Payment Successful!</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="mb-4">Your payment has been confirmed successfully.</p>
          <div className="mt-4 mb-6 text-4xl">✅</div>
          <div className="space-y-3">
            <Button 
              onClick={() => navigate("/account/orders")}
              className="w-full"
            >
              View My Orders
            </Button>
            <Button 
              onClick={() => navigate("/shop/home")}
              variant="outline"
              className="w-full"
            >
              Continue Shopping
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default EsewaSuccessPage;