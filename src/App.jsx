import React, { useState, useEffect } from "react";
import { Routes, Route, Link, useParams, useNavigate } from "react-router";
import Navbar from "./components/Navbar";
import SearchBar from "./components/SearchBar";
import VendorCard from "./components/VendorCard";
import CartDrawer from "./components/CartDrawer";
import CheckoutModal from "./components/CheckoutModal";

// Fallback seed data (your connectivity teammate will replace this with API fetch)
const INITIAL_VENDORS = [
  {
    id: 1,
    name: "Iyengar Bakery & Sweets",
    category: "Bakery",
    description: "Authentic Bengaluru butter biscuits, spicy bread roast, and fresh puffs.",
    location: "Malleshwaram, 8th Main",
    rating: 4.9,
    deliveryTime: "15 MINS",
    phone: "+91 98450 12345",
    items: [
      { id: 101, itemName: "Special Milk Bread", price: 45 },
      { id: 102, itemName: "Khara Biscuit (250g)", price: 80 },
      { id: 103, itemName: "Capsicum Veg Puff", price: 25 },
      { id: 104, itemName: "Filter Coffee Powder (200g)", price: 140 },
    ]
  },
  {
    id: 2,
    name: "Sri Manjunatha Organics",
    category: "Groceries",
    description: "Fresh Karnataka farm produce, organic pulses, and Desi A2 milk.",
    location: "Jayanagar, 4th Block",
    rating: 4.8,
    deliveryTime: "20 MINS",
    phone: "+91 98801 23456",
    items: [
      { id: 201, itemName: "Fresh Nanjanagud Bananas (1kg)", price: 60 },
      { id: 202, itemName: "Nandi Farm Cow Milk (1L)", price: 54 },
      { id: 203, itemName: "Organic Toor Dal (1kg)", price: 165 },
      { id: 204, itemName: "Byadgi Red Chillies (250g)", price: 95 },
    ]
  },
  {
    id: 3,
    name: "Namma Auto & Bike Clinic",
    category: "Services",
    description: "Quick two-wheeler servicing, puncture repair, and oil change.",
    location: "Indiranagar, 100ft Road",
    rating: 4.7,
    deliveryTime: "SAME DAY",
    phone: "+91 99002 34567",
    items: [
      { id: 301, itemName: "Scooter General Service", price: 499 },
      { id: 302, itemName: "Tubeless Puncture Fix", price: 120 },
      { id: 303, itemName: "Castrol Engine Oil (1L)", price: 380 },
    ]
  },
  {
    id: 4,
    name: "Commercial Street Silk & Cotton",
    category: "Fashion",
    description: "Handloom cotton kurtis, traditional sarees, and tailor adjustments.",
    location: "Commercial Street, Shivajinagar",
    rating: 4.6,
    deliveryTime: "30 MINS",
    phone: "+91 97403 45678",
    items: [
      { id: 401, itemName: "Block Print Cotton Kurti", price: 650 },
      { id: 402, itemName: "Pure Linen Dupatta", price: 350 },
      { id: 403, itemName: "Handmade Jute Tote", price: 280 },
    ]
  },
  {
    id: 5,
    name: "SP Road Electronics & Mobile Repair",
    category: "Electronics",
    description: "Instant phone screen replacement, cables, power banks, and accessories.",
    location: "SP Road / Koramangala 5th Block",
    rating: 4.8,
    deliveryTime: "25 MINS",
    phone: "+91 98444 56789",
    items: [
      { id: 501, itemName: "65W Type-C Fast Charger", price: 450 },
      { id: 502, itemName: "Tempered Glass Screen Protector", price: 150 },
      { id: 503, itemName: "10000mAh Power Bank", price: 899 },
    ]
  },
  {
    id: 6,
    name: "Subbamma Stores & Spices",
    category: "Groceries",
    description: "Traditional South Indian podis, pickles, and homemade papads.",
    location: "Gandhi Bazaar, Basavanagudi",
    rating: 4.9,
    deliveryTime: "20 MINS",
    phone: "+91 98860 67890",
    items: [
      { id: 601, itemName: "Gunpowder / Chutney Pudi (200g)", price: 90 },
      { id: 602, itemName: "Avakaya Mango Pickle (300g)", price: 130 },
      { id: 603, itemName: "Rice Sandige / Vadam (250g)", price: 85 },
    ]
  }
];

