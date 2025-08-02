import React, { useState, useRef } from 'react';
// import QRCode from 'react-qr-code';
import QRCodeStyling from 'qr-code-styling';
import { FaUtensils, FaCopy } from 'react-icons/fa';

const chefHatSvg = `<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><ellipse cx="20" cy="20" rx="20" ry="20" fill="#fff7e6"/><path d="M10 22c-2-5 2-8 6-7 0-4 8-4 8 0 4-1 8 2 6 7" stroke="#e6c28b" stroke-width="2" fill="#fff"/><ellipse cx="20" cy="28" rx="8" ry="3" fill="#e6c28b"/></svg>`;

const QRCodeGenerator = () => {
  // Get restaurantId from URL or user
  const urlParams = new URLSearchParams(window.location.search);
  let restaurantId = urlParams.get('restaurant');
  if (!restaurantId) {
    const user = JSON.parse(localStorage.getItem('user'));
    restaurantId = user?.restaurantId || 'demo-restaurant';
  }
  const [table, setTable] = useState('1');
  const [customUrl, setCustomUrl] = useState(`${window.location.origin}/menu?restaurant=${restaurantId}&table=${table}`);
  const [qrValue, setQrValue] = useState(customUrl);
  const [showQR, setShowQR] = useState(false);
  const qrRef = useRef(null);
  const [qrInstance, setQrInstance] = useState(null);
  const [copied, setCopied] = useState(false);

  const defaultTables = [
    { name: 'Table 1', table: '1' },
    { name: 'Table 2', table: '2' },
    { name: 'Table 3', table: '3' },
    { name: 'Takeaway', table: 'Takeaway' },
    { name: 'Delivery', table: 'Delivery' },
  ];

  const generateQR = (url) => {
    if (qrInstance) qrInstance.update({ data: url });
    else {
      const qr = new QRCodeStyling({
        width: 256,
        height: 256,
        data: url,
        image: `data:image/svg+xml;utf8,${encodeURIComponent(chefHatSvg)}`,
        dotsOptions: {
          color: '#e6c28b',
          type: 'rounded',
        },
        backgroundOptions: {
          color: '#fff7e6',
        },
        imageOptions: {
          crossOrigin: 'anonymous',
          margin: 8,
          imageSize: 0.25,
        },
        cornersSquareOptions: {
          color: '#234567',
          type: 'extra-rounded',
        },
        cornersDotOptions: {
          color: '#e6c28b',
          type: 'dot',
        },
      });
      setQrInstance(qr);
      setTimeout(() => {
        if (qrRef.current) qr.append(qrRef.current);
      }, 0);
    }
  };

  const handleGenerateQR = () => {
    setQrValue(customUrl);
    setShowQR(true);
    setTimeout(() => generateQR(customUrl), 0);
  };

  const handleDefaultQR = (table) => {
    const url = `${window.location.origin}/menu?restaurant=${restaurantId}&table=${table}`;
    setQrValue(url);
    setShowQR(true);
    setTimeout(() => generateQR(url), 0);
  };

  const handleDownloadQR = () => {
    if (qrInstance) qrInstance.download({ extension: 'png', name: 'dineqr-qr' });
  };

  // Compute a natural label for the table
  const getTableLabel = (qrValue, table) => {
    const match = qrValue.match(/table=([^&]+)/);
    const t = match ? match[1] : table;
    if (t === 'Takeaway' || t === 'Delivery') return t;
    return `Table ${t}`;
  };

  return (
    <div className="card shadow-2xl p-0 max-w-2xl mx-auto">
      {/* Kitchen-themed header */}
      <div className="flex items-center gap-3 px-8 py-6 card-header rounded-t-xl border-b border-[#D4AF37] relative overflow-hidden">
        <FaUtensils className="text-[#D4AF37] text-3xl drop-shadow" />
        <h2 className="text-3xl card-header tracking-tight">QR Code Generator</h2>
        <span className="absolute right-6 top-1/2 -translate-y-1/2 opacity-10 text-7xl select-none pointer-events-none">🍽️</span>
      </div>
      {/* Table Selection */}
      <div className="mb-6 px-8 pt-6">
        <h3 className="text-lg font-semibold mb-3 text-gray-700">Table</h3>
        <select
          value={table}
          onChange={e => {
            setTable(e.target.value);
            const url = `${window.location.origin}/menu?restaurant=${restaurantId}&table=${e.target.value}`;
            setCustomUrl(url);
          }}
          className="p-2 border border-gray-300 rounded-lg"
        >
          {defaultTables.map((t, idx) => (
            <option key={idx} value={t.table}>{t.name}</option>
          ))}
        </select>
      </div>
      {/* Custom URL Input */}
      <div className="mb-8 px-8">
        <h3 className="text-lg font-semibold mb-3 text-gray-700">Custom Menu URL</h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={customUrl}
            onChange={(e) => setCustomUrl(e.target.value)}
            placeholder="Enter custom menu URL"
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={handleGenerateQR}
            className="btn-blue px-6 py-3 font-semibold transition"
          >
            Generate QR
          </button>
        </div>
      </div>
      {/* Quick QR Codes */}
      <div className="mb-8 px-8">
        <h3 className="text-lg font-semibold mb-3 text-gray-700">Quick QR Codes</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {defaultTables.map((item, index) => (
            <button
              key={index}
              onClick={() => handleDefaultQR(item.table)}
              className="p-3 border border-[#D4AF37] rounded-lg hover:bg-[#FFF6E5] hover:border-[#204080] transition text-left"
            >
              <div className="font-medium text-gray-800">{item.name}</div>
              <div className="text-sm text-gray-500 truncate">{`${window.location.origin}/menu?restaurant=${restaurantId}&table=${item.table}`}</div>
            </button>
          ))}
        </div>
      </div>
      {/* QR Code Display */}
      {showQR && (
        <div className="flex flex-col items-center bg-[#fdfaf5] rounded-2xl shadow-xl p-6 max-w-xs w-full border border-[#e6c28b] print:bg-white print:shadow-none print:border-none mx-auto">
          <div className="relative flex items-center justify-center mb-4">
            <div ref={qrRef} className="rounded-xl overflow-hidden bg-[#fdfaf5]">
              {/* The QRCodeStyling instance will render here, ensure it uses the correct colors and logo */}
            </div>
            <div className="absolute inset-0 rounded-xl border-4 border-[#e6c28b] pointer-events-none" style={{boxShadow: '0 4px 24px 0 rgba(230,194,139,0.15)'}} />
                </div>
          <div className="text-center mt-2 mb-1">
            <div className="text-lg font-bold text-[#234567]">{getTableLabel(qrValue, table)}</div>
            <div className="text-base text-[#2ecc71] font-semibold">Scan to Order at {getTableLabel(qrValue, table)} 🍽️</div>
              </div>
              <button
                onClick={handleDownloadQR}
            className="mt-4 btn-gold px-6 py-2 rounded-full font-semibold shadow hover:scale-105 transition-all print:hidden"
              >
            Download QR
              </button>
        </div>
      )}
      {/* Instructions */}
      <div className="mt-8 p-4 bg-[#fff7e6] rounded-b-xl border-t border-[#e6c28b]">
        <h4 className="font-semibold text-blue-800 mb-2">How to use:</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Select a table or enter a custom menu URL</li>
          <li>• Generate the QR code and download it</li>
          <li>• Print and place the QR code on tables or menus</li>
          <li>• Customers scan the QR code to access your menu</li>
        </ul>
      </div>
    </div>
  );
};

export default QRCodeGenerator; 