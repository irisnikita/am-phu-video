import React from "react";
import { AbsoluteFill } from "remotion";
import "@fontsource/be-vietnam-pro/900.css";
import "@fontsource/be-vietnam-pro/700.css";
import { INK, Wobble } from "./Cast";

// Khuôn ảnh bìa chung "Phiên tòa Âm Phủ" (1080x1920).
// Vùng an toàn: mọi thứ quan trọng nằm trong khung vuông giữa (y 420..1500),
// để lưới 1:1 (trang kênh, TikTok) và 3:4 (Reels) vẫn đọc được.
const W = 1080, H = 1920;
const F = "'Be Vietnam Pro'";
const RED = "#E11D2E", YEL = "#FDE047";

export type CoverProps = { ep: number; crime: string[]; face: "hon-thuc-khuya" | "dv-tron-mat" };

const Bg: React.FC = () => (
  <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 62%, #8A1F2C 0%, #4A1022 38%, #1A0710 78%)" }}>
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      {/* tia sáng phía sau gương mặt */}
      <g opacity={0.16} fill={YEL}>
        {Array.from({ length: 18 }).map((_, i) => {
          const a = (i / 18) * Math.PI * 2, b = a + Math.PI / 36;
          const cx = 540, cy = 1150, R = 1500;
          return <path key={i} d={`M${cx} ${cy} L${cx + R * Math.cos(a)} ${cy + R * Math.sin(a)} L${cx + R * Math.cos(b)} ${cy + R * Math.sin(b)} Z`} />;
        })}
      </g>
      {/* lửa đáy */}
      <path d={`M-20 1640 ${Array.from({ length: 13 }).map((_, i) => `q42 ${-(100 + 50 * Math.abs(Math.sin(i * 1.7)))} 84 0`).join(" ")} L1100 1920 L-20 1920 Z`} fill="#E4572E" opacity={0.55} />
      <path d={`M-60 1720 ${Array.from({ length: 14 }).map((_, i) => `q42 ${-(80 + 40 * Math.abs(Math.cos(i * 1.3)))} 84 0`).join(" ")} L1100 1920 L-60 1920 Z`} fill="#F59E0B" opacity={0.4} />
    </svg>
  </AbsoluteFill>
);

// ---------- Gương mặt vẽ riêng cho ảnh bìa ----------
// Bị cáo tập 1: thức trắng, mắt đỏ thâm quầng, mặt xanh vì ánh điện thoại.
const HonThucKhuya: React.FC = () => (
  <svg viewBox="0 0 900 900" width="100%" height="100%" style={{ overflow: "visible" }}>
    <defs>
      <Wobble id="w-c1" frame={0} scale={6} />
      <radialGradient id="glow1" cx="50%" cy="100%" r="80%">
        <stop offset="0%" stopColor="#7DD3FC" stopOpacity={0.75} />
        <stop offset="60%" stopColor="#7DD3FC" stopOpacity={0.15} />
        <stop offset="100%" stopColor="#7DD3FC" stopOpacity={0} />
      </radialGradient>
    </defs>
    <g filter="url(#w-c1)" stroke={INK} strokeLinejoin="round" strokeLinecap="round">
      {/* thân liền đầu, hai tay liền thân ôm điện thoại */}
      <path d="M450 70 C690 70 790 250 790 440 L790 640 C790 700 760 740 720 760 C690 776 660 770 640 750 L600 700
               L300 700 L260 750 C240 770 210 776 180 760 C140 740 110 700 110 640 L110 440 C110 250 210 70 450 70 Z"
        fill="#EEF2FF" strokeWidth={14} />
      <path d="M450 70 C690 70 790 250 790 440 L790 640 C790 700 760 740 720 760 C690 776 660 770 640 750 L600 700
               L300 700 L260 750 C240 770 210 776 180 760 C140 740 110 700 110 640 L110 440 C110 250 210 70 450 70 Z"
        fill="url(#glow1)" stroke="none" />
      {/* tóc dựng */}
      <path d="M350 96 l20 -60 l26 50 l30 -70 l26 66 l34 -54 l14 62" fill="none" strokeWidth={14} />
      {/* quầng thâm */}
      <path d="M220 420 Q300 500 380 420" fill="none" stroke="#7C3AED" strokeWidth={22} opacity={0.55} />
      <path d="M520 420 Q600 500 680 420" fill="none" stroke="#7C3AED" strokeWidth={22} opacity={0.55} />
      {/* mắt trợn đỏ gân */}
      <circle cx={300} cy={340} r={92} fill="#fff" strokeWidth={13} />
      <circle cx={600} cy={340} r={92} fill="#fff" strokeWidth={13} />
      <g stroke="#EF4444" strokeWidth={6} fill="none">
        <path d="M216 330 l34 6 l14 -16 M226 390 l40 -14 M384 318 l-36 10 l-10 -18 M378 384 l-34 -10" />
        <path d="M516 330 l34 6 l14 -16 M526 390 l40 -14 M684 318 l-36 10 l-10 -18 M678 384 l-34 -10" />
      </g>
      <circle cx={300} cy={352} r={18} fill={INK} stroke="none" />
      <circle cx={600} cy={352} r={18} fill={INK} stroke="none" />
      {/* lông mày méo */}
      <path d="M210 214 Q270 188 350 226" fill="none" strokeWidth={16} />
      <path d="M690 214 Q630 188 550 226" fill="none" strokeWidth={16} />
      {/* miệng méo run */}
      <path d="M380 560 q18 -26 36 0 t36 0 t36 0 t36 0" fill="none" strokeWidth={13} />
      {/* mồ hôi */}
      <path d="M760 250 q30 50 0 76 q-30 -26 0 -76" fill="#8EC5FF" strokeWidth={9} />
      {/* điện thoại trong hai tay */}
      <rect x={330} y={600} width={240} height={250} rx={34} fill="#2B2B33" strokeWidth={13} />
      <rect x={352} y={624} width={196} height={200} rx={16} fill="#9FD3FF" strokeWidth={0} />
      <path d="M380 660 L520 660 M380 700 L490 700 M380 740 L510 740" stroke="#fff" strokeWidth={14} />
      {/* ngón cái liền tay */}
      <path d="M300 720 C330 690 380 690 392 720 C380 742 330 748 300 740 Z" fill="#EEF2FF" strokeWidth={11} />
      <path d="M600 720 C570 690 520 690 508 720 C520 742 570 748 600 740 Z" fill="#EEF2FF" strokeWidth={11} />
    </g>
  </svg>
);

