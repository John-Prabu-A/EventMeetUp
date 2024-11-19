import { Float } from "react-native/Libraries/Types/CodegenTypes";
import { FeatureCollection } from "~/types/db";

export async function getSuggestions(input: string) {
  const response = await fetch(
    `https://api.geoapify.com/v1/geocode/autocomplete?text=${input}&apiKey=${process.env.EXPO_PUBLIC_GEOAPIFY_API_KEY}`
  );

  const json : FeatureCollection = await response.json();
  return json;
}

export const retrieveDetails = async (long: Float , lat: Float) => {
  const response = await fetch(
    `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${long}&apiKey=${process.env.EXPO_PUBLIC_GEOAPIFY_API_KEY}`
  );

  const json = await response.json();
  return json;
};
