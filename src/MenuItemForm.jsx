import React, { useState, useEffect } from 'react';

const initialState = { name: '', price: '', available: true, description: '', image: '' };

const MenuItemForm = ({ onSave, editItem, onCancel }) => {
  const [form, setForm] = useState(initialState);

  useEffect(() => {
    if (editItem) {
      setForm({
        name: editItem.name || '',
        price: editItem.price || '',
        available: editItem.available ?? true,
        description: editItem.description || '',
        image: editItem.image || '',
        _id: editItem._id,
      });
    } else {
      setForm(initialState);
    }
  }, [editItem]);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    onSave(form);
    setForm(initialState);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white/90 rounded-2xl shadow-lg mb-8 p-6 md:p-8 w-full max-w-2xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
      <div className="md:col-span-2 flex items-center gap-2 mb-2">
        <span className="text-xl">{editItem ? '✏️' : '➕'}</span>
        <h2 className="text-2xl card-header">{editItem ? 'Edit' : 'Add'} Menu Item</h2>
      </div>
      <div className="flex flex-col gap-2">
        <label className="font-semibold flex items-center gap-2"><span className="text-lg">📝</span> Name</label>
        <input
          type="text"
          name="name"
          placeholder="Item name"
          value={form.name}
          onChange={handleChange}
          className="border-2 rounded-lg w-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#e6c28b]"
          style={{borderColor: 'var(--dineqr-gold)'}} required
        />
      </div>
      <div className="flex flex-col gap-2">
        <label className="font-semibold flex items-center gap-2"><span className="text-lg">₹</span> Price</label>
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          className="border-2 rounded-lg w-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#e6c28b]"
          style={{borderColor: 'var(--dineqr-gold)'}} required
        />
      </div>
      <div className="flex flex-col gap-2 md:col-span-2">
        <label className="font-semibold flex items-center gap-2"><span className="text-lg">🖼️</span> Image URL</label>
        <input
          type="text"
          name="image"
          placeholder="Image URL"
          value={form.image}
          onChange={handleChange}
          className="border-2 rounded-lg w-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#e6c28b]"
          style={{borderColor: 'var(--dineqr-gold)'}}
        />
        {form.image && (
          <img src={form.image} alt="Preview" className="rounded-lg mt-2 max-h-32 object-contain border border-[#e6c28b] bg-[#fff7e6]" onError={e => e.target.style.display='none'} />
        )}
      </div>
      <div className="flex flex-col gap-2 md:col-span-2">
        <label className="font-semibold flex items-center gap-2"><span className="text-lg">📄</span> Description</label>
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="border-2 rounded-lg w-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#e6c28b] min-h-[48px]"
          style={{borderColor: 'var(--dineqr-gold)'}}
        />
      </div>
      <div className="flex items-center gap-2 md:col-span-2">
        <input
          type="checkbox"
          name="available"
          checked={form.available}
          onChange={handleChange}
          className="mr-2 accent-[#e6c28b]"
        />
        <span className="font-semibold">Available</span>
      </div>
      <div className="flex gap-2 md:col-span-2 mt-2">
        <button type="submit" className="btn-gold px-8 py-2 rounded-full font-semibold text-lg shadow hover:scale-105 transition-all">
          {editItem ? 'Update' : 'Add'} Item
        </button>
        {editItem && (
          <button type="button" onClick={onCancel} className="btn-blue px-8 py-2 rounded-full font-semibold text-lg shadow hover:scale-105 transition-all">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default MenuItemForm; 