import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import SearchBar from "./components/SearchBar";
import VendorCard from "./components/VendorCard";
import VendorModal from "./components/VendorModal";
import CartDrawer from "./components/CartDrawer";
import CheckoutModal from "./components/CheckoutModal";

const API_BASE = "http://localhost:5000";

export default function App() {
  const [vendors, setVendors] = useState([]);
  const [isLoadingVendors, setIsLoadingVendors] = useState(true);
  const [apiError, setApiError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem("locomrkt_cart");
      return savedCart ? JSON.parse(savedCart) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("locomrkt_cart", JSON.stringify(cart));
    } catch (err) {
      console.error("Could not save cart to localStorage", err);
    }
  }, [cart]);

  useEffect(() => {
    let ignore = false;

    async function loadVendors() {
      setIsLoadingVendors(true);
      setApiError("");
      try {
        const res = await fetch(`${API_BASE}/api/vendors`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!ignore) {
          setVendors(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (!ignore) {
          setApiError("Could not reach backend on http://localhost:5000. Make sure node index.js is running.");
        }
      } finally {
        if (!ignore) {
          setIsLoadingVendors(false);
        }
      }
    }

    loadVendors();
    return () => {
      ignore = true;
    };
  }, []);

  const handleUpdateQuantity = (item, delta) => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((i) => i.id === item.id);

      if (existingIndex > -1) {
        const updated = [...prevCart];
        const newQty = updated[existingIndex].quantity + delta;

        if (newQty <= 0) {
          return updated.filter((i) => i.id !== item.id);
        } else {
          updated[existingIndex] = { ...updated[existingIndex], quantity: newQty };
          return updated;
        }
      } else if (delta > 0) {
        return [...prevCart, { ...item, quantity: delta }];
      }

      return prevCart;
    });
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleOpenCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleCompleteOrder = () => {
    setIsCheckoutOpen(false);
    setCart([]);
  };

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const filteredVendors = vendors.filter((vendor) => {
    const matchesSearch =
      vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" || vendor.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-between font-sans">
      <div>
        <Navbar
          cartCount={totalCartCount}
          onOpenCart={() => setIsCartOpen(true)}
        />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <SearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />

          <div className="mb-4 flex items-center justify-between border-b border-gray-800 pb-2">
            <h2 className="text-xl font-black text-white tracking-tight">
              Bengaluru Community Vendors
            </h2>
            <span className="text-xs font-bold text-red-500">
              {filteredVendors.length} STORES ONLINE
            </span>
          </div>

          {apiError && (
            <div className="mb-4 p-3 rounded-xl bg-red-950/60 border border-red-800 text-red-200 text-xs font-semibold">
              {apiError}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {isLoadingVendors ? (
              <div className="col-span-full text-center py-12 bg-gray-900 rounded-2xl border border-gray-800">
                <p className="text-gray-400 font-bold text-sm">Loading Bengaluru stores...</p>
              </div>
            ) : filteredVendors.length > 0 ? (
              filteredVendors.map((vendor) => (
                <VendorCard
                  key={vendor.id}
                  vendor={vendor}
                  onSelectVendor={setSelectedVendor}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12 bg-gray-900 rounded-2xl border border-purple-900/40">
                <p className="text-gray-400 font-bold">No stores found matching your query.</p>
                <button
                  onClick={() => { setSearchTerm(""); setSelectedCategory("All"); }}
                  className="mt-2 text-red-400 font-bold text-sm hover:underline"
                >
                  Clear search
                </button>
              </div>
            )}
          </div>
        </main>
      </div>

      <VendorModal
        vendor={selectedVendor}
        onClose={() => setSelectedVendor(null)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onClearCart={handleClearCart}
        onOpenCheckout={handleOpenCheckout}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        onCompleteOrder={handleCompleteOrder}
        apiBase={API_BASE}
      />

      <footer className="bg-gray-950 border-t border-purple-950 py-6 text-center text-purple-300 text-xs font-medium">
        © 2026 LocoMrkt • Powered by RMCUBE
      </footer>
    </div>
  );
}
