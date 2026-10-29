export const messages = {
  Bilim: "Yarına merakla, bilimle ve öğrenerek iz bırakıyorum.",
  Eşitlik: "Herkes için eşit ve adil bir geleceğe inanıyorum.",
  Özgürlük: "Özgür düşüncenin ve kendini ifade edebilmenin değerini yaşatıyorum.",
  Dayanışma: "Birbirimize güç vererek daha iyi bir gelecek kurabileceğimize inanıyorum.",
  Üretim: "Bilgimle, emeğimle ve ürettiklerimle yarına katkıda bulunuyorum.",
  Umut: "Geleceğe umutla bakıyor, onu güzelleştirmek için sorumluluk alıyorum.",
};
export type Value = keyof typeof messages;
export type CardFormat = "story" | "square";
export type CardTheme = "night" | "paper";
export const dimensions = { story: [1080, 1920], square: [1080, 1080] } as const;
export const limitName = (value: string) => Array.from(value).slice(0, 40).join("");
export const limitMessage = (value: string) => Array.from(value).slice(0, 140).join("");
export function wrapText(text: string, measure: (text: string) => number, width: number) {
  const lines: string[] = [];
  let line = "";
  for (const word of text.split(/\s+/).filter(Boolean)) {
    if (line && measure(`${line} ${word}`) > width) { lines.push(line); line = ""; }
    for (const character of Array.from(word)) {
      if (measure(line + character) > width && line) { lines.push(line); line = ""; }
      line += character;
    }
    line += " ";
  }
  if (line.trim()) lines.push(line.trim());
  return lines;
}

export async function drawCard(canvas: HTMLCanvasElement, data: { name: string; message: string; value: Value; format: CardFormat; theme: CardTheme }) {
  await Promise.all([document.fonts.load('600 72px "Playfair Display"'), document.fonts.load('400 36px "Source Sans 3"')]);
  await document.fonts.ready;
  const [width, height] = dimensions[data.format];
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Kart oluşturulamadı.");
  const css = getComputedStyle(document.documentElement);
  const color = (token: string) => css.getPropertyValue(token).trim();
  const background = color(data.theme === "night" ? "--card-night" : "--paper");
  const ink = color(data.theme === "night" ? "--paper" : "--ink");
  const red = color("--souvenir-red");
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, width, height);
  ctx.strokeStyle = ink;
  ctx.globalAlpha = 0.35;
  ctx.lineWidth = 2;
  ctx.strokeRect(36, 36, width - 72, height - 72);
  ctx.globalAlpha = 1;
  ctx.fillStyle = red;
  ctx.fillRect(80, 85, 64, 6);
  const text = (value: string, x: number, y: number, size: number, serif = false) => {
    ctx.font = `${serif ? "600" : "400"} ${size}px "${serif ? "Playfair Display" : "Source Sans 3"}"`;
    ctx.fillStyle = ink;
    ctx.fillText(value, x, y);
  };
  const story = data.format === "story";
  text("29 EKİM", 80, 158, 36);
  text("Cumhuriyet’in 103. yılı", 80, 213, 30);
  text("103", 65, story ? 750 : 490, story ? 520 : 330, true);
  ctx.fillStyle = red;
  ctx.beginPath(); ctx.arc(940, 147, 29, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = background;
  ctx.beginPath(); ctx.arc(951, 139, 25, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = red;
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const angle = -Math.PI / 2 + i * Math.PI / 5;
    const radius = i % 2 ? 8 : 19;
    const x = 994 + Math.cos(angle) * radius, y = 147 + Math.sin(angle) * radius;
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.closePath(); ctx.fill();
  const valueY = story ? 960 : 615;
  text(data.value, 80, valueY, story ? 88 : 62, true);
  const fitLines = (value: string, initial: number, maxHeight: number) => {
    let size = initial;
    let lines: string[] = [];
    while (size >= 20) {
      ctx.font = `400 ${size}px "Source Sans 3"`;
      lines = wrapText(value, t => ctx.measureText(t).width, 900);
      if (lines.length * size * 1.4 <= maxHeight) break;
      size -= 2;
    }
    return { size, lines };
  };
  const message = fitLines(limitMessage(data.message), story ? 48 : 32, story ? 320 : 110);
  message.lines.forEach((line, i) => text(line.trim(), 80, valueY + 82 + i * message.size * 1.4, message.size));
  const name = fitLines(limitName(data.name), 32, 95);
  name.lines.forEach((line, i) => text(line.trim(), 80, height - 240 + i * name.size * 1.4, name.size));
  ctx.strokeStyle = red; ctx.beginPath(); ctx.moveTo(80, height - 180); ctx.lineTo(1000, height - 180); ctx.stroke();
  text("UXipek — Design with kindness", 80, height - 120, 29);
  text("www.uxipek.com", 80, height - 76, 25);
}

export function cardBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error("PNG oluşturulamadı.")), "image/png"));
}