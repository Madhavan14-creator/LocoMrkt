import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import SearchBar from "./components/SearchBar";
import VendorCard from "./components/VendorCard";
import VendorModal from "./components/VendorModal";
import CartDrawer from "./components/CartDrawer";
import CheckoutModal from "./components/CheckoutModal";

export default function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isMerchantMode, setIsMerchantMode] = useState(false);

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

  const vendors = [
    {
      id: 1,
      name: "Corner Bakery & Cafe",
      category: "Bakery",
      description: "Artisan breads, fresh pastries, and warm filter coffee.",
      location: "Downtown",
      rating: 4.8,
      deliveryTime: "10 MINS",
      phone: "+91 98123 45678",
      items: [
        { id: 101, itemName: "Sourdough Bread", price: 140 },
        { id: 102, itemName: "Chocolate Croissant", price: 90 },
        { id: 103, itemName: "Cold Brew Coffee", price: 120 },
      ]
    },
    {
      id: 2,
      name: "Fresh Basket Organics",
      category: "Groceries",
      description: "Farm-fresh vegetables, organic fruits, and dairy.",
      location: "Westside",
      rating: 4.9,
      deliveryTime: "15 MINS",
      phone: "+91 98234 56789",
      items: [
        { id: 201, itemName: "Organic Avocados (Pack of 2)", price: 180 },
        { id: 202, itemName: "Fresh Cow Milk (1L)", price: 65 },
        { id: 203, itemName: "Brown Eggs (6 pcs)", price: 75 },
      ]
    },
    {
      id: 3,
      name: "QuickFix Auto Repair",
      category: "Services",
      description: "Emergency car maintenance and quick oil changes.",
      location: "Industrial Park",
      rating: 4.7,
      deliveryTime: "SAME DAY",
      phone: "+91 98345 67890",
      items: [
        { id: 301, itemName: "Full Car Wash & Polish", price: 499 },
        { id: 302, itemName: "Engine Oil Check & Top-up", price: 799 },
        { id: 303, itemName: "Tire Pressure & Alignment", price: 299 },
      ]
    },
    {
      id: 4,
      name: "Urban Threads Boutique",
      category: "Fashion",
      description: "Sustainable local fashion and handmade accessories.",
      location: "Main Street",
      rating: 4.6,
      deliveryTime: "30 MINS",
      phone: "+91 98456 78901",
      items: [
        { id: 401, itemName: "Cotton Graphic Tee", price: 599 },
        { id: 402, itemName: "Handcrafted Tote Bag", price: 349 },
        { id: 403, itemName: "Denim Jacket", price: 1299 },
      ]
    },
    {
      id: 5,
      name: "TechZone Gadgets",
      category: "Electronics",
      description: "Phone repairs, fast chargers, and smart home gear.",
      location: "Tech Hub",
      rating: 4.5,
      deliveryTime: "20 MINS",
      phone: "+91 98567 89012",
      items: [
        { id: 501, itemName: "Type-C Fast Charging Cable", price: 299 },
        { id: 502, itemName: "Bluetooth Earbuds", price: 1499 },
        { id: 503, itemName: "Tempered Glass Guard", price: 199 },
      ]
    },
  ];

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
      vendor.description.toLowerCase().includes(searchTerm.toLowerCase());

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
          isMerchantMode={isMerchantMode}
          setIsMerchantMode={setIsMerchantMode}
        />

        {isMerchantMode && (
          <div className="bg-amber-500 text-black px-4 py-2 text-center text-xs font-black uppercase tracking-wider">
            ⚡ Merchant View Enabled — Viewing direct shopkeeper operational controls
          </div>
        )}

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <SearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />

          <div className="mb-4 flex items-center justify-between border-b border-gray-800 pb-2">
            <h2 className="text-xl font-black text-white tracking-tight">
              {isMerchantMode ? "Store Management Portal" : "Community Vendors"}
            </h2>
            <span className="text-xs font-bold text-red-500">
              {filteredVendors.length} STORES ONLINE
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredVendors.length > 0 ? (
              filteredVendors.map((vendor) => (
                <VendorCard
                  key={vendor.id}
                  vendor={vendor}
                  onSelectVendor={setSelectedVendor}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12 bg-gray-900 rounded-2xl border border-blue-900/40">
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
      />

      <footer className="bg-gray-950 border-t border-purple-950 py-6 text-center text-purple-300 text-xs font-medium">
        © 2026 LocoMrkt • Powered by RMCUBE
      </footer>
    </div>
  );
}
