import React from 'react';

export default function LoadingOverlay({ show }) {
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity duration-300">
      <div className="w-24 h-24 flex items-center justify-center">
        <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-[#00eaff] border-solid border-opacity-80" style={{ borderLeftColor: '#ffd600', borderRightColor: '#0a6ebd' }}></div>
      </div>
    </div>
  );
} 