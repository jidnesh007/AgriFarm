const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');

// @route   GET /api/marketplace/products
// @desc    Get all marketplace products
// @access  Public
router.get('/products', async (req, res) => {
  try {
    const { status, qualityGrade, district, cropName } = req.query;
    
    let query = {};
    
    if (status) query.status = status;
    if (qualityGrade) query.qualityGrade = qualityGrade;
    if (district) query['location.district'] = new RegExp(district, 'i');
    if (cropName) query.cropName = new RegExp(cropName, 'i');

    const products = await Product.find(query)
      .populate('farmerId', 'name email phone location')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch products', 
      error: error.message 
    });
  }
});

// @route   GET /api/marketplace/products/:id
// @desc    Get single product with farmer details
// @access  Public
router.get('/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('farmerId', 'name email phone location');

    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: 'Product not found' 
      });
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch product', 
      error: error.message 
    });
  }
});

// @route   POST /api/marketplace/products
// @desc    Create new product listing
// @access  Private
router.post('/products', protect, async (req, res) => {
  try {
    const {
      cropName,
      quantity,
      price,
      qualityGrade,
      location,
      deliveryOption,
      images
    } = req.body;

    if (!cropName || !quantity || !price || !location) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide all required fields' 
      });
    }

    const parsedQuantity = typeof quantity === 'string' ? JSON.parse(quantity) : quantity;
    const parsedPrice = typeof price === 'string' ? JSON.parse(price) : price;
    const parsedLocation = typeof location === 'string' ? JSON.parse(location) : location;

    const product = await Product.create({
      cropName,
      quantity: parsedQuantity,
      price: parsedPrice,
      qualityGrade: qualityGrade || 'B',
      location: parsedLocation,
      deliveryOption: deliveryOption || 'Pickup',
      images: images || [],
      farmerId: req.user._id
    });

    await product.populate('farmerId', 'name email phone location');

    res.status(201).json({
      success: true,
      message: 'Product listed successfully',
      data: product
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create product', 
      error: error.message 
    });
  }
});

// @route   PUT /api/marketplace/products/:id
// @desc    Update product listing
// @access  Private
router.put('/products/:id', protect, async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: 'Product not found' 
      });
    }

    if (product.farmerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to update this product' 
      });
    }

    const {
      cropName,
      quantity,
      price,
      qualityGrade,
      location,
      deliveryOption,
      status,
      images
    } = req.body;

    const parsedQuantity = quantity && typeof quantity === 'string' ? JSON.parse(quantity) : quantity;
    const parsedPrice = price && typeof price === 'string' ? JSON.parse(price) : price;
    const parsedLocation = location && typeof location === 'string' ? JSON.parse(location) : location;

    if (cropName) product.cropName = cropName;
    if (parsedQuantity) product.quantity = parsedQuantity;
    if (parsedPrice) product.price = parsedPrice;
    if (qualityGrade) product.qualityGrade = qualityGrade;
    if (parsedLocation) product.location = parsedLocation;
    if (deliveryOption) product.deliveryOption = deliveryOption;
    if (status) product.status = status;
    if (images) product.images = images;

    await product.save();
    await product.populate('farmerId', 'name email phone location');

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: product
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update product', 
      error: error.message 
    });
  }
});

// @route   DELETE /api/marketplace/products/:id
// @desc    Delete product listing
// @access  Private
router.delete('/products/:id', protect, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: 'Product not found' 
      });
    }

    if (product.farmerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to delete this product' 
      });
    }

    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
      data: {}
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete product', 
      error: error.message 
    });
  }
});

// @route   GET /api/marketplace/my-products
// @desc    Get current user's products
// @access  Private
router.get('/my-products', protect, async (req, res) => {
  try {
    const products = await Product.find({ farmerId: req.user._id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    console.error('Get my products error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch your products', 
      error: error.message 
    });
  }
});

module.exports = router;