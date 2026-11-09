import React from "react";

export default function CheckoutModal({ isOpen, onClose, cart, onCompleteOrder }) {
  if (!isOpen) return null;

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const orderId = "LCO-" + Math.floor(100000 + Math.random() * 900000);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-gray-900 border border-purple-950 rounded-2xl max-w-md w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-900 via-blue-900 to-black p-6 text-center border-b border-purple-900/40">
          <div className="w-12 h-12 bg-red-600/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-2 text-xl font-bold border border-red-500/30">
            ✓
          </div>
          <h3 className="text-xl font-black text-white tracking-tight">Order Confirmed!</h3>
          <p className="text-xs text-purple-200 mt-1">Thank you for ordering on LocoMrkt</p>
        </div>

        {/* Receipt Content */}
        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          <div className="flex justify-between items-center text-xs text-gray-400 bg-gray-950 p-3 rounded-xl border border-gray-800">
            <div>
              <span className="text-[10px] uppercase font-bold block text-gray-500">Order ID</span>
              <span className="font-mono text-white font-bold">{orderId}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold block text-gray-500">Est. Delivery</span>
              <span className="text-blue-400 font-bold">12-15 MINS ⚡</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-black text-gray-400 uppercase tracking-wider mb-2">Item Summary</h4>
            <div className="space-y-2 bg-gray-950 p-3 rounded-xl border border-gray-800">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between text-xs text-gray-300">
                  <span>{item.itemName || item.name} <span className="text-gray-500">(x{item.quantity})</span></span>
                  <span className="text-white font-bold">₹{item.price * item.quantity}</span>
                </div>
              ))}
              <div className="pt-2 border-t border-gray-800 flex justify-between text-xs text-gray-400">
                <span>Subtotal ({totalItemsCount} items)</span>
                <span className="text-white font-bold">₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-xs text-gray-400">
                <span>Delivery Fee</span>
                <span className="text-blue-400 font-bold">FREE</span>
              </div>
              <div className="flex justify-between text-sm font-black text-white pt-2 border-t border-gray-800">
                <span>Total Paid</span>
                <span className="text-red-500">₹{subtotal}</span>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-gray-400 bg-gray-950 p-3 rounded-xl border border-gray-800 space-y-1">
            <div className="flex justify-between">
              <span>Delivery Address:</span>
              <span className="text-white font-medium">Downtown Marketplace, Main St</span>
            </div>
            <div className="flex justify-between">
              <span>Powered by:</span>
              <span className="text-purple-300 font-bold">RMCUBE</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-4 bg-gray-950 border-t border-gray-800">
          <button
            onClick={onCompleteOrder}
            className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs shadow-lg shadow-red-900/50 transition uppercase tracking-wider"
          >
            Back to Marketplace
          </button>
        </div>

      </div>
    </div>
  );
}
