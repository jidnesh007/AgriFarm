const Product = require("../models/Product");
const aiService = require("../services/aiService");
const i18n = require("i18n");

// Create Product Listing
exports.createProduct = async (req, res) => {
  try {
    const {
      cropName,
      quantity,
      expectedPrice,
      qualityGrade,
      location,
      deliveryOption,
      language,
    } = req.body;

    if (language) i18n.setLocale(req, language);

    // Get AI price guidance
    const priceGuidance = await aiService.getPriceGuidance(cropName, location.district, qualityGrade);
    
    // Get demand analysis
    const demandAnalysis = await aiService.getDemandLevel(cropName, location.district);

    // Determine price warning
    let priceWarning = null;
    if (expectedPrice < priceGuidance.min * 0.8) {
      priceWarning = "underpriced";
    } else if (expectedPrice > priceGuidance.max * 1.2) {
      priceWarning = "overpriced";
    } else {
      priceWarning = "fair";
    }

    const product = new Product({
      farmer: req.userId, // Changed from req.user.id to req.userId
      cropName,
      quantity: {
        value: quantity.value,
        unit: quantity.unit || "kg",
      },
      price: {
        expected: expectedPrice,
        aiSuggested: {
          min: priceGuidance.min,
          max: priceGuidance.max,
        },
        final: expectedPrice,
      },
      qualityGrade,
      location,
      deliveryOption,
      aiInsights: {
        demandLevel: demandAnalysis.level,
        priceWarning,
        marketTrend: priceGuidance.trend,
        confidence: priceGuidance.confidence,
      },
    });

    await product.save();

    res.status(201).json({
      success: true,
      message: i18n.__("marketplace.productCreated"),
      data: product,
      guidance: {
        suggestedPrice: priceGuidance,
        demand: demandAnalysis,
        warning: priceWarning !== "fair" ? {
          type: priceWarning,
          message: i18n.__(`marketplace.warnings.${priceWarning}`, {
            suggestedMin: priceGuidance.min,
            suggestedMax: priceGuidance.max,
          }),
        } : null,
      },
    });
  } catch (error) {
    console.error("Create product error:", error);
    res.status(500).json({
      success: false,
      message: i18n.__("errors.general"),
      error: error.message,
    });
  }
};

// Get AI Price Guidance
exports.getPriceGuidance = async (req, res) => {
  try {
    const { cropName, district, qualityGrade, language } = req.body;
    
    if (language) i18n.setLocale(req, language);

    const guidance = await aiService.getPriceGuidance(cropName, district, qualityGrade);
    const demand = await aiService.getDemandLevel(cropName, district);

    res.json({
      success: true,
      data: {
        priceRange: {
          min: guidance.min,
          max: guidance.max,
          recommended: guidance.recommended,
        },
        trend: guidance.trend,
        demand: demand.level,
        confidence: guidance.confidence,
        message: i18n.__("marketplace.priceGuidance", {
          min: guidance.min,
          max: guidance.max,
          trend: i18n.__(`marketplace.trends.${guidance.trend}`),
        }),
      },
    });
  } catch (error) {
    console.error("Price guidance error:", error);
    res.status(500).json({
      success: false,
      message: i18n.__("errors.general"),
    });
  }
};

// Get Demand Analysis
exports.getDemandAnalysis = async (req, res) => {
  try {
    const { cropName, district, language } = req.body;
    
    if (language) i18n.setLocale(req, language);

    const analysis = await aiService.getDemandLevel(cropName, district);

    res.json({
      success: true,
      data: {
        level: analysis.level,
        score: analysis.score,
        factors: analysis.factors,
        message: i18n.__(`marketplace.demand.${analysis.level}`, {
          crop: cropName,
        }),
      },
    });
  } catch (error) {
    console.error("Demand analysis error:", error);
    res.status(500).json({
      success: false,
      message: i18n.__("errors.general"),
    });
  }
};

// Get All Products (with filters)
exports.getAllProducts = async (req, res) => {
  try {
    const {
      cropName,
      qualityGrade,
      minPrice,
      maxPrice,
      district,
      state,
      status,
      sortBy,
      page = 1,
      limit = 20,
      language,
    } = req.query;

    if (language) i18n.setLocale(req, language);

    const query = { status: status || "active" };

    if (cropName) query.cropName = new RegExp(cropName, "i");
    if (qualityGrade) query.qualityGrade = qualityGrade;
    if (district) query["location.district"] = new RegExp(district, "i");
    if (state) query["location.state"] = new RegExp(state, "i");
    if (minPrice || maxPrice) {
      query["price.final"] = {};
      if (minPrice) query["price.final"].$gte = Number(minPrice);
      if (maxPrice) query["price.final"].$lte = Number(maxPrice);
    }

    let sort = { "visibility.score": -1, createdAt: -1 };
    if (sortBy === "price_low") sort = { "price.final": 1 };
    if (sortBy === "price_high") sort = { "price.final": -1 };
    if (sortBy === "newest") sort = { createdAt: -1 };

    const products = await Product.find(query)
      .populate("farmer", "name phone location")
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Product.countDocuments(query);

    res.json({
      success: true,
      data: products,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count,
    });
  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({
      success: false,
      message: i18n.__("errors.general"),
    });
  }
};

// Search Products
exports.searchProducts = async (req, res) => {
  try {
    const { query, language } = req.query;
    
    if (language) i18n.setLocale(req, language);

    const products = await Product.find({
      $or: [
        { cropName: new RegExp(query, "i") },
        { "location.village": new RegExp(query, "i") },
        { "location.district": new RegExp(query, "i") },
      ],
      status: "active",
    })
      .populate("farmer", "name phone")
      .sort({ "visibility.score": -1 })
      .limit(20);

    res.json({
      success: true,
      data: products,
      count: products.length,
    });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({
      success: false,
      message: i18n.__("errors.general"),
    });
  }
};

