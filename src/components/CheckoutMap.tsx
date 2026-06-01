'use client'
import React, { useEffect } from "react";
import "leaflet/dist/leaflet.css";
import L, { LatLngExpression } from "leaflet";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";

const markerIcon = typeof window !== "undefined" ? new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/128/149/149059.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40]
}) : null;

interface CheckoutMapProps {
  position: [number, number];
  setPosition: (pos: [number, number]) => void;
}

const DraggableMarker: React.FC<CheckoutMapProps> = ({ position, setPosition }) => {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.setView(position as LatLngExpression, 17, { animate: true });
    }
  }, [position, map]);

  if (!position || !markerIcon) return null;

  return (
    <Marker
      icon={markerIcon}
      position={position as LatLngExpression}
      draggable={true}
      eventHandlers={{
        dragend: (e: L.LeafletEvent) => {
          const marker = e.target as L.Marker;
          const { lat, lng } = marker.getLatLng();
          setPosition([lat, lng]);
        }
      }}
    />
  );
};

export default function CheckoutMap({ position, setPosition }: CheckoutMapProps) {
  return (
    <MapContainer
      center={position as LatLngExpression}
      zoom={17}
      scrollWheelZoom={true}
      className="w-full h-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <DraggableMarker position={position} setPosition={setPosition} />
    </MapContainer>
  );
}
