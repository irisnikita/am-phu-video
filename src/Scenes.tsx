import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { INK, Wobble, Hon, MeoSo } from "./Cast";

const W = 1080, H = 1920;
const F = "'Be Vietnam Pro'";

// Lửa âm phủ chuyển động ở đáy khung
export const Flames: React.FC<{ frame: number; y?: number; opacity?: number }> = ({ frame, y = 1500, opacity = 0.6 }) => {
  const pts = Array.from({ length: 13 }).map((_, i) => {
    const h = 90 + 60 * Math.abs(Math.sin(frame / 7 + i * 1.3));
    return `q${42} ${-h} ${84} 0`;
  }).join(" ");
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
      <path d={`M-20 ${y} ${pts} L1100 ${H} L-20 ${H} Z`} fill="#E4572E" opacity={opacity} />
      <path d={`M-60 ${y + 60} ${pts} L1100 ${H} L-60 ${H} Z`} fill="#F59E0B" opacity={opacity * 0.6} />
    </svg>
  );
};

export const CourtBg: React.FC<{ frame: number }> = ({ frame }) => (
  <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 35%, #4A1628 0%, #230A14 70%)" }}>
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      <defs><Wobble id="w-court" frame={frame} scale={3} /></defs>
      <g filter="url(#w-court)" stroke={INK} strokeWidth={7} strokeLinejoin="round">
        {[60, 900].map((x) => (
          <g key={x}>
            <rect x={x} y={180} width={120} height={1400} fill="#7F1D1D" />
            <rect x={x - 20} y={170} width={160} height={40} fill="#5B1414" />
          </g>
        ))}
        {[120, 960].map((x, i) => {
          const sw = Math.sin(frame / 15 + i) * 6;
          return (
            <g key={x} transform={`rotate(${sw} ${x} 260)`}>
              <path d={`M${x} 230 L${x} 270`} />
              <ellipse cx={x} cy={330} rx={52} ry={64} fill="#DC2626" />
              <ellipse cx={x} cy={330} rx={70} ry={80} fill="rgba(253,224,71,0.18)" stroke="none" />
              <path d={`M${x} 394 L${x} 430`} stroke="#FDE047" strokeWidth={8} />
            </g>
          );
        })}
      </g>
    </svg>
    <Flames frame={frame} y={1560} opacity={0.35} />
  </AbsoluteFill>
);

export const Desk: React.FC<{ frame: number }> = ({ frame }) => (
  <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
    <defs><Wobble id="w-desk" frame={frame} scale={3} /></defs>
    <g filter="url(#w-desk)" stroke={INK} strokeWidth={8} strokeLinejoin="round">
      <rect x={120} y={1030} width={840} height={250} rx={18} fill="#7A3B1E" />
      <rect x={100} y={1010} width={880} height={50} rx={14} fill="#934A26" />
      <rect x={380} y={1100} width={320} height={100} rx={14} fill="#FDE047" />
      <text x={540} y={1172} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={56} fill={INK} stroke="none">ÂM PHỦ</text>
    </g>
  </svg>
);

