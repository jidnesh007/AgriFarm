const mongoose = require('mongoose');

// Zone Schema
const zoneSchema = new mongoose.Schema({
  zoneName: { type: String, required: true },
  
  soilMoisture: {
    value: { type: Number, default: 0 },
    status: { type: String, default: 'Unknown' },
    lastUpdated: { type: Date }
  },
  
  soilNutrients: {
    nitrogen: { type: Number, default: 0 },
    phosphorus: { type: Number, default: 0 },
    potassium: { type: Number, default: 0 },
    lastUpdated: { type: Date }
  },
  
  soilPH: {
    value: { type: Number, default: 7.0 },
    lastUpdated: { type: Date }
  },
  
  cropHealth: {
    score: { type: Number, default: 0 },
    status: { type: String, default: 'Unknown' },
    lastUpdated: { type: Date }
  },
  
  // UPDATED RECOMMENDATIONS SCHEMA
  recommendations: {
    irrigation: {
      amount: { type: Number, default: 0 },
      unit: { type: String, default: 'mm' },
      timing: { type: String, default: 'Not needed' },
      confidence: { type: Number, default: 0 }
    },
    fertilizer: {
      amount: { type: Number, default: 0 },
      unit: { type: String, default: 'kg/acre' },
      type: { type: String, default: 'Not needed' },
      timing: { type: String, default: 'Not needed' },
      confidence: { type: Number, default: 0 }
    },
    explanation: { type: String, default: '' },
    weatherInfluence: { type: String, default: '' },
    lastGenerated: { type: Date },
    aiGenerated: { type: Boolean, default: false },
    healthScore: { type: Number, default: 0 }
  }
});

// Field Schema
const fieldSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  
  fieldName: { 
    type: String, 
    required: true 
  },
  
  cropType: { 
    type: String, 
    required: true 
  },
  
  fieldArea: {
    value: { type: Number, required: true },
    unit: { type: String, default: 'hectares' }
  },
  
  location: {
    village: { type: String },
    district: { type: String },
    coordinates: {
      latitude: { type: Number },
      longitude: { type: Number }
    }
  },
  
  numberOfZones: { 
    type: Number, 
    required: true, 
    default: 1 
  },
  
  zones: [zoneSchema],
  
  overallHealth: {
    status: { type: String, default: 'Unknown' },
    lastUpdated: { type: Date }
  },
  
  weatherSummary: {
    temperature: { type: Number },
    humidity: { type: Number },
    rainfall: { type: String },
    stressRisk: { type: String },
    lastUpdated: { type: Date }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Field', fieldSchema);
