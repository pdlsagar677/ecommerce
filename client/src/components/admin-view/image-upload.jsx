import { FileIcon, UploadCloudIcon, XIcon, ImageIcon } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";

function ProductImageUpload({
  imageFile,
  setImageFile,
  imageLoadingState,
  uploadedImageUrl,
  setUploadedImageUrl,
  isEditMode = false,
  isCustomStyling = false,
  currentImage = null,
}) {
  const inputRef = useRef(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadError, setUploadError] = useState("");

  const supportedImageTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/svg+xml',
    'image/bmp'
  ];

  // Generate preview for selected file
  useEffect(() => {
    if (imageFile) {
      const objectUrl = URL.createObjectURL(imageFile);
      setImagePreview(objectUrl);
      setUploadError("");

      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setImagePreview(null);
    }
  }, [imageFile]);

  // Set existing image in edit mode
  useEffect(() => {
    if (isEditMode && currentImage) {
      setUploadedImageUrl(currentImage);
      setImagePreview(currentImage);
    }
  }, [isEditMode, currentImage, setUploadedImageUrl]);

  function handleImageFileChange(event) {
    const selectedFile = event.target.files?.[0];
    
    if (selectedFile) {
      if (!supportedImageTypes.includes(selectedFile.type)) {
        setUploadError('Please select a valid image file (JPEG, PNG, WebP, GIF, SVG, BMP)');
        return;
      }
      
      if (selectedFile.size > 5 * 1024 * 1024) {
        setUploadError('Image size should be less than 5MB');
        return;
      }
      
      setImageFile(selectedFile);
      setUploadError("");
    }
  }

  function handleDragOver(event) {
    event.preventDefault();
  }

  function handleDrop(event) {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files?.[0];
    if (droppedFile) {
      if (!supportedImageTypes.includes(droppedFile.type)) {
        setUploadError('Please drop a valid image file (JPEG, PNG, WebP, GIF, SVG, BMP)');
        return;
      }
      setImageFile(droppedFile);
      setUploadError("");
    }
  }

  function handleRemoveImage() {
    setImageFile(null);
    setImagePreview(null);
    setUploadedImageUrl("");
    setUploadError("");
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  const displayImage = imagePreview || uploadedImageUrl;

  return (
    <div className={`w-full mt-4 ${isCustomStyling ? "" : "max-w-md mx-auto"}`}>
      <Label className="text-lg font-semibold mb-2 block">Product Image</Label>
      
      {uploadError && (
        <div className="mb-4 p-3 bg-destructive/10 border border-destructive rounded-md">
          <p className="text-destructive text-sm">{uploadError}</p>
        </div>
      )}
      
      {displayImage && (
        <div className="mb-4">
          <Label className="text-sm font-medium mb-2 block">Preview</Label>
          <div className="relative border rounded-lg overflow-hidden bg-muted/20">
            <img 
              src={displayImage} 
              alt="Product preview" 
              className="w-full h-48 object-contain"
              onError={(e) => {
                console.error("Image failed to load:", displayImage);
                e.target.style.display = 'none';
              }}
            />
            {!imageLoadingState && !isEditMode && (
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 w-8 h-8"
                onClick={handleRemoveImage}
              >
                <XIcon className="w-4 h-4" />
              </Button>
            )}
          </div>
          {imageLoadingState && (
            <div className="mt-2 text-sm text-muted-foreground flex items-center gap-2">
              <Skeleton className="w-4 h-4 rounded-full" />
              Uploading image...
            </div>
          )}
        </div>
      )}

      {(!isEditMode || !displayImage) && (
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
            isEditMode ? "opacity-60 cursor-not-allowed" : "cursor-pointer hover:border-primary hover:bg-muted/20"
          }`}
        >
          <Input
            id="image-upload"
            type="file"
            className="hidden"
            ref={inputRef}
            onChange={handleImageFileChange}
            disabled={isEditMode || imageLoadingState}
            accept={supportedImageTypes.join(',')}
          />
          
          {!imageFile ? (
            <Label
              htmlFor="image-upload"
              className={`flex flex-col items-center justify-center h-32 ${
                isEditMode ? "cursor-not-allowed" : "cursor-pointer"
              }`}
            >
              <UploadCloudIcon className="w-12 h-12 text-muted-foreground mb-3" />
              <span className="text-center text-sm font-medium mb-1">
                Drag & drop or click to upload
              </span>
              <span className="text-center text-xs text-muted-foreground">
                Supports: JPEG, PNG, WebP, GIF, SVG, BMP (Max 5MB)
              </span>
            </Label>
          ) : (
            <div className="flex items-center justify-between p-3 bg-muted/20 rounded">
              <div className="flex items-center space-x-3">
                <ImageIcon className="w-8 h-8 text-primary" />
                <div>
                  <p className="text-sm font-medium truncate max-w-[200px]">
                    {imageFile.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {(imageFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground hover:bg-destructive/10"
                onClick={handleRemoveImage}
                disabled={isEditMode}
              >
                <XIcon className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      )}

      {isEditMode && displayImage && (
        <div className="mt-2 text-sm text-muted-foreground text-center">
          {currentImage ? "Current product image" : "To change the image, please delete the current one first"}
        </div>
      )}
    </div>
  );
}

export default ProductImageUpload;