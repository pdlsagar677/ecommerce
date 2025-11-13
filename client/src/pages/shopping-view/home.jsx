import { Button } from "@/components/ui/button";
import {
  Airplay,
  BabyIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CloudLightning,
  Heater,
  Images,
  Shirt,
  ShirtIcon,
  ShoppingBasket,
  UmbrellaIcon,
  WashingMachine,
  WatchIcon,
  Star,
  Truck,
  Shield,
  ArrowRight,
  Sparkles,
  Tag,
  Award,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
} from "@/store/shop/products-slice";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { useNavigate } from "react-router-dom";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "@/components/ui/use-toast";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import { getFeatureImages } from "@/store/common-slice";

const categoriesWithIcon = [
  {
    id: "men",
    label: "Men's Fashion",
    icon: ShirtIcon,
    color: "from-blue-500 to-blue-600",
    description: "Trendy outfits & accessories",
  },
  {
    id: "women",
    label: "Women's Collection",
    icon: CloudLightning,
    color: "from-pink-500 to-rose-600",
    description: "Elegant styles & trends",
  },
  {
    id: "kids",
    label: "Kids & Toys",
    icon: BabyIcon,
    color: "from-green-500 to-emerald-600",
    description: "Fun & comfortable wear",
  },
  {
    id: "accessories",
    label: "Accessories",
    icon: WatchIcon,
    color: "from-purple-500 to-purple-600",
    description: "Complete your look",
  },
  {
    id: "footwear",
    label: "Footwear",
    icon: UmbrellaIcon,
    color: "from-orange-500 to-orange-600",
    description: "Step in style",
  },
];

const brandsWithIcon = [
  { id: "nike", label: "Nike", icon: Shirt, color: "bg-black text-white" },
  {
    id: "adidas",
    label: "Adidas",
    icon: WashingMachine,
    color: "bg-blue-600 text-white",
  },
  {
    id: "puma",
    label: "Puma",
    icon: ShoppingBasket,
    color: "bg-red-500 text-white",
  },
  {
    id: "levi",
    label: "Levi's",
    icon: Airplay,
    color: "bg-indigo-600 text-white",
  },
  { id: "zara", label: "Zara", icon: Images, color: "bg-gray-800 text-white" },
  { id: "h&m", label: "H&M", icon: Heater, color: "bg-red-600 text-white" },
];

const features = [
  {
    icon: Truck,
    title: "Free Delivery",
    description: "On orders above Rs. 999 across Nepal",
  },
  {
    icon: Shield,
    title: "Secure Payment",
    description: "100% protected transactions",
  },
  {
    icon: Award,
    title: "Quality Guarantee",
    description: "Authentic products guaranteed",
  },
  {
    icon: Tag,
    title: "Best Prices",
    description: "Competitive pricing always",
  },
];

