import ProductDetailsDialog from "@/components/shopping-view/product-details";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { fetchProductDetails } from "@/store/shop/products-slice";
import {
  getSearchResults,
  resetSearchResults,
} from "@/store/shop/search-slice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { Search, X, Sparkles, Filter, Grid, List, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

function SearchProducts() {
  const [keyword, setKeyword] = useState("");
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState("grid");
  const [isSearching, setIsSearching] = useState(false);
  
  const dispatch = useDispatch();
  const { searchResults } = useSelector((state) => state.shopSearch);
  const { productDetails } = useSelector((state) => state.shopProducts);
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { toast } = useToast();

  useEffect(() => {
    if (keyword && keyword.trim() !== "" && keyword.trim().length > 2) {
      setIsSearching(true);
      const searchTimer = setTimeout(() => {
        setSearchParams(new URLSearchParams(`?keyword=${keyword}`));
        dispatch(getSearchResults(keyword)).finally(() => {
          setIsSearching(false);
        });
      }, 800);
      
      return () => clearTimeout(searchTimer);
    } else {
      setIsSearching(false);
      setSearchParams(new URLSearchParams(`?keyword=${keyword}`));
      dispatch(resetSearchResults());
    }
  }, [keyword, dispatch, setSearchParams]);

  function handleAddtoCart(getCurrentProductId, getTotalStock) {
    let getCartItems = cartItems.items || [];

    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === getCurrentProductId
      );
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > getTotalStock) {
          toast({
            title: "Stock Limit Reached",
            description: `Only ${getQuantity} quantity can be added for this item`,
            variant: "destructive",
          });
          return;
        }
      }
    }

    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast({
          title: "🎉 Added to Cart!",
          description: "Product successfully added to your cart",
          className: "bg-green-50 border-green-200 text-green-800",
        });
      }
    });
  }

  function handleGetProductDetails(getCurrentProductId) {
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  function clearSearch() {
    setKeyword("");
    dispatch(resetSearchResults());
  }

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  const searchQuery = searchParams.get('keyword');

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <Sparkles className="h-4 w-4 mr-2" />
              Smart Search
            </div>
            <h1 className="text-4xl font-black bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-3">
              Discover Products
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Find exactly what you're looking for with our intelligent search
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search Bar Section */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              value={keyword}
              name="keyword"
              onChange={(event) => setKeyword(event.target.value)}
              className="pl-12 pr-12 py-6 text-lg border-2 border-gray-300 rounded-2xl focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-200 shadow-sm"
              placeholder="Search for products, brands, categories..."
            />
            {keyword && (
              <button
                onClick={clearSearch}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
          
          {/* Search Tips */}
          {!keyword && (
            <div className="mt-4 text-center">
              <p className="text-gray-500 text-sm">
                Try searching for: <span className="text-orange-600 font-medium">shoes</span>, 
                <span className="text-orange-600 font-medium mx-2">electronics</span>, 
                <span className="text-orange-600 font-medium">fashion</span>
              </p>
            </div>
          )}
        </div>

        {/* Search Results Header */}
        {keyword && (
          <div className="max-w-4xl mx-auto mb-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      Search Results
                    </h2>
                    <p className="text-gray-600">
                      {isSearching ? (
                        "Searching..."
                      ) : searchResults.length > 0 ? (
                        `Found ${searchResults.length} product${searchResults.length !== 1 ? 's' : ''} for "${searchQuery}"`
                      ) : (
                        `No results found for "${searchQuery}"`
                      )}
                    </p>
                  </div>
                  {isSearching && (
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  )}
                </div>

                {/* View Toggle */}
                {searchResults.length > 0 && (
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center bg-gray-100 p-1 rounded-xl">
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
                        <Grid className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={viewMode === "list" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setViewMode("list")}
                        className={`${
                          viewMode === "list" 
                            ? "bg-white shadow-sm text-orange-600" 
                            : "text-gray-600 hover:text-orange-600"
                        } transition-colors`}
                      >
                        <List className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Search Results */}
        {keyword && !isSearching && (
          <div className="max-w-4xl mx-auto">
            {searchResults.length > 0 ? (
              <div className={`
                ${viewMode === "grid" 
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
                  : "space-y-4"
                }
              `}>
                {searchResults.map((item) => (
                  <ShoppingProductTile
                    key={item._id}
                    handleAddtoCart={handleAddtoCart}
                    product={item}
                    handleGetProductDetails={handleGetProductDetails}
                    viewMode={viewMode}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-200">
                <div className="max-w-md mx-auto space-y-6">
                  <div className="bg-gradient-to-r from-orange-100 to-amber-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto">
                    <Search className="h-12 w-12 text-orange-600" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-2xl font-bold text-gray-900">No results found</h3>
                    <p className="text-gray-600 text-lg">
                      We couldn't find any products matching "<span className="text-orange-600 font-semibold">{searchQuery}</span>"
                    </p>
                  </div>
                  <div className="space-y-4">
                    <p className="text-gray-500">Try these suggestions:</p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {['shoes', 'electronics', 'clothing', 'accessories'].map((suggestion) => (
                        <Button
                          key={suggestion}
                          variant="outline"
                          onClick={() => setKeyword(suggestion)}
                          className="border-gray-300 text-gray-700 hover:border-orange-500 hover:text-orange-600 capitalize"
                        >
                          {suggestion}
                        </Button>
                      ))}
                    </div>
                    <Button
                      onClick={clearSearch}
                      variant="ghost"
                      className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                    >
                      Clear search and browse all products
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Browse All Prompt */}
        {!keyword && (
          <div className="max-w-4xl mx-auto text-center py-16">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12">
              <div className="max-w-md mx-auto space-y-6">
                <div className="bg-gradient-to-r from-gray-100 to-gray-200 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
                  <Search className="h-10 w-10 text-gray-400" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-bold text-gray-900">Start Searching</h3>
                  <p className="text-gray-600">
                    Enter a product name, brand, or category to discover amazing products
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-left p-4 bg-orange-50 rounded-xl border border-orange-200">
                    <div className="font-semibold text-orange-800 mb-1">Quick Tips</div>
                    <ul className="text-orange-700 space-y-1 text-xs">
                      <li>• Use specific keywords</li>
                      <li>• Try brand names</li>
                      <li>• Search by category</li>
                    </ul>
                  </div>
                  <div className="text-left p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="font-semibold text-gray-800 mb-1">Popular Searches</div>
                    <ul className="text-gray-700 space-y-1 text-xs">
                      <li>• Smartphones</li>
                      <li>• Running Shoes</li>
                      <li>• Winter Jackets</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
}

export default SearchProducts;