import React from 'react';

interface DetailBoxProps {
  label: string;
  value: string | number;
  className?: string;
}

export const DetailBox: React.FC<DetailBoxProps> = ({ label, value, className = "" }) => (
  <div className={`bg-gray-50 p-4 rounded-2xl border border-gray-100 ${className}`}>
    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{label}</p>
    <p className="text-gray-800 font-bold">{value}</p>
  </div>
);