import { useState } from 'react';
import { MapPin, Upload, X } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';
import { reportItem } from "../services/api";


export default function ReportItemPage() {
  const { user } = useAuth();
  const [itemType, setItemType] = useState<'lost' | 'found'>('lost');
  const [itemName, setItemName] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [storageLocation, setStorageLocation] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);
  const [isConfidential, setIsConfidential] = useState(false);
  const [uniqueIdentifier, setUniqueIdentifier] = useState('');
  const [hiddenDetail, setHiddenDetail] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);

  const categories = [
    'Electronics',
    'Personal Items',
    'Documents',
    'Accessories',
    'Clothing',
    'Keys',
    'Bags',
    'Jewelry',
    'Other',
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  // Validate file size
  if (file.size > 5 * 1024 * 1024) {
    toast.error('Image size must be less than 5MB');
    return;
  }

  // Validate type
  if (!['image/jpeg', 'image/png'].includes(file.type)) {
    toast.error('Only JPG and PNG files are allowed');
    return;
  }

  // ✅ Store actual file
  setImageFile(file);

  // ✅ Still keep preview (for UI)
  const reader = new FileReader();
  reader.onloadend = () => {
    setImagePreview(reader.result as string);
  };
  reader.readAsDataURL(file);
};

  const handleEnableLocation = () => {
    if (navigator.geolocation) {
      setUseCurrentLocation(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation(`Lat: ${latitude.toFixed(4)}, Long: ${longitude.toFixed(4)}`);
          toast.success('Location fetched successfully');
        },
        () => {
          toast.error('Unable to fetch location');
          setUseCurrentLocation(false);
        }
      );
    } else {
      toast.error('Geolocation is not supported by your browser');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  //  check if user exists
  if (!user) {
    toast.error("Please login first");
    return;
  }

  const formData = new FormData();
  formData.append("itemType", itemType);
  if (!user) {
    toast.error("Please login first");
    return;
  }
  formData.append("userId", user.userId.toString());  
  formData.append("itemName", itemName);
  formData.append("category", category);
  formData.append("description", description);
  formData.append("contactInfo", contactInfo);
  formData.append("dateLost", date);
  formData.append(
    "location",
    itemType === "lost" ? location : storageLocation
  );

  if (imageFile) {
    formData.append("image", imageFile);
  }

  try {
    await reportItem(formData);
    toast.success("Item reported successfully!");
  } catch (error) {
    toast.error("Failed to report item");
  }
};

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-3xl mb-6 text-[#1E2A44] font-semibold">Report Item</h2>

        {/* Item Type Selection */}
        <div className="flex gap-4 mb-6">
          <button
            type="button"
            onClick={() => setItemType('lost')}
            className={`flex-1 py-3 rounded-xl transition-all font-medium text-base ${
              itemType === 'lost'
                ? 'bg-[#EF4444] text-white border-2 border-[#EF4444] shadow-lg'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Report Lost Item
          </button>
          <button
            type="button"
            onClick={() => setItemType('found')}
            className={`flex-1 py-3 rounded-xl transition-all font-medium text-base ${
              itemType === 'found'
                ? 'bg-[#3B82F6] text-white border-2 border-[#3B82F6] shadow-lg'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Report Found Item
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="itemName" className="text-gray-700 text-base">Item Name *</Label>
            <Input
              id="itemName"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              placeholder="e.g., Laptop, Wallet, Keys"
              className="mt-1.5 border-2 border-gray-200 focus:border-[#14B8A6] text-base"
            />
          </div>

          <div>
            <Label htmlFor="category" className="text-gray-700 text-base">Category *</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="mt-1.5 border-2 border-gray-200 focus:border-[#14B8A6] text-base">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="description" className="text-gray-700 text-base">Description *</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide detailed description..."
              className="mt-1.5 border-2 border-gray-200 focus:border-[#14B8A6] min-h-[100px] text-base"
            />
          </div>

          <div>
            <Label htmlFor="contactInfo" className="text-gray-700 text-base">Contact Information *</Label>
            <Input
              id="contactInfo"
              value={contactInfo}
              onChange={(e) => setContactInfo(e.target.value)}
              placeholder="Email or Phone Number"
              className="mt-1.5 border-2 border-gray-200 focus:border-[#14B8A6] text-base"
            />
          </div>

          <div>
            <Label htmlFor="date" className="text-gray-700 text-base">Date *</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1.5 border-2 border-gray-200 focus:border-[#14B8A6] text-base"
            />
          </div>

          {/* Location Section */}
          <div>
            <Label className="text-gray-700 text-base">
              {itemType === 'lost' ? 'Last Known Location *' : 'Current Storage Location *'}
            </Label>
            <div className="mt-2 space-y-2">
              <Button
                type="button"
                onClick={handleEnableLocation}
                className={`${
                  itemType === 'lost' 
                    ? 'bg-[#EF4444] hover:bg-[#DC2626] text-white' 
                    : 'bg-[#3B82F6] hover:bg-[#2563EB] text-white'
                } text-base font-medium`}
              >
                <MapPin size={18} className="mr-2" />
                Enable Current Location
              </Button>
              {useCurrentLocation && location && (
                <div className="p-3 bg-[#86EFAC]/20 rounded-lg border border-[#86EFAC]">
                  <p className="text-sm text-[#16A34A]">📍 {location}</p>
                </div>
              )}
              {itemType === 'found' && (
                <Input
                  value={storageLocation}
                  onChange={(e) => setStorageLocation(e.target.value)}
                  placeholder="Enter storage location"
                  className="border-2 border-gray-200 focus:border-[#14B8A6] text-base"
                />
              )}
              {itemType === 'lost' && !useCurrentLocation && (
                <Input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Enter last known location"
                  className="border-2 border-gray-200 focus:border-[#14B8A6] text-base"
                />
              )}
            </div>
          </div>

          {/* Confidential Custody Protocol */}
          <div className="border-2 border-gray-200 rounded-xl p-5 bg-gray-50">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">🔐</span>
                <Label className="text-[#1E2A44] text-base font-semibold">
                  Enable Confidential Custody Protocol
                </Label>
              </div>
              <input
                type="checkbox"
                checked={isConfidential}
                onChange={(e) => setIsConfidential(e.target.checked)}
                className="w-5 h-5 accent-[#14B8A6]"
              />
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Add extra security for valuable or sensitive items. Requires verification for claims.
            </p>
            
            {isConfidential && (
              <div className="space-y-4">
                <div>
                  <Label className="text-gray-700 text-base">Unique Identifier *</Label>
                  <Input
                    value={uniqueIdentifier}
                    onChange={(e) => setUniqueIdentifier(e.target.value)}
                    placeholder="e.g., Serial number, unique marking"
                    className="mt-1.5 border-2 border-gray-200 focus:border-[#14B8A6] text-base"
                  />
                  <p className="text-xs text-gray-500 mt-1">This will be hidden from public view</p>
                </div>
                <div>
                  <Label className="text-gray-700 text-base">Hidden Detail (Optional)</Label>
                  <Textarea
                    value={hiddenDetail}
                    onChange={(e) => setHiddenDetail(e.target.value)}
                    placeholder="Additional verification details..."
                    className="mt-1.5 border-2 border-gray-200 focus:border-[#14B8A6] min-h-[80px] text-base"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Image Upload */}
          <div>
            <Label className="text-gray-700 text-base">Upload Image (JPG/PNG, Max 5MB)</Label>
            <div className="mt-2">
              {!imagePreview ? (
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                  <Upload size={32} className="text-gray-400 mb-2" />
                  <span className="text-base text-gray-500">Click to upload image</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              ) : (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={() => setImagePreview(null)}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>

          <Button
            type="submit"
            className={`w-full py-6 text-white font-semibold text-base shadow-md hover:shadow-lg transition-all ${
              itemType === 'lost'
                ? 'bg-[#EF4444] hover:bg-[#DC2626]'
                : 'bg-[#3B82F6] hover:bg-[#2563EB]'
            }`}
          >
            Submit {itemType === 'lost' ? 'Lost' : 'Found'} Item Report
          </Button>
        </form>
      </div>
    </div>
  );
}