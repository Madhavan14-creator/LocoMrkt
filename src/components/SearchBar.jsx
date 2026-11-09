import React from "react";

const categories = ["All", "Bakery", "Groceries", "Services", "Fashion", "Electronics"];

export default function SearchBar({ searchTerm, setSearchTerm, selectedCategory, setSelectedCategory }) {
  return (
    <div className="max-w-3xl mx-auto mb-10 text-center">
      <h1 className="text-3xl font-bold text-white mb-2">Local Vendor Directory</h1>
      <p className="text-gray-400 text-sm mb-6">Explore nearby businesses, view items, and order directly.</p>

      {/* Input */}
      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Search for a vendor or service..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full py-3 px-4 rounded-xl bg-gray-900 border border-gray-800 text-white placeholder-gray-500 focus:outline-none focus:border-purple-600 text-sm"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm("")}
            className="absolute right-3 top-3 text-gray-500 hover:text-white text-xs font-bold"
          >
            Clear
          </button>
        )}
      </div>

      {/* Simple Category Filter */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              selectedCategory === cat
                ? "bg-red-600 text-white"
                : "bg-gray-900 text-gray-400 border border-gray-800 hover:text-white"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}
