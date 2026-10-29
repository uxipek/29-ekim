import { describe, it, expect } from "vitest";
import { dimensions, limitName, limitMessage, messages, wrapText } from "@/lib/souvenir";
describe("Souvenir card rules", () => {
  it("limits names to 40 characters", () => expect(limitName("İ".repeat(41))).toBe("İ".repeat(40)));
  it("limits messages to 140 characters", () => expect(limitMessage("ş".repeat(141))).toBe("ş".repeat(140)));
  it("exports story at 1080 by 1920", () => expect(dimensions.story).toEqual([1080, 1920]));
  it("exports square at 1080 by 1080", () => expect(dimensions.square).toEqual([1080, 1080]));
  it("provides all six selected values", () => expect(Object.keys(messages)).toEqual(["Bilim", "Eşitlik", "Özgürlük", "Dayanışma", "Üretim", "Umut"]));
  it("wraps long uninterrupted messages within width", () => { const lines = wrapText("ş".repeat(140), text => text.length * 10, 90); expect(lines.length).toBeGreaterThan(1); expect(lines.every(line => line.trim().length <= 9)).toBe(true); });
});