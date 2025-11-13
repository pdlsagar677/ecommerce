import { AlignJustify, LogOut, User, Settings, Shield } from "lucide-react";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "@/store/auth-slice";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function AdminHeader({ setOpen }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  function handleLogout() {
    dispatch(logoutUser());
  }

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 shadow-sm">
      {/* Mobile Menu Button */}
      <Button 
        onClick={() => setOpen(true)} 
        className="lg:hidden sm:block bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
        size="sm"
      >
        <AlignJustify className="h-4 w-4" />
        <span className="sr-only">Toggle Menu</span>
      </Button>

      {/* Spacer for mobile */}
      <div className="lg:hidden flex-1"></div>

      {/* Page Title - Hidden on mobile, shown on desktop */}
      <div className="hidden lg:block">
        <h1 className="text-2xl font-black bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
          Admin Dashboard
        </h1>
      </div>

      {/* User Actions */}
      <div className="flex items-center space-x-4">
        {/* User Info & Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              className="flex items-center space-x-3 border-2 border-gray-300 hover:border-orange-500 hover:text-orange-600 transition-all duration-300 rounded-xl px-4 py-2"
            >
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 w-8 h-8 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-sm font-semibold text-gray-900">{user?.userName || 'Admin'}</div>
                <div className="text-xs text-gray-500">Administrator</div>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64 rounded-2xl shadow-xl border border-gray-200">
            <DropdownMenuLabel className="p-4">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 w-10 h-10 rounded-xl flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{user?.userName || 'Admin'}</div>
                  <div className="text-sm text-gray-500">{user?.email}</div>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex items-center space-x-3 p-3 cursor-pointer hover:bg-orange-50 rounded-lg">
              <Settings className="h-4 w-4 text-gray-600" />
              <span className="text-gray-700">Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center space-x-3 p-3 cursor-pointer hover:bg-orange-50 rounded-lg">
              <Shield className="h-4 w-4 text-gray-600" />
              <span className="text-gray-700">Security</span>
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

        {/* Logout Button - Desktop */}
        <Button
          onClick={handleLogout}
          className="hidden md:inline-flex gap-2 items-center bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl px-4 py-2"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </Button>
      </div>
    </header>
  );
}

export default AdminHeader;