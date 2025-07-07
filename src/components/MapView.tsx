import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export interface GeoPoint {
  lat: number;
  lng: number;
  name: string;
  type: string;
  accessible: boolean;
}

interface MapProps {
  points: GeoPoint[];
}

/** Retorna uma cor baseada no ponto (exemplos) */
const getColor = (p: GeoPoint) => (p.accessible ? "#10B981" : "#3B82F6"); // verde | azul

/** Gera um divIcon circular, leve e elegante */
const circleIcon = (color: string) =>
  L.divIcon({
    className: "custom-marker", // caso queira CSS adicional
    html: `<div style="
        width: 12px;
        height: 12px;
        background: ${color};
        border: 2px solid white;
        border-radius: 50%;
        box-shadow: 0 0 2px rgba(0,0,0,0.6);
      "></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],   // centraliza a bolinha
    popupAnchor: [0, -8],
  });

export default function MapView({ points }: MapProps) {
  const center: [number, number] =
    points.length > 0
      ? [points[0].lat, points[0].lng]
      : [-23.547271, -46.651813];

  return (
    <MapContainer
      center={center}
      zoom={17}
      scrollWheelZoom
      attributionControl={false}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        maxZoom={20}
        minZoom={16}
      />

      {points.map((p, i) => (
        <Marker
          key={i}
          position={[p.lat, p.lng]}
          icon={circleIcon(getColor(p))}
        >
          <Popup>
            <strong>{p.name || "Sem nome"}</strong>
            <br />Tipo: {p.type || "—"}
            <br />
            Acessível: {p.accessible ? "Sim" : "Não"}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
