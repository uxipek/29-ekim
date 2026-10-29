import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import hero from "@/assets/ataturk-portre.jpg.asset.json";
import { SpotifyPlayer } from "@/components/spotify-player";
import { HistoryTimeline } from "@/components/history-timeline";
import { SouvenirCard } from "@/components/souvenir-card";
import { Button } from "@/components/ui/button";
import { ThemeSwitch } from "@/components/theme-switch";

const TITLE = "UXipek | 29 Ekim — Dünden ilham, yarına iz";
const DESC = "Cumhuriyet’in 103. yılında hikâyesini keşfet, geleceğe taşıyacağın değeri seç ve sana özel 29 Ekim hatıra kartını oluştur.";
export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: TITLE }, { name: "description", content: DESC },
    { property: "og:title", content: TITLE }, { property: "og:description", content: DESC },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }), component: Index,
});
const values = [
  ["Millî egemenlik", "Cumhuriyet, ülkenin geleceğinde milletin söz sahibi olması ilkesine dayanır. Bu ilkeyi yaşatmak, katılımı ve ortak sorumluluğu her gün güçlendirmeyi gerektirir.", "Oy vermek, toplumsal meseleleri takip etmek ve ortak yaşama katkı sunmak."],
  ["Eğitim ve bilim", "Eğitim ve bilim, Cumhuriyet’in gelişim sürecinde geleceği kurmanın temel araçları oldu. Öğrenme imkânlarını yaygınlaştırmak, bugün de sürdürülmesi gereken bir sorumluluk.", "Merak etmek, bilgiyi sorgulamak ve öğrenmeyi herkes için erişilebilir kılmak."],
  ["Eşit yurttaşlık", "Ortak haklar ve sorumluluklar, eşit yurttaşlık idealinin temelidir. Bu ideal, zaman içinde gelişen haklarla ve eşitliği güçlendiren çabalarla yaşatılır.", "Farklılıklara saygı duymak ve herkesin adil biçimde söz sahibi olmasını savunmak."],
  ["Üretim ve çağdaşlaşma", "Emek, bilgi ve üretim, toplumun kendi geleceğini kurmasına katkı sağlar. Çağdaşlaşma, tamamlanmış bir hedef değil; yenilenerek sürdürülen bir süreçtir.", "İşini özenle yapmak, yeni fikirler geliştirmek ve emeğin değerini gözetmek."],
];
function Index() {
  const [night, setNight] = useState(false);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", night);
    return () => document.documentElement.classList.remove("dark");
  }, [night]);
  useEffect(() => {
    const io = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add("in-view"); io.unobserve(entry.target); } }), { threshold: 0.1 });
    document.querySelectorAll("[data-reveal]").forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
  return <div className="min-h-screen">
    <header className="masthead border-b border-border"><nav className="page-width header-layout"><a href="#top" className="font-serif text-2xl font-semibold text-brand-mark">UXipek.</a><ul className="header-links"><li><a href="#donum-noktasi">Hikâye</a></li><li><a href="#anlam">Değerler</a></li><li><a href="#hatira-karti">Hatıra Kartı</a></li></ul><ThemeSwitch night={night} onChange={setNight} /></nav></header>
    <main id="top">
      <section className="opening dark-band">
        <img src={hero.url} width={736} height={920} alt="Türk bayrağı önünde Mustafa Kemal Atatürk portresi." className="opening-art" />
        <div className="page-width opening-content">
          <p data-reveal className="text-sm font-semibold text-accent">29 EKİM 1923 — 2026 · 103. YIL</p>
          <h1 data-reveal className="mt-6 text-5xl font-semibold sm:text-6xl lg:text-7xl">Dünden ilham.<br /><span className="italic">Yarına iz.</span></h1>
          <div className="headline-rule" aria-hidden />
          <p data-reveal className="mt-7 max-w-lg text-lg text-muted-foreground">Cumhuriyet, geçmişten devraldığımız bir miras ve geleceğe taşıdığımız ortak sorumluluk. 103. yılında hikâyesini keşfet, senin için taşıdığı değeri seç ve bu güne bir hatıra bırak.</p>
          <div data-reveal className="mt-8 flex flex-wrap gap-3"><Button asChild size="lg"><a href="#donum-noktasi">Hikâyeyi keşfet<ArrowDown aria-hidden /></a></Button><Button asChild size="lg" variant="outline"><a href="#hatira-karti">Hatıra kartımı oluştur<ArrowUpRight aria-hidden /></a></Button></div>
          <p className="mt-8 text-sm text-muted-foreground">Cumhuriyet’in 103. yılına UXipek’ten dijital bir armağan.</p>
        </div>
      </section>
      <section id="donum-noktasi" className="section-shell"><div className="page-width"><p className="section-label">CUMHURİYET’E UZANAN YOL</p><h2 data-reveal className="section-title">Bir günde ilan edildi.<br /><span className="italic">Bir mücadeleyle mümkün oldu.</span></h2><p className="mt-7 max-w-2xl text-muted-foreground">Cumhuriyet’in ilanı, bağımsızlık mücadelesinin ve millî egemenlik düşüncesinin yeni bir yönetim biçimine dönüşmesiydi.</p><HistoryTimeline /></div></section>
      <section id="anlam" className="section-shell border-t border-border"><div className="page-width"><p className="section-label">GEÇMİŞTEN BUGÜNE</p><h2 data-reveal className="section-title">Bugün hayatımıza<br />dokunan miras.</h2><div className="mt-14 grid gap-x-16 gap-y-12 md:grid-cols-2">{values.map(([title, text, today]) => <article key={title} data-reveal className="border-t border-border pt-6"><h3 className="text-3xl">{title}</h3><p className="mt-5 max-w-[65ch] text-muted-foreground">{text}</p><p className="mt-6 text-sm font-semibold text-primary">Bugüne yansıması</p><p className="mt-1 max-w-[65ch]">{today}</p></article>)}</div></div></section>
      <SouvenirCard />
      <section id="sarkilar" className="section-shell border-t border-border"><div className="page-width grid items-center gap-10 md:grid-cols-2"><div><p className="section-label">BAYRAMIN SESİ</p><h2 className="section-title">Cumhuriyet’in sesi.</h2><a href="https://open.spotify.com/playlist/1rmV6jyWt6VnXwLRgga9ef" target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-2 text-sm text-muted-foreground underline">Spotify çalma listesi<ArrowUpRight size={16} aria-hidden /></a></div><SpotifyPlayer /></div></section>
      <section id="gelecege" className="section-shell dark-band"><div className="page-width max-w-4xl text-center"><p className="section-label">BİRLİKTE, YARINA</p><h2 data-reveal className="section-title">Cumhuriyet, birlikte<br />yaşattığımız bir gelecek.</h2><p className="mx-auto mt-8 max-w-2xl text-muted-foreground">Gazi Mustafa Kemal Atatürk’ü, Millî Mücadele’nin kahramanlarını ve Cumhuriyet’e emek veren herkesi saygı ve minnetle anıyoruz.</p><div className="mx-auto my-10 h-px w-20 bg-primary" /><p className="font-serif text-2xl italic sm:text-3xl">29 Ekim Cumhuriyet Bayramımız kutlu olsun.</p><p className="mt-8 text-sm text-muted-foreground">Cumhuriyet’in 103. yılına UXipek’ten dijital bir armağan.</p></div></section>
    </main>
    <footer className="dark-band border-t border-border"><div className="page-width py-8"><div className="flex flex-wrap items-center justify-between gap-4 text-sm"><p>UXipek — Design with kindness</p><a href="https://www.uxipek.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2">www.uxipek.com<ArrowUpRight size={16} aria-hidden /></a></div><details className="mt-6 text-sm text-muted-foreground"><summary className="cursor-pointer">Kaynaklar</summary><p className="mt-3">T.C. Kültür ve Turizm Bakanlığı</p><ul className="mt-2 flex flex-wrap gap-x-6 gap-y-2"><li><a className="underline" href="https://www.ktb.gov.tr/TR-96300/ataturk39un-hayati.html" target="_blank" rel="noopener noreferrer">Atatürk’ün Hayatı · 1919 ve 1923</a></li><li><a className="underline" href="https://www.ktb.gov.tr/TR-96327/1920.html" target="_blank" rel="noopener noreferrer">1920 kronolojisi</a></li><li><a className="underline" href="https://www.ktb.gov.tr/TR-96329/1922.html" target="_blank" rel="noopener noreferrer">1922 kronolojisi</a></li></ul></details></div></footer>
  </div>;
}
