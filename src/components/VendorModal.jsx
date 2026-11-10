import React from "react";

export default function VendorModal({ vendor, onClose, cart, onUpdateQuantity }) {
  if (!vendor) return null;

  const getItemQuantity = (itemId) => {
    const cartItem = cart.find((i) => i.id === itemId);
    return cartItem ? cartItem.quantity : 0;
  };

  const storePhone = vendor.phone || "+91 98765 43210";
  const whatsappMessage = encodeURIComponent(`Hi ${vendor.name}, I am reaching out via LocoMrkt community app.`);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-gray-900 border border-blue-900/60 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl">
        
        {/* Banner Header */}
        <div className="h-32 p-6 flex justify-between items-start relative bg-gradient-to-r from-purple-900 via-blue-900 to-black">
          <div>
            <span className="bg-red-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
              {vendor.category}
            </span>
            <h3 className="text-2xl font-black text-white mt-2 leading-tight">
              {vendor.name}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="bg-black/40 hover:bg-black/70 text-gray-300 hover:text-white rounded-full w-8 h-8 flex items-center justify-center font-bold transition"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          <p className="text-xs text-gray-300 leading-relaxed">
            {vendor.description}
          </p>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-gray-950 p-2.5 rounded-xl border border-gray-800">
              <span className="text-gray-500 font-bold uppercase block text-[10px]">Delivery Time</span>
              <span className="text-blue-400 font-extrabold text-xs mt-0.5 block">
                ⚡ {vendor.deliveryTime || "15 MINS"}
              </span>
            </div>
            <div className="bg-gray-950 p-2.5 rounded-xl border border-gray-800">
              <span className="text-gray-500 font-bold uppercase block text-[10px]">Rating</span>
              <span className="text-red-400 font-extrabold text-xs mt-0.5 block">
                ★ {vendor.rating} / 5.0
              </span>
            </div>
          </div>

          {/* Quick Direct Actions for Customers */}
          <div className="flex gap-2">
            <a
              href={`tel:${storePhone.replace(/\s+/g, "")}`}
              className="flex-1 py-2 bg-gray-950 hover:bg-gray-800 border border-gray-800 text-blue-400 text-center text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5"
            >
              📞 Call Shop
            </a>
            <a
              href={`https://wa.me/${storePhone.replace(/[^0-9]/g, "")}?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2 bg-gray-950 hover:bg-gray-800 border border-gray-800 text-green-400 text-center text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5"
            >
              💬 WhatsApp
            </a>
          </div>

          {/* Product Items List */}
          <div className="pt-2">
            <h4 className="text-xs font-black text-purple-300 uppercase tracking-wider mb-2">
              Popular Items & Menu
            </h4>
            <div className="space-y-2">
              {vendor.items && vendor.items.length > 0 ? (
                vendor.items.map((item) => {
                  const qty = getItemQuantity(item.id);
                  return (
                    <div 
                      key={item.id}
                      className="bg-gray-950 p-3 rounded-xl border border-gray-800 flex items-center justify-between transition"
                    >
                      <div>
                        <h5 className="font-bold text-white text-xs">{item.itemName}</h5>
                        <span className="text-xs text-red-400 font-black block mt-0.5">
                          ₹{item.price}
                        </span>
                      </div>

                      {qty === 0 ? (
                        <button
                          type="button"
                          onClick={() =>
                            onUpdateQuantity({
                              ...item,
                              storeName: vendor.name,
                              category: vendor.category,
                            }, 1)
                          }
                          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-black px-3 py-1.5 rounded-lg transition uppercase"
                        >
                          + Add
                        </button>
                      ) : (
                        <div className="flex items-center bg-gray-900 border border-blue-600 rounded-lg overflow-hidden">
                          <button
                            type="button"
                            onClick={() =>
                              onUpdateQuantity({
                                ...item,
                                storeName: vendor.name,
                                category: vendor.category,
                              }, -1)
                            }
                            className="px-2.5 py-1 bg-red-950/60 text-red-400 hover:bg-red-600 hover:text-white font-black text-xs transition"
                          >
                            -
                          </button>
                          <span className="px-3 text-white text-xs font-black">
                            {qty}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              onUpdateQuantity({
                                ...item,
                                storeName: vendor.name,
                                category: vendor.category,
                              }, 1)
                            }
                            className="px-2.5 py-1 bg-blue-950/60 text-blue-400 hover:bg-blue-600 hover:text-white font-black text-xs transition"
                          >
                            +
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <p className="text-xs text-gray-500 italic py-2 text-center">No items listed for this store.</p>
              )}
            </div>
          </div>

          <div className="space-y-1.5 text-[11px] text-gray-400 pt-3 border-t border-gray-800">
            <div className="flex justify-between">
              <span>📍 Location:</span>
              <span className="text-white font-medium">{vendor.location}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 rounded-xl border border-gray-700 text-gray-300 font-bold text-xs hover:bg-gray-800 transition uppercase"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
}
