import React from "react";

// Dàn nhân vật gốc của kênh "Phiên tòa Âm Phủ".
// Phong cách: nét tay hơi rung (filter), viền đen dày, mặt lầy kiểu meme.
export const INK = "#141218";

export const Wobble: React.FC<{ id: string; frame: number; scale?: number }> = ({ id, frame, scale = 3.5 }) => (
  <filter id={id} x="-10%" y="-10%" width="120%" height="120%">
    <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves={2} seed={Math.floor(frame / 4) % 7} />
    <feDisplacementMap in="SourceGraphic" scale={scale} />
  </filter>
);

type Common = { frame: number; talk: number; uid: string };

// ---------- Diêm Vương ----------
export type DvMood = "angry" | "shout" | "smug";
export const DiemVuong: React.FC<Common & { mood: DvMood }> = ({ frame, talk, uid, mood }) => {
  const t = Math.min(1, talk);
  const shake = mood === "shout" && t > 0.2 ? Math.sin(frame * 2.3) * 3 : 0;
  const mouth = t > 0.1
    ? <ellipse cx={300} cy={474} rx={mood === "shout" ? 26 : 18} ry={6 + (mood === "shout" ? 30 : 16) * t} fill={INK} />
    : mood === "smug"
      ? <path d="M276 472 Q300 480 326 462" stroke={INK} strokeWidth={7} fill="none" strokeLinecap="round" />
      : <path d="M280 470 L320 470" stroke={INK} strokeWidth={7} strokeLinecap="round" />;
  const browY = mood === "smug" ? 6 : 0;
  return (
    <svg viewBox="100 180 400 470" width="100%" height="100%" style={{ overflow: "visible" }}>
      <defs><Wobble id={`w-${uid}`} frame={frame} /></defs>
      <g filter={`url(#w-${uid})`} transform={`translate(${shake} ${Math.sin(frame / 20) * 2})`}>
        <g stroke={INK} strokeLinejoin="round" strokeLinecap="round">
          {/* Áo bào */}
          <path d="M160 650 C170 560 220 530 300 530 C380 530 430 560 440 650 Z" fill="#B91C1C" strokeWidth={7} />
          <path d="M270 535 L300 600 L330 535" fill="#FDE047" strokeWidth={5} />
          {/* Đầu liền cổ */}
          <path d="M300 250 C390 250 430 320 428 400 C426 470 400 510 360 530 L240 530 C200 510 174 470 172 400 C170 320 210 250 300 250 Z" fill="#E0574F" strokeWidth={7} />
          {/* Râu */}
          <path d="M215 470 Q300 600 385 470 Q372 590 300 640 Q228 590 215 470 Z" fill="#1a1a1a" strokeWidth={5} />
          {/* Mũ cánh chuồn */}
          <rect x={205} y={200} width={190} height={80} rx={18} fill="#1a1a1a" strokeWidth={5} />
          <path d={`M205 232 L106 ${214 + Math.sin(frame / 10) * 4} L106 ${252 + Math.sin(frame / 10) * 4} L205 254 Z`} fill="#1a1a1a" strokeWidth={5} />
          <path d={`M395 232 L494 ${214 + Math.sin(frame / 10) * 4} L494 ${252 + Math.sin(frame / 10) * 4} L395 254 Z`} fill="#1a1a1a" strokeWidth={5} />
          <rect x={282} y={208} width={36} height={26} rx={6} fill="#FDE047" strokeWidth={4} />
        </g>
        <g stroke={INK} strokeLinecap="round">
          <path d={`M226 ${356 + browY} L280 ${376}`} strokeWidth={13} />
          <path d={`M374 ${356 + (mood === "smug" ? -8 : 0)} L320 ${376}`} strokeWidth={13} />
          <path d="M236 398 A18 18 0 0 0 272 398 Z" fill={INK} />
          <path d="M328 398 A18 18 0 0 0 364 398 Z" fill={INK} />
          <path d="M226 398 L282 398 M318 398 L374 398" strokeWidth={7} />
          {mood === "shout" && <path d="M440 300 l30 -20 M446 340 l36 0 M440 380 l30 20" strokeWidth={6} />}
        </g>
        {mouth}
      </g>
    </svg>
  );
};

