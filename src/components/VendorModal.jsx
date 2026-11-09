import React, { useState } from "react";

export default function VendorModal({ vendor, onClose, cart, onUpdateQuantity, isMerchantMode }) {
  const [items, setItems] = useState(vendor?.items || []);
  const [newItemName, setNewItemName] = useState("");
  const [newItemPrice, setNewItemPrice] = useState("");

  if (!vendor) return null;

  const getItemQuantity = (itemId) => {
    const cartItem = cart.find((i) => i.id === itemId);
    return cartItem ? cartItem.quantity : 0;
  };

  const toggleStock = (itemId) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, outOfStock: !item.outOfStock } : item
      )
    );
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!newItemName.trim() || !newItemPrice) return;

    const newItem = {
      id: Date.now(),
      itemName: newItemName,
      price: Number(newItemPrice),
      outOfStock: false,
    };

    setItems([...items, newItem]);
    setNewItemName("");
    setNewItemPrice("");
  };

  const storePhone = vendor.phone || "+91 98765 43210";
  const whatsappMessage = encodeURIComponent(`Hi ${vendor.name}, I am reaching out via LocoMrkt community app.`);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-gray-900 border border-blue-900/60 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        {/* Banner Header */}
        <div className={`h-32 p-6 flex justify-between items-start relative ${
          isMerchantMode 
            ? "bg-gradient-to-r from-amber-950 via-purple-950 to-black border-b border-amber-500/40" 
            : "bg-gradient-to-r from-purple-900 via-blue-900 to-black"
        }`}>
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-red-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                {vendor.category}
              </span>
              {isMerchantMode && (
                <span className="bg-amber-500 text-black text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Merchant Control
                </span>
              )}
            </div>
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
          
          {/* Quick Direct Actions for Customers */}
          {!isMerchantMode && (
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
          )}

          {/* Merchant Add Item Form */}
          {isMerchantMode && (
            <form onSubmit={handleAddItem} className="bg-gray-950 p-3 rounded-xl border border-amber-900/50 space-y-2">
              <h4 className="text-xs font-black text-amber-400 uppercase tracking-wider">
                + Add New Store Product
              </h4>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Item Name"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="flex-1 bg-gray-900 border border-gray-800 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
                />
                <input
                  type="number"
                  placeholder="Price (₹)"
                  value={newItemPrice}
                  onChange={(e) => setNewItemPrice(e.target.value)}
                  className="w-24 bg-gray-900 border border-gray-800 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
                />
                <button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-600 text-black text-xs font-black px-3 py-1.5 rounded-lg transition uppercase"
                >
                  Save
                </button>
              </div>
            </form>
          )}

          {/* Product Items List */}
          <div className="pt-2">
            <h4 className="text-xs font-black text-purple-300 uppercase tracking-wider mb-2">
              {isMerchantMode ? "Inventory & Stock Management" : "Popular Items"}
            </h4>
            <div className="space-y-2">
              {items.map((item) => {
                const qty = getItemQuantity(item.id);
                return (
                  <div 
                    key={item.id}
                    className={`bg-gray-950 p-3 rounded-xl border flex items-center justify-between transition ${
                      item.outOfStock ? "border-red-900/40 opacity-60" : "border-gray-800"
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <h5 className="font-bold text-white text-xs">{item.itemName}</h5>
                        {item.outOfStock && (
                          <span className="text-[9px] bg-red-950 text-red-400 border border-red-800 px-1.5 py-0.5 rounded font-black uppercase">
                            Out of Stock
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-red-400 font-black block mt-0.5">
                        ₹{item.price}
                      </span>
                    </div>

                    {/* Merchant Stock Controls */}
                    {isMerchantMode ? (
                      <button
                        onClick={() => toggleStock(item.id)}
                        className={`text-[10px] font-black px-3 py-1.5 rounded-lg transition border uppercase ${
                          item.outOfStock
                            ? "bg-green-950 text-green-400 border-green-800 hover:bg-green-900"
                            : "bg-red-950 text-red-400 border-red-800 hover:bg-red-900"
                        }`}
                      >
                        {item.outOfStock ? "Mark In Stock" : "Mark Out of Stock"}
                      </button>
                    ) : (
                      /* Customer Cart Controls */
                      item.outOfStock ? (
                        <span className="text-[11px] text-gray-500 font-bold italic">Unavailable</span>
                      ) : qty === 0 ? (
                        <button
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
                      )
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <button
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
