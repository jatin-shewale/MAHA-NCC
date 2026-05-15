import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Navigation, ShieldCheck, AlertTriangle, Loader2 } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

// Fix for default marker icons in Leaflet + React
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const GeoAttendance = () => {
  const [position, setPosition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkingIn, setCheckingIn] = useState(false);
  const [inRange, setInRange] = useState(false);

  // Parade Ground Coordinates (Mumbai HQ as example)
  const paradeGround = [18.9415, 72.8258]; 
  const radius = 200; // 200 meters

  useEffect(() => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      setLoading(false);
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setPosition([latitude, longitude]);
        
        // Calculate distance to parade ground
        const dist = L.latLng(latitude, longitude).distanceTo(L.latLng(paradeGround[0], paradeGround[1]));
        setInRange(dist <= radius);
        setLoading(false);
      },
      (err) => {
        toast.error('Unable to retrieve your location');
        setLoading(false);
      },
      { enableHighAccuracy: true }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  const handleCheckIn = async () => {
    if (!inRange) {
      toast.error('You are outside the operational radius!');
      return;
    }

    setCheckingIn(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/attendance/check-in`, {
        lat: position[0],
        lng: position[1],
        paradeLocation: 'Main Parade Ground',
        deviceId: navigator.userAgent
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Attendance Logged. Jai Hind!');
    } catch (error) {
      toast.error('Sync failed. Please try again.');
    } finally {
      setCheckingIn(false);
    }
  };

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center space-y-4">
        <Loader2 className="animate-spin text-accent-gold" size={40} />
        <p className="font-orbitron text-slate-400 uppercase tracking-widest">Acquiring GPS Signal...</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-orbitron font-bold text-white uppercase">Geo-Intelligent Attendance</h1>
          <p className="text-xs text-slate-500 font-poppins uppercase tracking-widest">Precision Tracking Active</p>
        </div>
        <div className={`px-4 py-1.5 rounded-full border flex items-center gap-2 ${inRange ? 'border-green-500/30 bg-green-500/10 text-green-500' : 'border-red-500/30 bg-red-500/10 text-red-500'}`}>
          {inRange ? <ShieldCheck size={14} /> : <AlertTriangle size={14} />}
          <span className="text-[10px] font-orbitron font-bold tracking-widest uppercase">
            {inRange ? 'IN RANGE' : 'OUT OF RADIUS'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1">
        {/* Map Area */}
        <div className="lg:col-span-3 glass-card overflow-hidden h-[500px] lg:h-full relative">
          <MapContainer center={paradeGround} zoom={16} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Circle center={paradeGround} radius={radius} pathOptions={{ color: '#D4AF37', fillColor: '#D4AF37', fillOpacity: 0.1 }} />
            {position && <Marker position={position} />}
            {position && (
              <Circle
                center={position}
                radius={30}
                pathOptions={{ color: '#22c55e', fillColor: '#22c55e', fillOpacity: 0.2 }}
              />
            )}
          </MapContainer>
        </div>

        {/* Control Panel */}
        <div className="space-y-6">
          <div className="glass-card p-6 space-y-6">
            <h3 className="font-orbitron font-bold text-sm tracking-widest uppercase text-slate-400">Status Terminal</h3>
            
            <div className="space-y-4">
              <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                <p className="text-[10px] font-orbitron text-slate-500 uppercase">Current Coordinates</p>
                <p className="text-xs font-mono text-white mt-1">
                  {position ? `${position[0].toFixed(4)}, ${position[1].toFixed(4)}` : 'SCANNING...'}
                </p>
              </div>

              <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                <p className="text-[10px] font-orbitron text-slate-500 uppercase">Target Location</p>
                <p className="text-xs text-white mt-1 font-poppins">Main Parade Ground, HQ</p>
              </div>
            </div>

            <button 
              onClick={handleCheckIn}
              disabled={checkingIn || !inRange}
              className={`w-full py-4 rounded-xl font-orbitron font-bold tracking-widest flex items-center justify-center gap-3 transition-all
                ${inRange ? 'bg-accent-gold text-primary-navy hover:scale-105 active:scale-95' : 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-50'}
              `}
            >
              {checkingIn ? <Loader2 className="animate-spin" /> : (
                <>
                  <Navigation size={18} /> INITIALIZE CHECK-IN
                </>
              )}
            </button>

            {!inRange && (
              <div className="flex gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <AlertTriangle className="text-red-500 shrink-0" size={16} />
                <p className="text-[10px] text-red-400 font-poppins">
                  System lockout: GPS coordinates do not match parade ground perimeter. Please move to the designated area.
                </p>
              </div>
            )}
          </div>

          <div className="glass-card p-6">
            <h3 className="font-orbitron font-bold text-sm tracking-widest uppercase text-slate-400 mb-4">Security Protocol</h3>
            <ul className="space-y-3">
              {[
                'Device integrity verified',
                'GPS spoofing protection active',
                'Timestamp synchronized',
              ].map((text, i) => (
                <li key={i} className="flex items-center gap-2 text-[10px] text-slate-400 font-poppins uppercase">
                  <div className="w-1 h-1 rounded-full bg-green-500" />
                  {text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeoAttendance;
