import { useEffect, useRef, useState } from "react";
import { Download, Share2, Check, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cardBlob, drawCard, limitMessage, limitName, messages, type CardFormat, type CardTheme, type Value } from "@/lib/souvenir";

export function SouvenirCard() {
  const [value, setValue] = useState<Value>("Bilim");
  const [message, setMessage] = useState<string>(messages.Bilim);
  const [name, setName] = useState("");
  const [format, setFormat] = useState<CardFormat>("story");
  const [theme, setTheme] = useState<CardTheme>("night");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    let active = true;
    const temporary = document.createElement("canvas");
    void drawCard(temporary, { name, message, value, format, theme }).then(() => {
      if (!active || !canvas.current) return;
      canvas.current.width = temporary.width; canvas.current.height = temporary.height;
      canvas.current.getContext("2d")?.drawImage(temporary, 0, 0);
    }).catch(() => { if (active) setStatus("Kart önizlemesi yüklenemedi."); });
    return () => { active = false; };
  }, [name, message, value, format, theme]);

  const exportCard = async (share: boolean) => {
    setBusy(true); setStatus("");
    try {
      const output = document.createElement("canvas");
      await drawCard(output, { name, message, value, format, theme });
      const blob = await cardBlob(output);
      const filename = `29-ekim-103-${format === "story" ? "hikaye" : "kare"}.png`;
      const file = new File([blob], filename, { type: "image/png" });
      if (share && navigator.canShare?.({ files: [file] }) && navigator.share) {
        await navigator.share({ files: [file], title: "Cumhuriyet’in 103. yılı" });
        setStatus("Kart paylaşıldı.");
      } else {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a"); a.href = url; a.download = filename; a.click();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        setStatus(share ? "Bu cihaz dosya paylaşımını desteklemiyor; kart indirildi." : "Kart indirildi.");
      }
    } catch (error) {
      if (!(error instanceof Error && error.name === "AbortError")) setStatus("Kart oluşturulamadı. Lütfen tekrar deneyin.");
    } finally { setBusy(false); }
  };
  return (
    <>
      <section id="katilim" className="section-shell border-t border-border">
        <div className="page-width">
          <p className="section-label">YARINA BİR İZ</p>
          <h2 className="section-title">Sen yarına ne taşımak istersin?</h2>
          <p className="mt-6 text-muted-foreground">Bir değer seç. Cumhuriyet’in 103. yılına kendi mesajınla bir iz bırak.</p>
          <div role="group" aria-label="Geleceğe taşımak istediğin değer" className="mt-9 flex flex-wrap gap-3">
            {(Object.keys(messages) as Value[]).map(option => <Button key={option} size="lg" variant={value === option ? "default" : "outline"} aria-pressed={value === option} onClick={() => { setValue(option); setMessage(messages[option]); }}>{value === option && <Check aria-hidden />}{option}</Button>)}
          </div>
        </div>
      </section>
      <section id="hatira-karti" className="section-shell border-t border-border bg-muted">
        <div className="page-width">
          <p className="section-label">KİŞİSEL HATIRA KARTI</p>
          <h2 className="section-title">Bu güne senden bir iz kalsın.</h2>
          <div className="mt-12 grid items-start gap-12 md:grid-cols-2 lg:gap-20">
            <form onSubmit={event => event.preventDefault()} className="min-w-0 space-y-7">
              <div><label htmlFor="card-name" className="mb-2 block font-semibold">Adın <span className="font-normal text-muted-foreground">(isteğe bağlı)</span></label><Input id="card-name" value={name} maxLength={40} onChange={e => setName(limitName(e.target.value))} className="h-12" autoComplete="off" /></div>
              <div><label htmlFor="card-value" className="mb-2 block font-semibold">Seçtiğin değer</label><select id="card-value" className="form-select" value={value} onChange={e => { const selected = e.target.value as Value; setValue(selected); setMessage(messages[selected]); }}>{(Object.keys(messages) as Value[]).map(option => <option key={option}>{option}</option>)}</select></div>
              <div><label htmlFor="card-message" className="mb-2 block font-semibold">Mesajın</label><Textarea id="card-message" value={message} maxLength={140} onChange={e => setMessage(limitMessage(e.target.value))} className="min-h-32" aria-describedby="message-count" /><p id="message-count" className="mt-1 text-right text-sm text-muted-foreground">{Array.from(message).length} / 140</p></div>
              <fieldset><legend className="mb-3 font-semibold">Format</legend><div className="flex flex-wrap gap-2">{(["story", "square"] as const).map(f => <Button key={f} variant={format === f ? "default" : "outline"} aria-pressed={format === f} onClick={() => setFormat(f)}>{f === "story" ? "Hikâye · 1080 × 1920" : "Kare · 1080 × 1080"}</Button>)}</div></fieldset>
              <fieldset><legend className="mb-3 font-semibold">Tema</legend><div className="flex gap-2"><Button variant={theme === "night" ? "default" : "outline"} aria-pressed={theme === "night"} onClick={() => setTheme("night")}><Moon aria-hidden />Gece</Button><Button variant={theme === "paper" ? "default" : "outline"} aria-pressed={theme === "paper"} onClick={() => setTheme("paper")}><Sun aria-hidden />Kâğıt</Button></div></fieldset>
              <p className="text-sm text-muted-foreground">Bilgilerin sunucuya gönderilmez; kartın bu cihazda oluşturulur.</p>
              <div className="flex flex-wrap gap-3"><Button size="lg" disabled={busy} onClick={() => void exportCard(false)}><Download aria-hidden />{busy ? "Hazırlanıyor…" : "Kartı indir"}</Button><Button size="lg" variant="outline" disabled={busy} onClick={() => void exportCard(true)}><Share2 aria-hidden />Paylaş</Button></div>
              <p role="status" className="min-h-6 text-sm text-muted-foreground">{status}</p>
            </form>
            <div className="min-w-0"><canvas ref={canvas} width={1080} height={1920} role="img" aria-label={`Hatıra kartı önizlemesi: ${value}. ${message}${name ? ` — ${name}` : ""}`} className="souvenir-preview" /><p className="mt-4 text-center text-sm text-muted-foreground">{format === "story" ? "1080 × 1920 px" : "1080 × 1080 px"} · {theme === "night" ? "Gece" : "Kâğıt"}</p></div>
          </div>
        </div>
      </section>
    </>
  );
}