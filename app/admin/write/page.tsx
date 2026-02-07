"use client";

import { useState, useRef } from 'react';
import { 
  Wand2, Languages, CalendarDays, Eye, Send, ChevronLeft, 
  LayoutDashboard, FileText, Clock, X, Plus, Bold, Italic, Quote,
  Type, Settings, Info, Heading2
} from 'lucide-react';
import Link from 'next/link';

export default function AdminWritePage() {
  const [isPreview, setIsPreview] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [title, setTitle] = useState("शनि का गोचर 2024");
  const [tags, setTags] = useState(["ShaniTransit", "VedicAstrology"]);
  const [newTag, setNewTag] = useState("");
  const [activeFormats, setActiveFormats] = useState({
    bold: false,
    italic: false,
    heading: false,
    shloka: false
  });
  const [stats, setStats] = useState({ words: 0, readTime: 0 });
  const editorRef = useRef<HTMLDivElement>(null);

  // Check current selection formatting
  const checkFormats = () => {
    setActiveFormats({
      bold: document.queryCommandState('bold'),
      italic: document.queryCommandState('italic'),
      heading: document.queryCommandValue('formatBlock') === 'h3',
      shloka: document.queryCommandValue('formatBlock') === 'blockquote'
    });
  };

  // Formatting Functions
  const applyFormat = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    if (editorRef.current) editorRef.current.focus();
    checkFormats();
  };

  const applyHeading = () => {
    // Heading formatting - Toggle logic
    if (document.queryCommandValue('formatBlock') === 'h3') {
      document.execCommand('formatBlock', false, 'p');
    } else {
      document.execCommand('formatBlock', false, 'h3');
    }
    if (editorRef.current) editorRef.current.focus();
    checkFormats();
  };

  const applyShloka = () => {
    // Sanskrit Shloka formatting - Toggle logic
    if (document.queryCommandValue('formatBlock') === 'blockquote') {
      document.execCommand('formatBlock', false, 'p');
    } else {
      document.execCommand('formatBlock', false, 'blockquote');
    }
    if (editorRef.current) editorRef.current.focus();
    checkFormats();
  };

  const addTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setNewTag("");
    }
  };

  if (isPreview) { /* Previous Preview Code... */ }

  return (
    <div className="flex h-screen bg-brand-paper overflow-hidden">
      {/* LEFT SIDEBAR (Library) */}
      <aside className="hidden w-64 flex-col border-r border-brand-navy/10 bg-white lg:flex">
        <div className="p-6 border-b border-brand-navy/5">
          <Link href="/" className="flex items-center gap-2 text-brand-navy font-bold">
            <LayoutDashboard size={20} className="text-brand-gold" />
            Admin Dashboard
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2 mb-4">Library</p>
          <button className="flex w-full items-center gap-3 rounded-lg bg-brand-navy/5 px-3 py-2 text-sm font-bold text-brand-navy text-left">
            <FileText size={18} /> New Article
          </button>
          <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-500 hover:bg-brand-navy/5 transition-colors text-left text-brand-gold">
            <Clock size={18} /> Drafts (4)
          </button>
        </nav>
        <div className="p-4 border-t border-brand-navy/5">
           <button 
            onClick={() => setShowSettings(!showSettings)}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${showSettings ? 'bg-brand-gold text-brand-navy' : 'text-slate-500 hover:bg-brand-navy/5'}`}
           >
            <Settings size={18} /> SEO & Settings
          </button>
        </div>
      </aside>

      {/* MAIN EDITOR AREA */}
      <main className="flex flex-1 flex-col overflow-hidden relative">
        <header className="flex h-16 items-center justify-between border-b border-brand-navy/5 bg-white px-8">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-[10px] font-bold text-green-500 uppercase tracking-widest">
              <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></div>
              Cloud Synced
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setIsPreview(true)} className="flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold uppercase tracking-widest text-brand-navy hover:bg-brand-navy/5">
              <Eye size={16} /> Preview
            </button>
            <button className="flex items-center gap-2 rounded-lg bg-brand-navy px-6 py-2 text-xs font-bold uppercase tracking-widest text-brand-gold shadow-md active:scale-95 transition-transform">
              <Send size={16} /> Publish
            </button>
          </div>
        </header>

        {/* TOOLBAR (Fixed functionality) */}
        <div className="flex items-center gap-1 border-b border-brand-navy/5 bg-white px-8 py-2">
          <button 
            onMouseDown={(e) => { e.preventDefault(); applyFormat('bold'); }}
            className={`p-2 rounded transition-colors ${activeFormats.bold ? 'bg-brand-navy text-brand-gold' : 'text-slate-400 hover:bg-brand-navy/5 hover:text-brand-navy'}`}
          >
            <Bold size={18} />
          </button>
          <button 
            onMouseDown={(e) => { e.preventDefault(); applyFormat('italic'); }}
            className={`p-2 rounded transition-colors ${activeFormats.italic ? 'bg-brand-navy text-brand-gold' : 'text-slate-400 hover:bg-brand-navy/5 hover:text-brand-navy'}`}
          >
            <Italic size={18} />
          </button>
          <div className="mx-2 h-4 w-px bg-slate-200"></div>
          
          <button 
            onMouseDown={(e) => { e.preventDefault(); applyHeading(); }}
            className={`p-2 rounded flex items-center gap-1 transition-colors ${activeFormats.heading ? 'bg-brand-navy text-brand-gold' : 'text-slate-400 hover:bg-brand-navy/5 hover:text-brand-navy'}`}
          >
            <Heading2 size={18} /> <span className="text-[10px] font-bold uppercase">Subheading</span>
          </button>

          <button 
            onMouseDown={(e) => { e.preventDefault(); applyShloka(); }}
            className={`p-2 rounded flex items-center gap-1 border transition-colors ${activeFormats.shloka ? 'bg-brand-gold/10 border-brand-gold text-brand-navy' : 'border-transparent text-slate-400 hover:bg-brand-navy/5 hover:text-brand-navy'}`}
          >
            <Quote size={18} /> <span className={`text-[10px] font-bold uppercase ${activeFormats.shloka ? 'text-brand-navy' : 'text-brand-gold'}`}>Sanskrit Shloka</span>
          </button>
        </div>

        {/* Writing Area */}
        <div className="flex-1 overflow-y-auto px-8 py-12 md:px-20 lg:px-32 pb-32">
          <div className="mx-auto max-w-2xl">
            
            {/* Tags Area */}
            <div className="mb-12 flex flex-wrap items-center gap-3">
              {tags.map(t => (
                <span key={t} className="flex items-center gap-1.5 rounded-full bg-brand-gold/20 border border-brand-gold/40 px-3 py-1.5 text-[11px] font-bold text-brand-navy uppercase shadow-sm">
                  #{t}
                  <X 
                    size={14} 
                    className="cursor-pointer text-brand-navy/40 hover:text-red-600" 
                    onClick={() => setTags(tags.filter(tag => tag !== t))} 
                  />
                </span>
              ))}
              <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1.5 focus-within:border-brand-gold shadow-sm">
                <Plus size={14} className="text-slate-400" />
                <form onSubmit={addTag}>
                  <input 
                    type="text" 
                    value={newTag} 
                    onChange={(e) => setNewTag(e.target.value)} 
                    placeholder="Add Keyword..." 
                    className="w-28 border-none bg-transparent p-0 text-[11px] font-bold uppercase text-brand-navy focus:ring-0" 
                  />
                </form>
              </div>
            </div>

            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="शीर्षक यहाँ लिखें..."
              className="w-full border-none bg-transparent font-hindi text-4xl md:text-5xl font-black text-brand-navy focus:ring-0 py-2 mb-12"
            />
            
            {/* CONTENT EDITOR (Converted to contentEditable) */}
            <div 
              ref={editorRef}
              contentEditable
              suppressContentEditableWarning={true}
              className="min-h-[600px] w-full border-none bg-transparent font-hindi text-xl md:text-2xl leading-[1.8] text-brand-ink outline-none prose prose-slate max-w-none 
              [&>h3]:text-3xl [&>h3]:font-bold [&>h3]:text-brand-navy [&>h3]:mt-8 [&>h3]:mb-4
              [&>blockquote]:border-l-4 [&>blockquote]:border-brand-gold [&>blockquote]:bg-brand-gold/5 [&>blockquote]:py-6 [&>blockquote]:px-8 [&>blockquote]:italic [&>blockquote]:my-8 [&>blockquote]:font-bold [&>blockquote]:text-center"
              onInput={(e) => {
                if (editorRef.current) {
                  const text = editorRef.current.innerText || "";
                  const words = text.trim().split(/\s+/).filter(w => w.length > 0).length;
                  setStats({ 
                    words, 
                    readTime: Math.ceil(words / 200) 
                  });
                }
              }}
              onKeyUp={checkFormats}
              onMouseUp={checkFormats}
            >
              <p>शनi का गोचर 2024 में एक महत्वपूर्ण ज्योतिषीय घटना है। यह न केवल व्यक्तिगत जीवन पर प्रभाव डालेगा...</p>
            </div>
          </div>
        </div>

        {/* BOTTOM STATUS BAR */}
        <div className="absolute bottom-0 w-full border-t border-brand-navy/5 bg-white/80 px-8 py-3 backdrop-blur-md flex items-center justify-between">
          <div className="flex gap-6">
            <div className="flex flex-col"><span className="text-[8px] font-black uppercase text-slate-400">Word Count</span><span className="text-xs font-bold text-brand-navy">{stats.words} Words</span></div>
            <div className="flex flex-col border-x border-slate-100 px-6"><span className="text-[8px] font-black uppercase text-slate-400">Reading Time</span><span className="text-xs font-bold text-brand-navy">{stats.readTime} Min Read</span></div>
          </div>
          <button className="flex items-center gap-2 rounded-lg bg-slate-50 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-brand-navy"><Info size={14} /> Writing Guide</button>
        </div>
      </main>

      {/* RIGHT SIDEBAR (AI Suite) */}
      <aside className="hidden w-80 flex-col border-l border-brand-navy/10 bg-white lg:flex">
        <div className="p-6 border-b border-brand-navy/5">
          <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-brand-navy">
            <Wand2 size={16} className="text-brand-gold" /> AI Suite
          </h3>
        </div>
        <div className="p-6 space-y-4">
          <ToolCard icon={<Languages size={18}/>} title="Translation" desc="Hindi to Scholarly English" />
          <ToolCard icon={<FileText size={18}/>} title="Summary" desc="3-Paragraph Exec Summary" />
          <ToolCard icon={<CalendarDays size={18}/>} title="Extract Dates" desc="Muhurats & Transits" badge="SAVE REQ" />
        </div>
      </aside>
    </div>
  );
}

function ToolCard({ icon, title, desc, badge }: { icon: any, title: string, desc: string, badge?: string }) {
  return (
    <button className="flex w-full flex-col gap-1 rounded-xl border border-brand-navy/5 bg-brand-paper p-4 text-left transition-all hover:border-brand-gold/50 group">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2 text-brand-navy font-bold text-xs uppercase tracking-tight">
          <span className="text-brand-gold">{icon}</span> {title}
        </div>
        {badge && <span className="rounded bg-slate-200 px-1.5 py-0.5 text-[7px] font-black text-slate-500">{badge}</span>}
      </div>
      <p className="text-[10px] text-slate-400">{desc}</p>
    </button>
  );
}