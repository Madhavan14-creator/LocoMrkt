import React from "react";

export default function Navbar({ cartCount, onOpenCart }) {
  return (
    <header className="bg-purple-950 text-white border-b border-purple-900 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center text-2xl font-bold tracking-tight">
            <span className="text-white">Loco</span>
            <span className="text-red-500">Mrkt</span>
          </div>
          <span className="hidden sm:inline text-xs text-purple-300 border-l border-purple-800 pl-4">
            Downtown Marketplace
          </span>
        </div>

        <button 
          onClick={onOpenCart}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
        >
          <span>Cart</span>
          {cartCount > 0 && (
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
