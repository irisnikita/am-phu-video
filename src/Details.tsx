import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { INK, Wobble, Hon, DiemVuong } from "./Cast";
import { Frame, Flames } from "./Scenes";

// Cảnh hồi tưởng chi tiết: cận cảnh điện thoại, đồng hồ nhảy số, mặt díp mắt, văn phòng.
// p = tiến độ của cảnh (0..1), frame = khung hình tính từ đầu cảnh.
const F = "'Be Vietnam Pro'";
const HAND = "'Patrick Hand'";
const GHOST = "#EEF2FF";
const cl = (v: number) => Math.max(0, Math.min(1, v));
const ease = (v: number) => 1 - Math.pow(1 - cl(v), 3);
type P = { frame: number; p: number };

const pad = (n: number) => String(n).padStart(2, "0");
const hhmm = (min: number) => { const m = ((Math.floor(min) % 1440) + 1440) % 1440; return `${pad(Math.floor(m / 60))}:${pad(m % 60)}`; };

// Ngôi sao "BỐP!"
const Burst: React.FC<{ x: number; y: number; r: number; text: string; fill?: string; size?: number; rot?: number }> =
  ({ x, y, r, text, fill = "#FDE047", size = 44, rot = -8 }) => {
    const pts = Array.from({ length: 20 }).map((_, i) => {
      const a = (i / 20) * Math.PI * 2, rr = i % 2 ? r * 0.62 : r;
      return `${x + Math.cos(a) * rr},${y + Math.sin(a) * rr}`;
    }).join(" ");
    return (
      <g transform={`rotate(${rot} ${x} ${y})`}>
        <polygon points={pts} fill={fill} stroke={INK} strokeWidth={6} strokeLinejoin="round" />
        <text x={x} y={y + size * 0.36} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={size} fill={INK}>{text}</text>
      </g>
    );
  };

// ---------- Một tập short drama AI trên màn hình ----------
const DRAMAS = [
  { t: ["TỔNG TÀI VẢ MẶT", "NGƯỜI YÊU CŨ"], ep: 79, c: "#E11D48" },
  { t: ["TỔNG TÀI VẢ MẶT", "NGƯỜI YÊU CŨ"], ep: 80, c: "#BE185D" },
  { t: ["CÔ VỢ BỊ BỎ RƠI", "LÀ NỮ TỶ PHÚ"], ep: 12, c: "#7C3AED" },
  { t: ["MẸ CHỒNG QUỲ XIN", "LỖI CON DÂU"], ep: 44, c: "#D97706" },
  { t: ["TỔNG TÀI VẢ MẶT", "NGƯỜI YÊU CŨ"], ep: 81, c: "#E11D48" },
  { t: ["THIẾU GIA GIẢ NGHÈO", "ĐI GIAO CƠM"], ep: 7, c: "#0891B2" },
];

