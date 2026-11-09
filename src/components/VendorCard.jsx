import React from "react";

export default function VendorCard({ vendor, onSelectVendor }) {
  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 p-5 flex flex-col justify-between hover:border-purple-800 transition">
      <div>
        <div className="flex justify-between items-start mb-2">
          <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
            {vendor.category}
          </span>
          <span className="text-xs font-medium text-gray-400">
            ★ {vendor.rating}
          </span>
        </div>

        <h3 className="text-lg font-bold text-white mb-1">{vendor.name}</h3>
        <p className="text-xs text-gray-400 leading-relaxed mb-4">{vendor.description}</p>
      </div>

      <div className="pt-3 border-t border-gray-800/60 flex items-center justify-between text-xs">
        <span className="text-gray-500">📍 {vendor.location}</span>
        <button
          onClick={() => onSelectVendor(vendor)}
          className="text-red-400 hover:text-red-300 font-semibold transition"
        >
          View Menu &rarr;
        </button>
      </div>
    </div>
  );
}