// ---------- Mèo Sổ (thư ký âm phủ) ----------
export const MeoSo: React.FC<Common> = ({ frame, talk, uid }) => {
  const t = Math.min(1, talk);
  const blink = frame % 110 < 4;
  const tail = Math.sin(frame / 9) * 14;
  return (
    <svg viewBox="500 380 220 270" width="100%" height="100%" style={{ overflow: "visible" }}>
      <defs><Wobble id={`w-${uid}`} frame={frame} /></defs>
      <g filter={`url(#w-${uid})`}>
        <path d={`M655 590 C700 580 ${700 + tail} 520 ${688 + tail} 480`} stroke={INK} strokeWidth={22} fill="none" strokeLinecap="round" />
        <path d={`M655 590 C700 580 ${700 + tail} 520 ${688 + tail} 480`} stroke="#2B2B33" strokeWidth={10} fill="none" strokeLinecap="round" />
        <g stroke={INK} strokeLinejoin="round" strokeLinecap="round">
          <path d="M540 470 L552 418 L580 456 Q600 452 620 456 L648 418 L660 470 C676 500 672 560 650 600 L550 600 C528 560 524 500 540 470 Z" fill="#2B2B33" strokeWidth={7} />
          {/* Kính tròn */}
          <circle cx={578} cy={500} r={18} fill="#fff" strokeWidth={5} />
          <circle cx={622} cy={500} r={18} fill="#fff" strokeWidth={5} />
          <path d="M596 500 L604 500" stroke="#fff" strokeWidth={4} />
          {blink
            ? <path d="M568 502 L588 502 M612 502 L632 502" strokeWidth={5} />
            : <>
              <path d="M570 503 A8 8 0 0 0 586 503 Z" fill={INK} strokeWidth={0} />
              <path d="M614 503 A8 8 0 0 0 630 503 Z" fill={INK} strokeWidth={0} />
              <path d="M566 503 L590 503 M610 503 L634 503" strokeWidth={5} />
            </>}
          {t > 0.1
            ? <ellipse cx={600} cy={536} rx={8} ry={3 + 8 * t} fill="#F9A8B8" stroke="#fff" strokeWidth={3} />
            : <path d="M590 532 q5 6 10 0 q5 6 10 0" stroke="#fff" strokeWidth={4} fill="none" />}
          <path d="M556 528 l-26 -4 M556 538 l-26 6 M644 528 l26 -4 M644 538 l26 6" stroke="#fff" strokeWidth={3} />
          {/* Sổ */}
          <rect x={520} y={560} width={160} height={74} rx={6} fill="#F3E9D2" strokeWidth={6} />
          <path d="M600 560 L600 634" strokeWidth={5} />
          <circle cx={548} cy={622} r={13} fill="#2B2B33" strokeWidth={5} />
          <circle cx={652} cy={622} r={13} fill="#2B2B33" strokeWidth={5} />
        </g>
        <text x={560} y={594} textAnchor="middle" fontFamily="'Be Vietnam Pro'" fontWeight={900} fontSize={13} fill={INK}>SỔ TỘI</text>
        <text x={640} y={594} textAnchor="middle" fontFamily="'Be Vietnam Pro'" fontWeight={900} fontSize={10} fill={INK}>ĐỜI THƯỜNG</text>
      </g>
    </svg>
  );
};

// ---------- Linh hồn bị cáo ----------
export type HonMood = "scared" | "happy" | "tired";
export const Hon: React.FC<Common & { mood: HonMood; phone?: boolean }> = ({ frame, talk, uid, mood, phone }) => {
  const t = Math.min(1, talk);
  const float = Math.sin(frame / 12) * 8;
  const wave = Math.sin(frame / 6) * 4;
  const tremble = mood === "scared" ? Math.sin(frame * 1.7) * 1.5 : 0;
  const eyes = mood === "happy"
    ? <path d="M114 470 Q122 458 130 470 M150 470 Q158 458 166 470" stroke={INK} strokeWidth={6} fill="none" strokeLinecap="round" />
    : mood === "tired"
      ? <g stroke={INK} strokeLinecap="round"><path d="M114 468 A8 8 0 0 0 130 468 Z M150 468 A8 8 0 0 0 166 468 Z" fill={INK} /><path d="M112 468 L132 468 M148 468 L168 468" strokeWidth={6} /></g>
      : <g><circle cx={122} cy={468} r={9} fill="#fff" stroke={INK} strokeWidth={5} /><circle cx={158} cy={468} r={9} fill="#fff" stroke={INK} strokeWidth={5} /><circle cx={122} cy={469} r={3} fill={INK} /><circle cx={158} cy={469} r={3} fill={INK} /></g>;
  const mouth = t > 0.1
    ? <ellipse cx={140} cy={504} rx={7} ry={3 + 9 * t} fill={INK} />
    : mood === "happy"
      ? <path d="M128 498 Q140 514 152 498" stroke={INK} strokeWidth={6} fill="none" strokeLinecap="round" />
      : mood === "tired" ? <path d="M130 502 q5 -4 10 0 t10 0" stroke={INK} strokeWidth={5} fill="none" strokeLinecap="round" />
        : <ellipse cx={140} cy={504} rx={6} ry={8} fill={INK} />;
  return (
    <svg viewBox="60 400 160 220" width="100%" height="100%" style={{ overflow: "visible" }}>
      <defs><Wobble id={`w-${uid}`} frame={frame} /></defs>
      <g filter={`url(#w-${uid})`} transform={`translate(${tremble} ${float})`}>
        <path d={`M90 470 C90 400 190 400 190 470 L190 580 q-12 ${18 + wave} -25 0 q-12 ${18 - wave} -25 0 q-12 ${18 + wave} -25 0 q-12 ${18 - wave} -25 0 Z`}
          fill="#EEF2FF" stroke={INK} strokeWidth={7} strokeLinejoin="round" />
        {eyes}
        {mouth}
        {mood === "scared" && <path d="M180 430 q10 18 0 26 q-10 -8 0 -26" fill="#8EC5FF" stroke={INK} strokeWidth={4} />}
        {mood !== "scared" && <g stroke="#F28B82" strokeWidth={3} strokeLinecap="round"><path d="M104 486 l-4 7 M110 486 l-4 7 M170 486 l-4 7 M176 486 l-4 7" /></g>}
        {phone && (
          <g>
            <rect x={124} y={512} width={34} height={54} rx={7} fill="#2B2B33" stroke={INK} strokeWidth={5} />
            <rect x={129} y={518} width={24} height={40} rx={3} fill="#9FD3FF" />
            <ellipse cx={141} cy={520} rx={60} ry={50} fill="rgba(159,211,255,0.18)" />
          </g>
        )}
      </g>
    </svg>
  );
};
