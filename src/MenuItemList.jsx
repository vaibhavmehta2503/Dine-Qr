import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';

const MenuItemList = ({ items, onEdit, onDelete }) => {
  if (!Array.isArray(items)) return <div className="text-red-600 text-center py-8">Error loading menu items.</div>;
  return (
    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      {items.length === 0 && <div className="col-span-2 text-center text-gray-500 py-8">No menu items found.</div>}
      {items.map(item => (
        <div key={item._id} className="bg-white rounded-xl shadow-lg flex flex-col md:flex-row items-center gap-4 p-4 border border-[#f5eee6] hover:shadow-2xl transition-all">
          {item.image && (
            <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg border border-[#e6c28b] bg-[#fff7e6]" onError={e => e.target.style.display='none'} />
          )}
          <div className="flex-1 w-full">
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-lg text-[#234567]">{item.name}</span>
              <span className="text-base font-bold text-[#e6c28b]">₹{item.price}</span>
            </div>
            <div className="flex items-center gap-2 mb-2">
              {item.available ? (
                <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded-full">Available</span>
              ) : (
                <span className="bg-red-100 text-red-600 text-xs font-semibold px-2 py-1 rounded-full">Unavailable</span>
              )}
            </div>
            <div className="text-gray-600 text-sm mb-2">{item.description}</div>
            <div className="flex gap-3 mt-2">
              <button className="text-blue-600 hover:text-blue-800 p-2 rounded-full bg-blue-50 hover:bg-blue-100 transition" onClick={() => onEdit(item)} title="Edit"><FaEdit /></button>
              <button className="text-red-600 hover:text-red-800 p-2 rounded-full bg-red-50 hover:bg-red-100 transition" onClick={() => onDelete(item._id)} title="Delete"><FaTrash /></button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MenuItemList; 