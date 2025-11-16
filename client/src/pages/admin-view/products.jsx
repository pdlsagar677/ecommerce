import { Fragment, useEffect, useState, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProductImageUpload from "@/components/admin-view/image-upload";
import AdminProductTile from "@/components/admin-view/product-tile";
import CommonForm from "@/components/common/form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { addProductFormElements } from "@/config";
import {
  addNewProduct,
  deleteProduct,
  editProduct,
  fetchAllProducts,
} from "@/store/admin/products-slice";
import axios from "axios";
import { Plus, Package, Search, Grid, List } from "lucide-react";

const INITIAL_FORM_DATA = {
  image: null,
  title: "",
  description: "",
  category: "",
  brand: "",
  price: "",
  salePrice: "",
  totalStock: "",
  averageReview: 0,
};

function AdminProducts() {
  const [openCreateProductsDialog, setOpenCreateProductsDialog] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [currentEditedId, setCurrentEditedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const { productList } = useSelector((state) => state.adminProducts);
  const dispatch = useDispatch();
  const { toast } = useToast();
const API_BASE_URL = import.meta.env.VITE_API_URL ;

  // Form validation
  const isFormValid = useCallback(() => {
    const requiredFields = Object.keys(formData).filter(
      (key) => key !== "averageReview" && key !== "image"
    );
    
    return requiredFields.every((key) => {
      const value = formData[key];
      return value !== "" && value !== null && value !== undefined;
    }) && (currentEditedId !== null || imageFile);
  }, [formData, currentEditedId, imageFile]);

  // Function to upload image and then create product
  const uploadImageAndCreateProduct = async (productData) => {
    try {
      setImageLoadingState(true);
      
      // Upload image first
      const imageFormData = new FormData();
      imageFormData.append("my_file", imageFile);
      
      const uploadResponse = await axios.post(
        `${API_BASE_URL}/api/admin/products/upload-image`,
        imageFormData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          timeout: 30000,
        }
      );

      if (uploadResponse?.data?.success) {
        const imageUrl = uploadResponse.data.result.url;
        
        // Now create product with the image URL
        const productWithImage = {
          ...productData,
          image: imageUrl
        };

        const result = await dispatch(addNewProduct(productWithImage)).unwrap();
        return result;
      } else {
        throw new Error('Image upload failed');
      }
    } catch (error) {
      throw error;
    } finally {
      setImageLoadingState(false);
    }
  };

  const onSubmit = useCallback(async (event) => {
    event.preventDefault();

    // Check if we have a valid image for new products
    if (!imageFile && !currentEditedId) {
      toast({
        title: "Image Required",
        description: "Please upload an image before submitting",
        variant: "destructive",
      });
      return;
    }

    if (!isFormValid()) {
      toast({
        title: "Validation Error",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      // Prepare product data
      const productData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        brand: formData.brand,
        price: parseFloat(formData.price) || 0,
        salePrice: formData.salePrice ? parseFloat(formData.salePrice) : 0,
        totalStock: parseInt(formData.totalStock) || 0,
        averageReview: parseFloat(formData.averageReview) || 0,
      };

      let result;

      if (currentEditedId !== null) {
        // Edit existing product - use existing image or new uploaded image
        const editData = {
          ...productData,
          image: formData.image // Use existing image for edits
        };
        result = await dispatch(editProduct({ id: currentEditedId, formData: editData })).unwrap();
      } else {
        // Create new product - upload image first
        result = await uploadImageAndCreateProduct(productData);
      }

      if (result?.success) {
        dispatch(fetchAllProducts());
        
        toast({
          title: currentEditedId !== null ? "Product updated successfully" : "Product added successfully",
          className: "bg-green-50 border-green-200 text-green-800",
        });

        // Reset form and close dialog
        handleCloseDialog();
      } else {
        throw new Error(result?.message || "Operation failed");
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast({
        title: "Error",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    }
  }, [formData, imageFile, currentEditedId, dispatch, toast, isFormValid]);

  // Handle product deletion
  const handleDelete = useCallback(async (productId) => {
    try {
      const result = await dispatch(deleteProduct(productId)).unwrap();
      
      if (result?.success) {
        dispatch(fetchAllProducts());
        toast({
          title: "Product deleted successfully",
          className: "bg-green-50 border-green-200 text-green-800",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete product",
        variant: "destructive",
      });
    }
  }, [dispatch, toast]);

  // Handle edit product
  const handleEdit = useCallback((product) => {
    setFormData({
      image: product.image || null,
      title: product.title || "",
      description: product.description || "",
      category: product.category || "",
      brand: product.brand || "",
      price: product.price?.toString() || "",
      salePrice: product.salePrice?.toString() || "",
      totalStock: product.totalStock?.toString() || "",
      averageReview: product.averageReview?.toString() || "0",
    });
    setCurrentEditedId(product._id);
    setUploadedImageUrl(product.image || "");
    setOpenCreateProductsDialog(true);
  }, []);

  // Close dialog handler
  const handleCloseDialog = useCallback(() => {
    setOpenCreateProductsDialog(false);
    setFormData(INITIAL_FORM_DATA);
    setImageFile(null);
    setUploadedImageUrl("");
    setCurrentEditedId(null);
  }, []);

  // Fetch products on component mount
  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  // Filter and search products
  const filteredProducts = useMemo(() => {
    if (!productList) return [];
    
    return productList.filter(product => {
      const matchesSearch = product.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [productList, searchTerm, selectedCategory]);

  // Get unique categories
  const categories = useMemo(() => {
    if (!productList) return [];
    const uniqueCategories = [...new Set(productList.map(product => product.category).filter(Boolean))];
    return ["all", ...uniqueCategories];
  }, [productList]);

  const productTiles = useMemo(() => {
    if (!filteredProducts || filteredProducts.length === 0) {
      return (
        <div className="col-span-full text-center py-16">
          <div className="max-w-md mx-auto space-y-4">
            <div className="bg-gradient-to-r from-orange-100 to-amber-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
              <Package className="h-10 w-10 text-orange-600" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-gray-900">No products found</h3>
              <p className="text-gray-500">
                {searchTerm || selectedCategory !== "all" 
                  ? "Try adjusting your search or filter criteria" 
                  : "Add your first product to get started"}
              </p>
            </div>
            {!searchTerm && selectedCategory === "all" && (
              <Button 
                onClick={() => setOpenCreateProductsDialog(true)}
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add First Product
              </Button>
            )}
          </div>
        </div>
      );
    }

    return filteredProducts.map((productItem) => (
      <AdminProductTile
        key={productItem._id}
        product={productItem}
        onEdit={handleEdit}
        onDelete={handleDelete}
        viewMode={viewMode}
      />
    ));
  }, [filteredProducts, handleEdit, handleDelete, viewMode, searchTerm, selectedCategory]);

  return (
    <Fragment>
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-black bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Product Management
            </h1>
            <p className="text-gray-600">
              Manage your products, inventory, and pricing
            </p>
          </div>
          
          <Button 
            onClick={() => setOpenCreateProductsDialog(true)}
            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg hover:shadow-xl transition-all duration-200"
            size="lg"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add New Product
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Products</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{productList?.length || 0}</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-xl">
                <Package className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Products</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {productList?.filter(p => p.totalStock > 0).length || 0}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-xl">
                <Package className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Out of Stock</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {productList?.filter(p => p.totalStock === 0).length || 0}
                </p>
              </div>
              <div className="bg-red-100 p-3 rounded-xl">
                <Package className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-1 gap-4 w-full lg:w-auto">
              {/* Search Input */}
              <div className="relative flex-1 lg:flex-initial lg:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                />
              </div>

              {/* Category Filter */}
              <div className="flex-1 lg:flex-initial">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-white"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === "all" ? "All Categories" : category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-xl">
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
        </div>
      </div>

      {/* Products Grid/List */}
      <div className={`${
        viewMode === "grid" 
          ? "grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
          : "space-y-4"
      }`}>
        {productTiles}
      </div>

      {/* Product Dialog */}
      <Dialog
        open={openCreateProductsDialog}
        onOpenChange={handleCloseDialog}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              {currentEditedId !== null ? "Edit Product" : "Add New Product"}
            </DialogTitle>
            <DialogDescription>
              {currentEditedId !== null 
                ? "Update your product information below" 
                : "Fill in the details to add a new product to your store"
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-8 md:grid-cols-2">
            {/* Image Upload Section */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-6 border border-orange-200">
                <h3 className="font-semibold text-orange-800 mb-4 flex items-center">
                  <Package className="h-5 w-5 mr-2" />
                  Product Image
                </h3>
                <ProductImageUpload
                  imageFile={imageFile}
                  setImageFile={setImageFile}
                  uploadedImageUrl={uploadedImageUrl}
                  setUploadedImageUrl={setUploadedImageUrl}
                  setImageLoadingState={setImageLoadingState}
                  imageLoadingState={imageLoadingState}
                  isEditMode={currentEditedId !== null}
                  currentImage={currentEditedId !== null ? formData.image : null}
                />
              </div>
            </div>

            {/* Form Section */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <CommonForm
                  onSubmit={onSubmit}
                  formData={formData}
                  setFormData={setFormData}
                  buttonText={
                    currentEditedId !== null 
                      ? "Update Product" 
                      : imageLoadingState 
                        ? "Uploading..." 
                        : "Add Product"
                  }
                  formControls={addProductFormElements}
                  isBtnDisabled={!isFormValid() || imageLoadingState}
                  buttonClassName="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                />
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Fragment>
  );
}

export default AdminProducts;