// Get Nearby Products
exports.getNearbyProducts = async (req, res) => {
  try {
    const { latitude, longitude, radius = 50, language } = req.query;
    
    if (language) i18n.setLocale(req, language);

    // For now, filter by district (can be enhanced with geospatial queries)
    const userDistrict = req.query.district;
    
    const products = await Product.find({
      "location.district": new RegExp(userDistrict, "i"),
      status: "active",
    })
      .populate("farmer", "name phone")
      .sort({ "visibility.score": -1 })
      .limit(20);

    res.json({
      success: true,
      data: products,
      message: i18n.__("marketplace.nearbyProducts", { count: products.length }),
    });
  } catch (error) {
    console.error("Nearby products error:", error);
    res.status(500).json({
      success: false,
      message: i18n.__("errors.general"),
    });
  }
};

// Get Product by ID
exports.getProductById = async (req, res) => {
  try {
    const { language } = req.query;
    if (language) i18n.setLocale(req, language);

    const product = await Product.findById(req.params.id).populate(
      "farmer",
      "name phone location"
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: i18n.__("marketplace.productNotFound"),
      });
    }

    // Increment views
    product.views += 1;
    await product.save();

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error("Get product error:", error);
    res.status(500).json({
      success: false,
      message: i18n.__("errors.general"),
    });
  }
};

// Update Product
exports.updateProduct = async (req, res) => {
  try {
    const { language } = req.body;
    if (language) i18n.setLocale(req, language);

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: i18n.__("marketplace.productNotFound"),
      });
    }

    if (product.farmer.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: i18n.__("errors.unauthorized"),
      });
    }

    Object.assign(product, req.body);
    await product.save();

    res.json({
      success: true,
      message: i18n.__("marketplace.productUpdated"),
      data: product,
    });
  } catch (error) {
    console.error("Update product error:", error);
    res.status(500).json({
      success: false,
      message: i18n.__("errors.general"),
    });
  }
};

// Delete Product
exports.deleteProduct = async (req, res) => {
  try {
    const { language } = req.query;
    if (language) i18n.setLocale(req, language);

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: i18n.__("marketplace.productNotFound"),
      });
    }

    if (product.farmer.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: i18n.__("errors.unauthorized"),
      });
    }

    await product.deleteOne();

    res.json({
      success: true,
      message: i18n.__("marketplace.productDeleted"),
    });
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({
      success: false,
      message: i18n.__("errors.general"),
    });
  }
};

// Create Inquiry
exports.createInquiry = async (req, res) => {
  try {
    const { message, language } = req.body;
    if (language) i18n.setLocale(req, language);

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: i18n.__("marketplace.productNotFound"),
      });
    }

    product.inquiries.push({
      buyer: req.userId, // Changed from req.user.id
      message,
    });

    await product.save();

    res.json({
      success: true,
      message: i18n.__("marketplace.inquirySent"),
    });
  } catch (error) {
    console.error("Create inquiry error:", error);
    res.status(500).json({
      success: false,
      message: i18n.__("errors.general"),
    });
  }
};

// Get Farmer's Products
exports.getFarmerProducts = async (req, res) => {
  try {
    const { language } = req.query;
    if (language) i18n.setLocale(req, language);

    const products = await Product.find({ farmer: req.userId }) // Changed from req.user.id
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: products,
      count: products.length,
    });
  } catch (error) {
    console.error("Get farmer products error:", error);
    res.status(500).json({
      success: false,
      message: i18n.__("errors.general"),
    });
  }
};

// Get Farmer Analytics
exports.getFarmerAnalytics = async (req, res) => {
  try {
    const { language } = req.query;
    if (language) i18n.setLocale(req, language);

    const products = await Product.find({ farmer: req.userId }); // Changed from req.user.id

    const analytics = {
      totalListings: products.length,
      activeListings: products.filter((p) => p.status === "active").length,
      soldListings: products.filter((p) => p.status === "sold").length,
      totalViews: products.reduce((sum, p) => sum + p.views, 0),
      totalInquiries: products.reduce((sum, p) => sum + p.inquiries.length, 0),
      averageVisibility: (
        products.reduce((sum, p) => sum + p.visibility.score, 0) / products.length
      ).toFixed(2),
    };

    res.json({
      success: true,
      data: analytics,
    });
  } catch (error) {
    console.error("Get analytics error:", error);
    res.status(500).json({
      success: false,
      message: i18n.__("errors.general"),
    });
  }
};

// Voice-Assisted Listing Creation
exports.voiceCreateListing = async (req, res) => {
  try {
    const { transcription, language } = req.body;
    if (language) i18n.setLocale(req, language);

    // Parse voice input using AI
    const parsedData = await aiService.parseVoiceListing(transcription, language);

    if (!parsedData.success) {
      return res.json({
        success: false,
        message: i18n.__("marketplace.voice.parseError"),
        needsClarification: parsedData.missingFields,
      });
    }

    // Create product with parsed data
    const product = new Product({
      farmer: req.userId, // Changed from req.user.id
      ...parsedData.data,
    });

    await product.save();

    res.json({
      success: true,
      message: i18n.__("marketplace.voice.listingCreated"),
      data: product,
      voiceResponse: i18n.__("marketplace.voice.confirmationMessage", {
        crop: product.cropName,
        quantity: product.quantity.value,
        price: product.price.final,
      }),
    });
  } catch (error) {
    console.error("Voice listing error:", error);
    res.status(500).json({
      success: false,
      message: i18n.__("errors.general"),
    });
  }
};