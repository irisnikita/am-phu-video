import React from "react";
import {
  AbsoluteFill, Audio, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig,
} from "remotion";
import "@fontsource/be-vietnam-pro/700.css";
import "@fontsource/be-vietnam-pro/900.css";
import "@fontsource/patrick-hand/400.css";
import { DiemVuong, MeoSo, INK } from "./Cast";
import { CourtBg, Desk } from "./Scenes";
import { Dossier, GroupChat, Ghosts46, DressChat, MomChat, SonRoom, Kitchen, TuStory, TuFail, SendThree, Verdict2, Punish, Twist, TwistFace, Cta2, HonX } from "./Ep2Scenes";
import type { Line, Timeline } from "./types";

const FONT = "'Be Vietnam Pro', sans-serif";
const CHUNK = 4;
const SPEAKER_COLOR: Record<string, string> = { dv: "#DC2626", meo: "#7C3AED", hon: "#0EA5E9" };
// Tâm điểm máy quay khi mỗi nhân vật nói (toạ độ trên khung 1080x1920)
const FOCUS: Record<string, [number, number]> = { dv: [540, 640], meo: [880, 860], hon: [260, 1180] };

const lineAt = (lines: Line[], t: number) => {
  let i = 0;
  for (let k = 0; k < lines.length; k++) if (lines[k].start <= t) i = k;
  return i;
};

const Captions: React.FC<{ line: Line; t: number; name: string }> = ({ line, t, name }) => {
  const words = line.words;
  let active = words.findIndex((w) => t >= w.start && t < w.end);
  if (active < 0) active = t < words[0].start ? 0 : words.length - 1;
  const c0 = Math.floor(active / CHUNK) * CHUNK;
  const chunk = words.slice(c0, c0 + CHUNK);
  return (
    <div style={{ position: "absolute", left: 50, right: 50, top: 1470, fontFamily: FONT }}>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 22 }}>
        <div style={{ fontWeight: 900, fontSize: 38, color: "#fff", background: SPEAKER_COLOR[line.speaker],
          border: `5px solid ${INK}`, borderRadius: 48, height: 86, boxSizing: "border-box", padding: "0 40px 2px",
          display: "flex", alignItems: "center", lineHeight: 1, letterSpacing: 2 }}>{name}</div>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "16px 8px" }}>
        {chunk.map((w, i) => {
          const idx = c0 + i;
          const on = idx === active;
          return (
            <span key={idx} style={{
              fontSize: 80, fontWeight: 900, lineHeight: 1.35, padding: "8px 22px 14px", borderRadius: 24,
              color: on ? INK : "#fff", background: on ? "#FDE047" : "transparent",
              WebkitTextStroke: on ? "0" : `12px ${INK}`, paintOrder: "stroke fill",
              transform: `scale(${on ? 1.06 : 1})`, display: "inline-block",
            }}>{w.w}</span>
          );
        })}
      </div>
    </div>
  );
};

const Court: React.FC<{ line: Line; frame: number; local: number; talk: number; fps: number; prevSpeaker?: string }> =
  ({ line, frame, local, talk, fps, prevSpeaker }) => {
    const s = line.speaker;
    const k = spring({ frame: local, fps, config: { damping: 18, stiffness: 90 } });
    const [fx, fy] = FOCUS[s];
    const [px, py] = FOCUS[prevSpeaker ?? s];
    const cx = px + (fx - px) * k, cy = py + (fy - py) * k;
    const zoom = 1.1 + (line.overlay ? 0.05 * Math.min(1, local / 40) : 0);
    return (
      <AbsoluteFill style={{ transform: `scale(${zoom})`, transformOrigin: `${cx}px ${cy}px` }}>
        <CourtBg frame={frame} />
        <div style={{ position: "absolute", left: 200, top: 330, width: 680, height: 800 }}>
          <DiemVuong frame={frame} talk={s === "dv" ? talk : 0} uid="dv" mood={line.dv ?? "angry"} />
        </div>
        <Desk frame={frame} />
        <div style={{ position: "absolute", left: 730, top: 700, width: 300, height: 368 }}>
          <MeoSo frame={frame} talk={s === "meo" ? talk : 0} uid="meo" />
        </div>
        {line.overlay ? (["sv", "ny", "con"] as const).map((w, i) => (
          <div key={w} style={{ position: "absolute", left: 30 + i * 230, top: 1040 + (i % 2) * 30, width: 250, height: 344 }}>
            <HonX frame={frame + i * 7} talk={0} uid={`trio${i}`} mood="scared" who={w} />
          </div>
        )) : <div style={{ position: "absolute", left: 100, top: 1000, width: 320, height: 440 }}>
          <HonX frame={frame} talk={s === "hon" ? talk : 0} uid="hon" mood={line.hon ?? "scared"} who={(line as any).who ?? "sv"} />
        </div>}
      </AbsoluteFill>
    );
  };

