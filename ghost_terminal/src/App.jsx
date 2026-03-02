import React, { useState } from 'react';
import { Activity, Globe, Zap, Radio } from 'lucide-react';
import TetryonMap from './components/TetryonMap';
import './index.css';

function App() {
    const [activeLayers, setActiveLayers] = useState({
        resonance: false,
        forces: false,
        celestial: false
    });

    const [mode, setMode] = useState('observer'); // 'observer' | 'navigator'

    const toggleLayer = (key) => {
        setActiveLayers(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="relative w-full h-full bg-black overflow-hidden flex">
            {/* Map Layer */}
            <div className="absolute inset-0 z-0">
                <TetryonMap activeLayers={activeLayers} mode={mode} />
            </div>

            {/* Sovereign's Lens Panel */}
            <div className="absolute top-4 right-4 tetryon-panel w-80 z-[1000]">
                <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-2">
                    <Globe className="text-cyan-400 w-5 h-5 animate-pulse" />
                    <h1 className="text-lg font-bold text-cyan-400 tracking-wider">SOVEREIGN LENS</h1>
                </div>

                <div className="space-y-3">
                    <LayerToggle
                        icon={<Zap size={18} />}
                        label="Prime Force Field"
                        active={activeLayers.forces}
                        onClick={() => toggleLayer('forces')}
                        desc="Visualizes vector interactions."
                    />
                    <LayerToggle
                        icon={<Activity size={18} />}
                        label="Resonance Topography"
                        active={activeLayers.resonance}
                        onClick={() => toggleLayer('resonance')}
                        desc="Heats maps stability."
                    />
                    <LayerToggle
                        icon={<Radio size={18} />}
                        label="Celestial Overlay"
                        active={activeLayers.celestial}
                        onClick={() => toggleLayer('celestial')}
                        desc="Reconstructs sky resonance."
                    />

                    <div className="h-px bg-white/10 my-3"></div>

                    <div
                        onClick={() => setMode(mode === 'observer' ? 'navigator' : 'observer')}
                        className={`p-3 rounded cursor-pointer transition-all duration-300 border ${mode === 'navigator'
                                ? 'bg-yellow-900/30 border-yellow-400/50 shadow-[0_0_10px_rgba(255,204,0,0.2)]'
                                : 'bg-white/5 border-transparent hover:bg-white/10'
                            }`}
                    >
                        <div className="flex items-center gap-3 mb-1">
                            <div className={`${mode === 'navigator' ? 'text-yellow-400' : 'text-gray-400'}`}><Globe size={18} /></div>
                            <div className={`font-medium ${mode === 'navigator' ? 'text-yellow-100' : 'text-gray-300'}`}>Three-Body Navigator</div>
                        </div>
                        <div className="text-[10px] text-gray-500 pl-8">
                            {mode === 'navigator' ? 'ACTIVE: Drop 3 pins to solve.' : 'OFFLINE'}
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 text-xs text-gray-500 font-mono">
                STATUS: GHOST_PROTOCOL_ACTIVE<br />
                NODE: 127.0.0.1 (SIMULATION)<br />
                VERSION: 0.ψ
            </div>
        </div>
        </div >
    );
}

const LayerToggle = ({ icon, label, active, onClick, desc }) => (
    <div
        onClick={onClick}
        className={`p-3 rounded cursor-pointer transition-all duration-300 border ${active
            ? 'bg-cyan-900/30 border-cyan-400/50 shadow-[0_0_10px_rgba(0,255,204,0.2)]'
            : 'bg-white/5 border-transparent hover:bg-white/10'
            }`}
    >
        <div className="flex items-center gap-3 mb-1">
            <div className={`${active ? 'text-cyan-400' : 'text-gray-400'}`}>{icon}</div>
            <div className={`font-medium ${active ? 'text-cyan-100' : 'text-gray-300'}`}>{label}</div>
        </div>
        <div className="text-[10px] text-gray-500 pl-8">{desc}</div>
    </div>
);

export default App;