const DramaCard: React.FC<{ d: typeof DRAMAS[number]; w: number; h: number; frame: number }> = ({ d, w, h, frame }) => {
  const slap = (frame % 24) / 24; // tay vả qua lại
  const hx = interpolate(slap, [0, 0.35, 0.5, 1], [0, 70, 70, 0]);
  const hit = slap > 0.32 && slap < 0.6;
  const likes = (1.2 + ((frame * 7) % 90) / 100).toFixed(1);
  return (
    <g>
      <rect width={w} height={h} fill={d.c} />
      <rect y={h * 0.62} width={w} height={h * 0.38} fill="rgba(0,0,0,0.45)" />
      {/* hai nhân vật drama */}
      <g stroke={INK} strokeWidth={6} strokeLinejoin="round">
        {/* tổng tài: áo vest, kính đen */}
        <path d={`M70 ${h * 0.62} Q70 ${h * 0.4} 140 ${h * 0.4} Q210 ${h * 0.4} 210 ${h * 0.62} Z`} fill="#1F2937" />
        <circle cx={140} cy={h * 0.3} r={50} fill="#FCD9B6" />
        <path d={`M100 ${h * 0.29} L180 ${h * 0.29}`} strokeWidth={16} stroke={INK} />
        <path d={`M120 ${h * 0.35} L162 ${h * 0.35}`} />
        {/* tay vả */}
        <path d={`M200 ${h * 0.47} L${250 + hx} ${h * 0.36}`} strokeWidth={22} stroke={INK} strokeLinecap="round" />
        <path d={`M200 ${h * 0.47} L${250 + hx} ${h * 0.36}`} strokeWidth={10} stroke="#FCD9B6" strokeLinecap="round" />
        {/* người yêu cũ: nghiêng đầu khi bị vả */}
        <g transform={`rotate(${hit ? 18 : 0} 340 ${h * 0.34})`}>
          <path d={`M270 ${h * 0.62} Q270 ${h * 0.42} 340 ${h * 0.42} Q410 ${h * 0.42} 410 ${h * 0.62} Z`} fill="#F9A8D4" />
          <circle cx={340} cy={h * 0.32} r={46} fill="#FCD9B6" />
          <path d={`M296 ${h * 0.3} Q340 ${h * 0.18} 386 ${h * 0.3}`} fill="#5B3A29" />
          <path d={hit ? `M322 ${h * 0.33} l10 6 l-10 6 M358 ${h * 0.33} l-10 6 l10 6` : `M324 ${h * 0.33} l0 6 M356 ${h * 0.33} l0 6`} fill="none" />
          <ellipse cx={340} cy={h * 0.37} rx={8} ry={hit ? 10 : 4} fill={INK} />
        </g>
      </g>
      {hit && <Burst x={300} y={h * 0.22} r={62} text="BỐP!" size={34} />}
      {/* nhãn AI + số tập */}
      <rect x={20} y={70} width={70} height={44} rx={10} fill="#fff" stroke={INK} strokeWidth={4} />
      <text x={55} y={102} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={28} fill={INK}>AI</text>
      <rect x={100} y={70} width={150} height={44} rx={22} fill="rgba(0,0,0,0.55)" />
      <text x={175} y={101} textAnchor="middle" fontFamily={F} fontWeight={700} fontSize={26} fill="#fff">Tập {d.ep}/120</text>
      {/* tên phim */}
      {d.t.map((s, i) => (
        <text key={i} x={24} y={h * 0.72 + i * 48} fontFamily={F} fontWeight={900} fontSize={36} fill="#fff"
          stroke={INK} strokeWidth={8} paintOrder="stroke fill">{s}</text>
      ))}
      <text x={24} y={h * 0.72 + 104} fontFamily={F} fontWeight={700} fontSize={24} fill="#FDE68A">Tập tiếp theo tự phát sau 3s...</text>
      {/* nút bên phải */}
      <g transform={`translate(${w - 62} ${h * 0.5})`}>
        <path d="M0 10 C-26 -16 -44 12 0 40 C44 12 26 -16 0 10 Z" fill="#FB7185" stroke={INK} strokeWidth={4} />
        <text x={0} y={76} textAnchor="middle" fontFamily={F} fontWeight={700} fontSize={22} fill="#fff">{likes}Tr</text>
      </g>
      <rect x={0} y={h - 10} width={w} height={10} fill="rgba(255,255,255,0.3)" />
      <rect x={0} y={h - 10} width={w * ((frame % 36) / 36)} height={10} fill="#fff" />
    </g>
  );
};

