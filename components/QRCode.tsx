
import React from 'react';

interface QRCodeProps {
  value: string;
  size?: number;
}

const QRCode: React.FC<QRCodeProps> = ({ value, size = 250 }) => {
  const encodedValue = encodeURIComponent(value);
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodedValue}`;

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-white rounded-xl shadow-inner border border-slate-100">
      <img 
        src={qrUrl} 
        alt="QR Code" 
        className="w-full h-auto max-w-[250px] aspect-square object-contain"
      />
    </div>
  );
};

export default QRCode;
