import { Fragment, useEffect, useState, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProductImageUpload from "@/components/admin-view/image-upload";
import AdminProductTile from "@/components/admin-view/product-tile";
import CommonForm from "@/components/common/form";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useToast } from "@/components/ui/use-toast";
import { addProductFormElements } from "@/config";
import {
  addNewProduct,
  deleteProduct,
  editProduct,
  fetchAllProducts,
} from "@/store/admin/products-slice";
import axios from "axios";

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

  const { productList } = useSelector((state) => state.adminProducts);
  const dispatch = useDispatch();
  const { toast } = useToast();

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
        "http://localhost:5000/api/admin/products/upload-image",
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

      console.log("Submitting product data:", productData);

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

  const productTiles = useMemo(() => {
    if (!productList || productList.length === 0) {
      return (
        <div className="col-span-full text-center py-8 text-muted-foreground">
          No products found. Add your first product to get started.
        </div>
      );
    }

    return productList.map((productItem) => (
      <AdminProductTile
        key={productItem._id}
        product={productItem}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    ));
  }, [productList, handleEdit, handleDelete]);

  return (
    <Fragment>
      <div className="mb-5 w-full flex justify-end">
        <Button onClick={() => setOpenCreateProductsDialog(true)}>
          Add New Product
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        {productTiles}
      </div>
      <Sheet
        open={openCreateProductsDialog}
        onOpenChange={handleCloseDialog}
      >
        <SheetContent side="right" className="overflow-auto">
          <SheetHeader>
            <SheetTitle>
              {currentEditedId !== null ? "Edit Product" : "Add New Product"}
            </SheetTitle>
          </SheetHeader>
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
          <div className="py-6">
            <CommonForm
              onSubmit={onSubmit}
              formData={formData}
              setFormData={setFormData}
              buttonText={currentEditedId !== null ? "Update" : imageLoadingState ? "Uploading..." : "Add"}
              formControls={addProductFormElements}
              isBtnDisabled={!isFormValid() || imageLoadingState}
            />
          </div>
        </SheetContent>
      </Sheet>
    </Fragment>
  );
}

export default AdminProducts;