// ---------- Cảnh 1: cận cảnh điện thoại, ngón cái vuốt liên tục ----------
const PER = 34; // mỗi video xem ~1 giây rồi vuốt
export const PhoneCU: React.FC<P> = ({ frame }) => {
  const SX = 262, SY = 130, SW = 456, SH = 840;
  const k = frame % PER, idx = Math.floor(frame / PER);
  const sw = ease((k - 24) / 10);
  const cur = DRAMAS[idx % DRAMAS.length], nxt = DRAMAS[(idx + 1) % DRAMAS.length];
  const time = hhmm(23 * 60 + 52 + frame / 5);
  const batt = Math.max(3, 21 - Math.floor(frame / 9));
  // ngón cái: nghỉ ở dưới, kéo lên khi vuốt
  const swipeK = cl((k - 18) / 16);
  const ty = interpolate(swipeK, [0, 0.35, 0.8, 1], [860, 860, 470, 860]);
  const tx = interpolate(swipeK, [0, 0.8, 1], [600, 560, 600]);
  const shake = Math.sin(frame / 3) * 2;
  return (
    <Frame label="HỒI TƯỞNG · 23:52" color="#0B1026" frame={frame}>
      <svg width={980} height={1120} viewBox="0 0 980 1120" style={{ position: "absolute", inset: 0 }}>
        <defs>
          <Wobble id="w-pcu" frame={frame} scale={2.5} />
          <radialGradient id="glow-pcu" cx="50%" cy="45%" r="60%">
            <stop offset="0%" stopColor="#60A5FA" stopOpacity={0.55} />
            <stop offset="100%" stopColor="#0B1026" stopOpacity={0} />
          </radialGradient>
          <clipPath id="clip-pcu"><rect x={SX} y={SY} width={SW} height={SH} rx={26} /></clipPath>
        </defs>
        <rect width={980} height={1120} fill="url(#glow-pcu)" />
        <g transform={`translate(0 ${shake})`}>
          <g filter="url(#w-pcu)">
            <rect x={232} y={70} width={516} height={960} rx={64} fill="#1F1F27" stroke={INK} strokeWidth={10} />
            <rect x={430} y={92} width={120} height={22} rx={11} fill={INK} />
          </g>
          <g clipPath="url(#clip-pcu)">
            <g transform={`translate(${SX} ${SY - sw * SH})`}><DramaCard d={cur} w={SW} h={SH} frame={frame} /></g>
            <g transform={`translate(${SX} ${SY + SH - sw * SH})`}><DramaCard d={nxt} w={SW} h={SH} frame={frame} /></g>
            {/* thanh trạng thái: giờ chạy, pin tụt */}
            <rect x={SX} y={SY} width={SW} height={56} fill="rgba(0,0,0,0.5)" />
            <text x={SX + 26} y={SY + 40} fontFamily={F} fontWeight={900} fontSize={30} fill="#fff">{time}</text>
            <rect x={SX + SW - 120} y={SY + 16} width={62} height={28} rx={6} fill="none" stroke="#fff" strokeWidth={4} />
            <rect x={SX + SW - 116} y={SY + 20} width={54 * batt / 100 + 4} height={20} rx={3} fill={batt < 10 ? "#F87171" : "#fff"} />
            <text x={SX + SW - 46} y={SY + 40} fontFamily={F} fontWeight={700} fontSize={24} fill="#fff">{batt}%</text>
          </g>
          {/* ngón cái ma (liền khối: viền trước, ruột sau) */}
          <g filter="url(#w-pcu)">
            <g stroke={INK} strokeWidth={18} fill={INK}>
              <ellipse cx={tx} cy={ty} rx={52} ry={78} transform={`rotate(-18 ${tx} ${ty})`} />
              <path d={`M${tx - 40} ${ty + 20} Q${tx + 40} ${ty + 260} ${tx + 360} ${ty + 340} L980 1120 L${tx + 100} 1120 Z`} />
            </g>
            <g fill={GHOST}>
              <ellipse cx={tx} cy={ty} rx={52} ry={78} transform={`rotate(-18 ${tx} ${ty})`} />
              <path d={`M${tx - 40} ${ty + 20} Q${tx + 40} ${ty + 260} ${tx + 360} ${ty + 340} L980 1120 L${tx + 100} 1120 Z`} />
            </g>
            <path d={`M${tx - 18} ${ty - 52} q18 -12 36 4`} stroke="#C7CCE8" strokeWidth={5} fill="none" strokeLinecap="round" />
          </g>
          {/* vệt vuốt */}
          {sw > 0 && sw < 1 && (
            <path d={`M${tx + 70} ${ty + 120} L${tx + 70} ${ty + 260} M${tx + 100} ${ty + 150} L${tx + 100} ${ty + 250}`}
              stroke="#fff" strokeWidth={6} strokeLinecap="round" opacity={0.7} />
          )}
        </g>
        <text x={80} y={1080} fontFamily={HAND} fontSize={46} fill="#BFDBFE" transform={`rotate(-4 80 1080)`}>
          vuốt lần thứ {12 + idx * 7}...
        </text>
      </svg>
    </Frame>
  );
};

