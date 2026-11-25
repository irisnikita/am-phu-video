export type Word = { w: string; start: number; end: number };
export type Line = {
  speaker: "dv" | "meo" | "hon"; scene: string; text: string;
  dv?: "angry" | "shout" | "smug"; hon?: "scared" | "happy" | "tired"; overlay?: string;
  start: number; end: number; words: Word[];
};
export type Speaker = { name: string };
export type Timeline = {
  id: string; title: string; fps: number; duration: number;
  speakers: Record<string, Speaker>; lines: Line[]; amp: number[];
};