export const Frame: React.FC<{ label: string; color: string; children: React.ReactNode; frame: number }> = ({ label, color, children, frame }) => (
  <AbsoluteFill style={{ background: "#1A0A10" }}>
    <div style={{ position: "absolute", left: 50, right: 50, top: 300, height: 1120, borderRadius: 40, overflow: "hidden",
      border: `10px solid ${INK}`, background: color, boxShadow: "0 0 0 8px #FDE047" }}>
      {children}
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.45) 100%)" }} />
    </div>
    <div style={{ position: "absolute", top: 250, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
      <div style={{ fontFamily: F, fontWeight: 900, fontSize: 42, background: "#FDE047", color: INK, padding: "10px 34px 14px",
        border: `6px solid ${INK}`, borderRadius: 50, transform: `rotate(${Math.sin(frame / 20) * 1.5}deg)` }}>{label}</div>
    </div>
    <Flames frame={frame} y={1600} opacity={0.3} />
  </AbsoluteFill>
);

export const FlashBed: React.FC<{ frame: number; talk: number }> = ({ frame, talk }) => (
  <Frame label="HỒI TƯỞNG · 2:00 SÁNG" color="#1E2547" frame={frame}>
    <svg width={980} height={1120} viewBox="0 0 980 1120" style={{ position: "absolute", inset: 0 }}>
      <defs><Wobble id="w-fb" frame={frame} scale={3} /></defs>
      <g filter="url(#w-fb)" stroke="#E8E4F0" strokeWidth={7} strokeLinejoin="round" fill="none">
        <rect x={90} y={120} width={320} height={380} rx={14} fill="#0B1226" />
        <path d="M250 120 L250 500" />
        <circle cx={330} cy={230} r={46} fill="#FEF3C7" stroke="none" />
        <circle cx={352} cy={214} r={42} fill="#0B1226" stroke="none" />
        <rect x={600} y={170} width={270} height={120} rx={20} fill="#0B1020" />
        <text x={735} y={258} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={80} fill="#F87171" stroke="none"
          opacity={frame % 30 < 20 ? 1 : 0.3}>2:00</text>
        <path d="M40 980 L40 760 Q40 720 90 720 L890 720 Q940 720 940 760 L940 980" fill="#3B3F72" stroke="#E8E4F0" />
        <rect x={80} y={640} width={260} height={120} rx={50} fill="#E8E4F0" stroke={INK} />
      </g>
    </svg>
    <div style={{ position: "absolute", left: 330, top: 420, width: 360, height: 495 }}>
      <Hon frame={frame} talk={talk} uid="hon-fb" mood="tired" phone />
    </div>
    <div style={{ position: "absolute", left: 640, top: 380, fontFamily: "'Patrick Hand'", fontSize: 54, color: "#E8E4F0",
      transform: `rotate(-6deg) translateY(${Math.sin(frame / 10) * 6}px)` }}>thêm 1 video nữa...</div>
  </Frame>
);

export const FlashOffice: React.FC<{ frame: number; talk: number }> = ({ frame, talk }) => {
  const notes = [["SẾP", "#FDE047"], ["KHÁCH", "#F9A8D4"], ["DEADLINE", "#FCA5A5"]];
  return (
    <Frame label="HỒI TƯỞNG · BAN NGÀY" color="#E7E2D6" frame={frame}>
      <svg width={980} height={1120} viewBox="0 0 980 1120" style={{ position: "absolute", inset: 0 }}>
        <defs><Wobble id="w-fo" frame={frame} scale={3} /></defs>
        <g filter="url(#w-fo)" stroke={INK} strokeWidth={7} strokeLinejoin="round">
          <rect x={0} y={860} width={980} height={260} fill="#A8A29E" />
          <rect x={560} y={600} width={300} height={200} rx={12} fill="#334155" />
          <rect x={578} y={618} width={264} height={150} rx={6} fill="#7DD3FC" />
          {notes.map(([t, c], i) => {
            const appear = interpolate(frame, [i * 22, i * 22 + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            return (
              <g key={t} transform={`translate(${90 + i * 280} ${130 + (i % 2) * 70}) rotate(${i % 2 ? 6 : -6}) scale(${appear})`}>
                <rect width={240} height={190} fill={c} />
                <text x={120} y={118} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={t.length > 5 ? 40 : 54} fill={INK} stroke="none">{t}</text>
              </g>
            );
          })}
        </g>
      </svg>
      <div style={{ position: "absolute", left: 140, top: 480, width: 380, height: 522 }}>
        <Hon frame={frame} talk={talk} uid="hon-fo" mood="tired" />
      </div>
    </Frame>
  );
};

const Scroll: React.FC<{ frame: number; talk: number; children: React.ReactNode }> = ({ frame, talk, children }) => {
  const open = interpolate(frame, [0, 10], [0.2, 1], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 35%, #4A1628 0%, #230A14 70%)" }}>
      <div style={{ position: "absolute", left: 70, right: 70, top: 260, height: 1000, transform: `scaleY(${open})`, transformOrigin: "50% 0%" }}>
        <div style={{ position: "absolute", inset: "30px 0", background: "#F6EBD3", border: `8px solid ${INK}`, borderRadius: 16 }}>{children}</div>
        <div style={{ position: "absolute", left: -20, right: -20, top: 0, height: 56, background: "#B91C1C", border: `8px solid ${INK}`, borderRadius: 28 }} />
        <div style={{ position: "absolute", left: -20, right: -20, bottom: 0, height: 56, background: "#B91C1C", border: `8px solid ${INK}`, borderRadius: 28 }} />
      </div>
      <div style={{ position: "absolute", right: 30, top: 1060, width: 280, height: 344 }}>
        <MeoSo frame={frame} talk={talk} uid="meo-sc" />
      </div>
      <Flames frame={frame} y={1600} opacity={0.3} />
    </AbsoluteFill>
  );
};

export const TitleScroll: React.FC<{ frame: number; talk: number }> = ({ frame, talk }) => {
  const stamp = interpolate(frame, [18, 26], [2.2, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Scroll frame={frame} talk={talk}>
      <div style={{ fontFamily: F, textAlign: "center", padding: "90px 50px", color: INK }}>
        <div style={{ fontSize: 46, fontWeight: 700 }}>Tên khoa học:</div>
        <div style={{ fontSize: 92, fontWeight: 900, lineHeight: 1.2, marginTop: 10 }}>Trì hoãn<br />giờ ngủ</div>
        <div style={{ fontSize: 36, fontWeight: 700, color: "#57534E", marginTop: 14 }}>(Kroese và cộng sự, 2014)</div>
        <div style={{ fontSize: 46, fontWeight: 700, marginTop: 70 }}>Tên trên mạng:</div>
        <div style={{ display: "inline-block", marginTop: 20, fontSize: 84, fontWeight: 900, color: "#DC2626", lineHeight: 1.2,
          border: "10px solid #DC2626", borderRadius: 24, padding: "14px 30px 20px", transform: `rotate(-5deg) scale(${stamp})`,
          opacity: frame < 18 ? 0 : 1 }}>THỨC KHUYA<br />ĐỂ TRẢ THÙ</div>
      </div>
    </Scroll>
  );
};

export const BatteryScroll: React.FC<{ frame: number; talk: number }> = ({ frame, talk }) => {
  const level = interpolate(frame, [40, 200], [0.85, 0.08], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const col = level > 0.5 ? "#16A34A" : level > 0.25 ? "#F59E0B" : "#DC2626";
  return (
    <Scroll frame={frame} talk={talk}>
      <div style={{ fontFamily: F, textAlign: "center", padding: "110px 40px", color: INK }}>
        <div style={{ fontSize: 64, fontWeight: 900 }}>Pin tự kiểm soát</div>
        <div style={{ margin: "60px auto 0", width: 620, height: 260, border: `14px solid ${INK}`, borderRadius: 36, padding: 18, position: "relative" }}>
          <div style={{ width: `${level * 100}%`, height: "100%", background: col, borderRadius: 18 }} />
          <div style={{ position: "absolute", right: -50, top: 80, width: 34, height: 100, background: INK, borderRadius: 10 }} />
        </div>
        <div style={{ fontSize: 110, fontWeight: 900, color: col, marginTop: 30 }}>{Math.round(level * 100)}%</div>
        <div style={{ fontSize: 46, fontWeight: 700, marginTop: 10 }}>Đặt điện thoại xuống cần: <span style={{ color: "#DC2626" }}>60%</span></div>
      </div>
    </Scroll>
  );
};

export const LoopScroll: React.FC<{ frame: number; talk: number }> = ({ frame, talk }) => {
  const rot = frame * 1.6;
  const nodes = ["Thức khuya", "Sáng mệt", "Pin cạn"];
  return (
    <Scroll frame={frame} talk={talk}>
      <div style={{ fontFamily: F, textAlign: "center", paddingTop: 80, fontSize: 62, fontWeight: 900, color: INK }}>Vòng lặp hoàn hảo</div>
      <svg width={940} height={760} viewBox="0 0 940 760" style={{ position: "absolute", left: 0, top: 180 }}>
        <g transform={`rotate(${rot} 470 360)`}>
          <circle cx={470} cy={360} r={250} fill="none" stroke={INK} strokeWidth={12} strokeDasharray="60 30" />
          {[0, 120, 240].map((a) => (
            <path key={a} transform={`rotate(${a + 40} 470 360)`} d="M470 92 l36 18 l-36 18 z" fill={INK} />
          ))}
        </g>
        {nodes.map((n, i) => {
          const a = (i * 120 - 90) * Math.PI / 180;
          const x = 470 + 250 * Math.cos(a), y = 360 + 250 * Math.sin(a);
          return (
            <g key={n}>
              <rect x={x - 150} y={y - 50} width={300} height={100} rx={24} fill={["#FCA5A5", "#FDE047", "#C4B5FD"][i]} stroke={INK} strokeWidth={8} />
              <text x={x} y={y + 16} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={46} fill={INK}>{n}</text>
            </g>
          );
        })}
      </svg>
    </Scroll>
  );
};

export const CtaBg: React.FC<{ frame: number; talk: number }> = ({ frame, talk }) => (
  <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 40%, #4A1628 0%, #230A14 70%)" }}>
    <div style={{ position: "absolute", left: 140, top: 520, width: 800, height: 982 }}>
      <MeoSo frame={frame} talk={talk} uid="meo-cta" />
    </div>
    <div style={{ position: "absolute", top: 260, left: 60, right: 60, textAlign: "center", fontFamily: F, fontWeight: 900, fontSize: 80,
      color: "#fff", lineHeight: 1.25 }}>
      Giờ là <span style={{ color: "#FDE047" }}>mấy giờ?</span>
      <div style={{ fontSize: 44, fontWeight: 700, color: "#FCA5A5", marginTop: 12 }}>Quá 11 giờ thì tắt máy đi ngủ. Mai khai ở bình luận.</div>
    </div>
    <Flames frame={frame} y={1600} opacity={0.35} />
  </AbsoluteFill>
);
