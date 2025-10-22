import React, { useState, useEffect } from "react";
import { fetchApiKey, logEvent } from "../../services/api";

// Import new CSS
import "../../styles/attendance/GeoFenceMap.css";

// --- Geofence Configuration ---
// This would be fetched from your backend in a real app
const GEOFENCE = {
  id: 101, // Geofence ID
  center: { lat: 23.7538, lng: 90.3793 }, // Example: Sonali Intellect Office
  radius: 150, // in meters
};

const GeoFenceMap = ({ employeeId, onEventLogged }) => {
  const [isFinalExit, setIsFinalExit] = useState(false);
  const [map, setMap] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Load Google Maps script and initialize map
  useEffect(() => {
    // This function will be called by the Google Maps script
    window.initMap = () => {
      const mapInstance = new window.google.maps.Map(document.getElementById("map"), {
        center: GEOFENCE.center,
        zoom: 16,
        mapTypeId: "roadmap",
      });

      // Draw the geofence circle
      new window.google.maps.Circle({
        strokeColor: "#007BFF",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#007BFF",
        fillOpacity: 0.2,
        map: mapInstance,
        center: GEOFENCE.center,
        radius: GEOFENCE.radius,
      });

      // Add a marker for the center
       new window.google.maps.Marker({
        position: GEOFENCE.center,
        map: mapInstance,
        title: "Office Geofence",
      });

      setMap(mapInstance);
    };

    const loadMapScript = async () => {
      try {
        const apiKey = await fetchApiKey();
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initMap`;
        script.async = true;
        document.head.appendChild(script);
      } catch (error) {
        console.error("Failed to load Google Maps API key:", error);
        setMessage("Could not load map.");
      }
    };

    if (!window.google) {
      loadMapScript();
    } else {
      window.initMap();
    }

    // Cleanup script
    return () => {
      const scripts = document.head.getElementsByTagName("script");
      for (let script of scripts) {
        if (script.src.includes("maps.googleapis.com")) {
          // script.remove(); // Be careful with cleanup; might break other components
        }
      }
      if (window.initMap) {
        delete window.initMap;
      }
    };
  }, []);

  // --- Event Handlers ---
  const handleEventTrigger = async (eventType) => {
    if (!employeeId) return;

    setLoading(true);
    setMessage("");

    const isFinal = eventType === "exit" ? isFinalExit : false;

    try {
      const updatedAttendanceRecord = await logEvent(employeeId, GEOFENCE.id, eventType, isFinal);
      setMessage(`Event '${eventType}' logged successfully.`);
      
      // Pass the full, updated record back to the parent
      if (onEventLogged) {
        onEventLogged(updatedAttendanceRecord);
      }

    } catch (error) {
      console.error(error);
      setMessage(`Error logging ${eventType} event.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="geofence-map-container">
      {/* Map display */}
      <div id="map"></div>

      {/* Simulation Controls */}
      <div className="geofence-controls">
        <button onClick={() => handleEventTrigger("enter")} disabled={loading} className="btn-enter">
          Simulate ENTER Geofence
        </button>
        <button onClick={() => handleEventTrigger("exit")} disabled={loading} className="btn-exit">
          Simulate EXIT Geofence
        </button>

        <label className="final-exit-label">
          <input 
            type="checkbox" 
            checked={isFinalExit} 
            onChange={(e) => setIsFinalExit(e.target.checked)} 
            disabled={loading}
          />
          Final Exit for the day
        </label>
      </div>
      {message && <p className="status-message">{message}</p>}
    </div>
  );
};

export default GeoFenceMap;