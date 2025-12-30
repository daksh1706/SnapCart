"use client";

import L, { LatLngExpression } from "leaflet";
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState, useMemo } from "react";

interface ILocation {
  latitude: number;
  longitude: number;
}

interface Iprops {
  userLocation: ILocation;
  deliveryBoyLocation: ILocation | null;
  storageKey?: string;
}

// Recenter map logic
function MapUpdater({ userLocation, deliveryBoyLocation }: { userLocation: ILocation, deliveryBoyLocation: ILocation | null }) {
  const map = useMap();
  
  useEffect(() => {
    if (deliveryBoyLocation) {
      const bounds = L.latLngBounds(
        [userLocation.latitude, userLocation.longitude],
        [deliveryBoyLocation.latitude, deliveryBoyLocation.longitude]
      );
      map.fitBounds(bounds, { padding: [70, 70] });
    } else {
      map.setView([userLocation.latitude, userLocation.longitude], 15);
    }
  }, [deliveryBoyLocation, userLocation, map]);

  return null;
}

function LiveMap({ userLocation, deliveryBoyLocation, storageKey = 'user' }: Iprops) {
  const [isClient, setIsClient] = useState(false);
  const [savedDeliveryBoyLocation, setSavedDeliveryBoyLocation] = useState<ILocation | null>(null);

  // Memoize icons so they don't re-render and flicker
  const icons = useMemo(() => {
    if (typeof window === 'undefined') return null;
    return {
      delivery: L.icon({
        iconUrl: "https://cdn-icons-png.flaticon.com/128/16399/16399661.png",
        iconSize: [45, 45],
        iconAnchor: [22, 45],
        popupAnchor: [0, -45]
      }),
      user: L.icon({
        iconUrl: "https://cdn-icons-png.flaticon.com/128/7720/7720526.png",
        iconSize: [45, 45],
        iconAnchor: [22, 45],
        popupAnchor: [0, -45]
      })
    };
  }, []);

  useEffect(() => {
    setIsClient(true);
    
    // FIX: Changed from window.storage to standard localStorage
    const saved = localStorage.getItem(`deliveryBoyLocation_${storageKey}`);
    if (saved) {
      try {
        setSavedDeliveryBoyLocation(JSON.parse(saved));
      } catch (e) {
        console.error("Error parsing saved location", e);
      }
    }
  }, [storageKey]);

  useEffect(() => {
    if (deliveryBoyLocation) {
      localStorage.setItem(`deliveryBoyLocation_${storageKey}`, JSON.stringify(deliveryBoyLocation));
      setSavedDeliveryBoyLocation(deliveryBoyLocation)
    }
  }, [deliveryBoyLocation, storageKey]);

  const activeDeliveryBoyLocation = deliveryBoyLocation || savedDeliveryBoyLocation;

  const calculateDistance = (loc1: ILocation, loc2: ILocation): string => {
    const R = 6371; 
    const dLat = (loc2.latitude - loc1.latitude) * Math.PI / 180;
    const dLon = (loc2.longitude - loc1.longitude) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(loc1.latitude * Math.PI / 180) * Math.cos(loc2.latitude * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return distance < 1 ? `${(distance * 1000).toFixed(0)}m` : `${distance.toFixed(2)}km`;
  };

  if (!isClient) return <div className="h-[500px] w-full bg-gray-100 animate-pulse rounded-xl" />;

  return (
    <div className="w-full space-y-4">
      {/* Header Info Panel */}
      <div className="bg-white p-4 rounded-xl shadow border border-gray-100 grid grid-cols-2 gap-4">
        <div>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Your Location</p>
          <p className="text-sm font-semibold">{userLocation.latitude.toFixed(4)}, {userLocation.longitude.toFixed(4)}</p>
        </div>
        <div>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Delivery Partner</p>
          <p className="text-sm font-semibold text-green-600">
            {activeDeliveryBoyLocation ? calculateDistance(userLocation, activeDeliveryBoyLocation) : "Finding..."}
          </p>
        </div>
      </div>

      {/* Map Area */}
      <div className="w-full h-[500px] rounded-xl overflow-hidden shadow-lg relative border border-gray-200">
        <MapContainer
          center={[userLocation.latitude, userLocation.longitude]}
          zoom={15}
          className="w-full h-full"
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          
          <Marker position={[userLocation.latitude, userLocation.longitude]} icon={icons?.user!}>
            <Popup>Delivery Destination</Popup>
          </Marker>
          
          {activeDeliveryBoyLocation && (
            <>
              <Marker 
                position={[activeDeliveryBoyLocation.latitude, activeDeliveryBoyLocation.longitude]} 
                icon={icons?.delivery!}
              >
                <Popup>Delivery Partner</Popup>
              </Marker>
              
              <Polyline 
                positions={[[userLocation.latitude, userLocation.longitude], [activeDeliveryBoyLocation.latitude, activeDeliveryBoyLocation.longitude]]} 
                color="#22c55e" 
                weight={4} 
                dashArray="5, 10" 
              />
            </>
          )}
          
          <MapUpdater userLocation={userLocation} deliveryBoyLocation={activeDeliveryBoyLocation} />
        </MapContainer>

        {/* Floating Live Badge */}
        <div className="absolute top-4 right-4 z-1000] bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-md flex items-center gap-2 border border-gray-100">
          <span className={`w-2.5 h-2.5 rounded-full ${activeDeliveryBoyLocation ? 'bg-green-500 animate-pulse' : 'bg-orange-400'}`} />
          <span className="text-[11px] font-bold text-gray-800 tracking-tight">
            {activeDeliveryBoyLocation ? 'LIVE TRACKING' : 'CONNECTING...'}
          </span>
        </div>
      </div>
    </div>
  );
}

export default LiveMap;