import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import accImg from "../../assets/account.jpg";
import Address from "@/components/shopping-view/address";
import ShoppingOrders from "@/components/shopping-view/orders";
import { User, Settings, Heart, Shield, LogOut, Mail, Phone, MapPin } from "lucide-react";
import { useSelector } from "react-redux";

function ShoppingAccount() {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Header */}
      <div className="relative h-64 w-full overflow-hidden">
        <img
          src={accImg}
          className="h-full w-full object-cover object-center"
          alt="Account background"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/90 to-orange-600/80"></div>
        
        {/* User Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <div className="flex items-center space-x-6">
                <div className="bg-gradient-to-r from-white to-orange-100 w-20 h-20 rounded-2xl flex items-center justify-center shadow-2xl border-4 border-white">
                  <User className="h-10 w-10 text-orange-600" />
                </div>
                <div className="text-white">
                  <h1 className="text-3xl font-black mb-2">
                    Welcome back, {user?.userName || 'User'}!
                  </h1>
                  <p className="text-orange-100 text-lg opacity-90">
                    Manage your orders, addresses, and account settings
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Button 
                  variant="outline" 
className="border-2 border-white text-white bg-white/15 backdrop-blur-sm hover:bg-white/25 font-semibold shadow-lg hover:shadow-xl transition-all duration-300">                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
                <Button 
                  variant="outline" 
className="border-2 border-white text-white bg-white/15 backdrop-blur-sm hover:bg-white/25 font-semibold shadow-lg hover:shadow-xl transition-all duration-300">                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 -mt-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <CardContent className="p-6">
                {/* Quick Stats */}
                <div className="space-y-6">
                  <div className="text-center pb-6 border-b border-gray-100">
                    <div className="bg-gradient-to-r from-orange-500 to-orange-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <User className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg">{user?.userName || 'User'}</h3>
                    <p className="text-gray-600 text-sm">{user?.email}</p>
                    <div className="mt-3 inline-flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                      <Shield className="h-3 w-3 mr-1" />
                      Verified Account
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">
                      Quick Actions
                    </h4>
                    <Button variant="ghost" className="w-full justify-start text-gray-700 hover:text-orange-600 hover:bg-orange-50">
                      <Heart className="h-4 w-4 mr-3" />
                      Wishlist
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-gray-700 hover:text-orange-600 hover:bg-orange-50">
                      <Settings className="h-4 w-4 mr-3" />
                      Account Settings
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-gray-700 hover:text-orange-600 hover:bg-orange-50">
                      <Shield className="h-4 w-4 mr-3" />
                      Privacy & Security
                    </Button>
                  </div>

                  {/* Contact Info */}
                  <div className="pt-6 border-t border-gray-100">
                    <h4 className="font-semibold text-gray-900 text-sm uppercase tracking-wide mb-3">
                      Contact Info
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center text-gray-600">
                        <Mail className="h-4 w-4 mr-2 text-orange-500" />
                        {user?.email}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Phone className="h-4 w-4 mr-2 text-orange-500" />
                        +977 98XXXXXXX
                      </div>
                      <div className="flex items-center text-gray-600">
                        <MapPin className="h-4 w-4 mr-2 text-orange-500" />
                        Kathmandu, Nepal
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <Card className="rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <CardContent className="p-0">
                <Tabs defaultValue="orders" className="w-full">
                  <div className="border-b border-gray-200">
                    <TabsList className="w-full justify-start p-6 pb-0 bg-transparent h-auto">
                      <TabsTrigger 
                        value="orders" 
                        className="data-[state=active]:bg-orange-500 data-[state=active]:text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200"
                      >
                        <div className="flex items-center space-x-2">
                          <div className="bg-orange-100 p-1 rounded-lg">
                            <User className="h-4 w-4 text-orange-600" />
                          </div>
                          <span>My Orders</span>
                        </div>
                      </TabsTrigger>
                      <TabsTrigger 
                        value="address" 
                        className="data-[state=active]:bg-orange-500 data-[state=active]:text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200"
                      >
                        <div className="flex items-center space-x-2">
                          <div className="bg-orange-100 p-1 rounded-lg">
                            <MapPin className="h-4 w-4 text-orange-600" />
                          </div>
                          <span>Address Book</span>
                        </div>
                      </TabsTrigger>
                      <TabsTrigger 
                        value="profile" 
                        className="data-[state=active]:bg-orange-500 data-[state=active]:text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200"
                      >
                        <div className="flex items-center space-x-2">
                          <div className="bg-orange-100 p-1 rounded-lg">
                            <Settings className="h-4 w-4 text-orange-600" />
                          </div>
                          <span>Profile Settings</span>
                        </div>
                      </TabsTrigger>
                    </TabsList>
                  </div>
                  
                  <div className="p-6">
                    <TabsContent value="orders" className="mt-0">
                      <div className="space-y-1 mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Order History</h2>
                        <p className="text-gray-600">View and manage your recent orders</p>
                      </div>
                      <ShoppingOrders />
                    </TabsContent>
                    
                    <TabsContent value="address" className="mt-0">
                      <div className="space-y-1 mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Address Book</h2>
                        <p className="text-gray-600">Manage your delivery addresses</p>
                      </div>
                      <Address />
                    </TabsContent>
                    
                    <TabsContent value="profile" className="mt-0">
                      <div className="space-y-1 mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Profile Settings</h2>
                        <p className="text-gray-600">Update your personal information and preferences</p>
                      </div>
                      <div className="text-center py-12">
                        <div className="bg-gradient-to-r from-orange-100 to-amber-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                          <Settings className="h-10 w-10 text-orange-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Profile Settings</h3>
                        <p className="text-gray-600 mb-6">This section is coming soon with more customization options</p>
                        <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700">
                          Notify Me When Ready
                        </Button>
                      </div>
                    </TabsContent>
                  </div>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Additional Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card className="rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <CardContent className="p-6 text-center">
              <div className="bg-blue-100 w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Heart className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Wishlist</h3>
              <p className="text-gray-600 text-sm mb-4">Save items you love for later</p>
              <Button variant="outline" size="sm" className="w-full">
                View Wishlist
              </Button>
            </CardContent>
          </Card>
          
          <Card className="rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <CardContent className="p-6 text-center">
              <div className="bg-green-100 w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Security</h3>
              <p className="text-gray-600 text-sm mb-4">Manage your account security</p>
              <Button variant="outline" size="sm" className="w-full">
                Security Settings
              </Button>
            </CardContent>
          </Card>
          
          <Card className="rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <CardContent className="p-6 text-center">
              <div className="bg-purple-100 w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <User className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Support</h3>
              <p className="text-gray-600 text-sm mb-4">Need help? Contact our support</p>
              <Button variant="outline" size="sm" className="w-full">
                Get Help
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default ShoppingAccount;