// Dynamic Store Page (/store/:id) matching your dark & purple/red theme
function StoreDetailPage({ vendors, isLoading, cart, onUpdateQuantity }) {
  const { id } = useParams();
  const store = vendors.find((v) => String(v.id) === String(id));

  if (isLoading) {
    return (
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
        <div className="h-4 w-40 bg-gray-800 rounded mb-6"></div>
        <div className="bg-gray-900 rounded-2xl p-6 border border-purple-900/40 space-y-4">
          <div className="h-7 w-64 bg-gray-800 rounded"></div>
          <div className="h-4 w-48 bg-gray-800 rounded"></div>
          <div className="h-4 w-full bg-gray-800 rounded"></div>
        </div>
      </main>
    );
  }

  if (!store) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-black text-white mb-2">Store Not Found</h2>
        <p className="text-gray-400 text-sm mb-6">
          This vendor link may have moved or is currently offline.
        </p>
        <Link
          to="/"
          className="inline-block bg-red-600 hover:bg-red-700 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition"
        >
          ← Back to Bengaluru Vendors
        </Link>
      </main>
    );
  }

  const getItemQuantity = (itemId) => {
    const found = cart.find((i) => i.id === itemId);
    return found ? found.quantity : 0;
  };

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <Link
        to="/"
        className="inline-flex items-center text-xs font-bold text-red-400 hover:text-red-300 mb-5 transition"
      >
        ← BACK TO ALL STORES
      </Link>

      {/* Store Banner Card */}
      <div className="bg-gray-900 border border-purple-900/50 rounded-2xl p-6 mb-6 shadow-lg">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <span className="inline-block text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-purple-950 text-purple-300 border border-purple-800/50 mb-2">
              {store.category}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {store.name}
            </h1>
            <p className="text-gray-400 text-sm mt-1">{store.description}</p>
          </div>

          <div className="flex flex-col items-end gap-1.5">
            <span className="bg-green-950 text-green-400 border border-green-800/50 text-xs font-black px-3 py-1 rounded-lg">
              ★ {store.rating}
            </span>
            <span className="text-xs font-bold text-red-400">
              {store.deliveryTime}
            </span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-800 flex flex-wrap gap-4 text-xs text-gray-400 font-medium">
          <span>📍 {store.location}</span>
          <span>📞 {store.phone}</span>
        </div>
      </div>

      {/* Store Items List */}
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-black text-white">Available Items & Services</h2>
        <span className="text-xs font-bold text-purple-400">
          {store.items.length} ITEMS
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {store.items.map((item) => {
          const qty = getItemQuantity(item.id);
          return (
            <div
              key={item.id}
              className="bg-gray-900/90 border border-gray-800 hover:border-purple-800/60 rounded-xl p-4 flex items-center justify-between transition"
            >
              <div>
                <h3 className="font-bold text-white text-sm">{item.itemName}</h3>
                <p className="text-red-400 font-black text-sm mt-1">₹{item.price}</p>
              </div>

              {qty === 0 ? (
                <button
                  onClick={() => onUpdateQuantity(item, 1)}
                  className="bg-red-600 hover:bg-red-700 text-white text-xs font-black px-4 py-2 rounded-lg transition cursor-pointer"
                >
                  + ADD
                </button>
              ) : (
                <div className="flex items-center gap-2 bg-gray-950 border border-purple-800/60 rounded-lg px-2 py-1">
                  <button
                    onClick={() => onUpdateQuantity(item, -1)}
                    className="text-red-400 font-black px-2 hover:text-white cursor-pointer"
                  >
                    −
                  </button>
                  <span className="text-xs font-black text-white min-w-[16px] text-center">
                    {qty}
                  </span>
                  <button
                    onClick={() => onUpdateQuantity(item, 1)}
                    className="text-green-400 font-black px-2 hover:text-white cursor-pointer"
                  >
                    +
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </main>
  );
}

export default function App() {
  const navigate = useNavigate();
  const [vendors, setVendors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Simulate dynamic API loading (Connectivity teammate will swap this with fetch('/api/vendors'))
  useEffect(() => {
    const timer = setTimeout(() => {
      setVendors(INITIAL_VENDORS);
      setIsLoading(false);
    }, 350);
    return () => clearTimeout(timer);
  }, []);

  // Initialize cart from localStorage so items persist on refresh
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem("locomrkt_cart");
      return savedCart ? JSON.parse(savedCart) : [];
    } catch {
      return [];
    }
  });

  // Sync cart changes with localStorage
  useEffect(() => {
    try {
      localStorage.setItem("locomrkt_cart", JSON.stringify(cart));
    } catch (err) {
      console.error("Could not save cart to localStorage", err);
    }
  }, [cart]);

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

  const handleClearCart = () => setCart([]);

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

        <Routes>
          {/* Main Marketplace View */}
          <Route
            path="/"
            element={
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
                    {isLoading ? "LOADING STORES..." : `${filteredVendors.length} STORES ONLINE`}
                  </span>
                </div>

                {isLoading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((n) => (
                      <div
                        key={n}
                        className="h-52 bg-gray-900 rounded-2xl border border-purple-900/30 p-4 animate-pulse flex flex-col justify-between"
                      >
                        <div className="space-y-3">
                          <div className="h-4 w-20 bg-gray-800 rounded"></div>
                          <div className="h-5 w-40 bg-gray-800 rounded"></div>
                          <div className="h-3 w-full bg-gray-800 rounded"></div>
                        </div>
                        <div className="h-8 w-full bg-gray-800 rounded-lg"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredVendors.length > 0 ? (
                      filteredVendors.map((vendor) => (
                        <VendorCard
                          key={vendor.id}
                          vendor={vendor}
                          onSelectVendor={(v) => navigate(`/store/${v.id}`)}
                        />
                      ))
                    ) : (
                      <div className="col-span-full text-center py-12 bg-gray-900 rounded-2xl border border-purple-900/40">
                        <p className="text-gray-400 font-bold">
                          No stores found matching your query.
                        </p>
                        <button
                          onClick={() => {
                            setSearchTerm("");
                            setSelectedCategory("All");
                          }}
                          className="mt-2 text-red-400 font-bold text-sm hover:underline"
                        >
                          Clear search
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </main>
            }
          />

          {/* Dynamic Individual Vendor Page */}
          <Route
            path="/store/:id"
            element={
              <StoreDetailPage
                vendors={vendors}
                isLoading={isLoading}
                cart={cart}
                onUpdateQuantity={handleUpdateQuantity}
              />
            }
          />
        </Routes>
      </div>

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
      />

      <footer className="bg-gray-950 border-t border-purple-950 py-6 text-center text-purple-300 text-xs font-medium">
        © 2026 LocoMrkt • Powered by RMCUBE
      </footer>
    </div>
  );
}
