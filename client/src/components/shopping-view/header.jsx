import {  LogOut, Menu, ShoppingCart, UserCog, Search, Sparkles } from "lucide-react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { shoppingViewHeaderMenuItems } from "@/config";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { logoutUser } from "@/store/auth-slice";
import UserCartWrapper from "./cart-wrapper";
import { useEffect, useState } from "react";
import { fetchCartItems } from "@/store/shop/cart-slice";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";

function MenuItems({ isMobile = false }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");

  function handleNavigate(getCurrentMenuItem) {
    sessionStorage.removeItem("filters");
    const currentFilter =
      getCurrentMenuItem.id !== "home" &&
      getCurrentMenuItem.id !== "products" &&
      getCurrentMenuItem.id !== "search"
        ? {
            category: [getCurrentMenuItem.id],
          }
        : null;

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));

    location.pathname.includes("listing") && currentFilter !== null
      ? setSearchParams(
          new URLSearchParams(`?category=${getCurrentMenuItem.id}`)
        )
      : navigate(getCurrentMenuItem.path);
  }

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/shop/search?keyword=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <div className={`${isMobile ? 'space-y-6' : 'flex items-center space-x-8'}`}>
      {/* Search Bar - Only on desktop */}
      {!isMobile && (
        <div className="relative w-80">
          <form onSubmit={handleSearch}>
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border-2 border-gray-300 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-200"
            />
          </form>
        </div>
      )}

      {/* Navigation Menu */}
      <nav className={`flex ${isMobile ? 'flex-col space-y-4' : 'items-center space-x-6'}`}>
        {shoppingViewHeaderMenuItems.map((menuItem) => (
          <div
            key={menuItem.id}
            onClick={() => handleNavigate(menuItem)}
            className={`cursor-pointer transition-all duration-200 font-semibold ${
              location.pathname === menuItem.path
                ? "text-orange-600 border-b-2 border-orange-600"
                : "text-gray-700 hover:text-orange-600 hover:scale-105"
            } ${isMobile ? 'py-2 text-lg' : 'text-sm'}`}
          >
            {menuItem.label}
          </div>
        ))}
      </nav>

      {/* Mobile Search */}
      {isMobile && (
        <div className="relative">
          <form onSubmit={handleSearch}>
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-200"
            />
          </form>
        </div>
      )}
    </div>
  );
}

function HeaderRightContent({ isMobile = false }) {
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const [openCartSheet, setOpenCartSheet] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  function handleLogout() {
    dispatch(logoutUser());
  }

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchCartItems(user.id));
    }
  }, [dispatch, user?.id]);

  const cartItemsCount = cartItems?.items?.length || 0;

  return (
    <div className={`flex items-center ${isMobile ? 'flex-col space-y-4' : 'space-x-4'}`}>
      {/* Cart Button */}
      <Button
        onClick={() => setOpenCartSheet(true)}
        variant="outline"
        className={`relative border-2 border-gray-300 hover:border-orange-500 hover:text-orange-600 transition-all duration-300 ${
          isMobile ? 'w-full justify-center py-3' : 'px-4 py-2'
        }`}
      >
        <ShoppingCart className="h-5 w-5 mr-2" />
        <span>Cart</span>
        {cartItemsCount > 0 && (
          <Badge className="absolute -top-2 -right-2 bg-orange-500 text-white rounded-full min-w-6 h-6 flex items-center justify-center text-xs font-bold">
            {cartItemsCount}
          </Badge>
        )}
      </Button>

      {/* User Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className={`border-2 border-gray-300 hover:border-orange-500 transition-all duration-300 ${
              isMobile ? 'w-full justify-center py-3' : 'px-4 py-2'
            }`}
          >
            <Avatar className="h-6 w-6 mr-2 bg-gradient-to-r from-orange-500 to-orange-600">
              <AvatarFallback className="bg-transparent text-white text-sm font-bold">
                {user?.userName?.[0]?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <span className={isMobile ? 'text-base' : 'text-sm'}>
              {user?.userName || 'User'}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          side={isMobile ? "bottom" : "right"} 
          className="w-64 rounded-2xl shadow-xl border border-gray-200"
        >
          <DropdownMenuLabel className="p-4">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10 bg-gradient-to-r from-orange-500 to-orange-600">
                <AvatarFallback className="bg-transparent text-white font-bold">
                  {user?.userName?.[0]?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-semibold text-gray-900">{user?.userName || 'User'}</div>
                <div className="text-sm text-gray-500">{user?.email}</div>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={() => navigate("/shop/account")}
            className="flex items-center space-x-3 p-3 cursor-pointer hover:bg-orange-50 rounded-lg"
          >
            <UserCog className="h-4 w-4 text-gray-600" />
            <span className="text-gray-700">My Account</span>
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => navigate("/account/orders")}
            className="flex items-center space-x-3 p-3 cursor-pointer hover:bg-orange-50 rounded-lg"
          >
            <ShoppingCart className="h-4 w-4 text-gray-600" />
            <span className="text-gray-700">My Orders</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={handleLogout}
            className="flex items-center space-x-3 p-3 cursor-pointer hover:bg-red-50 rounded-lg text-red-600"
          >
            <LogOut className="h-4 w-4" />
            <span className="font-medium">Logout</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Cart Sheet */}
      <Sheet open={openCartSheet} onOpenChange={setOpenCartSheet}>
        <SheetContent side="right" className="w-full sm:max-w-md">
          <UserCartWrapper
            setOpenCartSheet={setOpenCartSheet}
            cartItems={cartItems?.items || []}
          />
        </SheetContent>
      </Sheet>
    </div>
  );
}

function ShoppingHeader() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur-sm shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link 
            to="/shop/home" 
            className="flex items-center space-x-3 group"
          >
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 w-10 h-10 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-200">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                The Shopery
              </span>
              <span className="text-xs text-gray-500 -mt-1">Premium Shopping</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <MenuItems />
          </div>

          {/* Desktop Right Content */}
          <div className="hidden lg:flex items-center space-x-4">
            <HeaderRightContent />
          </div>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                className="lg:hidden border-2 border-gray-300 hover:border-orange-500 hover:text-orange-600 transition-all duration-300"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent 
              side="right" 
              className="w-full max-w-sm bg-gradient-to-b from-gray-50 to-white border-l border-gray-200"
            >
              <div className="flex flex-col h-full py-6">
                {/* Mobile Logo */}
                <div className="flex items-center space-x-3 mb-8 px-4">
                  <div className="bg-gradient-to-r from-orange-500 to-orange-600 w-8 h-8 rounded-lg flex items-center justify-center">
                    <Sparkles className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xl font-black bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                      The Shopery
                    </span>
                    <span className="text-xs text-gray-500 -mt-1">Premium Shopping</span>
                  </div>
                </div>

                {/* Mobile Menu Items */}
                <div className="flex-1 px-4">
                  <MenuItems isMobile={true} />
                </div>

                {/* Mobile Right Content */}
                <div className="px-4 pt-6 border-t border-gray-200">
                  <HeaderRightContent isMobile={true} />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

export default ShoppingHeader;