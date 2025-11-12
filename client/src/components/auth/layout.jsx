import { Outlet } from "react-router-dom";

function AuthLayout() {
  return (
    <div className="flex min-h-screen w-full bg-white">
      {/* Left Side - Premium Brand Experience */}
      <div className="hidden lg:flex items-center justify-center bg-gradient-to-br from-orange-500 to-orange-600 w-1/2 px-12 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-black bg-opacity-5"></div>
        
        {/* Floating Animation Elements */}
        <div className="absolute top-1/4 left-1/4 w-24 h-24 bg-white bg-opacity-10 rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-16 h-16 bg-white bg-opacity-15 rounded-full animate-bounce"></div>
        <div className="absolute top-1/3 right-1/3 w-20 h-20 bg-white bg-opacity-8 rounded-full animate-ping"></div>
        
        {/* Main Content */}
        <div className="max-w-md space-y-10 text-center text-white relative z-10">
          {/* Premium Logo/Brand */}
          <div className="space-y-6">
            <div className="relative inline-block">
              <div className="absolute -inset-4 bg-white bg-opacity-20 rounded-full blur-lg"></div>
              <h1 className="text-6xl font-black tracking-tighter relative">
                <span className="bg-gradient-to-r from-white to-orange-100 bg-clip-text text-transparent">
                  The Shopery
                </span>
              </h1>
            </div>
            <div className="space-y-2">
              <p className="text-2xl font-semibold opacity-95">
                Nepal's Premium Shopping Destination
              </p>
              <p className="text-orange-100 text-sm font-medium">
                Where Quality Meets Affordability
              </p>
            </div>
          </div>

          {/* Enhanced Features List */}
          <div className="space-y-6 pt-8">
            <div className="flex items-center space-x-5 text-left bg-white bg-opacity-10 p-4 rounded-2xl backdrop-blur-sm border border-white border-opacity-20">
              <div className="bg-white bg-opacity-20 p-3 rounded-xl shadow-lg">
                <span className="text-2xl">🚀</span>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">Lightning Fast Delivery</h3>
                <p className="text-sm opacity-90">Same-day delivery in Kathmandu Valley</p>
              </div>
            </div>

            <div className="flex items-center space-x-5 text-left bg-white bg-opacity-10 p-4 rounded-2xl backdrop-blur-sm border border-white border-opacity-20">
              <div className="bg-white bg-opacity-20 p-3 rounded-xl shadow-lg">
                <span className="text-2xl">🛡️</span>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">Bank-Grade Security</h3>
                <p className="text-sm opacity-90">Your data and payments are 100% protected</p>
              </div>
            </div>

            <div className="flex items-center space-x-5 text-left bg-white bg-opacity-10 p-4 rounded-2xl backdrop-blur-sm border border-white border-opacity-20">
              <div className="bg-white bg-opacity-20 p-3 rounded-xl shadow-lg">
                <span className="text-2xl">💎</span>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">Premium Quality</h3>
                <p className="text-sm opacity-90">Authentic products with quality guarantee</p>
              </div>
            </div>

            <div className="flex items-center space-x-5 text-left bg-white bg-opacity-10 p-4 rounded-2xl backdrop-blur-sm border border-white border-opacity-20">
              <div className="bg-white bg-opacity-20 p-3 rounded-xl shadow-lg">
                <span className="text-2xl">🎯</span>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">Best Price Guarantee</h3>
                <p className="text-sm opacity-90">Found cheaper? We'll match the price</p>
              </div>
            </div>
          </div>

          {/* Enhanced Trust Badges */}
          <div className="pt-8 border-t border-white border-opacity-20">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <p className="text-sm font-medium opacity-90">Live - Serving 15,000+ customers</p>
            </div>
            <div className="flex justify-center space-x-8 text-sm font-medium opacity-80">
              <span className="flex items-center space-x-1">
                <span className="text-green-400">✓</span>
                <span>100% Authentic</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="text-green-400">✓</span>
                <span>24/7 Support</span>
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-orange-600 to-transparent"></div>
      </div>

      {/* Right Side - Premium Auth Experience */}
      <div className="flex flex-1 items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          {/* Mobile Premium Header */}
          <div className="lg:hidden text-center mb-10">
            <div className="space-y-3">
              <div className="relative inline-block">
                <div className="absolute -inset-3 bg-orange-500 bg-opacity-10 rounded-full blur-md"></div>
                <h1 className="text-5xl font-black bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent relative">
                  The Shopery
                </h1>
              </div>
              <p className="text-gray-600 font-medium text-lg">
                Nepal's Premium Marketplace
              </p>
              <div className="w-20 h-1 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full mx-auto"></div>
            </div>
          </div>
          
          {/* Premium Auth Card */}
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 backdrop-blur-sm bg-opacity-95">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
                Welcome Back
              </div>
            </div>
            <Outlet />
          </div>
          
          {/* Mobile Premium Features */}
          <div className="lg:hidden mt-10">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-5 rounded-xl shadow-lg border border-gray-100 text-center group hover:shadow-xl transition-all duration-300">
                <div className="text-orange-500 text-2xl mb-3 group-hover:scale-110 transition-transform">🚀</div>
                <p className="text-sm font-semibold text-gray-800">Fast Delivery</p>
                <p className="text-xs text-gray-500 mt-1">Same-day in KTM</p>
              </div>
              <div className="bg-white p-5 rounded-xl shadow-lg border border-gray-100 text-center group hover:shadow-xl transition-all duration-300">
                <div className="text-orange-500 text-2xl mb-3 group-hover:scale-110 transition-transform">🛡️</div>
                <p className="text-sm font-semibold text-gray-800">Secure</p>
                <p className="text-xs text-gray-500 mt-1">100% Protected</p>
              </div>
              <div className="bg-white p-5 rounded-xl shadow-lg border border-gray-100 text-center group hover:shadow-xl transition-all duration-300">
                <div className="text-orange-500 text-2xl mb-3 group-hover:scale-110 transition-transform">💎</div>
                <p className="text-sm font-semibold text-gray-800">Premium</p>
                <p className="text-xs text-gray-500 mt-1">Quality Guaranteed</p>
              </div>
              <div className="bg-white p-5 rounded-xl shadow-lg border border-gray-100 text-center group hover:shadow-xl transition-all duration-300">
                <div className="text-orange-500 text-2xl mb-3 group-hover:scale-110 transition-transform">🎯</div>
                <p className="text-sm font-semibold text-gray-800">Best Price</p>
                <p className="text-xs text-gray-500 mt-1">Price Match</p>
              </div>
            </div>
            
            {/* Mobile Trust Badge */}
            <div className="mt-6 text-center">
              <div className="inline-flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-medium text-gray-600">Trusted by 15K+ customers</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;