import React from "react";
import { AbsoluteFill } from "remotion";
import "@fontsource/be-vietnam-pro/900.css";
import { DiemVuong, Hon, INK } from "./Cast";
import { CourtBg, Desk } from "./Scenes";
import type { Timeline } from "./types";

export const Thumbnail: React.FC<{ id: string; timeline: Timeline }> = () => (
  <AbsoluteFill>
    <CourtBg frame={0} />
    <div style={{ position: "absolute", left: 180, top: 360, width: 720, height: 847 }}>
      <DiemVuong frame={0} talk={0.9} uid="t-dv" mood="shout" />
    </div>
    <Desk frame={0} />
    <div style={{ position: "absolute", left: 40, top: 1080, width: 400, height: 550 }}>
      <Hon frame={0} talk={0} uid="t-hon" mood="scared" />
    </div>
    <div style={{ position: "absolute", top: 150, left: 50, right: 50, display: "flex", justifyContent: "center" }}>
      <div style={{ fontFamily: "'Be Vietnam Pro'", fontWeight: 900, fontSize: 100, lineHeight: 1.15, color: "#fff",
        background: "#DC2626", border: `10px solid ${INK}`, borderRadius: 30, padding: "20px 40px 30px", textAlign: "center",
        transform: "rotate(-3deg)", boxShadow: `12px 14px 0 ${INK}` }}>
        TỘI: THỨC KHUYA
      </div>
    </div>
  </AbsoluteFill>
);
