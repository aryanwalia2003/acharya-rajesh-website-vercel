"use client";

import { useState } from 'react';
import { 
  Search, Plus, MoreVertical, Globe, EyeOff, FileText, 
  ChevronRight, LayoutDashboard, Send, Clock, Filter,
  ExternalLink, Edit3, Trash2
} from 'lucide-react';
import Link from 'next/link';

export default function AdminArticlesPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'public' | 'unlisted' | 'draft'>('all');

  // Sample Data (Actual data Raw SQL se aayega baad mein)
  const articles = [
    { id: 1, title: "शनि का कुंभ राशि में गोचर 2024", status: 'public', date: 'Oct 12, 2023', views: 1240 },
    { id: 2, title: "बृहस्पति और शुक्र की युति का फल", status: 'draft', date: 'Oct 15, 2023', views: 0 },
    { id: 3, title: "गोपनीय: विशेष मुहूर्त गणना विधियां", status: 'unlisted', date: 'Sept 28, 2023', views: 45 },
    { id: 4, title: "नक्षत्रों का रहस्यमयी संसार", status: 'public', date: 'Aug 20, 2023', views: 890 },
  ];

  // Filtering Logic
  const filteredArticles = activeTab === 'all' 
    ? articles 
    : articles.filter(a => a.status === activeTab);

  return (
    <div className="flex h-screen bg-brand-paper overflow-hidden">
      
      {/* LEFT SIDEBAR (Consistency with Write Page) */}
      <aside className="hidden w-64 flex-col border-r border-brand-navy/10 bg-white lg:flex">
        <div className="p-6 border-b border-brand-navy/5">
          <Link href="/" className="flex items-center gap-2 text-brand-navy font-bold">
            <LayoutDashboard size={20} className="text-brand-gold" />
            Admin Dashboard
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/admin/write" className="flex items-center gap-3 rounded-lg bg-brand-navy px-3 py-2 text-sm font-bold text-brand-gold shadow-lg hover:bg-brand-navy/90 transition-all mb-6">
            <Plus size={18} /> New Article
          </Link>
          
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2 mb-2">Content</p>
          <button className="flex w-full items-center gap-3 rounded-lg bg-brand-navy/5 px-3 py-2 text-sm font-bold text-brand-navy text-left">
            <FileText size={18} /> All Articles
          </button>
          <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-500 hover:bg-brand-navy/5 transition-colors text-left">
            <Clock size={18} /> Drafts
          </button>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="flex h-16 items-center justify-between border-b border-brand-navy/5 bg-white px-8">
          <h1 className="text-xl font-bold text-brand-navy uppercase tracking-tight">Article Management</h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Search research..." 
                className="rounded-full border border-slate-200 bg-slate-50 py-1.5 pl-10 pr-4 text-sm focus:border-brand-gold focus:ring-0 w-64"
              />
            </div>
          </div>
        </header>

        {/* Filters & Tabs */}
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
              <TabButton active={activeTab === 'all'} label="All" count={articles.length} onClick={() => setActiveTab('all')} />
              <TabButton active={activeTab === 'public'} label="Public" count={2} onClick={() => setActiveTab('public')} />
              <TabButton active={activeTab === 'unlisted'} label="Unlisted" count={1} onClick={() => setActiveTab('unlisted')} />
              <TabButton active={activeTab === 'draft'} label="Drafts" count={1} onClick={() => setActiveTab('draft')} />
            </div>
            <button className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-brand-navy uppercase tracking-widest">
              <Filter size={14} /> Advanced Filter
            </button>
          </div>
        </div>

        {/* Article List Area */}
        <div className="flex-1 overflow-y-auto px-8 pb-12">
          <div className="rounded-2xl border border-brand-navy/5 bg-white overflow-hidden shadow-sm">
            <table className="w-full text-left">
              <thead className="bg-brand-navy/5 text-[10px] font-black uppercase tracking-widest text-slate-500">
                <tr>
                  <th className="px-6 py-4">Title & Status</th>
                  <th className="px-6 py-4">Last Modified</th>
                  <th className="px-6 py-4">Engagement</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredArticles.map((article) => (
                  <tr key={article.id} className="group hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-5">
                      <div className="flex flex-col gap-1.5">
                        <Link href="/admin/write" className="font-hindi text-lg font-bold text-brand-navy hover:text-brand-gold transition-colors">
                          {article.title}
                        </Link>
                        <div className="flex items-center gap-2">
                          <StatusBadge status={article.status as any} />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-sm text-slate-500 font-medium">
                      {article.date}
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-brand-navy">{article.views} views</span>
                        <span className="text-[10px] text-slate-400">0 appointments</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button title="Edit" className="p-2 text-slate-400 hover:bg-white hover:text-brand-gold hover:shadow-sm rounded-lg border border-transparent hover:border-slate-100 transition-all">
                          <Edit3 size={18} />
                        </button>
                        <button title="Delete" className="p-2 text-slate-400 hover:text-red-500 rounded-lg transition-all">
                          <Trash2 size={18} />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-brand-navy rounded-lg">
                          <MoreVertical size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

// --- Internal Components ---

function TabButton({ active, label, count, onClick }: { active: boolean, label: string, count: number, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`px-4 py-1.5 text-xs font-bold uppercase tracking-widest rounded-lg transition-all flex items-center gap-2 ${
        active ? 'bg-white text-brand-navy shadow-sm' : 'text-slate-400 hover:text-brand-navy'
      }`}
    >
      {label}
      <span className={`text-[10px] px-1.5 rounded-full ${active ? 'bg-brand-navy text-white' : 'bg-slate-200 text-slate-500'}`}>
        {count}
      </span>
    </button>
  );
}

function StatusBadge({ status }: { status: 'public' | 'unlisted' | 'draft' }) {
  const configs = {
    public: { icon: <Globe size={10} />, label: 'Public', styles: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
    unlisted: { icon: <EyeOff size={10} />, label: 'Unlisted', styles: 'bg-sky-50 text-sky-700 border-sky-100' },
    draft: { icon: <Clock size={10} />, label: 'Draft', styles: 'bg-slate-50 text-slate-600 border-slate-200' },
  };

  const config = configs[status];

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[9px] font-black uppercase tracking-tighter ${config.styles}`}>
      {config.icon}
      {config.label}
    </span>
  );
}