import Navbar from '@/components/Navbar';
import { MapPin, Phone, Mail } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-brand-paper selection:bg-brand-gold/30">
      <Navbar />
      
      <main className="mx-auto max-w-3xl px-6 py-16 md:py-24">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-normal tracking-tight text-brand-navy mb-4 font-hindi">
            आचार्य राजेश वालिया
          </h1>
          <div className="flex items-center justify-center gap-2 text-sm font-bold uppercase tracking-[0.1em] text-brand-gold font-hindi">
            <span>वैदिक ज्योतिषी</span>
            <span className="w-1 h-1 rounded-full bg-brand-gold"></span>
            <span>वास्तु विशेषज्ञ</span>
          </div>
        </div>

        {/* Content */}
        <div className="prose prose-lg prose-slate mx-auto mb-16 font-hindi">
          <p className="lead text-xl text-center text-brand-ink/80 italic">
            "ज्योतिष केवल भविष्य जानने का साधन नहीं, बल्कि कर्म और भाग्य के बीच सामंजस्य बिठाने का एक दिव्य विज्ञान है।"
          </p>
          
          <div className="mt-12 space-y-6 text-brand-ink/90 text-justify">
            <p>
              विगत कई वर्षों से वैदिक ज्योतिष और वास्तु शास्त्र के क्षेत्र में कार्यरत, आचार्य राजेश वालिया जी ने अनगिनत लोगों का मार्गदर्शन किया है। उनका मानना है कि ग्रह-नक्षत्र हमारे जीवन की दिशा निर्धारित अवश्य करते हैं, परंतु सही कर्म और ईश्वर की कृपा से हम अपनी दशा बदल सकते हैं।
            </p>
            <p>
              आचार्य जी अपनी सटीक भविष्यवाणी और अत्यंत सरल व सात्विक उपायों के लिए जाने जाते हैं। चाहे विवाह में विलंब हो, व्यापार में बाधा, या पारिवारिक कलह—आचार्य जी कुंडली का गहन अध्ययन कर समस्या की जड़ तक पहुँचते हैं और ऐसे उपाय बताते हैं जिन्हें कोई भी आसानी से अपने दैनिक जीवन में अपना सकता है।
            </p>
            <p>
              उनका उद्देश्य केवल भविष्य बताना नहीं, बल्कि व्यक्ति को उसकी क्षमताओं का आभास कराना और उसे सकारात्मक दिशा में प्रेरित करना है। वे डराने वाले उपायों के सख्त खिलाफ हैं और हमेशा सात्विक पूजा-पाठ व सेवा-भाव को प्राथमिकता देते हैं।
            </p>
          </div>
        </div>

        {/* Contact Schema */}
        <div className="bg-white border border-brand-navy/5 rounded-2xl p-8 md:p-12 shadow-sm font-hindi">
          <h2 className="text-2xl font-bold text-brand-navy mb-8 text-center">संपर्क सूत्र</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Phone */}
            <div className="flex flex-col items-center text-center p-6 bg-brand-paper/50 rounded-xl">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-brand-navy/5 text-brand-navy mb-4">
                <Phone size={24} />
              </div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-2 font-sans">Phone</h3>
              <p className="text-lg font-medium text-brand-navy font-sans">
                <a href="tel:+917982803848" className="hover:text-brand-gold transition-colors">7982803848</a>
              </p>
               <p className="text-lg font-medium text-brand-navy font-sans">
                <a href="tel:+919810449333" className="hover:text-brand-gold transition-colors">9810449333</a>
              </p>
            </div>

            {/* Address */}
            <div className="flex flex-col items-center text-center p-6 bg-brand-paper/50 rounded-xl">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-brand-navy/5 text-brand-navy mb-4">
                <MapPin size={24} />
              </div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-2 font-sans">Address</h3>
              <p className="text-brand-navy leading-relaxed">
                B-5/54, सेक्टर 3, रोहिणी<br />
                नई दिल्ली, दिल्ली
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-brand-navy/5 py-12 text-center">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
          © {new Date().getFullYear()} Acharya Rajesh Walia. All Wisdom Reserved.
        </p>
      </footer>
    </div>
  );
}
