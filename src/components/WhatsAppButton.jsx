import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '919999999999';

export default function WhatsAppButton() {
  const href = `https://wa.me/${WHATSAPP_NUMBER}`;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50 bg-green-500 text-white p-3.5 rounded-full shadow-lg hover:bg-green-600 transition-colors"
    >
      <FaWhatsapp size={28} />
    </a>
  );
}
