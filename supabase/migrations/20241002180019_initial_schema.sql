drop policy "Enable delete for users based on user_id" on "public"."events";

drop policy "View all events" on "public"."events";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.nearby_events(lat double precision, long double precision)
 RETURNS TABLE(id bigint, created_at timestamp with time zone, title text, description text, date timestamp with time zone, location text, image_uri text, user_id uuid, lat double precision, long double precision, dist_meters double precision)
 LANGUAGE sql
AS $function$
  SELECT 
    id, 
    created_at, 
    title, 
    description, 
    date, 
    location, 
    image_uri, 
    user_id, 
    ST_Y(location_point::geometry) AS lat, 
    ST_X(location_point::geometry) AS long, 
    ST_Distance(location_point, ST_Point(long, lat)::geography) AS dist_meters
  FROM 
    public.events
  ORDER BY 
    location_point <-> ST_Point(long, lat)::geography;
$function$
;


