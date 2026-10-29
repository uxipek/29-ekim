import { useState } from "react";
import { ChevronDown, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const events = [
  { date: "19 Mayıs 1919", title: "Mücadelenin başlangıcı", text: "Mustafa Kemal, Samsun’a çıktı. Bağımsızlık mücadelesinin yeni bir dönemi başladı." },
  { date: "23 Nisan 1920", title: "Milletin Meclisi", text: "Türkiye Büyük Millet Meclisi açıldı. Millî egemenlik düşüncesi Mecliste somutlaştı." },
  { date: "30 Ağustos 1922", title: "Bağımsızlığa doğru", text: "Başkomutanlık Meydan Muharebesi zaferle sonuçlandı. Millî Mücadele’nin belirleyici dönüm noktalarından biri yaşandı." },
  { date: "29 Ekim 1923", title: "Cumhuriyet’in ilanı", text: "Cumhuriyet ilan edildi. Mustafa Kemal Atatürk, Türkiye Cumhuriyeti’nin ilk cumhurbaşkanı seçildi." },
];
export function HistoryTimeline() {
  const [selected, setSelected] = useState<number | null>(0);
  const current = events[selected ?? 0];
  if (!current) return null;
  return (
    <div className="mt-14">
      <div className="hidden grid-cols-4 gap-4 md:grid" role="tablist" aria-label="Cumhuriyet’e uzanan yol">
        {events.map((event, i) => <Button id={`history-tab-${i}`} key={event.date} role="tab" variant="ghost" aria-selected={selected === i} aria-controls="history-panel" tabIndex={selected === i ? 0 : -1} className={`timeline-tab ${selected === i ? "timeline-selected" : ""}`} onClick={() => setSelected(i)} onKeyDown={e => {
          let next = i;
          if (e.key === "ArrowRight") next = (i + 1) % events.length;
          else if (e.key === "ArrowLeft") next = (i + events.length - 1) % events.length;
          else if (e.key === "Home") next = 0;
          else if (e.key === "End") next = events.length - 1;
          else return;
          e.preventDefault(); setSelected(next); document.getElementById(`history-tab-${next}`)?.focus();
        }}><span>{event.date}</span><ArrowRight aria-hidden /></Button>)}
      </div>
      <div id="history-panel" role="tabpanel" aria-labelledby={`history-tab-${selected ?? 0}`} className="mt-10 hidden min-h-48 max-w-3xl md:block" tabIndex={0}><h3 className="text-3xl">{current.title}</h3><p className="mt-5 max-w-[65ch] text-muted-foreground">{current.text}</p></div>
      <div className="md:hidden">{events.map((event, i) => <div key={event.date} className="border-t border-border"><Button variant="ghost" className="h-auto w-full justify-between whitespace-normal px-0 py-6 text-left font-serif text-xl" aria-expanded={selected === i} aria-controls={`mobile-history-${i}`} onClick={() => setSelected(selected === i ? null : i)}>{event.date}<ChevronDown aria-hidden className={selected === i ? "rotate-180" : ""} /></Button><div id={`mobile-history-${i}`} hidden={selected !== i} className="pb-8"><h3 className="text-2xl">{event.title}</h3><p className="mt-4 text-muted-foreground">{event.text}</p></div></div>)}</div>
    </div>
  );
}