// ---------- Cảnh 2: đồng hồ nhảy số, lịch bay, báo thức ----------
export const ClockJump: React.FC<P> = ({ frame, p }) => {
  const phaseA = p < 0.45, phaseB = p >= 0.45 && p < 0.72;
  const a = cl(p / 0.45), b = cl((p - 0.45) / 0.27), c = cl((p - 0.72) / 0.28);
  const ring = !phaseA && !phaseB;
  const shakeX = ring ? Math.sin(frame * 2.1) * 10 : 0;
  const nights = Math.round(1 + 1094 * ease(b));
  const year = 2023 + Math.min(3, Math.floor(ease(b) * 3.99));
  return (
    <Frame label={ring ? "07:00 SÁNG" : phaseB ? "3 NĂM LIỀN" : "HỒI TƯỞNG · MỖI ĐÊM"} color={ring ? "#FDE68A" : "#111834"} frame={frame}>
      <svg width={980} height={1120} viewBox="0 0 980 1120" style={{ position: "absolute", inset: 0 }}>
        <defs><Wobble id="w-cj" frame={frame} scale={3} /></defs>
        {phaseA && (
          <g filter="url(#w-cj)">
            {/* cửa sổ có trăng trôi */}
            <rect x={80} y={90} width={300} height={260} rx={14} fill="#0B1226" stroke="#E8E4F0" strokeWidth={7} />
            <circle cx={120 + 220 * a} cy={200 - 60 * Math.sin(a * Math.PI)} r={34} fill="#FEF3C7" />
            <path d="M230 90 L230 350 M80 220 L380 220" stroke="#E8E4F0" strokeWidth={6} />
            {/* đồng hồ số to */}
            <rect x={470} y={110} width={430} height={210} rx={30} fill="#05070F" stroke="#E8E4F0" strokeWidth={8} />
            <text x={685} y={260} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={130} fill="#F87171">
              {hhmm(23 * 60 + 180 * ease(a))}
            </text>
            {/* giường + ma vẫn lướt */}
            <path d="M60 1000 L60 760 Q60 720 110 720 L870 720 Q920 720 920 760 L920 1000" fill="#3B3F72" stroke="#E8E4F0" strokeWidth={7} />
            <rect x={100} y={650} width={240} height={110} rx={46} fill="#E8E4F0" stroke={INK} strokeWidth={6} />
          </g>
        )}
        {phaseA && (
          <text x={490} y={420} fontFamily={HAND} fontSize={50} fill="#BFDBFE" transform="rotate(-4 490 420)">
            ngủ còn: {Math.max(5, Math.round(8 - 3 * ease(a)))} tiếng... rồi 5
          </text>
        )}
        {phaseB && (
          <g filter="url(#w-cj)">
            {Array.from({ length: 6 }).map((_, i) => {
              const f = ((frame * 0.5 + i * 7) % 42) / 42; // tờ lịch bay
              return (
                <g key={i} transform={`translate(${200 + i * 110 + f * 300} ${520 - f * 600}) rotate(${f * 160 - 20})`} opacity={1 - f}>
                  <rect x={-70} y={-80} width={140} height={160} rx={10} fill="#fff" stroke={INK} strokeWidth={6} />
                  <rect x={-70} y={-80} width={140} height={44} rx={10} fill="#DC2626" stroke={INK} strokeWidth={6} />
                  <text x={0} y={52} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={60} fill={INK}>{((i * 5 + Math.floor(frame / 3)) % 28) + 1}</text>
                </g>
              );
            })}
            <rect x={170} y={600} width={640} height={330} rx={28} fill="#fff" stroke={INK} strokeWidth={10} />
            <rect x={170} y={600} width={640} height={100} rx={28} fill="#DC2626" stroke={INK} strokeWidth={10} />
            <text x={490} y={675} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={60} fill="#fff">NĂM {year}</text>
            <text x={490} y={810} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={110} fill={INK}>{nights.toLocaleString("vi-VN")}</text>
            <text x={490} y={890} textAnchor="middle" fontFamily={F} fontWeight={700} fontSize={44} fill={INK}>đêm ngủ lúc 2:00</text>
          </g>
        )}
        {ring && (
          <g filter="url(#w-cj)">
            <g transform={`translate(${490 + shakeX} 380) rotate(${shakeX / 2})`}>
              <path d="M-170 -170 L-230 -230 M170 -170 L230 -230" stroke={INK} strokeWidth={14} strokeLinecap="round" />
              <circle cx={-150} cy={-190} r={60} fill="#F87171" stroke={INK} strokeWidth={8} />
              <circle cx={150} cy={-190} r={60} fill="#F87171" stroke={INK} strokeWidth={8} />
              <circle r={220} fill="#fff" stroke={INK} strokeWidth={12} />
              <path d="M0 0 L-55 95 M0 0 L0 -150" stroke={INK} strokeWidth={14} strokeLinecap="round" />
              <circle r={14} fill={INK} />
            </g>
            <Burst x={190} y={180} r={90} text="RENG!" size={40} rot={-14} fill="#fff" />
            <Burst x={800} y={230} r={90} text="RENG!" size={40} rot={12} fill="#fff" />
          </g>
        )}
      </svg>
      {phaseA && (
        <div style={{ position: "absolute", left: 340, top: 470, width: 330, height: 454 }}>
          <Hon frame={frame} talk={0} uid="hon-cj" mood="tired" phone />
        </div>
      )}
      {ring && (
        <div style={{ position: "absolute", left: 330, top: 640 + (1 - ease(c * 3)) * 200, width: 330, height: 454 }}>
          <Hon frame={frame} talk={0} uid="hon-cj2" mood="scared" />
        </div>
      )}
    </Frame>
  );
};

