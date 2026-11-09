import React from "react";

export default function Navbar({ cartCount, onOpenCart, isMerchantMode, setIsMerchantMode }) {
  return (
    <header className="bg-gray-950 border-b border-purple-950 sticky top-0 z-40 backdrop-blur-md bg-opacity-90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 bg-gradient-to-br from-red-600 to-purple-800 rounded-xl flex items-center justify-center font-black text-white text-lg shadow-lg shadow-red-900/40">
            L
          </div>
          <div>
            <h1 className="text-lg font-black text-white tracking-tight flex items-center gap-1.5">
              LocoMrkt
              <span className="text-[10px] bg-purple-950 text-purple-300 border border-purple-800 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                Community
              </span>
            </h1>
            <p className="text-[10px] text-gray-400 font-medium tracking-wide">
              POWERED BY RMCUBE
            </p>
          </div>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center space-x-3">
          
          {/* Simple Merchant Mode Switch */}
          <button
            onClick={() => setIsMerchantMode(!isMerchantMode)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 ${
              isMerchantMode
                ? "bg-amber-950/80 border-amber-500 text-amber-300"
                : "bg-gray-900 border-gray-800 text-gray-400 hover:text-white"
            }`}
          >
            <span>{isMerchantMode ? "🏪 Merchant View" : "🛒 Customer View"}</span>
          </button>

          {/* Cart Button */}
          <button
            onClick={onOpenCart}
            className="relative bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition flex items-center space-x-2 shadow-lg shadow-red-900/30"
          >
            <span>Cart</span>
            {cartCount > 0 && (
              <span className="bg-white text-red-600 font-black text-[11px] w-5 h-5 rounded-full flex items-center justify-center ml-1">
                {cartCount}
              </span>
            )}
          </button>

        </div>

      </div>
    </header>
  );
}