// Diêm Vương tập 2: cận mặt trợn mắt, gân giận.
const DvTronMat: React.FC = () => (
  <svg viewBox="0 0 900 900" width="100%" height="100%" style={{ overflow: "visible" }}>
    <defs><Wobble id="w-c2" frame={0} scale={6} /></defs>
    <g filter="url(#w-c2)" stroke={INK} strokeLinejoin="round" strokeLinecap="round">
      {/* áo bào */}
      <path d="M90 900 C110 760 240 720 450 720 C660 720 790 760 810 900 Z" fill="#B91C1C" strokeWidth={14} />
      <path d="M390 724 L450 830 L510 724" fill={YEL} strokeWidth={11} />
      {/* đầu liền cổ */}
      <path d="M450 150 C640 150 720 290 716 440 C712 580 660 680 590 720 L310 720 C240 680 188 580 184 440 C180 290 260 150 450 150 Z" fill="#E0574F" strokeWidth={14} />
      {/* râu */}
      <path d="M250 560 Q450 800 650 560 Q620 790 450 880 Q280 790 250 560 Z" fill="#1a1a1a" strokeWidth={11} />
      {/* mũ cánh chuồn */}
      <rect x={250} y={70} width={400} height={150} rx={34} fill="#1a1a1a" strokeWidth={11} />
      <path d="M250 130 L40 96 L40 176 L250 182 Z" fill="#1a1a1a" strokeWidth={11} />
      <path d="M650 130 L860 96 L860 176 L650 182 Z" fill="#1a1a1a" strokeWidth={11} />
      <rect x={410} y={88} width={80} height={56} rx={12} fill={YEL} strokeWidth={9} />
      {/* lông mày dựng đứng */}
      <path d="M250 270 L410 340" strokeWidth={30} />
      <path d="M650 270 L490 340" strokeWidth={30} />
      {/* mắt trợn */}
      <circle cx={345} cy={410} r={66} fill="#fff" strokeWidth={13} />
      <circle cx={555} cy={410} r={66} fill="#fff" strokeWidth={13} />
      <circle cx={352} cy={418} r={15} fill={INK} stroke="none" />
      <circle cx={548} cy={418} r={15} fill={INK} stroke="none" />
      {/* miệng quát */}
      <path d="M360 540 Q450 500 540 540 Q560 640 450 660 Q340 640 360 540 Z" fill={INK} strokeWidth={11} />
      <path d="M378 544 Q450 520 522 544 L516 566 Q450 548 384 566 Z" fill="#fff" strokeWidth={6} />
      <path d="M400 630 Q450 600 500 630 Q470 650 450 650 Q430 650 400 630 Z" fill="#F87171" strokeWidth={0} />
      {/* gân giận */}
      <g stroke="#7F1D1D" strokeWidth={12} fill="none">
        <path d="M640 220 q-14 30 -40 34 M676 252 q-30 10 -36 40 M610 286 q30 -4 40 18" />
      </g>
      {/* vạch rung */}
      <path d="M760 330 l70 -40 M774 420 l84 0 M760 510 l70 40" strokeWidth={14} />
      <path d="M140 330 l-70 -40 M126 420 l-84 0 M140 510 l-70 40" strokeWidth={14} />
    </g>
  </svg>
);

