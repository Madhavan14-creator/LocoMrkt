import React from "react";

export default function CartDrawer({ isOpen, onClose, cart, onUpdateQuantity, onClearCart, onOpenCheckout }) {
  if (!isOpen) return null;

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-gray-900 border-l border-purple-950 text-white shadow-2xl flex flex-col justify-between">
          
          {/* Drawer Header */}
          <div className="p-6 bg-purple-950/60 border-b border-purple-900/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl font-black tracking-tighter text-white">loco</span>
              <span className="text-xl font-black tracking-tighter text-red-500">mrkt</span>
              <span className="text-xs font-bold text-gray-400 ml-2">CART ({totalItemsCount})</span>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white font-bold text-lg p-1"
            >
              ✕
            </button>
          </div>

          {/* Cart Items List */}
          <div className="p-6 flex-1 overflow-y-auto space-y-3">
            {cart.length > 0 ? (
              cart.map((item) => (
                <div 
                  key={item.id}
                  className="bg-gray-950 p-4 rounded-xl border border-gray-800 flex items-center justify-between shadow-md"
                >
                  <div>
                    <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block">
                      {item.storeName || item.category}
                    </span>
                    <h4 className="font-bold text-white text-sm mt-0.5">{item.itemName || item.name}</h4>
                    <span className="text-xs text-red-400 font-extrabold block mt-1">
                      ₹{item.price}
                    </span>
                  </div>

                  <div className="flex items-center bg-gray-900 border border-blue-600 rounded-lg overflow-hidden">
                    <button
                      onClick={() => onUpdateQuantity(item, -1)}
                      className="px-2.5 py-1 bg-red-950/60 text-red-400 hover:bg-red-600 hover:text-white font-black text-xs transition"
                    >
                      -
                    </button>
                    <span className="px-3 text-white text-xs font-black">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => onUpdateQuantity(item, 1)}
                      className="px-2.5 py-1 bg-blue-950/60 text-blue-400 hover:bg-blue-600 hover:text-white font-black text-xs transition"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16">
                <p className="text-gray-500 font-bold text-sm">Your cart is empty.</p>
                <p className="text-xs text-gray-600 mt-1">Explore stores and add items to your cart!</p>
              </div>
            )}
          </div>

          {/* Cart Summary & Calculation Breakdown */}
          {cart.length > 0 && (
            <div className="p-6 bg-gray-950 border-t border-gray-800 space-y-4">
              <div className="space-y-2 text-xs">
                <div className="space-y-1 pb-2 border-b border-gray-800 text-gray-400 max-h-24 overflow-y-auto">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between">
                      <span className="truncate max-w-[200px]">{item.itemName || item.name} (x{item.quantity})</span>
                      <span className="text-white font-bold">₹{item.price} × {item.quantity} = ₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between text-gray-400 pt-1">
                  <span>Subtotal</span>
                  <span className="text-white font-bold">₹{total}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Delivery Fee</span>
                  <span className="text-blue-400 font-bold">FREE</span>
                </div>
                <div className="flex justify-between text-base font-black text-white pt-2 border-t border-gray-800">
                  <span>Total</span>
                  <span className="text-red-500">₹{total}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={onClearCart}
                  className="w-1/3 py-3 rounded-xl border border-gray-800 text-gray-400 font-bold text-xs hover:bg-gray-900 transition"
                >
                  CLEAR
                </button>
                <button
                  onClick={onOpenCheckout}
                  className="w-2/3 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs shadow-lg shadow-red-900/50 transition uppercase tracking-wider"
                >
                  Checkout
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