const Overlay: React.FC<{ text: string; local: number }> = ({ text, local }) => {
  const s = interpolate(local, [0, 7], [1.15, 1], { extrapolateRight: "clamp" });
  const o = 1;
  return (
    <div style={{ position: "absolute", top: 220, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: o }}>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 72, lineHeight: 1.15, textAlign: "center", maxWidth: 900, color: "#fff", background: "#DC2626",
        border: `8px solid ${INK}`, borderRadius: 26, padding: "14px 36px 22px", transform: `rotate(-4deg) scale(${s})`,
        boxShadow: `10px 12px 0 ${INK}` }}>{text.split(" – ").map((t, i) => <div key={i} style={{ fontSize: i === 0 && text.includes(" – ") ? 44 : 64, whiteSpace: "nowrap" }}>{t}</div>)}</div>
    </div>
  );
};

const Stamp: React.FC<{ text: string; local: number }> = ({ text, local }) => {
  const s = interpolate(local, [0, 6], [2.6, 1], { extrapolateRight: "clamp" });
  const o = interpolate(local, [0, 3], [0, 1], { extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", top: 1180, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: o }}>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 64, color: "#DC2626", border: "10px solid #DC2626", borderRadius: 18,
        padding: "6px 30px 14px", transform: `rotate(-9deg) scale(${s})`, background: "rgba(253,230,138,0.92)", whiteSpace: "nowrap" }}>{text}</div>
    </div>
  );
};

export const Episode2: React.FC<{ id: string; timeline: Timeline }> = ({ id, timeline }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const t = frame / fps;
  const { lines, amp, speakers } = timeline;
  const i = lineAt(lines, t);
  const line = lines[i];
  const prev = i > 0 ? lines[i - 1] : undefined;
  const local = frame - Math.round(line.start * fps);
  const talk = t < line.end - 0.3 ? amp[frame] ?? 0 : 0;

  // Khi đổi cảnh: chớp trắng 5 khung hình
  const sceneChanged = prev && prev.scene !== line.scene;
  const flash = sceneChanged ? interpolate(local, [0, 5], [0.7, 0], { extrapolateRight: "clamp" }) : 0;
  const sceneLocal = (() => {
    // đếm khung hình từ lúc cảnh hiện tại bắt đầu (gộp các câu liên tiếp cùng cảnh)
    let j = i;
    while (j > 0 && lines[j - 1].scene === line.scene) j--;
    return frame - Math.round(lines[j].start * fps);
  })();
  const sceneP = (() => {
    let j = i, k = i;
    while (j > 0 && lines[j - 1].scene === line.scene) j--;
    while (k < lines.length - 1 && lines[k + 1].scene === line.scene) k++;
    const dur = (lines[k].end - lines[j].start) * fps;
    return Math.max(0, Math.min(1, sceneLocal / dur));
  })();

  let scene: React.ReactNode;
  const sp = { frame: sceneLocal, p: sceneP, talk };
  switch (line.scene) {
    case "court": scene = <Court line={line} frame={frame} local={local} talk={talk} fps={fps} prevSpeaker={prev?.scene === "court" ? prev.speaker : undefined} />; break;
    case "dossier": scene = <Dossier {...sp} />; break;
    case "group_chat": scene = <GroupChat {...sp} />; break;
    case "ghosts46": scene = <Ghosts46 {...sp} />; break;
    case "dress_chat": scene = <DressChat {...sp} />; break;
    case "mom_chat": scene = <MomChat {...sp} />; break;
    case "son_room": scene = <SonRoom {...sp} />; break;
    case "kitchen": scene = <Kitchen {...sp} />; break;
    case "tu_story": scene = <TuStory {...sp} />; break;
    case "tu_fail": scene = <TuFail {...sp} />; break;
    case "send_three": scene = <SendThree {...sp} />; break;
    case "verdict": scene = <Verdict2 {...sp} />; break;
    case "punish": scene = <Punish {...sp} />; break;
    case "twist": scene = <Twist {...sp} />; break;
    case "twist_face": scene = <TwistFace {...sp} />; break;
    default: scene = <Cta2 {...sp} />;
  }
  const stamp = (line as any).stamp as string | undefined;
  const stampLocal = local - Math.round((line.end - line.start) * fps * 0.45);

  return (
    <AbsoluteFill style={{ background: "#1A0A10" }}>
      {scene}
      {line.overlay && <Overlay text={line.overlay} local={local} />}
      {stamp && stampLocal >= 0 && <Stamp text={stamp} local={stampLocal} />}
      <div style={{ position: "absolute", left: 0, right: 0, top: 1420, bottom: 0,
        background: "linear-gradient(to bottom, rgba(20,10,16,0) 0%, rgba(20,10,16,0.85) 22%, rgba(20,10,16,0.95) 100%)" }} />
      <Captions line={line} t={t} name={speakers[line.speaker]?.name ?? ""} />
      <div style={{ position: "absolute", top: 70, left: 60, right: 60, height: 12, borderRadius: 6, background: "rgba(255,255,255,0.2)" }}>
        <div style={{ width: `${(frame / durationInFrames) * 100}%`, height: "100%", borderRadius: 6, background: "#DC2626" }} />
      </div>
      <div style={{ position: "absolute", top: 110, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 36, color: "#FDE047", letterSpacing: 3 }}>PHIÊN TÒA ÂM PHỦ · VỤ #2</div>
      </div>
      {flash > 0 && <AbsoluteFill style={{ background: "#fff", opacity: flash }} />}
      <Audio src={staticFile(`${id}/voice.wav`)} />
    </AbsoluteFill>
  );
};
