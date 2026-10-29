import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

type PlaybackEvent = { data: { isPaused: boolean; isBuffering: boolean } };
type Controller = {
  togglePlay: () => void;
  destroy: () => void;
  addListener: (name: string, callback: (event: PlaybackEvent) => void) => void;
};
type SpotifyAPI = {
  createController: (
    element: HTMLElement,
    options: { url: string; width: string; height: number },
    callback: (controller: Controller) => void,
  ) => void;
};
declare global {
  interface Window {
    onSpotifyIframeApiReady?: (api: SpotifyAPI) => void;
    republicSpotifyAPI?: SpotifyAPI;
  }
}

export function SpotifyPlayer() {
  const host = useRef<HTMLDivElement>(null);
  const controller = useRef<Controller | null>(null);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;
    const element = document.createElement("div");
    host.current?.appendChild(element);
    const initialize = (api: SpotifyAPI) => {
      window.republicSpotifyAPI = api;
      if (!active) return;
      api.createController(element, {
        url: "https://open.spotify.com/playlist/1rmV6jyWt6VnXwLRgga9ef?theme=0",
        width: "100%",
        height: 80,
      }, (player) => {
        if (!active) { player.destroy(); return; }
        controller.current = player;
        player.addListener("ready", () => { if (active) setReady(true); });
        player.addListener("playback_update", (event) => {
          if (active) setPlaying(!event.data.isPaused);
        });
        const frame = host.current?.querySelector("iframe");
        if (frame) frame.title = "29 Ekim Cumhuriyet Bayramı Spotify çalma listesi";
      });
    };
    if (window.republicSpotifyAPI) initialize(window.republicSpotifyAPI);
    else {
      window.onSpotifyIframeApiReady = initialize;
      if (!document.getElementById("republic-spotify-api")) {
        const script = document.createElement("script");
        script.id = "republic-spotify-api";
        script.src = "https://open.spotify.com/embed/iframe-api/v1";
        script.async = true;
        script.onerror = () => { if (active) setFailed(true); };
        document.body.appendChild(script);
      }
    }
    return () => {
      active = false;
      controller.current?.destroy();
      controller.current = null;
      element.remove();
    };
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <Button
          size="lg"
          disabled={!ready}
          aria-pressed={playing}
          onClick={() => controller.current?.togglePlay()}
          className="min-w-44"
        >
          {playing ? <Pause aria-hidden /> : <Play aria-hidden />}
          {playing ? "Duraklat" : "Müziği başlat"}
        </Button>
        <span role="status" className="text-sm text-muted-foreground">
          {failed ? "Spotify yüklenemedi." : !ready ? "Spotify yükleniyor…" : playing ? "Çalıyor" : "Hazır"}
        </span>
      </div>
      <div ref={host} className="min-h-20 overflow-hidden rounded-lg border border-border bg-card" />
      {failed && <a className="text-sm text-accent underline" href="https://open.spotify.com/playlist/1rmV6jyWt6VnXwLRgga9ef" target="_blank" rel="noopener noreferrer">Spotify’da aç</a>}
    </div>
  );
}