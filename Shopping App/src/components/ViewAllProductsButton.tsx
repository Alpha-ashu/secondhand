import React from 'react';

interface ViewAllProductsButtonProps {
  onClick: () => void;
  show?: boolean;
}

export default function ViewAllProductsButton({ onClick, show = true }: ViewAllProductsButtonProps) {
  if (!show) return null;

  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 bg-[#426b1f] hover:bg-[#365a19] text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 z-30"
    >
      <div className="flex items-center gap-2">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        <span className="text-sm font-medium whitespace-nowrap">View All</span>
      </div>
    </button>
  );
}