#include <napi.h>
#include <string>
#include <map>
#include <vector>

// Define Pokemon types
enum PokemonType {
  FIRE,
  WATER,
  GRASS,
  UNKNOWN
};

// Type effectiveness matrix
// Fire > Grass, Grass > Water, Water > Fire
std::map<PokemonType, std::map<PokemonType, int>> typeEffectiveness = {
  {FIRE, {{FIRE, 0}, {WATER, -1}, {GRASS, 1}}},
  {WATER, {{FIRE, 1}, {WATER, 0}, {GRASS, -1}}},
  {GRASS, {{FIRE, -1}, {WATER, 1}, {GRASS, 0}}}
};

// Convert string type to enum
PokemonType getTypeFromString(const std::string& typeStr) {
  if (typeStr == "fire" || typeStr == "Fire") return FIRE;
  if (typeStr == "water" || typeStr == "Water") return WATER;
  if (typeStr == "grass" || typeStr == "Grass") return GRASS;
  return UNKNOWN;
}

// Battle function that determines the winner based on Pokemon types
Napi::Value Battle(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();
  
  // Check if the arguments are valid
  if (info.Length() < 2 || !info[0].IsString() || !info[1].IsString()) {
    Napi::TypeError::New(env, "Two string arguments expected").ThrowAsJavaScriptException();
    return env.Null();
  }

  // Get Pokemon types from arguments
  std::string type1 = info[0].As<Napi::String>().Utf8Value();
  std::string type2 = info[1].As<Napi::String>().Utf8Value();
  
  PokemonType pokemon1Type = getTypeFromString(type1);
  PokemonType pokemon2Type = getTypeFromString(type2);
  
  // Check if types are valid
  if (pokemon1Type == UNKNOWN || pokemon2Type == UNKNOWN) {
    Napi::TypeError::New(env, "Invalid Pokemon type. Valid types are: Fire, Water, Grass").ThrowAsJavaScriptException();
    return env.Null();
  }
  
  // Determine battle outcome
  int result = typeEffectiveness[pokemon1Type][pokemon2Type];
  
  // Create result object
  Napi::Object resultObj = Napi::Object::New(env);
  
  if (result > 0) {
    resultObj.Set("winner", 1);
    resultObj.Set("message", "Pokemon 1 wins! " + type1 + " is super effective against " + type2 + "!");
  } else if (result < 0) {
    resultObj.Set("winner", 2);
    resultObj.Set("message", "Pokemon 2 wins! " + type2 + " is super effective against " + type1 + "!");
  } else {
    resultObj.Set("winner", 0);
    resultObj.Set("message", "It's a draw! Both Pokemon are of the same type or equally matched.");
  }
  
  return resultObj;
}

// Initialize the module
Napi::Object Init(Napi::Env env, Napi::Object exports) {
  exports.Set("battle", Napi::Function::New(env, Battle));
  return exports;
}

NODE_API_MODULE(battle, Init)