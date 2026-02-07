import { CalendarDays, Clock, Sparkles } from 'lucide-react';

interface DateItem {
  date: string;
  time?: string | null;
  time_end?: string | null;
  title_hi: string;
  title_en: string;
  type: string;
}

const typeColors: Record<string, string> = {
  transit: 'bg-blue-100 text-blue-700',
  eclipse: 'bg-red-100 text-red-700',
  muhurat: 'bg-green-100 text-green-700',
  rahu_kaal: 'bg-amber-100 text-amber-700',
  festival: 'bg-purple-100 text-purple-700',
  panchang: 'bg-cyan-100 text-cyan-700',
  period_start: 'bg-orange-100 text-orange-700',
  period_end: 'bg-orange-100 text-orange-700',
  other: 'bg-slate-100 text-slate-700',
};

// Format time for display (24h to 12h with AM/PM)
const formatTime = (time: string) => {
  const [hours, minutes] = time.split(':').map(Number);
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const h = hours % 12 || 12;
  return `${h}:${minutes.toString().padStart(2, '0')} ${ampm}`;
};

export default function ImportantDates({ dates }: { dates: DateItem[] }) {
  if (!dates || dates.length === 0) return null;

  return (
    <section className="my-12 rounded-lg border-2 border-brand-gold/30 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-3 text-brand-navy">
        <CalendarDays className="text-brand-gold" />
        <h3 className="font-display text-xl font-bold italic flex items-center gap-2">
          Important Dates & Times <Sparkles size={14} className="text-brand-gold" />
        </h3>
      </div>
      
      <div className="space-y-4">
        {dates.map((item, index) => (
          <div key={index} className="flex flex-col md:flex-row md:gap-6 border-b border-brand-navy/5 pb-4 last:border-0">
            <div className="min-w-[140px]">
              <span className="font-mono text-sm font-bold text-brand-gold block">
                {new Date(item.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
              {item.time && (
                <span className="text-xs text-brand-ink/60 flex items-center gap-1 mt-1">
                  <Clock size={10} />
                  {formatTime(item.time)}
                  {item.time_end && ` - ${formatTime(item.time_end)}`}
                </span>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h4 className="font-bold text-brand-navy">{item.title_en}</h4>
                <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${typeColors[item.type] || typeColors.other}`}>
                  {item.type.replace('_', ' ')}
                </span>
              </div>
              <p className="text-sm text-brand-ink/70 font-hindi">{item.title_hi}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

