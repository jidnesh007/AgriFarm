const express = require('express');
const router = express.Router();
const Field = require('../models/Field'); // Adjust path as needed

router.get('/', async (req, res) => {
  try {
    // Fetch all fields from database
    const fields = await Field.find();

    if (!fields || fields.length === 0) {
      return res.status(200).json({
        totalFields: 0,
        averages: {
          moisture: 0,
          nitrogen: 0,
          phosphorus: 0,
          potassium: 0,
          ph: 0
        },
        risks: [],
        chartData: {
          moisture: [],
          npk: [],
          ph: []
        },
        fields: [],
        healthSummary: "No fields available for analysis."
      });
    }

    // Calculate total fields
    const totalFields = fields.length;

    // Calculate averages
    const totals = fields.reduce((acc, field) => {
      acc.moisture += field.moisture || 0;
      acc.nitrogen += field.N || 0;
      acc.phosphorus += field.P || 0;
      acc.potassium += field.K || 0;
      acc.ph += field.pH || 0;
      return acc;
    }, { moisture: 0, nitrogen: 0, phosphorus: 0, potassium: 0, ph: 0 });

    const averages = {
      moisture: (totals.moisture / totalFields).toFixed(2),
      nitrogen: (totals.nitrogen / totalFields).toFixed(2),
      phosphorus: (totals.phosphorus / totalFields).toFixed(2),
      potassium: (totals.potassium / totalFields).toFixed(2),
      ph: (totals.ph / totalFields).toFixed(2)
    };

    // Detect risks based on thresholds
    const risks = [];
    fields.forEach(field => {
      const fieldName = field.fieldName || field.name || 'Unknown Field';
      
      if (field.moisture < 25) {
        risks.push({
          fieldName: fieldName,
          issue: `Low moisture level (${field.moisture}%) - Irrigation needed`
        });
      }
      
      if (field.N < 40) {
        risks.push({
          fieldName: fieldName,
          issue: `Low nitrogen level (${field.N}) - Fertilization required`
        });
      }
      
      if (field.P < 40) {
        risks.push({
          fieldName: fieldName,
          issue: `Low phosphorus level (${field.P}) - P-rich fertilizer needed`
        });
      }
      
      if (field.K < 40) {
        risks.push({
          fieldName: fieldName,
          issue: `Low potassium level (${field.K}) - K-rich fertilizer needed`
        });
      }
      
      if (field.pH < 5.5) {
        risks.push({
          fieldName: fieldName,
          issue: `pH too acidic (${field.pH}) - Lime application recommended`
        });
      }
      
      if (field.pH > 8.0) {
        risks.push({
          fieldName: fieldName,
          issue: `pH too alkaline (${field.pH}) - Sulfur application recommended`
        });
      }
    });

    // Prepare chart data
    const chartData = {
      moisture: fields.map(field => ({
        name: field.fieldName || field.name || 'Field',
        value: field.moisture || 0
      })),
      npk: fields.map(field => ({
        name: field.fieldName || field.name || 'Field',
        nitrogen: field.N || 0,
        phosphorus: field.P || 0,
        potassium: field.K || 0
      })),
      ph: fields.map(field => ({
        name: field.fieldName || field.name || 'Field',
        value: field.pH || 0
      }))
    };

    // Calculate health score for each field (0-100)
    const fieldsWithHealth = fields.map(field => {
      let healthScore = 100;

      // Deduct points for moisture issues
      if (field.moisture < 25) healthScore -= 20;
      else if (field.moisture < 40) healthScore -= 10;

      // Deduct points for nitrogen issues
      if (field.N < 40) healthScore -= 15;
      else if (field.N < 60) healthScore -= 7;

      // Deduct points for phosphorus issues
      if (field.P < 40) healthScore -= 15;
      else if (field.P < 60) healthScore -= 7;

      // Deduct points for potassium issues
      if (field.K < 40) healthScore -= 15;
      else if (field.K < 60) healthScore -= 7;

      // Deduct points for pH issues
      if (field.pH < 5.5 || field.pH > 8.0) healthScore -= 20;
      else if (field.pH < 6.0 || field.pH > 7.5) healthScore -= 10;

      return {
        fieldName: field.fieldName || field.name || 'Unknown Field',
        cropType: field.cropType || 'Not specified',
        moisture: field.moisture || 0,
        N: field.N || 0,
        P: field.P || 0,
        K: field.K || 0,
        pH: field.pH || 0,
        healthScore: Math.max(0, healthScore)
      };
    });

    // Generate health summary
    let healthSummary = '';
    const avgHealthScore = fieldsWithHealth.reduce((sum, f) => sum + f.healthScore, 0) / totalFields;
    
    const lowMoistureCount = fields.filter(f => f.moisture < 25).length;
    const lowNPKCount = fields.filter(f => f.N < 40 || f.P < 40 || f.K < 40).length;
    const phImbalanceCount = fields.filter(f => f.pH < 5.5 || f.pH > 8.0).length;

    if (avgHealthScore >= 80) {
      healthSummary = 'Overall farm health is excellent. Most fields are in optimal condition with balanced nutrients and adequate moisture levels.';
    } else if (avgHealthScore >= 60) {
      healthSummary = 'Farm health is moderate. ';
      if (lowMoistureCount > totalFields * 0.3) {
        healthSummary += 'Moisture levels are declining in several fields - irrigation scheduling recommended. ';
      }
      if (lowNPKCount > totalFields * 0.3) {
        healthSummary += 'Nutrient deficiencies detected in multiple fields - fertilization program needed. ';
      }
      if (phImbalanceCount > 0) {
        healthSummary += 'pH variance observed in some areas - soil amendment required.';
      }
    } else {
      healthSummary = 'Critical attention required. ';
      if (lowMoistureCount > 0) {
        healthSummary += `${lowMoistureCount} field(s) have critically low moisture levels. `;
      }
      if (lowNPKCount > 0) {
        healthSummary += `${lowNPKCount} field(s) show severe nutrient deficiencies. `;
      }
      if (phImbalanceCount > 0) {
        healthSummary += `${phImbalanceCount} field(s) have significant pH imbalance.`;
      }
    }

    // Send response
    res.status(200).json({
      totalFields,
      averages,
      risks,
      chartData,
      fields: fieldsWithHealth,
      healthSummary
    });

  } catch (error) {
    console.error('Analytics Error:', error);
    res.status(500).json({
      message: 'Error fetching analytics data',
      error: error.message
    });
  }
});

module.exports = router;
