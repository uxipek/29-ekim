import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ThemeSwitch({ night, onChange }: { night: boolean; onChange: (night: boolean) => void }) {
  return (
    <div role="group" aria-label="Sayfa teması" className="theme-switch">
      <Button variant={night ? "default" : "ghost"} aria-pressed={night} onClick={() => onChange(true)}><Moon aria-hidden />Gece</Button>
      <Button variant={night ? "ghost" : "default"} aria-pressed={!night} onClick={() => onChange(false)}><Sun aria-hidden />Aydınlık</Button>
    </div>
  );
}