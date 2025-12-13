const mongoose = require('mongoose');

const zoneSchema = new mongoose.Schema({
  zoneName: {
    type: String,
    required: true
  },
  soilMoisture: {
    value: { type: Number, default: 0 },
    status: { type: String, enum: ['Dry', 'Optimal', 'Wet'], default: 'Optimal' },
    lastUpdated: Date
  },
  soilNutrients: {
    nitrogen: { type: Number, default: 0 },
    phosphorus: { type: Number, default: 0 },
    potassium: { type: Number, default: 0 },
    lastUpdated: Date
  },
  soilPH: {
    value: { type: Number, default: 7.0 },
    lastUpdated: Date
  },
  cropHealth: {
    score: { type: Number, default: 75 },
    status: { type: String, enum: ['Healthy', 'Stress', 'Critical'], default: 'Healthy' },
    lastUpdated: Date
  },
  recommendations: {
    irrigation: {
      amount: Number,
      unit: { type: String, default: 'mm' },
      timing: String,
      confidence: Number
    },
    fertilizer: {
      amount: Number,
      unit: { type: String, default: 'kg/ha' },
      type: String,
      timing: String,
      confidence: Number
    },
    explanation: String,
    weatherInfluence: String,
    lastGenerated: Date
  }
});

const fieldSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fieldName: {
    type: String,
    required: true,
    trim: true
  },
  cropType: {
    type: String,
    required: true,
    trim: true
  },
  fieldArea: {
    value: { type: Number, required: true },
    unit: { type: String, default: 'hectares' }
  },
  location: {
    village: String,
    district: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  numberOfZones: {
    type: Number,
    required: true,
    min: 1
  },
  zones: [zoneSchema],
  overallHealth: {
    status: { type: String, enum: ['Good', 'Fair', 'Poor'], default: 'Good' },
    score: { type: Number, default: 75 }
  },
  weatherSummary: {
    temperature: Number,
    humidity: Number,
    rainfall: String,
    stressRisk: String,
    lastUpdated: Date
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Field', fieldSchema);
