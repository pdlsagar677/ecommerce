import {
  BadgeCheck,
  ChartNoAxesCombined,
  LayoutDashboard,
  ShoppingBasket,
  Users,
  Settings,
  LogOut,
  ChevronRight,
  Sparkles
} from "lucide-react";
import { Fragment } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

const adminSidebarMenuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/admin/dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
    badge: "New",
    badgeColor: "bg-green-500"
  },
  {
    id: "products",
    label: "Products",
    path: "/admin/products",
    icon: <ShoppingBasket className="h-5 w-5" />,
    count: 24
  },
  {
    id: "orders",
    label: "Orders",
    path: "/admin/orders",
    icon: <BadgeCheck className="h-5 w-5" />,
    count: 12
  },
  {
    id: "customers",
    label: "Customers",
    path: "/admin/customers",
    icon: <Users className="h-5 w-5" />,
    count: 156
  },
];

function MenuItems({ setOpen, isMobile = false }) {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="mt-8 flex-col flex gap-2">
      {adminSidebarMenuItems.map((menuItem) => (
        <div
          key={menuItem.id}
          onClick={() => {
            navigate(menuItem.path);
            setOpen && setOpen(false);
          }}
          className={`flex cursor-pointer items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200 group ${
            isActive(menuItem.path)
              ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg"
              : "text-gray-600 hover:bg-orange-50 hover:text-orange-600 hover:shadow-md"
          }`}
        >
          <div className={`${
            isActive(menuItem.path) 
              ? "text-white" 
              : "text-gray-400 group-hover:text-orange-500"
          } transition-colors`}>
            {menuItem.icon}
          </div>
          
          <span className="font-semibold flex-1">{menuItem.label}</span>
          
          {/* Badges and Counts */}
          <div className="flex items-center space-x-2">
            {menuItem.badge && (
              <Badge className={`${menuItem.badgeColor} text-white text-xs px-2 py-1 rounded-full`}>
                {menuItem.badge}
              </Badge>
            )}
            {menuItem.count && (
              <Badge variant="outline" className="bg-white/20 text-xs border-0">
                {menuItem.count}
              </Badge>
            )}
            {!isMobile && (
              <ChevronRight className={`h-4 w-4 transition-transform ${
                isActive(menuItem.path) 
                  ? "text-white transform translate-x-1" 
                  : "text-gray-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1"
              }`} />
            )}
          </div>
        </div>
      ))}
    </nav>
  );
}

function AdminSideBar({ open, setOpen }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Fragment>
      {/* Mobile Sidebar */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-80 p-0 bg-gradient-to-b from-gray-50 to-white border-r border-gray-200">
          <div className="flex flex-col h-full">
            {/* Header */}
            <SheetHeader className="p-6 border-b border-gray-200 bg-white">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg">
                  <ChartNoAxesCombined className="h-6 w-6 text-white" />
                </div>
                <div>
                  <SheetTitle className="text-xl font-black bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    Admin Panel
                  </SheetTitle>
                  <p className="text-sm text-gray-500 mt-1">Management Console</p>
                </div>
              </div>
            </SheetHeader>

            {/* Menu Items */}
            <div className="flex-1 p-6">
              <MenuItems setOpen={setOpen} isMobile={true} />
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-200 bg-white space-y-4">
              <Button 
                variant="outline" 
                className="w-full justify-start text-gray-600 hover:text-orange-600 hover:border-orange-500 border-2 transition-all duration-200"
              >
                <Settings className="h-4 w-4 mr-3" />
                Settings
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start text-red-600 hover:text-red-700 hover:border-red-500 border-2 transition-all duration-200"
              >
                <LogOut className="h-4 w-4 mr-3" />
                Logout
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <aside className="hidden w-80 flex-col border-r border-gray-200 bg-gradient-to-b from-gray-50 to-white lg:flex shadow-xl">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-white">
          <div 
            onClick={() => navigate("/admin/dashboard")}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-200">
              <ChartNoAxesCombined className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-black bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Admin Panel
              </h1>
              <p className="text-sm text-gray-500 mt-1">Management Console</p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="mt-6 p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border border-orange-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-orange-800">Welcome back!</p>
                <p className="text-xs text-orange-600 mt-1">12 new orders today</p>
              </div>
              <div className="bg-orange-500 p-2 rounded-lg">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="flex-1 p-6">
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Navigation
            </h3>
            <MenuItems />
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-white space-y-3">
          <Button 
            variant="outline" 
            className="w-full justify-start text-gray-600 hover:text-orange-600 hover:border-orange-500 border-2 transition-all duration-200 rounded-xl py-3"
          >
            <Settings className="h-4 w-4 mr-3" />
            Settings
          </Button>
          <Button 
            variant="outline" 
            className="w-full justify-start text-red-600 hover:text-red-700 hover:border-red-500 border-2 transition-all duration-200 rounded-xl py-3"
          >
            <LogOut className="h-4 w-4 mr-3" />
            Logout
          </Button>
          
          {/* User Info */}
          <div className="pt-4 border-t border-gray-200 mt-4">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-gray-400 to-gray-600 w-8 h-8 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-semibold">A</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">Admin User</p>
                <p className="text-xs text-gray-500 truncate">admin@theshopery.com</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </Fragment>
  );
}

export default AdminSideBar;