
import numpy as np
from stable_baselines3 import PPO
import os
from typing import Dict

# Model path
MODEL_PATH = "./model/improved_ppo_agriculture.zip"

# Action space mappings (must match training environment)
IRRIGATION_OPTIONS = [0, 5, 10, 15, 20]  # mm
FERTILIZER_OPTIONS = [0, 1, 2, 3]  # kg/acre

# Optimal ranges for health calculation
OPTIMAL_MOISTURE_RANGE = (40, 70)
OPTIMAL_N_RANGE = (50, 150)
OPTIMAL_P_RANGE = (30, 100)
OPTIMAL_K_RANGE = (40, 120)
OPTIMAL_PH_RANGE = (6.0, 7.5)

# Load the trained model
print("🔄 Loading DRL model...")
if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError(f"Model not found at {MODEL_PATH}")

model = PPO.load(MODEL_PATH)
print("✅ Model loaded successfully!")


def calculate_health_score(moisture: float, nitrogen: float, phosphorus: float, 
                          potassium: float, ph: float) -> float:
    """
    Calculate crop health score based on soil conditions
    Returns: Health score (0-100)
    """
    health = 100.0
    
    # Moisture penalties
    if moisture < OPTIMAL_MOISTURE_RANGE[0]:
        health -= (OPTIMAL_MOISTURE_RANGE[0] - moisture) * 0.8
    elif moisture > OPTIMAL_MOISTURE_RANGE[1]:
        health -= (moisture - OPTIMAL_MOISTURE_RANGE[1]) * 0.4
    
    # Nutrient penalties
    if nitrogen < OPTIMAL_N_RANGE[0]:
        health -= (OPTIMAL_N_RANGE[0] - nitrogen) * 0.3
    if phosphorus < OPTIMAL_P_RANGE[0]:
        health -= (OPTIMAL_P_RANGE[0] - phosphorus) * 0.2
    if potassium < OPTIMAL_K_RANGE[0]:
        health -= (OPTIMAL_K_RANGE[0] - potassium) * 0.2
    
    # pH penalty
    if not (OPTIMAL_PH_RANGE[0] <= ph <= OPTIMAL_PH_RANGE[1]):
        health -= 15
    
    return float(max(0, min(100, health)))


def get_recommendation(moisture: float, nitrogen: float, phosphorus: float,
                      potassium: float, ph: float, growth: float,
                      temp: float, humidity: float, rain_prob: float) -> Dict:
    """
    Get irrigation and fertilizer recommendation from DRL model
    
    Args:
        moisture: Soil moisture percentage (0-100)
        nitrogen: Nitrogen level in ppm (0-200)
        phosphorus: Phosphorus level in ppm (0-200)
        potassium: Potassium level in ppm (0-200)
        ph: Soil pH (4.0-9.0)
        growth: Crop growth stage (0.0-1.0)
        temp: Temperature in Celsius (-10 to 50)
        humidity: Humidity percentage (0-100)
        rain_prob: Rain probability (0.0-1.0)
    
    Returns:
        Dictionary with irrigation_mm, fertilizer_kg, and health score
    """
    # Build state array (11 values: moisture, N, P, K, pH, growth, temp, humidity, rain_prob, prev_irrigation, prev_fertilizer)
    state = np.array([
        moisture,
        nitrogen,
        phosphorus,
        potassium,
        ph,
        growth,
        temp,
        humidity,
        rain_prob,
        0.0,  # previous irrigation (not available for first call)
        0.0   # previous fertilizer (not available for first call)
    ], dtype=np.float32)
    
    # Get prediction from model
    action, _states = model.predict(state, deterministic=True)
    
    # Convert action indices to actual values
    irrigation_mm = int(IRRIGATION_OPTIONS[int(action[0])])
    fertilizer_kg = int(FERTILIZER_OPTIONS[int(action[1])])
    
    # Calculate health score
    health_score = calculate_health_score(moisture, nitrogen, phosphorus, potassium, ph)
    
    # Build response
    recommendation = {
        "irrigation_mm": irrigation_mm,
        "fertilizer_kg": fertilizer_kg,
        "health": round(health_score, 2)
    }
    
    return recommendation


# Test function (optional)
if __name__ == "__main__":
    print("\n🧪 Testing recommendation function...\n")
    
    # Test case: Dry soil, low nutrients
    test_rec = get_recommendation(
        moisture=25.0,
        nitrogen=35.0,
        phosphorus=25.0,
        potassium=30.0,
        ph=6.5,
        growth=0.4,
        temp=32.0,
        humidity=45.0,
        rain_prob=0.1
    )
    
    print("Test Recommendation:")
    print(f"  Irrigation: {test_rec['irrigation_mm']} mm")
    print(f"  Fertilizer: {test_rec['fertilizer_kg']} kg/acre")
    print(f"  Health Score: {test_rec['health']}%")
