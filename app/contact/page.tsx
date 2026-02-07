"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import { MessageSquare, MapPin, Phone, Clock, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { submitInquiry } from "./actions";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    message: ""
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [responseMsg, setResponseMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    
    const data = new FormData();
    data.append("name", formData.name);
    data.append("phone", formData.phone);
    data.append("message", formData.message);

    try {
      // @ts-ignore
      const res = await submitInquiry(null, data);
      if (res.success) {
        setStatus('success');
        setResponseMsg(res.message || "Thank you!");
        setFormData({ name: "", phone: "", message: "" });
      } else {
        setStatus('error');
        setResponseMsg(res.message || "Failed to submit.");
      }
    } catch (error) {
      setStatus('error');
      setResponseMsg("An unexpected error occurred.");
    }
  };

  return (
    <div className="min-h-screen bg-brand-paper selection:bg-brand-gold/30">
      <Navbar />
      
      <main className="mx-auto max-w-5xl px-6 py-12 md:py-20">
        
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-normal tracking-tight text-brand-navy mb-4 font-hindi">
            संपर्क करें (Contact Us)
          </h1>
          <p className="text-brand-ink/70 max-w-2xl mx-auto">
            Get in touch for consultations, inquiries, or to book an appointment with Acharya Rajesh Walia.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          
          {/* Left Column: Contact Info & Map */}
          <div className="space-y-8">
            {/* Quick Actions Card */}
            <div className="bg-white border border-brand-navy/5 rounded-2xl p-8 shadow-sm">
              <h2 className="text-xl font-bold text-brand-navy mb-6 flex items-center gap-2">
                <span className="w-1 h-6 bg-brand-gold rounded-full"></span>
                Quick Connect
              </h2>
              
              <div className="space-y-6">
                <a 
                  href="https://wa.me/919810449333" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl transition-all shadow-md hover:shadow-lg active:scale-[0.98]"
                >
                  <MessageSquare size={24} strokeWidth={2.5} />
                  Chat on WhatsApp
                </a>

                <div className="flex items-center gap-4 p-4 bg-brand-paper/50 rounded-xl">
                  <div className="bg-white p-3 rounded-full text-brand-navy shadow-sm">
                    <Phone size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Call Us</p>
                    <div className="font-bold text-brand-navy text-lg flex flex-col sm:flex-row sm:gap-4">
                      <a href="tel:+919810449333" className="hover:text-brand-gold transition-colors">9810449333</a>
                      <span className="hidden sm:inline text-slate-300">|</span>
                      <a href="tel:+917982803848" className="hover:text-brand-gold transition-colors">7982803848</a>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-brand-paper/50 rounded-xl">
                  <div className="bg-white p-3 rounded-full text-brand-navy shadow-sm">
                    <Clock size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Visiting Hours</p>
                    <p className="font-bold text-brand-navy">10:00 AM - 7:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Card */}
            <div className="bg-white border border-brand-navy/5 rounded-2xl overflow-hidden shadow-sm h-[300px] relative group">
              <iframe 
                src="https://maps.google.com/maps?q=28.700917,77.108028&t=&z=15&ie=UTF8&iwloc=&output=embed"
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="grayscale group-hover:grayscale-0 transition-all duration-700"
              ></iframe>
              <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-4 py-2 rounded-lg text-xs font-bold shadow-sm flex items-center gap-2">
                <MapPin size={14} className="text-brand-gold" />
                B-5/54, Sector 3, Rohini (Near Rohini West Metro)
              </div>
            </div>
          </div>

          {/* Right Column: Inquiry Form */}
          <div className="bg-white border border-brand-navy/5 rounded-2xl p-8 md:p-10 shadow-sm sticky top-24">
            <h2 className="text-xl font-bold text-brand-navy mb-6">Send an Inquiry</h2>
            
            {status === 'success' ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={32} />
                </div>
                <h3 className="text-xl font-bold text-brand-navy mb-2">Message Sent!</h3>
                <p className="text-slate-500 mb-6">{responseMsg}</p>
                <button 
                  onClick={() => setStatus('idle')}
                  className="text-brand-gold font-bold text-sm hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Your Name</label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white focus:border-brand-gold focus:ring-1 focus:ring-brand-gold/20 transition-all"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    required
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white focus:border-brand-gold focus:ring-1 focus:ring-brand-gold/20 transition-all"
                    placeholder="Where can we reach you?"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Message (Optional)</label>
                  <textarea
                    id="message"
                    rows={4}
                    value={formData.message}
                    onChange={e => setFormData({...formData, message: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white focus:border-brand-gold focus:ring-1 focus:ring-brand-gold/20 transition-all resize-none"
                    placeholder="How can we help you?"
                  ></textarea>
                </div>

                {status === 'error' && (
                  <div className="p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-2 text-sm">
                    <AlertCircle size={16} />
                    {responseMsg}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="w-full bg-brand-navy hover:bg-brand-navy/90 text-white font-bold py-4 rounded-xl transition-all shadow-md active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {status === 'submitting' ? (
                    'Sending...'
                  ) : (
                    <>
                      Send Message <Send size={18} />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}
