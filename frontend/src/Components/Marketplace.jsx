import React, { useState, useEffect } from 'react';
import { X, Upload, Plus, MapPin, Phone, Mail, Truck, Star, Filter, Search,TrendingUp,        // ← ADD THIS
  Loader,            // ← ADD THIS  
  Send , Package as PackageIcon  } from 'lucide-react';

import axios from 'axios';
// Mock API service (replace with real axios calls to your backend)
const api = {
  getProducts: async () => {
    const stored = localStorage.getItem('marketplace_products');
    return stored ? JSON.parse(stored) : [];
  },
  createProduct: async (formData) => {
    const products = await api.getProducts();
    const newProduct = {
      _id: Date.now().toString(),
      ...formData,
      createdAt: new Date().toISOString(),
      farmerId: {
        _id: 'farmer1',
        name: formData.farmerName || 'Ramesh Kumar',
        phone: formData.farmerPhone || '+91 98765 43210',
        email: formData.farmerEmail || 'ramesh@farm.in',
        location: formData.location
      }
    };
    products.push(newProduct);
    localStorage.setItem('marketplace_products', JSON.stringify(products));
    return newProduct;
  },
  getProduct: async (id) => {
    const products = await api.getProducts();
    return products.find(p => p._id === id);
  },
  deleteProduct: async (id) => {
    const products = await api.getProducts();
    const filtered = products.filter(p => p._id !== id);
    localStorage.setItem('marketplace_products', JSON.stringify(filtered));
  }
};

const AddListingModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    cropName: '',
    quantity: { value: '', unit: 'kg' },
    price: { expected: '' },
    qualityGrade: 'A',
    location: { village: '', district: '', state: '' },
    deliveryOption: 'Pickup',
    images: [],
    farmerName: '',
    farmerPhone: '',
    farmerEmail: ''
  });
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 5);
    
    // Create previews
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);
    
    // Convert to base64 for storage
    Promise.all(files.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
    })).then(base64Images => {
      setFormData(prev => ({ ...prev, images: base64Images }));
    });
  };

  const handleSubmit = async () => {
    if (!formData.cropName || !formData.quantity.value || !formData.price.expected ||
        !formData.location.village || !formData.location.district || !formData.location.state ||
        !formData.farmerName || !formData.farmerPhone) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);
    
    try {
      await api.createProduct(formData);
      onSuccess();
      onClose();
      
      // Reset
      setFormData({
        cropName: '',
        quantity: { value: '', unit: 'kg' },
        price: { expected: '' },
        qualityGrade: 'A',
        location: { village: '', district: '', state: '' },
        deliveryOption: 'Pickup',
        images: [],
        farmerName: '',
        farmerPhone: '',
        farmerEmail: ''
      });
      setImagePreviews([]);
    } catch (error) {
      alert('Failed to add listing');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-emerald-800">Add New Listing</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Crop Name *</label>
              <input
                type="text"
                value={formData.cropName}
                onChange={(e) => setFormData({ ...formData, cropName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="e.g., Wheat, Rice, Tomatoes"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity *</label>
                <input
                  type="number"
                  value={formData.quantity.value}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    quantity: { ...formData.quantity, value: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                <select
                  value={formData.quantity.unit}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    quantity: { ...formData.quantity, unit: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="kg">Kilograms</option>
                  <option value="quintal">Quintals</option>
                  <option value="ton">Tons</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Expected Price (₹) *</label>
              <input
                type="number"
                value={formData.price.expected}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  price: { ...formData.price, expected: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Price per unit"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quality Grade</label>
              <select
                value={formData.qualityGrade}
                onChange={(e) => setFormData({ ...formData, qualityGrade: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="A">Grade A (Premium)</option>
                <option value="B">Grade B (Standard)</option>
                <option value="C">Grade C (Economy)</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Village *</label>
                <input
                  type="text"
                  value={formData.location.village}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    location: { ...formData.location, village: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">District *</label>
                <input
                  type="text"
                  value={formData.location.district}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    location: { ...formData.location, district: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                <input
                  type="text"
                  value={formData.location.state}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    location: { ...formData.location, state: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Option</label>
              <select
                value={formData.deliveryOption}
                onChange={(e) => setFormData({ ...formData, deliveryOption: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Pickup">Pickup Only</option>
                <option value="Delivery">Delivery Available</option>
                <option value="Both">Both Options</option>
              </select>
            </div>

            <div className="border-t pt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Farmer Details</h3>
              <div className="space-y-3">
                <input
                  type="text"
                  value={formData.farmerName}
                  onChange={(e) => setFormData({ ...formData, farmerName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Your Name *"
                />
                <input
                  type="tel"
                  value={formData.farmerPhone}
                  onChange={(e) => setFormData({ ...formData, farmerPhone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Phone Number *"
                />
                <input
                  type="email"
                  value={formData.farmerEmail}
                  onChange={(e) => setFormData({ ...formData, farmerEmail: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Email (optional)"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Upload Images (up to 5)</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="flex items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-emerald-500"
              >
                <Upload size={20} className="mr-2" />
                <span>Click to upload images</span>
              </label>
              
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-5 gap-2 mt-3">
                  {imagePreviews.map((preview, idx) => (
                    <img
                      key={idx}
                      src={preview}
                      alt={`Preview ${idx + 1}`}
                      className="w-full h-20 object-cover rounded"
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:bg-gray-400"
              >
                {loading ? 'Adding...' : 'Add Listing'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


const ProductDetailsModal = ({ product, isOpen, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showContactForm, setShowContactForm] = useState(false);
  const [buyerInfo, setBuyerInfo] = useState({ name: '', phone: '' });
  const [sending, setSending] = useState(false);

  const handleContactFarmer = async () => {
    if (!buyerInfo.name || !buyerInfo.phone) {
      alert('Please enter your name and phone number');
      return;
    }

    if (!/^\d{10}$/.test(buyerInfo.phone)) {
      alert('Please enter a valid 10-digit phone number');
      return;
    }

    setSending(true);
    try {
      const response = await axios.post('http://localhost:5000/api/notifications/contact', {
        productId: product._id,
        buyerName: buyerInfo.name,
        buyerPhone: buyerInfo.phone
      });

      if (response.data.success) {
        alert('✅ Contact request sent! Farmer notified.');
        setShowContactForm(false);
        setBuyerInfo({ name: '', phone: '' });
      }
    } catch (error) {
      console.error('Contact error:', error);
      alert('Failed: ' + (error.response?.data?.message || 'Try again'));
    } finally {
      setSending(false);
    }
  };

  if (!isOpen || !product) return null;

  return (
    // ✅ ONLY THIS BACKGROUND CHANGED - Everything else same
    <div className="fixed inset-0 bg-white/10 backdrop-blur-md flex items-center justify-center p-4 z-50">
      {/* ✨ ONLY MAIN CONTAINER BACKGROUND CHANGED */}
      <div className="bg-white/95 backdrop-blur-xl shadow-2xl rounded-2xl border border-white/50 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-emerald-800">{product.cropName}</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              {product.images && product.images.length > 0 ? (
                <div>
                  <img
                    src={product.images[currentImageIndex]}
                    alt={product.cropName}
                    className="w-full h-80 object-cover rounded-lg"
                  />
                  {product.images.length > 1 && (
                    <div className="flex gap-2 mt-3 overflow-x-auto">
                      {product.images.map((img, idx) => (
                        <img
                          key={idx}
                          src={img}
                          alt={`${product.cropName} ${idx + 1}`}
                          onClick={() => setCurrentImageIndex(idx)}
                          className={`w-20 h-20 object-cover rounded cursor-pointer ${
                            idx === currentImageIndex ? 'ring-2 ring-emerald-500' : ''
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-full h-80 bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-gray-400">No image</span>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Price</h3>
                <p className="text-2xl font-bold text-emerald-600">
                  ₹{product.price.expected}/{product.quantity.unit}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Quantity Available</h3>
                  <p className="text-lg font-semibold">
                    {product.quantity.value} {product.quantity.unit}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Quality Grade</h3>
                  <div className="flex items-center">
                    <Star size={18} className="text-yellow-500 fill-yellow-500 mr-1" />
                    <span className="text-lg font-semibold">Grade {product.qualityGrade}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 flex items-center mb-1">
                  <MapPin size={16} className="mr-1" /> Location
                </h3>
                <p className="text-gray-700">
                  {product.location.village}, {product.location.district}, {product.location.state}
                </p>
              </div>

              <div className="border-t pt-4 mt-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Farmer Details</h3>
                <div className="space-y-2">
                  <p className="text-gray-700">
                    <strong>Name:</strong> {product.farmerId?.name || 'Ramesh Kumar'}
                  </p>
                  <p className="text-gray-700 flex items-center">
                    <Phone size={16} className="mr-2" />
                    {product.farmerId?.phone || '+91 98765 43210'}
                  </p>
                </div>
              </div>

              {!showContactForm ? (
                <button 
                  onClick={() => setShowContactForm(true)}
                  className="w-full mt-4 px-6 py-3 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 font-semibold"
                >
                  Contact Farmer
                </button>
              ) : (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-3">Your Contact Information</h4>
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Your Name"
                      value={buyerInfo.name}
                      onChange={(e) => setBuyerInfo({ ...buyerInfo, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <input
                      type="tel"
                      placeholder="Your Phone Number (10 digits)"
                      value={buyerInfo.phone}
                      onChange={(e) => setBuyerInfo({ ...buyerInfo, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowContactForm(false)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleContactFarmer}
                        disabled={sending}
                        className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:bg-gray-400"
                      >
                        {sending ? 'Sending...' : 'Send Request'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};





const ProductCard = ({ product, onClick }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer">
      <div onClick={onClick}>
        {product.images && product.images.length > 0 ? (
          <img
            src={product.images[0]}
            alt={product.cropName}
            className="w-full h-48 object-cover"
          />
        ) : (
          <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">No image</span>
          </div>
        )}
        
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-bold text-gray-800">{product.cropName}</h3>
            <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-1 rounded">
              Grade {product.qualityGrade}
            </span>
          </div>
          
          <p className="text-2xl font-bold text-emerald-600 mb-2">
            ₹{product.price.expected}/{product.quantity.unit}
          </p>
          
          <p className="text-sm text-gray-600 mb-2">
            Available: {product.quantity.value} {product.quantity.unit}
          </p>
          
          <div className="flex items-center text-sm text-gray-500 mb-3">
            <MapPin size={14} className="mr-1" />
            {product.location.village}, {product.location.district}
          </div>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
            className="w-full px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 font-semibold"
          >
            Contact Farmer
          </button>
        </div>
      </div>
    </div>
  );
};

const Marketplace = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  
  // Filter states
  const [filters, setFilters] = useState({
    location: '',
    grade: '',
    priceRange: '',
    searchQuery: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await api.getProducts();
      setProducts(data);
      setFilteredProducts(data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Apply filters whenever filter state changes
  useEffect(() => {
    let filtered = [...products];

    // Search filter
    if (filters.searchQuery) {
      filtered = filtered.filter(p => 
        p.cropName.toLowerCase().includes(filters.searchQuery.toLowerCase())
      );
    }

    // Location filter
    if (filters.location) {
      filtered = filtered.filter(p => 
        p.location.district.toLowerCase().includes(filters.location.toLowerCase()) ||
        p.location.state.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    // Grade filter
    if (filters.grade) {
      filtered = filtered.filter(p => p.qualityGrade === filters.grade);
    }

    // Price range filter
    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split('-').map(Number);
      filtered = filtered.filter(p => {
        const price = parseFloat(p.price.expected);
        if (max) {
          return price >= min && price <= max;
        } else {
          return price >= min;
        }
      });
    }

    setFilteredProducts(filtered);
  }, [filters, products]);

  const handleProductClick = async (product) => {
    const fullProduct = await api.getProduct(product._id);
    setSelectedProduct(fullProduct);
    setIsDetailsModalOpen(true);
  };

  const resetFilters = () => {
    setFilters({
      location: '',
      grade: '',
      priceRange: '',
      searchQuery: ''
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-emerald-700 to-teal-600 text-white py-5 md:py-6 px-4 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-1">Farmer Marketplace</h1>
              <p className="text-emerald-100 text-sm md:text-base">Connect directly with farmers for fresh produce</p>
            </div>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center justify-center gap-2 px-4 md:px-6 py-2.5 md:py-3 bg-white text-emerald-700 rounded-lg hover:bg-emerald-50 font-semibold shadow-lg transition-all hover:scale-105 w-full sm:w-auto"
            >
              <Plus size={20} />
              Add Listing
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search for crops..."
              value={filters.searchQuery}
              onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
              className="w-full pl-12 pr-4 py-3 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-300"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Filter Section */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 text-emerald-700 font-semibold hover:text-emerald-800"
            >
              <Filter size={20} />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
            
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                Showing {filteredProducts.length} of {products.length} listings
              </span>
              {(filters.location || filters.grade || filters.priceRange) && (
                <button
                  onClick={resetFilters}
                  className="text-sm text-emerald-600 hover:text-emerald-800 font-medium"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  placeholder="District or State"
                  value={filters.location}
                  onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quality Grade</label>
                <select
                  value={filters.grade}
                  onChange={(e) => setFilters({ ...filters, grade: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">All Grades</option>
                  <option value="A">Grade A (Premium)</option>
                  <option value="B">Grade B (Standard)</option>
                  <option value="C">Grade C (Economy)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price Range (₹)</label>
                <select
                  value={filters.priceRange}
                  onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">All Prices</option>
                  <option value="0-1000">₹0 - ₹1,000</option>
                  <option value="1000-2500">₹1,000 - ₹2,500</option>
                  <option value="2500-5000">₹2,500 - ₹5,000</option>
                  <option value="5000-10000">₹5,000 - ₹10,000</option>
                  <option value="10000">₹10,000+</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
            <p className="text-gray-500 mt-4">Loading listings...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500 mb-4">
              {products.length === 0 
                ? 'No listings available yet' 
                : 'No products match your filters'}
            </p>
            {products.length === 0 ? (
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="px-6 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
              >
                Add First Listing
              </button>
            ) : (
              <button
                onClick={resetFilters}
                className="px-6 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onClick={() => handleProductClick(product)}
              />
            ))}
          </div>
        )}
      </div>

      <AddListingModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={fetchProducts}
      />

      <ProductDetailsModal
        product={selectedProduct}
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedProduct(null);
        }}
      />
    </div>
  );
};

export default Marketplace;