// ---------- Nhãn dán đạo cụ ----------
const ClockSticker: React.FC = () => (
  <div style={{ transform: "rotate(8deg)", background: "#0F172A", border: `9px solid ${INK}`, borderRadius: 28,
    padding: "10px 26px 14px", boxShadow: `8px 10px 0 ${INK}`, textAlign: "center" }}>
    <div style={{ fontFamily: F, fontWeight: 900, fontSize: 92, color: "#7DD3FC", letterSpacing: 2, lineHeight: 1 }}>03:47</div>
    <div style={{ fontFamily: F, fontWeight: 700, fontSize: 30, color: "#CBD5E1", marginTop: 4 }}>"thêm 1 clip nữa"</div>
  </div>
);
const SeenSticker: React.FC = () => (
  <div style={{ transform: "rotate(7deg)", background: "#fff", border: `9px solid ${INK}`, borderRadius: "34px 34px 34px 6px",
    padding: "14px 28px 16px", boxShadow: `8px 10px 0 ${INK}` }}>
    <div style={{ fontFamily: F, fontWeight: 900, fontSize: 58, color: INK, lineHeight: 1 }}>Đã xem ✓✓</div>
    <div style={{ fontFamily: F, fontWeight: 700, fontSize: 30, color: "#64748B", marginTop: 6 }}>4 ngày trước</div>
  </div>
);

// Con dấu tội danh (running gag)
const Stamp: React.FC = () => (
  <svg width={300} height={300} viewBox="0 0 300 300" style={{ transform: "rotate(-16deg)" }}>
    <defs><Wobble id="w-st" frame={3} scale={2.5} /></defs>
    <g filter="url(#w-st)" fill="none" stroke={RED} strokeWidth={12} opacity={0.92}>
      <circle cx={150} cy={150} r={130} />
      <circle cx={150} cy={150} r={104} strokeWidth={5} />
      <text x={150} y={142} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={66} fill={RED} stroke="none">CÓ</text>
      <text x={150} y={206} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={66} fill={RED} stroke="none">TỘI</text>
    </g>
  </svg>
);

export const Cover: React.FC<CoverProps> = ({ ep, crime, face }) => {
  const big = crime.join(" ").length > 11 ? 150 : 176;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Bg />
      {/* nhãn kênh (ngoài vùng an toàn, cắt mất cũng không sao) */}
      <div style={{ position: "absolute", top: 250, left: 0, right: 0, textAlign: "center", fontFamily: F, fontWeight: 900,
        fontSize: 44, letterSpacing: 6, color: YEL }}>PHIÊN TÒA ÂM PHỦ</div>

      {/* tiêu đề: thẻ TỘI + tên tội */}
      <div style={{ position: "absolute", top: 400, left: 40, right: 40, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 22, transform: "rotate(-3deg)" }}>
          <div style={{ fontFamily: F, fontWeight: 900, fontSize: 78, color: "#fff", background: RED, border: `9px solid ${INK}`,
            borderRadius: 22, padding: "2px 30px 10px", boxShadow: `9px 10px 0 ${INK}` }}>TỘI:</div>
          <div style={{ fontFamily: F, fontWeight: 900, fontSize: 52, color: INK, background: YEL, border: `8px solid ${INK}`,
            borderRadius: 18, padding: "4px 20px 8px", boxShadow: `7px 8px 0 ${INK}` }}>VỤ #{String(ep).padStart(2, "0")}</div>
        </div>
        <div style={{ marginTop: 18, transform: "rotate(-3deg)", textAlign: "center" }}>
          {crime.map((l, i) => (
            <div key={i} style={{ fontFamily: F, fontWeight: 900, fontSize: big, lineHeight: 1.02, color: i === crime.length - 1 ? YEL : "#fff",
              WebkitTextStroke: `22px ${INK}`, paintOrder: "stroke fill", textShadow: `10px 12px 0 ${INK}`, letterSpacing: -2 }}>{l}</div>
          ))}
        </div>
      </div>

      {/* gương mặt */}
      <div style={{ position: "absolute", left: face === "hon-thuc-khuya" ? 140 : 110, top: face === "hon-thuc-khuya" ? 910 : 820, width: face === "hon-thuc-khuya" ? 800 : 860, height: 860 }}>
        {face === "hon-thuc-khuya" ? <HonThucKhuya /> : <DvTronMat />}
      </div>
      {/* đạo cụ dán góc phải trên gương mặt */}
      <div style={{ position: "absolute", right: 30, top: face === "dv-tron-mat" ? 1300 : 1000 }}>
        {face === "hon-thuc-khuya" ? <ClockSticker /> : <SeenSticker />}
      </div>
      {/* con dấu góc trái dưới */}
      <div style={{ position: "absolute", left: 10, top: 1210 }}><Stamp /></div>
    </AbsoluteFill>
  );
};
