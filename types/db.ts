import { Database } from "./supabase";
import * as Location from 'expo-location';

export type Event = Database["public"]["Tables"]["events"]["Row"];

export type NearbyEvent =
  Database["public"]["Functions"]["nearby_events"]["Returns"];

export type RecommendedEvent = Database["public"]["Functions"]["get_ordered_data"]["Returns"];

export type Attendance = Database["public"]["Tables"]["attendance"]["Row"];

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export type LocationContextType = {
  location: Location.LocationObject | null;
  errorMsg: string | null;
  loading: boolean;
}

export type LocationData = {
  features: {
    geometry: {
      coordinates: [number, number]; // [longitude, latitude]
    };
    properties: {
      name: string;
    };
  }[];
};


// Define the structure for the datasource object
export interface DataSource {
  sourcename: string; // Name of the source
  attribution: string; // Attribution information
  license: string; // License type
  url: string; // URL for copyright
}

// Define the structure for the geometry object
export interface Geometry {
  type: 'Point'; // Type of geometry
  coordinates: [number, number]; // Coordinates as [longitude, latitude]
}

// Define the structure for the properties of each feature
export interface Properties {
  country: string; // Country name
  city?: string; // City name (optional)
  postcode?: string; // Postal code (optional)
  county?: string; // County name (optional)
  street?: string; // Street name (optional)
  name: string; // Name of the place
  state: string; // State name
  datasource: DataSource; // Data source information
  country_code: string; // Country code
  lon: number; // Longitude
  lat: number; // Latitude
  state_code?: string; // State code (optional)
  result_type: string; // Type of result (e.g., "amenity")
  formatted: string; // Formatted address
  address_line1: string; // Address line 1
  address_line2: string; // Address line 2
  category?: string; // Category (optional)
  timezone?: { // Timezone information (optional)
    name: string;
    offset_STD: string;
    offset_STD_seconds: number;
    offset_DST: string;
    offset_DST_seconds: number;
    abbreviation_STD: string;
    abbreviation_DST: string;
  };
  plus_code: string; // Plus code for the location
  rank?: { // Rank information (optional)
    confidence: number; // Confidence score
    match_type: string; // Type of match (e.g., "full_match")
    importance?: number; // Importance score (optional)
  };
  place_id: string; // Unique place identifier
}

// Define the structure for each feature
export interface Feature {
  type: 'Feature'; // Type of the feature
  geometry: Geometry; // Geometry of the feature
  properties: Properties; // Properties of the feature
}

// Define the structure for the overall response
export interface FeatureCollection {
  type: 'FeatureCollection'; // Type of the collection
  features: Feature[]; // Array of features
  query?: { // Query information (optional)
    text: string; // Text used for the query
  };
}

export type EventExtended = Event & { dist_meters: number, lat: number, long: number };