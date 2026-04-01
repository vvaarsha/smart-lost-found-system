import { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";

export default function GISMap() {

  useEffect(() => {

    const map = L.map("map").setView([12.9725, 77.5960], 14);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap",
    }).addTo(map);

    // Example data (later we will fetch from backend)
    const items = [
      { latitude: 12.972, longitude: 77.595, status: "lost", location: "Library" },
      { latitude: 12.973, longitude: 77.597, status: "lost", location: "Canteen" },
      { latitude: 12.971, longitude: 77.596, status: "found", location: "Gate" },
    ];

    const heatPoints: any[] = [];

    items.forEach((item) => {
      const color = item.status === "lost" ? "red" : "green";

      L.circleMarker([item.latitude, item.longitude], {
        radius: 8,
        color: color,
        fillColor: color,
        fillOpacity: 0.8,
      })
        .addTo(map)
        .bindPopup(
          `<b>Status:</b> ${item.status}<br>
           <b>Location:</b> ${item.location}`
        );

      if (item.status === "lost") {
        heatPoints.push([item.latitude, item.longitude, 1]);
      }
    });

    (L as any).heatLayer(heatPoints, {
      radius: 25,
      blur: 15,
      maxZoom: 17,
    }).addTo(map);

  }, []);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">
        Loss Hotspot Map
      </h2>

      <div id="map" style={{ height: "500px", width: "100%" }}></div>
    </div>
  );
}