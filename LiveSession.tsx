
import React, { useEffect, useRef, useState } from 'react';

interface LiveSessionProps {
  onClose: () => void;
  status?: 'waiting' | 'active';
  meetLink?: string;
}

const LiveSession: React.FC<LiveSessionProps> = ({ onClose, status = 'active', meetLink }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const startCamera = async () => {
    setPermissionError(null);
    setIsInitializing(true);
    
    // Check for Secure Context (Required for MediaDevices)
    if (!window.isSecureContext && window.location.hostname !== 'localhost') {
      setPermissionError("Media access requires a secure connection (HTTPS). Your browser has blocked the request for safety.");
      setIsInitializing(false);
      return;
    }

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("MediaDevices API not available");
      }

      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: true, 
        video: { 
          width: { ideal: 1280 }, 
          height: { ideal: 720 },
          facingMode: "user"
        } 
      });
      
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setIsInitializing(false);
    } catch (err: any) {
      console.error("Hardware access denied:", err);
      setIsInitializing(false);
      
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setPermissionError("Permission Denied: Browser blocked camera/mic access. Please allow permissions in your address bar.");
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setPermissionError("Hardware Not Found: No camera or microphone was detected on this device.");
      } else {
        setPermissionError("Local preview is restricted. Please use the Google Meet button below to connect.");
      }
    }
  };

  const stopAllStreams = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
  };

  const openGoogleMeet = () => {
    const url = meetLink || 'https://meet.google.com/new';
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  useEffect(() => {
    startCamera();
    return () => stopAllStreams();
  }, []);

  return (
    <div className="bg-slate-900 w-full h-full flex flex-col text-white font-sans overflow-hidden animate-in fade-in duration-500">
      {/* Header */}
      <div className="p-6 flex justify-between items-center z-20 bg-slate-900/80 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center gap-4">
           <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center font-black shadow-lg shadow-indigo-500/20">A</div>
           <div className="flex flex-col">
             <span className="text-sm font-black tracking-tight uppercase">Support Tunnel</span>
             <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">P2P Bridge: Online</span>
           </div>
        </div>
        <div className="flex items-center gap-3">
           <div className="hidden sm:flex flex-col items-end mr-3">
             <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</span>
             <span className="text-xs font-bold text-emerald-400">Encrypted Stream</span>
           </div>
           <button onClick={onClose} className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all active:scale-95 border border-white/5">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
           </button>
        </div>
      </div>

      {/* Main Bridge Area */}
      <div className="flex-grow relative flex flex-col lg:flex-row items-center justify-center p-6 gap-8 bg-slate-950 overflow-y-auto lg:overflow-hidden">
        
        {/* Left: Video Preview / Hardware Diagnostics */}
        <div className="w-full lg:w-3/5 aspect-video bg-slate-900 rounded-[3rem] overflow-hidden shadow-2xl border border-white/5 relative group">
          {isInitializing && (
            <div className="absolute inset-0 z-40 bg-slate-900 flex flex-col items-center justify-center">
              <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-slate-500 font-black uppercase tracking-widest text-[10px]">Configuring Local Port...</p>
            </div>
          )}

          {permissionError ? (
            <div className="absolute inset-0 z-30 bg-slate-900/95 backdrop-blur-xl flex flex-col items-center justify-center p-8 text-center">
               <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center mb-6 border border-red-500/20">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                 </svg>
               </div>
               <h3 className="text-xl font-black mb-2 tracking-tight">Access Denied</h3>
               <p className="text-slate-400 font-medium mb-8 text-sm max-w-sm leading-relaxed">{permissionError}</p>
               <div className="flex flex-col sm:flex-row gap-3">
                 <button 
                  onClick={startCamera} 
                  className="px-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl font-bold text-xs uppercase tracking-widest transition-all"
                 >
                   Retry Hardware Access
                 </button>
                 <button 
                  onClick={openGoogleMeet} 
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-xl font-bold text-xs uppercase tracking-widest transition-all shadow-lg shadow-indigo-500/20"
                 >
                   Join via Direct Link
                 </button>
               </div>
            </div>
          ) : (
            <>
              <video 
                ref={videoRef} 
                autoPlay 
                muted 
                playsInline 
                className={`w-full h-full object-cover transition-opacity duration-700 scale-x-[-1] ${isVideoOff ? 'opacity-0' : 'opacity-100'}`} 
              />
              {isVideoOff && (
                <div className="absolute inset-0 bg-slate-900 flex items-center justify-center">
                   <div className="w-24 h-24 rounded-full bg-slate-800 flex items-center justify-center border-4 border-slate-700">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                     </svg>
                   </div>
                </div>
              )}
            </>
          )}

          {/* Local Status Indicators */}
          <div className="absolute top-6 left-6 flex items-center gap-3">
            <div className="bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/5 flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <span className="text-[10px] font-black uppercase tracking-widest opacity-80">Local Preview</span>
            </div>
          </div>
        </div>

        {/* Right: Join Panel */}
        <div className="w-full lg:w-2/5 flex flex-col items-center lg:items-start text-center lg:text-left space-y-8">
          <div className="space-y-4">
             <div className="inline-flex items-center gap-2 bg-indigo-500/10 text-indigo-400 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-500/20">
               <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-ping"></div>
               {status === 'waiting' ? 'Dispatching Admin...' : 'Line Secure'}
             </div>
             <h2 className="text-4xl sm:text-5xl font-black tracking-tight leading-[1.1]">Join the <span className="text-indigo-500">Masterclass</span></h2>
             <p className="text-slate-400 font-medium text-lg leading-relaxed max-w-md">Your tutor is ready to review your Aptitude Strategy. Click below to launch the dedicated meeting room.</p>
          </div>

          <div className="w-full space-y-4 pt-4">
             <button 
               onClick={openGoogleMeet}
               className="w-full bg-white text-slate-900 hover:bg-indigo-50 px-8 py-7 rounded-[2.5rem] font-black text-xl shadow-2xl shadow-indigo-500/20 flex items-center justify-center gap-4 transition-all hover:scale-[1.03] active:scale-95 group"
             >
                <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white group-hover:rotate-6 transition-transform">
                  <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                </div>
                Launch Google Meet
             </button>
             
             <button 
               onClick={onClose}
               className="w-full bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white px-8 py-5 rounded-[1.8rem] font-black text-xs tracking-widest uppercase transition-all border border-white/5"
             >
               Return to Assessments
             </button>
          </div>

          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-slate-500 font-bold uppercase text-[9px] tracking-widest pt-10 border-t border-white/5 w-full">
            <span className="flex items-center gap-2">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              Encrypted
            </span>
            <div className="w-1 h-1 bg-slate-800 rounded-full"></div>
            <span className="flex items-center gap-2">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
              720p HD
            </span>
            <div className="w-1 h-1 bg-slate-800 rounded-full"></div>
            <span className="flex items-center gap-2">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              Low Latency
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveSession;
