import React from 'react';
import { Helmet } from 'react-helmet-async';
import { FaWhatsapp } from 'react-icons/fa';
import { FiPhone, FiMail } from 'react-icons/fi';

const WHATSAPP = import.meta.env.VITE_WHATSAPP_NUMBER || '94762606990';
const PHONE = import.meta.env.VITE_PHONE_NUMBER || '+94762606990';
const EMAIL = import.meta.env.VITE_EMAIL_ADDRESS || 'gunabaladilaksan1999@gmail.com.com';

export default function Contact() {
  return (
    <>
      <Helmet>
        <title>Contact Us — New Multi Shop</title>
        <meta name="description" content="Get in touch with New Multi Shop via WhatsApp, phone, or email." />
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl font-bold text-gray-800 mb-3 text-center">Contact Us</h1>
        <p className="text-gray-500 text-center mb-12 max-w-lg mx-auto">
          We'd love to hear from you. Reach out through any of the channels below.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ContactCard
            icon={<FaWhatsapp size={32} />}
            label="WhatsApp"
            value={`+${WHATSAPP}`}
            href={`https://wa.me/${WHATSAPP}`}
            color="green"
          />
          <ContactCard
            icon={<FiPhone size={32} />}
            label="Call Us"
            value={PHONE}
            href={`tel:${PHONE}`}
            color="blue"
          />
          <ContactCard
            icon={<FiMail size={32} />}
            label="Email"
            value={EMAIL}
            href={`mailto:${EMAIL}`}
            color="purple"
          />
        </div>
      </div>
    </>
  );
}

function ContactCard({ icon, label, value, href, color }) {
  const colors = {
    green: 'bg-green-50 text-green-600 hover:bg-green-100',
    blue: 'bg-blue-50 text-blue-600 hover:bg-blue-100',
    purple: 'bg-purple-50 text-purple-600 hover:bg-purple-100',
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex flex-col items-center gap-4 p-8 rounded-2xl transition-colors ${colors[color] || colors.blue}`}
    >
      {icon}
      <div className="text-center">
        <p className="font-bold text-lg">{label}</p>
        <p className="text-sm mt-1 opacity-80 break-all">{value}</p>
      </div>
    </a>
  );
}
