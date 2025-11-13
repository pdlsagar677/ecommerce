import { Star, ShoppingCart, Heart, Share2, Package, Truck, Shield } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { Dialog, DialogContent } from "../ui/dialog";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "../ui/use-toast";
import { setProductDetails } from "@/store/shop/products-slice";
import { Label } from "../ui/label";
import StarRatingComponent from "../common/star-rating";
import { useEffect, useState } from "react";
import { addReview, getReviews } from "@/store/shop/review-slice";
import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";

function ProductDetailsDialog({ open, setOpen, productDetails }) {
  const [reviewMsg, setReviewMsg] = useState("");
  const [rating, setRating] = useState(0);
  const [activeImage, setActiveImage] = useState(0);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { reviews } = useSelector((state) => state.shopReview);

  const { toast } = useToast();

  function handleRatingChange(getRating) {
    setRating(getRating);
  }

  function handleAddToCart(getCurrentProductId, getTotalStock) {
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

  function handleDialogClose() {
    setOpen(false);
    dispatch(setProductDetails());
    setRating(0);
    setReviewMsg("");
    setActiveImage(0);
  }

  function handleAddReview() {
    dispatch(
      addReview({
        productId: productDetails?._id,
        userId: user?.id,
        userName: user?.userName,
        reviewMessage: reviewMsg,
        reviewValue: rating,
      })
    ).then((data) => {
      if (data.payload.success) {
        setRating(0);
        setReviewMsg("");
        dispatch(getReviews(productDetails?._id));
        toast({
          title: "Review Added Successfully!",
          description: "Thank you for your feedback",
          className: "bg-green-50 border-green-200 text-green-800",
        });
      }
    });
  }

  useEffect(() => {
    if (productDetails !== null) dispatch(getReviews(productDetails?._id));
  }, [productDetails]);

  const averageReview =
    reviews && reviews.length > 0
      ? reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) /
        reviews.length
      : 0;

  // Mock multiple images for demonstration
  const productImages = [
    productDetails?.image,
    productDetails?.image, // In real app, these would be different images
    productDetails?.image,
  ];

  const features = [
    { icon: Truck, text: "Free delivery on orders above $50" },
    { icon: Package, text: "Easy returns within 30 days" },
    { icon: Shield, text: "2-year warranty included" },
  ];

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="max-w-7xl max-h-[95vh] overflow-y-auto rounded-3xl border-0 shadow-2xl p-0 bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
          {/* Left Column - Images */}
          <div className="bg-gray-50 p-8 rounded-l-3xl">
            <div className="space-y-6">
              {/* Main Image */}
              <div className="relative overflow-hidden rounded-2xl bg-white p-4 shadow-lg">
                <img
                  src={productImages[activeImage]}
                  alt={productDetails?.title}
                  className="w-full h-80 object-contain transition-transform duration-300 hover:scale-105"
                />
                
                {/* Sale Badge */}
                {productDetails?.salePrice > 0 && (
                  <Badge className="absolute top-4 left-4 bg-orange-500 text-white px-3 py-2 text-sm font-bold shadow-lg">
                    SALE
                  </Badge>
                )}
                
                {/* Stock Badge */}
                <Badge className={`absolute top-4 right-4 ${
                  productDetails?.totalStock > 0 
                    ? 'bg-green-500 text-white' 
                    : 'bg-red-500 text-white'
                } px-3 py-2 text-sm font-bold shadow-lg`}>
                  {productDetails?.totalStock > 0 ? 'In Stock' : 'Out of Stock'}
                </Badge>
              </div>

              {/* Thumbnail Images */}
              <div className="flex gap-3 justify-center">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImage(index)}
                    className={`w-20 h-20 rounded-xl border-2 overflow-hidden transition-all duration-200 ${
                      activeImage === index
                        ? 'border-orange-500 ring-2 ring-orange-200'
                        : 'border-gray-300 hover:border-orange-400'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>

              {/* Features */}
              <Card className="rounded-2xl border-0 shadow-sm bg-gradient-to-r from-blue-50 to-indigo-50">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Product Features</h3>
                  <div className="space-y-2">
                    {features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-3 text-sm">
                        <feature.icon className="h-4 w-4 text-blue-600" />
                        <span className="text-gray-700">{feature.text}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="p-8">
            <div className="space-y-6">
              {/* Header */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="outline" className="border-orange-200 text-orange-600 bg-orange-50">
                    {productDetails?.category}
                  </Badge>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="icon" className="rounded-xl">
                      <Heart className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="rounded-xl">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <h1 className="text-3xl font-black bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-3">
                  {productDetails?.title}
                </h1>
                
                <p className="text-gray-600 text-lg leading-relaxed">
                  {productDetails?.description}
                </p>
              </div>

              {/* Rating */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    <StarRatingComponent rating={averageReview} />
                  </div>
                  <span className="text-lg font-semibold text-gray-900">
                    {averageReview.toFixed(1)}
                  </span>
                </div>
                <Separator orientation="vertical" className="h-6" />
                <span className="text-gray-600">
                  {reviews?.length || 0} reviews
                </span>
              </div>

              {/* Pricing */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  <span className={`text-4xl font-black ${
                    productDetails?.salePrice > 0 ? 'text-gray-400 line-through' : 'text-orange-600'
                  }`}>
                    ${productDetails?.price}
                  </span>
                  {productDetails?.salePrice > 0 && (
                    <span className="text-4xl font-black text-orange-600">
                      ${productDetails?.salePrice}
                    </span>
                  )}
                </div>
                {productDetails?.salePrice > 0 && (
                  <Badge className="bg-green-500 text-white px-3 py-1 text-sm">
                    Save ${(productDetails?.price - productDetails?.salePrice).toFixed(2)}
                  </Badge>
                )}
              </div>

              {/* Add to Cart */}
              <div className="space-y-4">
                {productDetails?.totalStock === 0 ? (
                  <Button 
                    className="w-full py-6 rounded-2xl bg-gray-400 text-white cursor-not-allowed shadow-lg"
                    size="lg"
                    disabled
                  >
                    <Package className="h-5 w-5 mr-2" />
                    Out of Stock
                  </Button>
                ) : (
                  <Button
                    className="w-full py-6 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                    size="lg"
                    onClick={() =>
                      handleAddToCart(
                        productDetails?._id,
                        productDetails?.totalStock
                      )
                    }
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Add to Cart - ${productDetails?.salePrice > 0 ? productDetails?.salePrice : productDetails?.price}
                  </Button>
                )}
              </div>

              <Separator />

              {/* Reviews Section */}
              <div className="space-y-6">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Customer Reviews
                </h2>
                
                <div className="max-h-80 overflow-y-auto space-y-6 pr-4">
                  {reviews && reviews.length > 0 ? (
                    reviews.map((reviewItem, index) => (
                      <Card key={index} className="rounded-2xl border-0 shadow-sm bg-gray-50">
                        <CardContent className="p-4">
                          <div className="flex space-x-4">
                            <Avatar className="w-12 h-12 border-2 border-orange-200">
                              <AvatarFallback className="bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold">
                                {reviewItem?.userName?.[0]?.toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 space-y-2">
                              <div className="flex items-center justify-between">
                                <h3 className="font-bold text-gray-900">{reviewItem?.userName}</h3>
                                <div className="flex items-center space-x-1">
                                  <StarRatingComponent rating={reviewItem?.reviewValue} />
                                </div>
                              </div>
                              <p className="text-gray-700 leading-relaxed">
                                {reviewItem.reviewMessage}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Star className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                      <h3 className="text-lg font-semibold text-gray-900">No Reviews Yet</h3>
                      <p className="text-gray-600">Be the first to review this product!</p>
                    </div>
                  )}
                </div>

                {/* Add Review */}
                <Card className="rounded-2xl border-0 shadow-sm bg-gradient-to-r from-orange-50 to-amber-50">
                  <CardContent className="p-6">
                    <h3 className="font-bold text-gray-900 mb-4">Write a Review</h3>
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-700 mb-2 block">
                          Your Rating
                        </Label>
                        <StarRatingComponent
                          rating={rating}
                          handleRatingChange={handleRatingChange}
                          size="lg"
                        />
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700 mb-2 block">
                          Your Review
                        </Label>
                        <Input
                          name="reviewMsg"
                          value={reviewMsg}
                          onChange={(event) => setReviewMsg(event.target.value)}
                          placeholder="Share your experience with this product..."
                          className="rounded-xl border-2 border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-200 py-3"
                        />
                      </div>
                      <Button
                        onClick={handleAddReview}
                        disabled={reviewMsg.trim() === "" || rating === 0}
                        className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl py-3 transition-all duration-300"
                      >
                        Submit Review
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ProductDetailsDialog;