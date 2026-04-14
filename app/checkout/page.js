'use client';

import { useSearchParams } from 'next/navigation';
import { useState, Suspense } from 'react';
import Image from 'next/image';

function CheckoutContent() {
  const searchParams = useSearchParams();
  const order = searchParams.get('order') || 'No order summary';
  const total = searchParams.get('total') || '0';

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    pincode: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, phone, address, pincode } = formData;

    if (!name || !phone || !address || !pincode) {
      alert('Please fill in all required fields.');
      return;
    }

    const msg = `New Order - Bilwashree Jewels
Name: ${name}
Phone: ${phone}
Address: ${address}
Pincode: ${pincode}
Order: ${order}
Total: Rs.${total}
Payment: UPI`;

    window.open(`https://wa.me/919986237677?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div style={{ backgroundColor: '#fff8f0', minHeight: '100vh', padding: '20px', fontFamily: 'Outfit, sans-serif' }}>
      <header style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: '#c9a84c', fontSize: '2rem', fontWeight: '800', margin: '0' }}>Bilwashree Jewels</h1>
        <p style={{ color: '#666', marginTop: '5px' }}>Complete Your Order</p>
      </header>

      <main style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: '#fff', padding: '30px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(201, 168, 76, 0.1)' }}>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#4A3F30' }}>Full Name *</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '16px' }}
              placeholder="Enter your full name"
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#4A3F30' }}>Phone Number *</label>
            <input
              type="tel"
              name="phone"
              required
              value={formData.phone}
              onChange={handleChange}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '16px' }}
              placeholder="Enter your 10-digit phone number"
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#4A3F30' }}>Delivery Address *</label>
            <textarea
              name="address"
              required
              rows="3"
              value={formData.address}
              onChange={handleChange}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '16px', fontFamily: 'inherit' }}
              placeholder="Street name, landmark, area..."
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#4A3F30' }}>Pincode *</label>
            <input
              type="text"
              name="pincode"
              required
              value={formData.pincode}
              onChange={handleChange}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '16px' }}
              placeholder="6-digit area pincode"
            />
          </div>

          <div style={{ backgroundColor: '#fdf9f2', padding: '15px', borderRadius: '8px', marginBottom: '25px', border: '1px solid rgba(201, 168, 76, 0.2)' }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '1rem', color: '#c9a84c' }}>Order Summary</h3>
            <p style={{ margin: '0', fontSize: '0.9rem', color: '#666', lineHeight: '1.4' }}>{order.replace(/ \| /g, '\n')}</p>
            <div style={{ marginTop: '10px', borderTop: '1px solid #eee', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', fontWeight: '700', fontSize: '1.1rem' }}>
              <span>Total Amount:</span>
              <span style={{ color: '#c9a84c' }}>₹{total}</span>
            </div>
          </div>

          <section style={{ textAlign: 'center', backgroundColor: '#fff', border: '2px dashed #c9a84c', borderRadius: '12px', padding: '20px', marginBottom: '30px' }}>
            <h3 style={{ margin: '0 0 15px 0', color: '#c9a84c' }}>Pay via UPI</h3>
            <div style={{ marginBottom: '15px' }}>
              <Image
                src="/qr-code.png"
                alt="UPI QR Code"
                width={200}
                height={200}
                style={{ margin: '0 auto', display: 'block' }}
              />
            </div>
            <p style={{ margin: '5px 0', fontSize: '1.1rem', fontWeight: '700' }}>bilwashreejewels@ybl</p>
            <p style={{ margin: '0', fontSize: '0.8rem', color: '#888' }}>Scan QR code or use UPI ID to pay, then submit the form</p>
          </section>

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '16px',
              backgroundColor: '#c9a84c',
              color: '#fff',
              border: 'none',
              borderRadius: '99px',
              fontSize: '1.1rem',
              fontWeight: '700',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(201, 168, 76, 0.3)',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#a8882e'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#c9a84c'}
          >
            Confirm Order via WhatsApp
          </button>
        </form>
      </main>

      <footer style={{ textAlign: 'center', marginTop: '40px', color: '#aaa', fontSize: '0.8rem', paddingBottom: '30px' }}>
        © 2026 Bilwashree Jewels. All rights reserved.
      </footer>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div style={{ padding: '50px', textAlign: 'center' }}>Loading checkout...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
