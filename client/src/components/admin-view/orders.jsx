import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Dialog } from "../ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import AdminOrderDetailsView from "./order-details";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrdersForAdmin,
  getOrderDetailsForAdmin,
  resetOrderDetails,
} from "@/store/admin/order-slice";
import { Badge } from "../ui/badge";
import { Eye, Package, Search, Download, Smartphone, Tablet, Monitor } from "lucide-react";
import { Input } from "../ui/input";

function AdminOrdersView() {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState("table"); // 'table' or 'grid'
  const { orderList, orderDetails } = useSelector((state) => state.adminOrder);
  const dispatch = useDispatch();

  function handleFetchOrderDetails(getId) {
    dispatch(getOrderDetailsForAdmin(getId));
  }

  useEffect(() => {
    dispatch(getAllOrdersForAdmin());
  }, [dispatch]);

  useEffect(() => {
    if (orderDetails !== null) setOpenDetailsDialog(true);
  }, [orderDetails]);

  // Filter orders based on search and status
  const filteredOrders = orderList?.filter(order => {
    const matchesSearch = order._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.paymentMethod?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.orderStatus === statusFilter;
    
    return matchesSearch && matchesStatus;
  }) || [];

  const getStatusColor = (status) => {
    switch (status) {
      case "delivered": return "bg-green-500 text-white";
      case "inShipping": return "bg-blue-500 text-white";
      case "inProcess": return "bg-orange-500 text-white";
      case "rejected": return "bg-red-500 text-white";
      case "pending": return "bg-gray-500 text-white";
      case "confirmed": return "bg-green-500 text-white";
      default: return "bg-gray-500 text-white";
    }
  };

  const statusOptions = [
    { id: "all", label: "All Status" },
    { id: "pending", label: "Pending" },
    { id: "confirmed", label: "Confirmed" },
    { id: "inProcess", label: "In Process" },
    { id: "inShipping", label: "In Shipping" },
    { id: "delivered", label: "Delivered" },
    { id: "rejected", label: "Rejected" },
  ];

  // Mobile Order Card Component
  const OrderCard = ({ order }) => (
    <Card className="rounded-2xl shadow-lg border-0 bg-white mb-4">
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <Package className="h-4 w-4 text-orange-500" />
                <span className="text-xs font-medium text-gray-500">Order ID</span>
              </div>
              <p className="text-sm font-semibold text-gray-900 truncate" title={order._id}>
                {order._id}
              </p>
            </div>
            <Badge className={`${getStatusColor(order?.orderStatus)} px-2 py-1 text-xs`}>
              {order?.orderStatus}
            </Badge>
          </div>

          {/* Customer Info */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-xs text-gray-500">Customer</p>
              <p className="font-medium text-gray-900 truncate">
                {order.userId?.userName || 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Date</p>
              <p className="font-medium text-gray-900">
                {order?.orderDate?.split("T")[0]}
              </p>
            </div>
          </div>

          {/* Payment & Amount */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-xs text-gray-500">Payment</p>
              <Badge variant="outline" className="text-xs border-gray-300 text-gray-700 capitalize">
                {order?.paymentMethod}
              </Badge>
            </div>
            <div>
              <p className="text-xs text-gray-500">Amount</p>
              <p className="font-semibold text-orange-600">${order?.totalAmount}</p>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-2 border-t border-gray-200">
            <Dialog
              open={openDetailsDialog}
              onOpenChange={() => {
                setOpenDetailsDialog(false);
                dispatch(resetOrderDetails());
              }}
            >
              <Button
                onClick={() => handleFetchOrderDetails(order?._id)}
                variant="outline"
                size="sm"
                className="w-full border-2 border-gray-300 text-gray-700 hover:border-orange-500 hover:text-orange-600 transition-all duration-300"
              >
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </Button>
              <AdminOrderDetailsView orderDetails={orderDetails} />
            </Dialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Order Management
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Manage and track all customer orders
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          {/* View Mode Toggle - Hidden on mobile */}
          <div className="hidden sm:flex items-center bg-gray-100 p-1 rounded-xl">
            <Button
              variant={viewMode === "table" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("table")}
              className={`${
                viewMode === "table" 
                  ? "bg-white shadow-sm text-orange-600" 
                  : "text-gray-600 hover:text-orange-600"
              } transition-colors`}
            >
              <Monitor className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className={`${
                viewMode === "grid" 
                  ? "bg-white shadow-sm text-orange-600" 
                  : "text-gray-600 hover:text-orange-600"
              } transition-colors`}
            >
              <Smartphone className="h-4 w-4" />
            </Button>
          </div>
          
          <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base">
            <Download className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Export Orders</span>
            <span className="sm:hidden">Export</span>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        <Card className="rounded-2xl shadow-lg border-0 bg-white">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">Total</p>
                <p className="text-xl sm:text-3xl font-bold text-gray-900 mt-1">{orderList?.length || 0}</p>
              </div>
              <div className="bg-orange-100 p-2 sm:p-3 rounded-xl">
                <Package className="h-4 w-4 sm:h-6 sm:w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="rounded-2xl shadow-lg border-0 bg-white">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">Pending</p>
                <p className="text-xl sm:text-3xl font-bold text-gray-900 mt-1">
                  {orderList?.filter(order => order.orderStatus === "pending").length || 0}
                </p>
              </div>
              <div className="bg-yellow-100 p-2 sm:p-3 rounded-xl">
                <Package className="h-4 w-4 sm:h-6 sm:w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="rounded-2xl shadow-lg border-0 bg-white">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">Processing</p>
                <p className="text-xl sm:text-3xl font-bold text-gray-900 mt-1">
                  {orderList?.filter(order => order.orderStatus === "inProcess").length || 0}
                </p>
              </div>
              <div className="bg-blue-100 p-2 sm:p-3 rounded-xl">
                <Package className="h-4 w-4 sm:h-6 sm:w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="rounded-2xl shadow-lg border-0 bg-white">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">Delivered</p>
                <p className="text-xl sm:text-3xl font-bold text-gray-900 mt-1">
                  {orderList?.filter(order => order.orderStatus === "delivered").length || 0}
                </p>
              </div>
              <div className="bg-green-100 p-2 sm:p-3 rounded-xl">
                <Package className="h-4 w-4 sm:h-6 sm:w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters Section */}
      <Card className="rounded-2xl shadow-lg border-0 bg-white">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              {/* Search Input */}
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border-2 border-gray-300 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-200 text-sm sm:text-base"
                />
              </div>

              {/* Status Filter */}
              <div className="w-full sm:w-48">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-200 bg-white text-sm sm:text-base"
                >
                  {statusOptions.map(option => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="text-sm text-gray-500">
                Showing {filteredOrders.length} of {orderList?.length || 0} orders
              </div>
              
              {/* Mobile View Mode Toggle */}
              <div className="sm:hidden flex items-center bg-gray-100 p-1 rounded-xl self-start">
                <Button
                  variant={viewMode === "table" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("table")}
                  className={`${
                    viewMode === "table" 
                      ? "bg-white shadow-sm text-orange-600" 
                      : "text-gray-600 hover:text-orange-600"
                  } transition-colors text-xs`}
                >
                  List
                </Button>
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className={`${
                    viewMode === "grid" 
                      ? "bg-white shadow-sm text-orange-600" 
                      : "text-gray-600 hover:text-orange-600"
                  } transition-colors text-xs`}
                >
                  Cards
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders Display */}
      {viewMode === "table" ? (
        /* Table View */
        <Card className="rounded-2xl shadow-lg border-0 bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center space-x-3 text-lg sm:text-xl">
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center">
                <Package className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
              <span>All Orders</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-xl border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50 hover:bg-gray-50">
                      <TableHead className="font-semibold text-gray-900 py-3 sm:py-4 text-xs sm:text-sm">Order ID</TableHead>
                      <TableHead className="font-semibold text-gray-900 py-3 sm:py-4 text-xs sm:text-sm hidden sm:table-cell">Date</TableHead>
                      <TableHead className="font-semibold text-gray-900 py-3 sm:py-4 text-xs sm:text-sm hidden lg:table-cell">Customer</TableHead>
                      <TableHead className="font-semibold text-gray-900 py-3 sm:py-4 text-xs sm:text-sm">Status</TableHead>
                      <TableHead className="font-semibold text-gray-900 py-3 sm:py-4 text-xs sm:text-sm">Amount</TableHead>
                      <TableHead className="font-semibold text-gray-900 py-3 sm:py-4 text-xs sm:text-sm text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.length > 0 ? (
                      filteredOrders.map((orderItem) => (
                        <TableRow key={orderItem._id} className="hover:bg-gray-50 transition-colors">
                          <TableCell className="font-medium text-gray-900 py-3 sm:py-4">
                            <div className="max-w-[100px] sm:max-w-[120px] truncate text-xs sm:text-sm" title={orderItem._id}>
                              {orderItem._id}
                            </div>
                          </TableCell>
                          <TableCell className="py-3 sm:py-4 text-xs sm:text-sm hidden sm:table-cell">
                            {orderItem?.orderDate?.split("T")[0]}
                          </TableCell>
                          <TableCell className="py-3 sm:py-4 text-xs sm:text-sm hidden lg:table-cell">
                            <div>
                              <div className="font-medium text-gray-900">{orderItem.userId?.userName || 'N/A'}</div>
                              <div className="text-gray-500 text-xs">{orderItem.userId?.email || 'N/A'}</div>
                            </div>
                          </TableCell>
                          <TableCell className="py-3 sm:py-4">
                            <Badge className={`${getStatusColor(orderItem?.orderStatus)} px-2 sm:px-3 py-1 rounded-full font-semibold text-xs`}>
                              {orderItem?.orderStatus}
                            </Badge>
                          </TableCell>
                          <TableCell className="py-3 sm:py-4">
                            <div className="font-semibold text-orange-600 text-sm sm:text-base">${orderItem?.totalAmount}</div>
                          </TableCell>
                          <TableCell className="py-3 sm:py-4 text-right">
                            <Dialog
                              open={openDetailsDialog}
                              onOpenChange={() => {
                                setOpenDetailsDialog(false);
                                dispatch(resetOrderDetails());
                              }}
                            >
                              <Button
                                onClick={() => handleFetchOrderDetails(orderItem?._id)}
                                variant="outline"
                                size="sm"
                                className="border-2 border-gray-300 text-gray-700 hover:border-orange-500 hover:text-orange-600 transition-all duration-300 text-xs"
                              >
                                <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                                <span className="hidden sm:inline">View</span>
                              </Button>
                              <AdminOrderDetailsView orderDetails={orderDetails} />
                            </Dialog>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 sm:py-12">
                          <div className="max-w-md mx-auto space-y-4">
                            <div className="bg-gradient-to-r from-gray-100 to-gray-200 w-12 h-12 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mx-auto">
                              <Package className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" />
                            </div>
                            <div className="space-y-2">
                              <h3 className="text-lg sm:text-xl font-semibold text-gray-900">No orders found</h3>
                              <p className="text-gray-600 text-sm sm:text-base">
                                {searchTerm || statusFilter !== "all" 
                                  ? "Try adjusting your search or filter criteria" 
                                  : "No orders have been placed yet"
                                }
                              </p>
                            </div>
                            {(searchTerm || statusFilter !== "all") && (
                              <Button 
                                variant="outline"
                                onClick={() => {
                                  setSearchTerm("");
                                  setStatusFilter("all");
                                }}
                                className="border-orange-500 text-orange-600 hover:bg-orange-50 text-sm"
                              >
                                Clear Filters
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        /* Grid/Card View for Mobile */
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Orders</h3>
            <span className="text-sm text-gray-500">{filteredOrders.length} orders</span>
          </div>
          
          {filteredOrders.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {filteredOrders.map((orderItem) => (
                <OrderCard key={orderItem._id} order={orderItem} />
              ))}
            </div>
          ) : (
            <Card className="rounded-2xl shadow-lg border-0 bg-white">
              <CardContent className="p-6 text-center">
                <div className="max-w-md mx-auto space-y-4">
                  <div className="bg-gradient-to-r from-gray-100 to-gray-200 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto">
                    <Package className="h-8 w-8 text-gray-400" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-gray-900">No orders found</h3>
                    <p className="text-gray-600">
                      {searchTerm || statusFilter !== "all" 
                        ? "Try adjusting your search or filter criteria" 
                        : "No orders have been placed yet"
                      }
                    </p>
                  </div>
                  {(searchTerm || statusFilter !== "all") && (
                    <Button 
                      variant="outline"
                      onClick={() => {
                        setSearchTerm("");
                        setStatusFilter("all");
                      }}
                      className="border-orange-500 text-orange-600 hover:bg-orange-50"
                    >
                      Clear Filters
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}

export default AdminOrdersView;