// ---------- Cảnh 3: cận mặt, ánh xanh hắt lên, mắt díp rồi điện thoại rơi vào mặt ----------
export const FaceCU: React.FC<P> = ({ frame, p }) => {
  const drop = cl((p - 0.74) / 0.12);
  const hit = drop >= 1;
  // mi mắt sụp dần, cứ ~1 giây lại cố mở ra
  const cyc = (frame % 28) / 28;
  const lid = hit ? 1 : Math.min(0.92, 0.25 + 0.5 * cl(p * 1.4) + 0.3 * ease(cyc));
  const glow = 0.45 + 0.15 * Math.sin(frame / 2.5); // ánh màn hình nhấp nháy theo video
  const py = interpolate(drop, [0, 1], [-420, 300]);
  const eye = (cx: number) => (
    <g>
      <ellipse cx={cx} cy={470} rx={110} ry={92} fill="#fff" stroke={INK} strokeWidth={10} />
      {!hit && <circle cx={cx + 6} cy={500} r={38} fill={INK} />}
      {!hit && <rect x={cx - 8} y={486} width={22} height={34} rx={4} fill="#60A5FA" />}
      {hit && <path d={`M${cx - 50} 430 L${cx + 50} 510 M${cx + 50} 430 L${cx - 50} 510`} stroke={INK} strokeWidth={14} strokeLinecap="round" />}
      {/* mi mắt trên */}
      <path d={`M${cx - 116} 470 A110 92 0 0 1 ${cx + 116} 470 L${cx + 116} ${378 + 184 * lid} L${cx - 116} ${378 + 184 * lid} Z`}
        fill={GHOST} stroke="none" clipPath={`url(#eye-${cx})`} />
      <path d={`M${cx - 104} ${378 + 184 * lid} L${cx + 104} ${378 + 184 * lid}`} stroke={INK} strokeWidth={10} strokeLinecap="round"
        clipPath={`url(#eye-${cx})`} />
      {/* quầng thâm */}
      <path d={`M${cx - 90} 590 Q${cx} 640 ${cx + 90} 590`} stroke="#8B5CF6" strokeWidth={12} fill="none" strokeLinecap="round" opacity={0.7} />
      <path d={`M${cx - 70} 620 Q${cx} 660 ${cx + 70} 620`} stroke="#8B5CF6" strokeWidth={8} fill="none" strokeLinecap="round" opacity={0.45} />
    </g>
  );
  return (
    <Frame label="2:47 SÁNG" color="#0A0F24" frame={frame}>
      <svg width={980} height={1120} viewBox="0 0 980 1120" style={{ position: "absolute", inset: 0 }}>
        <defs>
          <Wobble id="w-fcu" frame={frame} scale={3} />
          <clipPath id="eye-300"><ellipse cx={300} cy={470} rx={106} ry={88} /></clipPath>
          <clipPath id="eye-680"><ellipse cx={680} cy={470} rx={106} ry={88} /></clipPath>
          <linearGradient id="blue-fcu" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity={glow} />
            <stop offset="70%" stopColor="#3B82F6" stopOpacity={0} />
          </linearGradient>
        </defs>
        <g filter="url(#w-fcu)" transform={hit ? `translate(${Math.sin(frame * 3) * 8} 0)` : undefined}>
          <path d="M40 1120 L40 420 C40 60 940 60 940 420 L940 1120 Z" fill={GHOST} stroke={INK} strokeWidth={12} />
          {eye(300)}
          {eye(680)}
          {/* miệng há ngáp */}
          <ellipse cx={490} cy={800} rx={hit ? 70 : 40 + 20 * ease(cyc)} ry={hit ? 60 : 24 + 30 * ease(cyc)} fill={INK} />
          <rect width={980} height={1120} fill="url(#blue-fcu)" />
          {/* mép điện thoại ở đáy, phát sáng */}
          {!hit && (
            <g>
              <rect x={300} y={1010} width={380} height={160} rx={40} fill="#1F1F27" stroke={INK} strokeWidth={10} />
              <rect x={320} y={1030} width={340} height={120} rx={20} fill="#93C5FD" />
            </g>
          )}
        </g>
        {!hit && lid > 0.75 && (
          <text x={780} y={260} fontFamily={F} fontWeight={900} fontSize={70} fill="#BFDBFE" transform="rotate(10 780 260)">z z z</text>
        )}
        {/* điện thoại rơi vào mặt */}
        {drop > 0 && (
          <g transform={`translate(490 ${py}) rotate(${(1 - drop) * 40})`}>
            <rect x={-150} y={-260} width={300} height={520} rx={40} fill="#1F1F27" stroke={INK} strokeWidth={10} />
            <rect x={-132} y={-236} width={264} height={472} rx={22} fill="#E11D48" />
          </g>
        )}
        {hit && <Burst x={220} y={200} r={130} text="BỘP!" size={64} rot={-12} />}
      </svg>
    </Frame>
  );
};