function ShoppingHome() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { productList, productDetails } = useSelector(
    (state) => state.shopProducts
  );
  const { featureImageList } = useSelector((state) => state.commonFeature);

  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  function handleNavigateToListingPage(getCurrentItem, section) {
    sessionStorage.removeItem("filters");
    const currentFilter = {
      [section]: [getCurrentItem.id],
    };

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));
    navigate(`/shop/listing`);
  }

  function handleGetProductDetails(getCurrentProductId) {
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  function handleAddtoCart(getCurrentProductId) {
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

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % featureImageList.length);
    }, 5000); // Reduced to 5 seconds for better UX

    return () => clearInterval(timer);
  }, [featureImageList]);

  useEffect(() => {
    dispatch(
      fetchAllFilteredProducts({
        filterParams: {},
        sortParams: "price-lowtohigh",
      })
    );
  }, [dispatch]);

  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Slider Section */}
      <section className="relative w-full h-[70vh] min-h-[500px] overflow-hidden bg-gradient-to-r from-orange-500 to-orange-600">
        {featureImageList && featureImageList.length > 0 ? (
          <>
            {featureImageList.map((slide, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  index === currentSlide ? "opacity-100" : "opacity-0"
                }`}
              >
                <img
                  src={slide?.image}
                  className="w-full h-full object-cover"
                  alt={`Slide ${index + 1}`}
                />
                <div className="absolute inset-0 bg-black/40"></div>
              </div>
            ))}

            {/* Hero Content */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white max-w-4xl mx-auto px-4 space-y-6">
                <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-4">
                  <Sparkles className="h-4 w-4 mr-2" />
                  <span className="text-sm font-medium">
                    Nepal's #1 Shopping Destination
                  </span>
                </div>
                <h1 className="text-5xl md:text-7xl font-black tracking-tight">
                  Welcome to{" "}
                  <span className="bg-gradient-to-r from-white to-orange-100 bg-clip-text text-transparent">
                    The Shopery
                  </span>
                </h1>
                <p className="text-xl md:text-2xl opacity-90 max-w-2xl mx-auto leading-relaxed">
                  Discover amazing products at unbeatable prices. Quality meets
                  affordability in every purchase.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                  <Button
                    size="lg"
                    className="bg-white text-orange-600 hover:bg-gray-100 font-semibold text-lg px-8 py-6 rounded-xl shadow-2xl"
                    onClick={() => navigate("/shop/listing")}
                  >
                    Start Shopping
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white text-white hover:bg-white/20 font-semibold text-lg px-8 py-6 rounded-xl backdrop-blur-sm"
                  >
                    View Deals
                  </Button>
                </div>
              </div>
            </div>

            {/* Slider Controls */}
            <Button
              variant="outline"
              size="icon"
              onClick={() =>
                setCurrentSlide(
                  (prevSlide) =>
                    (prevSlide - 1 + featureImageList.length) %
                    featureImageList.length
                )
              }
              className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm border-white text-white hover:bg-white/30"
            >
              <ChevronLeftIcon className="w-6 h-6" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() =>
                setCurrentSlide(
                  (prevSlide) => (prevSlide + 1) % featureImageList.length
                )
              }
              className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm border-white text-white hover:bg-white/30"
            >
              <ChevronRightIcon className="w-6 h-6" />
            </Button>

            {/* Slider Indicators */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {featureImageList.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide
                      ? "bg-white scale-125"
                      : "bg-white/50 hover:bg-white/80"
                  }`}
                />
              ))}
            </div>
          </>
        ) : (
          // Fallback hero when no images
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white max-w-2xl mx-auto px-4 space-y-6">
              <h1 className="text-6xl md:text-7xl font-black tracking-tight">
                The Shopery
              </h1>
              <p className="text-xl md:text-2xl opacity-90">
                Your premium shopping destination in Nepal
              </p>
              <Button
                size="lg"
                className="bg-white text-orange-600 hover:bg-gray-100 font-semibold text-lg px-8"
              >
                Explore Collection
              </Button>
            </div>
          </div>
        )}
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
              Shop by Category
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explore our wide range of categories and find exactly what you're
              looking for
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {categoriesWithIcon.map((categoryItem) => (
              <Card
                key={categoryItem.id}
                onClick={() =>
                  handleNavigateToListingPage(categoryItem, "category")
                }
                className="cursor-pointer group border-0 shadow-sm hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white rounded-2xl overflow-hidden"
              >
                <CardContent className="p-6 text-center">
                  <div
                    className={`bg-gradient-to-r ${categoryItem.color} w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                  >
                    <categoryItem.icon className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg mb-2">
                    {categoryItem.label}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {categoryItem.description}
                  </p>
                  <div className="flex items-center justify-center text-orange-600 font-semibold text-sm">
                    <span>Explore</span>
                    <ArrowRight className="ml-1 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Brands Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
              Popular Brands
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Shop from your favorite trusted brands and discover new ones
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {brandsWithIcon.map((brandItem) => (
              <Card
                key={brandItem.id}
                onClick={() => handleNavigateToListingPage(brandItem, "brand")}
                className="cursor-pointer group border-0 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:scale-105 rounded-2xl overflow-hidden"
              >
                <CardContent
                  className={`p-6 text-center ${brandItem.color} rounded-2xl h-full flex flex-col items-center justify-center min-h-[140px] group-hover:brightness-110 transition-all`}
                >
                  <brandItem.icon className="w-12 h-12 mb-3 text-white" />
                  <span className="font-bold text-white text-lg">
                    {brandItem.label}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <Star className="h-4 w-4 mr-2" />
              Featured Collection
            </div>
            <h2 className="text-4xl font-black bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
              Trending Products
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover our most loved products this season
            </p>
          </div>

          {productList && productList.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {productList.slice(0, 8).map((productItem) => (
                <ShoppingProductTile
                  key={productItem._id}
                  handleGetProductDetails={handleGetProductDetails}
                  product={productItem}
                  handleAddtoCart={handleAddtoCart}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="bg-gradient-to-r from-orange-100 to-amber-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-12 w-12 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Loading Products...
              </h3>
              <p className="text-gray-600">
                Discovering amazing products for you
              </p>
            </div>
          )}

          {productList && productList.length > 8 && (
            <div className="text-center mt-12">
              <Button
                size="lg"
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all"
                onClick={() => navigate("/shop/listing")}
              >
                View All Products
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-500 to-orange-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
            Ready to Start Shopping?
          </h2>
          <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers and experience the best online
            shopping in Nepal
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-orange-600 hover:bg-gray-100 font-semibold text-lg px-8 py-6 rounded-xl shadow-2xl"
              onClick={() => navigate("/shop/listing")}
            >
              Shop Now
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-white/20 border-2 border-white text-white hover:bg-white/30 font-semibold text-lg px-8 py-6 rounded-xl backdrop-blur-sm transition-all duration-300 shadow-lg"
            >
              {" "}
              Learn More
            </Button>
          </div>
        </div>
      </section>

      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
}

export default ShoppingHome;
