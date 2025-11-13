import { useState } from "react";
import CommonForm from "../common/form";
import { DialogContent } from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrdersForAdmin,
  getOrderDetailsForAdmin,
  updateOrderStatus,
} from "@/store/admin/order-slice";
import { useToast } from "../ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Package, Truck, MapPin, CreditCard, Calendar, User, FileText } from "lucide-react";

const initialFormData = {
  status: "",
};

function AdminOrderDetailsView({ orderDetails }) {
  const [formData, setFormData] = useState(initialFormData);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { toast } = useToast();

  function handleUpdateStatus(event) {
    event.preventDefault();
    const { status } = formData;

    dispatch(
      updateOrderStatus({ id: orderDetails?._id, orderStatus: status })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(getOrderDetailsForAdmin(orderDetails?._id));
        dispatch(getAllOrdersForAdmin());
        setFormData(initialFormData);
        toast({
          title: "Order Status Updated",
          description: data?.payload?.message,
          className: "bg-green-50 border-green-200 text-green-800",
        });
      }
    });
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "delivered": return "bg-green-500 text-white";
      case "inShipping": return "bg-blue-500 text-white";
      case "inProcess": return "bg-orange-500 text-white";
      case "rejected": return "bg-red-500 text-white";
      case "pending": return "bg-gray-500 text-white";
      default: return "bg-gray-500 text-white";
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "completed": return "bg-green-500 text-white";
      case "pending": return "bg-orange-500 text-white";
      case "failed": return "bg-red-500 text-white";
      default: return "bg-gray-500 text-white";
    }
  };

  return (
    <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl">
      <div className="space-y-6 p-2">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-2xl font-black bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Order Details
          </h2>
          <p className="text-gray-600">Manage order information and status</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Order Info & Items */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Information Card */}
            <Card className="rounded-2xl shadow-lg border-0 bg-white">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-3 text-lg">
                  <div className="bg-gradient-to-r from-orange-500 to-orange-600 w-10 h-10 rounded-xl flex items-center justify-center">
                    <FileText className="h-5 w-5 text-white" />
                  </div>
                  <span>Order Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                    <FileText className="h-5 w-5 text-orange-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">Order ID</p>
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {orderDetails?._id}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                    <Calendar className="h-5 w-5 text-orange-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">Order Date</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {orderDetails?.orderDate?.split("T")[0]}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                    <CreditCard className="h-5 w-5 text-orange-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Amount</p>
                      <p className="text-lg font-bold text-orange-600">
                        ${orderDetails?.totalAmount}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                    <Truck className="h-5 w-5 text-orange-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">Payment Method</p>
                      <p className="text-sm font-semibold text-gray-900 capitalize">
                        {orderDetails?.paymentMethod}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <span className="text-sm font-medium text-gray-600">Payment Status</span>
                    <Badge className={`${getPaymentStatusColor(orderDetails?.paymentStatus)} px-3 py-1 rounded-full font-semibold`}>
                      {orderDetails?.paymentStatus}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <span className="text-sm font-medium text-gray-600">Order Status</span>
                    <Badge className={`${getStatusColor(orderDetails?.orderStatus)} px-3 py-1 rounded-full font-semibold`}>
                      {orderDetails?.orderStatus}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Items Card */}
            <Card className="rounded-2xl shadow-lg border-0 bg-white">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-3 text-lg">
                  <div className="bg-gradient-to-r from-orange-500 to-orange-600 w-10 h-10 rounded-xl flex items-center justify-center">
                    <Package className="h-5 w-5 text-white" />
                  </div>
                  <span>Order Items ({orderDetails?.cartItems?.length || 0})</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orderDetails?.cartItems && orderDetails?.cartItems.length > 0
                    ? orderDetails.cartItems.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                          <div className="flex items-center space-x-4">
                            {item.image && (
                              <img 
                                src={item.image} 
                                alt={item.title}
                                className="w-12 h-12 rounded-lg object-cover border border-gray-300"
                              />
                            )}
                            <div>
                              <p className="font-semibold text-gray-900">{item.title}</p>
                              <p className="text-sm text-gray-600">SKU: {item.productId}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-orange-600">${item.price}</p>
                            <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                            <p className="text-sm font-semibold text-gray-900">
                              Total: ${(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))
                    : (
                      <div className="text-center py-8 text-gray-500">
                        <Package className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                        <p>No items found</p>
                      </div>
                    )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Shipping & Status Update */}
          <div className="space-y-6">
            {/* Shipping Information Card */}
            <Card className="rounded-2xl shadow-lg border-0 bg-white">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-3 text-lg">
                  <div className="bg-gradient-to-r from-orange-500 to-orange-600 w-10 h-10 rounded-xl flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-white" />
                  </div>
                  <span>Shipping Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                  <User className="h-5 w-5 text-orange-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Customer</p>
                    <p className="text-sm font-semibold text-gray-900">{user.userName}</p>
                  </div>
                </div>
                
                <div className="space-y-3 text-sm">
                  <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
                    <p className="font-semibold text-blue-900 mb-2">Delivery Address</p>
                    <p className="text-blue-800">{orderDetails?.addressInfo?.address}</p>
                    <p className="text-blue-800">
                      {orderDetails?.addressInfo?.city}, {orderDetails?.addressInfo?.pincode}
                    </p>
                    <p className="text-blue-800">{orderDetails?.addressInfo?.phone}</p>
                    {orderDetails?.addressInfo?.notes && (
                      <p className="text-blue-800 mt-2">
                        <span className="font-semibold">Notes:</span> {orderDetails.addressInfo.notes}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Status Update Card */}
            <Card className="rounded-2xl shadow-lg border-0 bg-white">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-3 text-lg">
                  <div className="bg-gradient-to-r from-orange-500 to-orange-600 w-10 h-10 rounded-xl flex items-center justify-center">
                    <Truck className="h-5 w-5 text-white" />
                  </div>
                  <span>Update Status</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CommonForm
                  formControls={[
                    {
                      label: "Order Status",
                      name: "status",
                      componentType: "select",
                      options: [
                        { id: "pending", label: "🟡 Pending" },
                        { id: "inProcess", label: "🟠 In Process" },
                        { id: "inShipping", label: "🔵 In Shipping" },
                        { id: "delivered", label: "🟢 Delivered" },
                        { id: "rejected", label: "🔴 Rejected" },
                      ],
                    },
                  ]}
                  formData={formData}
                  setFormData={setFormData}
                  buttonText={"Update Order Status"}
                  onSubmit={handleUpdateStatus}
                  buttonClassName="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 rounded-xl shadow-lg transition-all duration-300"
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DialogContent>
  );
}

export default AdminOrderDetailsView;