// ---------- Cảnh 4: ban ngày bị chiếm hết, nửa đêm mới là của mình ----------
const PINGS = [
  { who: "SẾP", msg: "Em ơi gấp nha!!", c: "#FDE047" },
  { who: "KHÁCH", msg: "Sửa lần 8 nhé em", c: "#F9A8D4" },
  { who: "DEADLINE", msg: "HÔM NAY 17:00", c: "#FCA5A5" },
  { who: "SẾP", msg: "Online không em?", c: "#FDE047" },
  { who: "KHÁCH", msg: "Logo to ra mà nhỏ lại", c: "#F9A8D4" },
];
export const OfficeDay: React.FC<P & { talk: number }> = ({ frame, p, talk }) => {
  const night = p >= 0.64;
  const d = cl(p / 0.64);
  const hour = 9 + 13 * d; // 9h -> 22h
  const n = Math.min(PINGS.length, Math.floor(d * (PINGS.length + 0.9)));
  const badge = Math.min(99, Math.floor(d * 140));
  const cups = 1 + Math.floor(d * 4);
  const nk = ease((p - 0.64) / 0.1);
  if (night) {
    return (
      <Frame label="00:00 · GIỜ CỦA RIÊNG TÔI" color="#151B45" frame={frame}>
        <svg width={980} height={1120} viewBox="0 0 980 1120" style={{ position: "absolute", inset: 0 }}>
          <defs><Wobble id="w-on" frame={frame} scale={3} /></defs>
          <g filter="url(#w-on)">
            {Array.from({ length: 14 }).map((_, i) => (
              <circle key={i} cx={(i * 173) % 940 + 20} cy={(i * 97) % 380 + 60} r={4 + (i % 3) * 2}
                fill="#FEF3C7" opacity={0.4 + 0.6 * Math.abs(Math.sin(frame / 8 + i))} />
            ))}
            <path d="M40 1080 L40 800 Q40 760 90 760 L890 760 Q940 760 940 800 L940 1080" fill="#3B3F72" stroke="#E8E4F0" strokeWidth={7} />
            <rect x={70} y={700} width={240} height={110} rx={46} fill="#E8E4F0" stroke={INK} strokeWidth={6} />
            <rect x={500} y={150} width={420} height={84} rx={42} fill="#0B1020" stroke="#E8E4F0" strokeWidth={5} />
            <text x={710} y={204} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={34} fill="#A5B4FC">KHÔNG LÀM PHIỀN</text>
          </g>
          <text x={490} y={420} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={140} fill="#FDE047"
            stroke={INK} strokeWidth={10} paintOrder="stroke fill" transform={`scale(${0.6 + 0.4 * nk})`} style={{ transformOrigin: "490px 380px" }}>00:00</text>
        </svg>
        <div style={{ position: "absolute", left: 300, top: 450, width: 380, height: 522 }}>
          <Hon frame={frame} talk={talk} uid="hon-on" mood="happy" phone />
        </div>
      </Frame>
    );
  }
  return (
    <Frame label={`${hour < 18 ? "BAN NGÀY" : "TĂNG CA"} · ${hhmm(hour * 60)}`} color="#E7E2D6" frame={frame}>
      <svg width={980} height={1120} viewBox="0 0 980 1120" style={{ position: "absolute", inset: 0 }}>
        <defs><Wobble id="w-od" frame={frame} scale={3} /></defs>
        <g filter="url(#w-od)" stroke={INK} strokeWidth={7} strokeLinejoin="round">
          {/* cửa sổ: trời sáng dần tối */}
          <rect x={60} y={80} width={300} height={230} rx={12} fill={`hsl(${210 - 10 * d}, ${70 - 30 * d}%, ${75 - 55 * d}%)`} />
          <path d="M210 80 L210 310" />
          {/* đồng hồ treo tường: kim quay nhanh */}
          <circle cx={490} cy={180} r={90} fill="#fff" />
          <path d={`M490 180 L${490 + 55 * Math.sin((hour / 12) * 2 * Math.PI)} ${180 - 55 * Math.cos((hour / 12) * 2 * Math.PI)}`} strokeWidth={10} strokeLinecap="round" />
          <path d={`M490 180 L${490 + 75 * Math.sin(hour * 2 * Math.PI)} ${180 - 75 * Math.cos(hour * 2 * Math.PI)}`} strokeWidth={6} strokeLinecap="round" />
          {/* bàn, laptop, cốc cà phê */}
          <rect x={0} y={880} width={980} height={240} fill="#A8A29E" />
          <rect x={360} y={660} width={330} height={220} rx={12} fill="#334155" />
          <rect x={378} y={678} width={294} height={168} rx={6} fill="#7DD3FC" />
          <rect x={660} y={664} width={52} height={40} rx={20} fill="#DC2626" />
          {Array.from({ length: cups }).map((_, i) => (
            <g key={i} transform={`translate(${740 + (i % 3) * 70} ${800 - Math.floor(i / 3) * 70})`}>
              <rect x={0} y={0} width={50} height={70} rx={8} fill="#fff" />
              <path d="M50 18 q22 0 22 18 q0 18 -22 18" fill="none" />
            </g>
          ))}
        </g>
        <text x={686} y={697} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={24} fill="#fff">{badge}{badge >= 99 ? "+" : ""}</text>
      </svg>
      {/* tin nhắn dồn dập */}
      <div style={{ position: "absolute", right: 30, top: 340, width: 470, display: "flex", flexDirection: "column", gap: 14 }}>
        {PINGS.slice(0, n).map((m, i) => {
          const born = (i / (PINGS.length + 0.9)) * 0.64;
          const s = ease((p - born) / 0.04);
          return (
            <div key={i} style={{ background: "#fff", border: `6px solid ${INK}`, borderRadius: 22, padding: "8px 18px 12px",
              transform: `scale(${s}) rotate(${i % 2 ? 2 : -2}deg)`, transformOrigin: "100% 50%", boxShadow: `6px 7px 0 ${INK}` }}>
              <span style={{ fontFamily: F, fontWeight: 900, fontSize: 28, background: m.c, padding: "0 10px", borderRadius: 8 }}>{m.who}</span>
              <div style={{ fontFamily: F, fontWeight: 700, fontSize: 34, color: INK }}>{m.msg}</div>
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 40, top: 520, width: 340, height: 468 }}>
        <Hon frame={frame} talk={talk} uid="hon-od" mood="tired" />
      </div>
    </Frame>
  );
};

// ---------- Phán quyết: 3 việc cụ thể, hiện lần lượt khi Diêm Vương đọc ----------
const RULES = [
  { at: 0.17, n: "1", when: "VỪA TAN LÀM", what: "30 phút đi bộ, tập thể dục hoặc gọi cho bạn", note: "KHÔNG MÀN HÌNH", c: "#BBF7D0" },
  { at: 0.5, n: "2", when: "23:00", what: "Cắm sạc điện thoại ở NGOÀI phòng ngủ", note: "", c: "#BFDBFE" },
  { at: 0.74, n: "3", when: "LÊN GIƯỜNG", what: "Đọc vài trang sách giấy thay vì lướt", note: "", c: "#FDE68A" },
];
export const VerdictScroll: React.FC<P & { talk: number }> = ({ frame, p, talk }) => {
  const open = interpolate(frame, [0, 10], [0.2, 1], { extrapolateRight: "clamp" });
  const stamp = interpolate(frame, [4, 12], [2.2, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 35%, #4A1628 0%, #230A14 70%)" }}>
      <div style={{ position: "absolute", left: 50, right: 50, top: 250, height: 1060, transform: `scaleY(${open})`, transformOrigin: "50% 0%" }}>
        <div style={{ position: "absolute", inset: "30px 0", background: "#F6EBD3", border: `8px solid ${INK}`, borderRadius: 16, padding: "70px 34px 0" }}>
          <div style={{ textAlign: "center" }}>
            <span style={{ display: "inline-block", fontFamily: F, fontWeight: 900, fontSize: 76, color: "#fff", background: "#DC2626",
              border: `8px solid ${INK}`, borderRadius: 22, padding: "6px 30px 14px", transform: `rotate(-3deg) scale(${stamp})` }}>PHÁN QUYẾT</span>
          </div>
          {RULES.map((r) => {
            const s = ease((p - r.at) / 0.05);
            return (
              <div key={r.n} style={{ display: "flex", alignItems: "center", gap: 22, marginTop: 30, opacity: s,
                transform: `translateX(${(1 - s) * -80}px)` }}>
                <div style={{ flex: "0 0 96px", height: 96, borderRadius: 48, background: INK, color: "#FDE047", fontFamily: F,
                  fontWeight: 900, fontSize: 60, display: "flex", alignItems: "center", justifyContent: "center" }}>{r.n}</div>
                <div style={{ flex: 1, background: r.c, border: `6px solid ${INK}`, borderRadius: 22, padding: "10px 22px 16px",
                  boxShadow: `6px 7px 0 ${INK}` }}>
                  <div style={{ fontFamily: F, fontWeight: 900, fontSize: 34, color: "#B91C1C" }}>{r.when}</div>
                  <div style={{ fontFamily: F, fontWeight: 700, fontSize: 40, lineHeight: 1.25, color: INK }}>{r.what}</div>
                  {r.note && <div style={{ display: "inline-block", marginTop: 6, fontFamily: F, fontWeight: 900, fontSize: 30, color: "#fff",
                    background: "#DC2626", borderRadius: 10, padding: "2px 12px 6px" }}>{r.note}</div>}
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ position: "absolute", left: -20, right: -20, top: 0, height: 56, background: "#B91C1C", border: `8px solid ${INK}`, borderRadius: 28 }} />
        <div style={{ position: "absolute", left: -20, right: -20, bottom: 0, height: 56, background: "#B91C1C", border: `8px solid ${INK}`, borderRadius: 28 }} />
      </div>
      <div style={{ position: "absolute", right: -10, top: 1110, width: 300, height: 352 }}>
        <DiemVuong frame={frame} talk={talk} uid="dv-vd" mood="angry" />
      </div>
      <Flames frame={frame} y={1600} opacity={0.3} />
    </AbsoluteFill>
  );
};
