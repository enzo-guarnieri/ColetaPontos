import { useState } from "react";
import MapView from "./MapView";
import type { GeoPoint } from "./MapView"; // reutiliza o mesmo tipo

const predefinedTypes = ["rota", "entrada", "rota+entrada"];

export default function LocationCollector() {
  const [form, setForm] = useState({
    name: "",
    type: "",
    accessible: false,
  });

  const [points, setPoints] = useState<GeoPoint[]>([]);

  /** Converte um ponto para Feature GeoJSON */
  const pointToGeoJSONFeature = (p: GeoPoint) => ({
    type: "Feature",
    geometry: { type: "Point", coordinates: [p.lng, p.lat] },
    properties: { name: p.name, type: p.type, accessible: p.accessible },
  });

  /** Converte todos os pontos para FeatureCollection */
  const allPointsToFeatureCollection = () => ({
    type: "FeatureCollection",
    features: points.map(pointToGeoJSONFeature),
  });

  /** Pega a localização atual e adiciona ao estado */
  const addCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Este navegador não suporta geolocalização.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setPoints((prev) => [
          ...prev,
          {
            lat: Number(latitude.toFixed(6)),
            lng: Number(longitude.toFixed(6)),
            ...form,
          },
        ]);
      },
      (error) => alert("Erro ao obter localização: " + error.message)
    );
  };


  const copyAllGeoJSON = () => {
    if (points.length === 0) return;
    const collection = allPointsToFeatureCollection();
    navigator.clipboard.writeText(JSON.stringify(collection, null, 2));
  };

  return (
    <div className="app-container">

      {/* Mapa separado em componente */}
      <div className="map-wrapper">
        <MapView points={points} />
      </div>

      <div className="card">
        <h1 className="card__title">Coletor de Localização</h1>

        {/* Formulário */}
        <div className="card__form">
          <input
            className="input"
            placeholder="Nome"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            list="type-list"
            className="input"
            placeholder="Tipo"
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
          />
          <datalist id="type-list">
            {predefinedTypes.map((t) => (
              <option key={t} value={t} />
            ))}
          </datalist>

          <label className="checkbox">
            <input
              type="checkbox"
              checked={form.accessible}
              onChange={(e) => setForm({ ...form, accessible: e.target.checked })}
            />
            <span>Acessível</span>
          </label>
        </div>

        {/* Botões de ação */}
        <button className="btn btn--primary" onClick={addCurrentLocation}>
          Adicionar coordenada atual
        </button>

        <button
          className="btn btn--secondary"
          onClick={copyAllGeoJSON}
          disabled={points.length === 0}
        >
          Copiar TODOS pontos GeoJSON
        </button>

        {/* Lista de pontos */}
        <div className="points">
          <h2 className="points__title">Pontos coletados</h2>
          {points.length === 0 ? (
            <p className="points__empty">Nenhum ponto coletado.</p>
          ) : (
            <ul className="points__list">
              {points.map((p, i) => (
                <li key={i} className="points__item">
                  <pre>{JSON.stringify(pointToGeoJSONFeature(p), null, 2)}</pre>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      
    </div>
  );
}