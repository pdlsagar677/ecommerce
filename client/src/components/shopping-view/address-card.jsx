import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Edit, Trash2, MapPin, CheckCircle } from "lucide-react";
import { Badge } from "../ui/badge";

function AddressCard({
  addressInfo,
  handleDeleteAddress,
  handleEditAddress,
  setCurrentSelectedAddress,
  selectedId,
}) {
  const isSelected = selectedId?._id === addressInfo?._id;

  return (
    <Card
      onClick={
        setCurrentSelectedAddress
          ? () => setCurrentSelectedAddress(addressInfo)
          : null
      }
      className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
        isSelected
          ? "border-2 border-orange-500 bg-gradient-to-r from-orange-50 to-amber-50 shadow-lg scale-105"
          : "border-2 border-gray-200 bg-white hover:border-orange-300"
      } rounded-2xl overflow-hidden`}
    >
      <CardContent className="p-6 space-y-4">
        {/* Header with Selection Indicator */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MapPin className={`h-5 w-5 ${
              isSelected ? "text-orange-600" : "text-gray-500"
            }`} />
            <span className={`font-semibold text-lg ${
              isSelected ? "text-orange-600" : "text-gray-900"
            }`}>
              Delivery Address
            </span>
          </div>
          {isSelected && (
            <Badge className="bg-green-500 text-white px-3 py-1 text-sm font-semibold">
              <CheckCircle className="h-3 w-3 mr-1" />
              Selected
            </Badge>
          )}
        </div>

        {/* Address Details */}
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
            <div>
              <p className="text-sm text-gray-600">Address</p>
              <p className="font-medium text-gray-900">{addressInfo?.address}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <p className="text-sm text-gray-600">City</p>
                <p className="font-medium text-gray-900">{addressInfo?.city}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <p className="text-sm text-gray-600">Pincode</p>
                <p className="font-medium text-gray-900">{addressInfo?.pincode}</p>
              </div>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
            <div>
              <p className="text-sm text-gray-600">Phone</p>
              <p className="font-medium text-gray-900">{addressInfo?.phone}</p>
            </div>
          </div>

          {addressInfo?.notes && (
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <p className="text-sm text-gray-600">Delivery Notes</p>
                <p className="font-medium text-gray-900 italic">{addressInfo?.notes}</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 bg-gray-50 border-t border-gray-200 flex justify-between space-x-2">
        <Button
          onClick={(e) => {
            e.stopPropagation();
            handleEditAddress(addressInfo);
          }}
          variant="outline"
          className="flex-1 border-2 border-gray-300 text-gray-700 hover:border-orange-500 hover:text-orange-600 transition-all duration-300 font-semibold"
          size="sm"
        >
          <Edit className="h-4 w-4 mr-2" />
          Edit
        </Button>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteAddress(addressInfo);
          }}
          variant="outline"
          className="flex-1 border-2 border-red-300 text-red-600 hover:border-red-500 hover:bg-red-50 transition-all duration-300 font-semibold"
          size="sm"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}

export default AddressCard;