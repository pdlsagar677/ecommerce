import { Link } from "react-router-dom";
import { Home, ArrowLeft, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";

function NotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-md mx-auto text-center space-y-8">
        {/* Icon */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 w-24 h-24 rounded-3xl flex items-center justify-center mx-auto shadow-lg">
          <Navigation className="h-12 w-12 text-white" />
        </div>

        {/* Content */}
        <div className="space-y-4">
          <h1 className="text-6xl font-black text-gray-900">404</h1>
          <h2 className="text-2xl font-bold text-gray-800">Page Not Found</h2>
          <p className="text-gray-600 leading-relaxed">
            Sorry, we couldn't find the page you're looking for. The page might have been moved, deleted, or you entered the wrong URL.
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-4">
          <Button
            asChild
            size="lg"
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
          >
            <Link to="/" className="flex items-center justify-center space-x-2">
              <Home className="h-5 w-5" />
              <span>Go Home</span>
            </Link>
          </Button>
          
          <Button
            asChild
            variant="outline"
            size="lg"
            className="w-full border-gray-300 hover:bg-gray-50"
          >
            <Link to="javascript:history.back()" className="flex items-center justify-center space-x-2">
              <ArrowLeft className="h-5 w-5" />
              <span>Go Back</span>
            </Link>
          </Button>
        </div>

        {/* Support */}
        <p className="text-sm text-gray-500 pt-4">
          Need help?{" "}
          <Link 
            to="/contact" 
            className="text-orange-600 hover:text-orange-700 font-medium hover:underline"
          >
            Contact support
          </Link>
        </p>
      </div>
    </div>
  );
}

export default NotFound;