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
      />

      <footer className="bg-gray-950 border-t border-purple-950 py-6 text-center text-purple-300 text-xs font-medium">
        © 2026 LocoMrkt • Powered by RMCUBE
      </footer>
    </div>
  );
}
