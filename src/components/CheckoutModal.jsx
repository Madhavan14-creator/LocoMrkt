import React, { useState } from "react";

export default function CheckoutModal({ isOpen, onClose, cart, onCompleteOrder }) {
  const [paymentMethod, setPaymentMethod] = useState("COD");
  if (!isOpen) return null;

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const orderId = "LCO-" + Math.floor(100000 + Math.random() * 900000);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-gray-900 border border-purple-950 rounded-2xl max-w-md w-full overflow-hidden shadow-2xl">
        
        {/* Header */}
        <div className="bg-purple-950/80 p-6 text-center border-b border-purple-900/40">
          <div className="w-10 h-10 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-2 text-lg font-bold border border-green-500/30">
            ✓
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight">Order Receipt</h3>
          <p className="text-xs text-purple-200 mt-0.5">LocoMrkt Community Network</p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          <div className="flex justify-between items-center text-xs text-gray-400 bg-gray-950 p-3 rounded-xl border border-gray-800">
            <div>
              <span className="text-[10px] uppercase font-bold block text-gray-500">Order ID</span>
              <span className="font-mono text-white font-bold">{orderId}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold block text-gray-500">Delivery Status</span>
              <span className="text-blue-400 font-bold">Store Notified</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Order Items</h4>
            <div className="space-y-2 bg-gray-950 p-3 rounded-xl border border-gray-800">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between text-xs text-gray-300">
                  <span>{item.itemName || item.name} <span className="text-gray-500">(x{item.quantity})</span></span>
                  <span className="text-white font-bold">₹{item.price * item.quantity}</span>
                </div>
              ))}
              <div className="pt-2 border-t border-gray-800 flex justify-between text-xs font-bold text-white">
                <span>Total Amount</span>
                <span className="text-red-500">₹{subtotal}</span>
              </div>
            </div>
          </div>

          {/* Simple Payment Selection */}
          <div>
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Payment Option</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setPaymentMethod("COD")}
                className={`p-2.5 rounded-xl border font-bold text-center transition ${
                  paymentMethod === "COD"
                    ? "bg-purple-950 border-purple-600 text-white"
                    : "bg-gray-950 border-gray-800 text-gray-400 hover:text-white"
                }`}
              >
                💵 Cash on Delivery
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod("UPI")}
                className={`p-2.5 rounded-xl border font-bold text-center transition ${
                  paymentMethod === "UPI"
                    ? "bg-purple-950 border-purple-600 text-white"
                    : "bg-gray-950 border-gray-800 text-gray-400 hover:text-white"
                }`}
              >
                📱 Pay via UPI
              </button>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-4 bg-gray-950 border-t border-gray-800">
          <button
            onClick={onCompleteOrder}
            className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition uppercase tracking-wider"
          >
            Confirm & Return to Directory
          </button>
        </div>

      </div>
    </div>
  );
}
