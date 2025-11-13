import ProductImageUpload from "@/components/admin-view/image-upload";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { addFeatureImage, getFeatureImages } from "@/store/common-slice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Image, Upload, Trash2, Eye } from "lucide-react";

function AdminDashboard() {
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const dispatch = useDispatch();
  const { featureImageList } = useSelector((state) => state.commonFeature);

  function handleUploadFeatureImage() {
    if (!uploadedImageUrl) {
      return;
    }
    
    dispatch(addFeatureImage(uploadedImageUrl)).then((data) => {
      if (data?.payload?.success) {
        dispatch(getFeatureImages());
        setImageFile(null);
        setUploadedImageUrl("");
      }
    });
  }

  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);

  return (
    <div className="space-y-8 p-6 bg-gradient-to-b from-gray-50 to-white min-h-screen">
      {/* Header Section */}
      <div className="space-y-2">
        <h1 className="text-4xl font-black bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="text-gray-600 text-lg">
          Manage feature images and site content
        </p>
      </div>

      {/* Upload Section */}
      <Card className="rounded-2xl shadow-lg border-0 bg-white">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center space-x-3 text-xl">
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 w-10 h-10 rounded-xl flex items-center justify-center">
              <Upload className="h-5 w-5 text-white" />
            </div>
            <span>Upload Feature Image</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <ProductImageUpload
            imageFile={imageFile}
            setImageFile={setImageFile}
            uploadedImageUrl={uploadedImageUrl}
            setUploadedImageUrl={setUploadedImageUrl}
            setImageLoadingState={setImageLoadingState}
            imageLoadingState={imageLoadingState}
            isCustomStyling={true}
          />
          
          <Button 
            onClick={handleUploadFeatureImage}
            disabled={!uploadedImageUrl || imageLoadingState}
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 rounded-xl shadow-lg transition-all duration-300"
            size="lg"
          >
            {imageLoadingState ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Uploading...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Upload className="h-5 w-5" />
                <span>Upload Feature Image</span>
              </div>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Feature Images Grid */}
      <Card className="rounded-2xl shadow-lg border-0 bg-white">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center space-x-3 text-xl">
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 w-10 h-10 rounded-xl flex items-center justify-center">
              <Image className="h-5 w-5 text-white" />
            </div>
            <span>Feature Images ({featureImageList?.length || 0})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {featureImageList && featureImageList.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featureImageList.map((featureImgItem, index) => (
                <div key={featureImgItem._id || index} className="group relative">
                  <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-gray-50">
                    <img
                      src={featureImgItem.image}
                      className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                      alt={`Feature image ${index + 1}`}
                    />
                    
                    {/* Overlay Actions */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-3">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="bg-white/90 backdrop-blur-sm border-white text-gray-900 hover:bg-white"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="bg-red-500/90 backdrop-blur-sm border-red-500 text-white hover:bg-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </div>

                    {/* Image Index Badge */}
                    <div className="absolute top-3 left-3 bg-black/70 text-white px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
                      #{index + 1}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="bg-gradient-to-r from-gray-100 to-gray-200 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Image className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Feature Images</h3>
              <p className="text-gray-600 mb-6">Upload your first feature image to get started</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="rounded-2xl shadow-lg border-0 bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Images</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {featureImageList?.length || 0}
                </p>
              </div>
              <div className="bg-orange-100 p-3 rounded-xl">
                <Image className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="rounded-2xl shadow-lg border-0 bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Images</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {featureImageList?.length || 0}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-xl">
                <Eye className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="rounded-2xl shadow-lg border-0 bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Storage Used</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {((featureImageList?.length || 0) * 0.5).toFixed(1)}MB
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-xl">
                <Upload className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default AdminDashboard;