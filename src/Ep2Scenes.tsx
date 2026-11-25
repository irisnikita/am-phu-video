import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { INK, Wobble, Hon, MeoSo, DiemVuong } from "./Cast";
import { Frame, Flames, CourtBg } from "./Scenes";

// Cảnh riêng của tập 2 "Seen không rep".
// Mỗi cảnh nhận frame (tính từ đầu cảnh), p (tiến độ 0..1) và talk (biên độ giọng).
const F = "'Be Vietnam Pro'";
const HAND = "'Patrick Hand'";
const GHOST = "#EEF2FF";
const cl = (v: number) => Math.max(0, Math.min(1, v));
const ease = (v: number) => 1 - Math.pow(1 - cl(v), 3);
const pad = (n: number) => String(n).padStart(2, "0");
const hhmm = (min: number) => { const m = ((Math.floor(min) % 1440) + 1440) % 1440; return `${pad(Math.floor(m / 60))}:${pad(m % 60)}`; };
export type SP = { frame: number; p: number; talk: number };

// ---------- Bị cáo có phụ kiện riêng ----------
export type Who = "sv" | "ny" | "con" | "tu" | "tuold";
export const HonX: React.FC<{ frame: number; talk: number; uid: string; mood: "scared" | "happy" | "tired"; who?: Who; phone?: boolean }> =
  ({ frame, talk, uid, mood, who, phone }) => {
    const float = Math.sin(frame / 12) * 8;
    const tremble = mood === "scared" ? Math.sin(frame * 1.7) * 1.5 : 0;
    return (
      <div style={{ position: "relative", width: "100%", height: "100%" }}>
        <Hon frame={frame} talk={talk} uid={uid} mood={mood} phone={phone} />
        <svg viewBox="60 400 160 220" width="100%" height="100%" style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          <g transform={`translate(${tremble} ${float})`} stroke={INK} strokeLinejoin="round" strokeLinecap="round">
            {who === "sv" && <>
              {/* tóc rối + quai balo */}
              <path d="M112 418 l8 -22 l8 18 l10 -24 l8 22 l12 -18 l4 24" fill="none" strokeWidth={6} />
              <path d="M98 470 L104 560 M182 470 L176 560" stroke="#F59E0B" strokeWidth={10} />
              <path d="M98 470 L104 560 M182 470 L176 560" stroke={INK} strokeWidth={3} fill="none" />
            </>}
            {who === "ny" && <>
              {/* sơ mi hoa + tóc vuốt */}
              <path d="M104 420 Q140 380 180 424 Q150 408 120 426 Z" fill="#3F2A1D" strokeWidth={5} />
              {[[112, 530], [150, 548], [168, 520], [128, 566], [176, 566]].map(([x, y], i) =>
                <circle key={i} cx={x} cy={y} r={7} fill={i % 2 ? "#F472B6" : "#FDE047"} strokeWidth={3} />)}
            </>}
            {who === "con" && <>
              {/* mũ hoodie + tai nghe */}
              <path d="M84 480 C80 400 200 400 196 480 C192 440 88 440 84 480 Z" fill="#64748B" strokeWidth={6} />
              <path d="M96 462 C96 410 184 410 184 462" fill="none" stroke="#111827" strokeWidth={8} />
              <rect x={84} y={452} width={18} height={30} rx={8} fill="#111827" strokeWidth={4} />
              <rect x={178} y={452} width={18} height={30} rx={8} fill="#111827" strokeWidth={4} />
            </>}
            {(who === "tu" || who === "tuold") && <>
              {/* chú Tư: ria mép, tóc (đen khi trẻ, bạc khi già) */}
              <path d="M104 428 Q140 396 178 428 Q140 414 104 428 Z" fill={who === "tu" ? "#1F2937" : "#E5E7EB"} strokeWidth={5} />
              <path d="M124 492 q16 -10 32 0" fill="none" stroke={who === "tu" ? "#1F2937" : "#D1D5DB"} strokeWidth={8} />
            </>}
          </g>
        </svg>
      </div>
    );
  };

// ---------- Khung điện thoại dùng chung ----------
const SX = 262, SY = 130, SW = 456, SH = 840;
const PhoneShell: React.FC<{ frame: number; uid: string; shake?: number; children: React.ReactNode; title: string; time: string; glow?: string }> =
  ({ frame, uid, shake = 0, children, title, time, glow = "#60A5FA" }) => (
    <svg width={980} height={1120} viewBox="0 0 980 1120" style={{ position: "absolute", inset: 0 }}>
      <defs>
        <Wobble id={`w-${uid}`} frame={frame} scale={2.5} />
        <radialGradient id={`g-${uid}`} cx="50%" cy="45%" r="60%">
          <stop offset="0%" stopColor={glow} stopOpacity={0.5} />
          <stop offset="100%" stopColor="#0B1026" stopOpacity={0} />
        </radialGradient>
        <clipPath id={`c-${uid}`}><rect x={SX} y={SY} width={SW} height={SH} rx={26} /></clipPath>
      </defs>
      <rect width={980} height={1120} fill={`url(#g-${uid})`} />
      <g transform={`translate(${shake} 0)`}>
        <g filter={`url(#w-${uid})`}>
          <rect x={232} y={70} width={516} height={960} rx={64} fill="#1F1F27" stroke={INK} strokeWidth={10} />
        </g>
        <g clipPath={`url(#c-${uid})`}>
          <rect x={SX} y={SY} width={SW} height={SH} fill="#F4F1EA" />
          {children}
          {/* thanh trạng thái + tiêu đề cuộc trò chuyện (giao diện tự vẽ, không logo ứng dụng nào) */}
          <rect x={SX} y={SY} width={SW} height={130} fill="#2E3A59" />
          <text x={SX + 24} y={SY + 38} fontFamily={F} fontWeight={900} fontSize={26} fill="#fff">{time}</text>
          <circle cx={SX + 52} cy={SY + 88} r={24} fill="#FDE68A" stroke={INK} strokeWidth={3} />
          <text x={SX + 90} y={SY + 98} fontFamily={F} fontWeight={900} fontSize={28} fill="#fff">{title}</text>
        </g>
        <rect x={430} y={92} width={120} height={22} rx={11} fill={INK} />
      </g>
    </svg>
  );

// Bong bóng chat
const Bubble: React.FC<{ x: number; y: number; w: number; text: string[]; me?: boolean; o?: number; s?: number; fill?: string }> =
  ({ x, y, w, text, me, o = 1, s = 1, fill }) => {
    const h = 26 + text.length * 40;
    return (
      <g opacity={o} transform={`translate(${x} ${y}) scale(${s})`}>
        <rect width={w} height={h} rx={22} fill={fill ?? (me ? "#BFDBFE" : "#fff")} stroke={INK} strokeWidth={4} />
        {text.map((t, i) => (
          <text key={i} x={20} y={46 + i * 40} fontFamily={F} fontWeight={700} fontSize={28} fill={INK}>{t}</text>
        ))}
      </g>
    );
  };

// Ngón cái ma lướt qua màn hình
const Thumb: React.FC<{ tx: number; ty: number }> = ({ tx, ty }) => (
  <g>
    <g stroke={INK} strokeWidth={18} fill={INK}>
      <ellipse cx={tx} cy={ty} rx={52} ry={78} transform={`rotate(-18 ${tx} ${ty})`} />
      <path d={`M${tx - 40} ${ty + 20} Q${tx + 40} ${ty + 260} ${tx + 360} ${ty + 340} L980 1120 L${tx + 100} 1120 Z`} />
    </g>
    <g fill={GHOST}>
      <ellipse cx={tx} cy={ty} rx={52} ry={78} transform={`rotate(-18 ${tx} ${ty})`} />
      <path d={`M${tx - 40} ${ty + 20} Q${tx + 40} ${ty + 260} ${tx + 360} ${ty + 340} L980 1120 L${tx + 100} 1120 Z`} />
    </g>
  </g>
);

const Counter: React.FC<{ text: string; frame: number; color?: string; y?: number }> = ({ text, frame, color = "#FDE047", y = 1050 }) => (
  <text x={490} y={y} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={52} fill={color}
    stroke={INK} strokeWidth={12} paintOrder="stroke fill" transform={`rotate(${Math.sin(frame / 9) * 2} 490 ${y})`}>{text}</text>
);

// ---------- C2: Mèo mở sổ, ba hồ sơ bay ra ----------
export const Dossier: React.FC<SP> = ({ frame, p, talk }) => {
  const files: { who: Who; label: string; c: string }[] = [
    { who: "sv", label: "SINH VIÊN", c: "#FDE68A" },
    { who: "ny", label: "NGƯỜI YÊU", c: "#FBCFE8" },
    { who: "con", label: "CON TRAI", c: "#BAE6FD" },
  ];
  const days = Math.round(96 * ease(p / 0.8));
  return (
    <Frame label="HỒ SƠ VỤ 002" color="#3B1B2B" frame={frame}>
      {files.map((f, i) => {
        const k = ease((frame - 4 - i * 6) / 14);
        const x = interpolate(k, [0, 1], [400, 60 + i * 300]);
        const rot = interpolate(k, [0, 1], [0, (i - 1) * 8]);
        return (
          <div key={i} style={{ position: "absolute", left: x, top: 140 + Math.abs(i - 1) * 40, width: 260, height: 360,
            background: f.c, border: `7px solid ${INK}`, borderRadius: 18, transform: `rotate(${rot}deg)`, opacity: k }}>
            <div style={{ position: "absolute", left: 40, top: 20, width: 180, height: 230 }}>
              <HonX frame={frame} talk={0} uid={`dos${i}`} mood="scared" who={f.who} />
            </div>
            <div style={{ position: "absolute", bottom: 18, left: 0, right: 0, textAlign: "center", fontFamily: F, fontWeight: 900, fontSize: 30, color: INK }}>{f.label}</div>
            <div style={{ position: "absolute", top: 10, right: 10, fontFamily: F, fontWeight: 900, fontSize: 22, color: "#DC2626", border: "4px solid #DC2626", borderRadius: 8, padding: "0 6px", transform: "rotate(10deg)" }}>ĐÃ XEM</div>
          </div>
        );
      })}
      <div style={{ position: "absolute", left: 300, top: 600, width: 380, height: 466 }}>
        <MeoSo frame={frame} talk={talk} uid="meo-dos" />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 540, textAlign: "center", fontFamily: F, fontWeight: 900, fontSize: 46, color: "#FDE047", WebkitTextStroke: `10px ${INK}`, paintOrder: "stroke fill" }}>
        TỔNG: {Math.floor(days / 24)} NGÀY {days % 24} GIỜ CHƯA REP
      </div>
    </Frame>
  );
};

// ---------- C3: nhóm lớp, "Đã xem bởi 47" ----------
export const GroupChat: React.FC<SP> = ({ frame, p }) => {
  const n = Math.max(1, Math.round(47 * ease(p / 0.65)));
  const swipe = cl((p - 0.15) / 0.25);
  const ty = interpolate(swipe, [0, 0.5, 1], [1150, 640, 1150]);
  const avatars = Array.from({ length: Math.min(n, 12) });
  const done = p > 0.7;
  return (
    <Frame label="VẬT CHỨNG A · 23:47" color="#0B1026" frame={frame}>
      <PhoneShell frame={frame} uid="grp" title="Lớp K19 – Thuyết trình" time="23:47">
        <Bubble x={SX + 24} y={SY + 170} w={330} text={["Mai nộp slide rồi nha"]} />
        <Bubble x={SX + 24} y={SY + 290} w={400} text={["Ai làm slide phần 3", "vậy? 🙏"]} s={1 + 0.04 * Math.sin(frame / 5)} />
        <text x={SX + 30} y={SY + 470} fontFamily={F} fontWeight={700} fontSize={24} fill="#6B7280">Đã xem bởi {n} người</text>
        {avatars.map((_, i) => {
          const isMeo = i === 7;
          return (
            <g key={i} transform={`translate(${SX + 40 + i * 34} ${SY + 510})`}>
              <circle r={17} fill={isMeo ? "#2B2B33" : ["#FCA5A5", "#93C5FD", "#86EFAC", "#FDE68A"][i % 4]} stroke={INK} strokeWidth={3} />
              {isMeo && <path d="M-10 -10 l4 -10 l6 8 M10 -10 l-4 -10 l-6 8" fill="#2B2B33" stroke={INK} strokeWidth={2} />}
            </g>
          );
        })}
        {n > 12 && <text x={SX + 40 + 12 * 34} y={SY + 518} fontFamily={F} fontWeight={900} fontSize={22} fill={INK}>+{n - 12}</text>}
        <rect x={SX + 20} y={SY + SH - 90} width={SW - 40} height={64} rx={32} fill="#fff" stroke={INK} strokeWidth={4} />
        <text x={SX + 50} y={SY + SH - 48} fontFamily={F} fontSize={26} fill="#9CA3AF">Nhắn tin...</text>
      </PhoneShell>
      <svg width={980} height={1120} viewBox="0 0 980 1120" style={{ position: "absolute", inset: 0 }}>
        {swipe > 0 && swipe < 1 && <Thumb tx={600} ty={ty} />}
        <Counter text={`${n} NGƯỜI XEM`} frame={frame} y={1060} />
        {done && (
          <g transform={`translate(700 260) rotate(-12) scale(${interpolate(p, [0.7, 0.76], [2, 1], { extrapolateRight: "clamp" })})`}>
            <rect x={-130} y={-60} width={260} height={110} rx={16} fill="none" stroke="#DC2626" strokeWidth={10} />
            <text x={0} y={20} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={66} fill="#DC2626">0 REP</text>
          </g>
        )}
      </svg>
    </Frame>
  );
};

// ---------- C4b: 46 linh hồn ở hàng ghế dự thính cùng giơ tay ----------
export const Ghosts46: React.FC<SP> = ({ frame, p, talk }) => {
  const shown = Math.round(46 * ease(p / 0.5));
  const raise = p > 0.55;
  return (
    <AbsoluteFill>
      <CourtBg frame={frame} />
      <div style={{ position: "absolute", left: 340, top: 250, width: 400, height: 470 }}>
        <DiemVuong frame={frame} talk={talk} uid="dv-g46" mood="smug" />
      </div>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
        {Array.from({ length: 46 }).map((_, i) => {
          if (i >= shown) return null;
          const row = Math.floor(i / 8), col = i % 8;
          const x = 90 + col * 122 + (row % 2) * 40, y = 820 + row * 120;
          const bob = Math.sin(frame / 8 + i) * 4;
          const arm = raise ? -60 : 0;
          return (
            <g key={i} transform={`translate(${x} ${y + bob})`} stroke={INK} strokeWidth={5} strokeLinejoin="round">
              {raise && <path d={`M30 10 L40 ${arm}`} strokeWidth={14} strokeLinecap="round" />}
              {raise && <path d={`M30 10 L40 ${arm}`} stroke={GHOST} strokeWidth={6} strokeLinecap="round" />}
              <path d="M0 30 C0 -10 60 -10 60 30 L60 80 q-10 12 -20 0 q-10 12 -20 0 q-10 12 -20 0 Z" fill={GHOST} />
              <circle cx={20} cy={28} r={4} fill={INK} stroke="none" />
              <circle cx={40} cy={28} r={4} fill={INK} stroke="none" />
              <rect x={20} y={46} width={20} height={28} rx={4} fill="#2B2B33" strokeWidth={3} />
            </g>
          );
        })}
      </svg>
      <div style={{ position: "absolute", top: 760, left: 0, right: 0, textAlign: "center", fontFamily: F, fontWeight: 900, fontSize: 44, color: "#FDE047", WebkitTextStroke: `10px ${INK}`, paintOrder: "stroke fill" }}>
        46 NGƯỜI CŨNG TƯỞNG VẬY
      </div>
      <Flames frame={frame} y={1600} opacity={0.3} />
    </AbsoluteFill>
  );
};

// ---------- C5: hai chiếc váy, gõ rồi xóa, "ok." và mưa tin nhắn ----------
const DRAFTS = ["cái trái", "cái phải", "cái nào em mặc cũng đẹp", "em thích cái nào", "cái có nơ", "hai cái giống nhau mà"];
export const DressChat: React.FC<SP> = ({ frame, p }) => {
  const typingP = cl(p / 0.7);
  const edits = Math.min(14, Math.floor(typingP * 14.99));
  const d = DRAFTS[edits % DRAFTS.length];
  const k = (typingP * 14.99) % 1; // trong một lần gõ: gõ ra rồi xóa
  const shownChars = Math.round(d.length * (k < 0.6 ? k / 0.6 : 1 - (k - 0.6) / 0.4));
  const sent = p >= 0.72;
  const flood = cl((p - 0.78) / 0.2);
  const time = hhmm(20 * 60 + 3 + typingP * 188);
  const shake = flood > 0 ? Math.sin(frame * 2.4) * 10 * flood : 0;
  const Dress: React.FC<{ x: number; bow: boolean }> = ({ x, bow }) => (
    <g transform={`translate(${x} ${SY + 190})`} stroke={INK} strokeWidth={4} strokeLinejoin="round">
      <rect width={170} height={220} rx={14} fill="#fff" />
      <path d="M60 30 L110 30 L120 80 L150 200 L20 200 L50 80 Z" fill="#60A5FA" />
      {bow && <path d="M72 82 l-18 -10 l0 20 Z M98 82 l18 -10 l0 20 Z" fill="#F472B6" />}
    </g>
  );
  return (
    <Frame label={`VẬT CHỨNG B · ${time}`} color="#1A1030" frame={frame}>
      <PhoneShell frame={frame} uid="dress" title="Bé Na ♥" time={time} shake={shake} glow="#F472B6">
        <Dress x={SX + 30} bow={false} />
        <Dress x={SX + 220} bow={true} />
        <Bubble x={SX + 30} y={SY + 430} w={390} text={["Anh thấy cái nào", "đẹp hơn?"]} />
        {!sent && typingP > 0 && (
          <g>
            <circle cx={SX + 50} cy={SY + 590} r={9} fill="#9CA3AF" opacity={0.4 + 0.6 * ((frame % 12) / 12)} />
            <circle cx={SX + 75} cy={SY + 590} r={9} fill="#9CA3AF" opacity={0.4 + 0.6 * (((frame + 4) % 12) / 12)} />
            <circle cx={SX + 100} cy={SY + 590} r={9} fill="#9CA3AF" opacity={0.4 + 0.6 * (((frame + 8) % 12) / 12)} />
          </g>
        )}
        {sent && <Bubble x={SX + SW - 140} y={SY + 560} w={110} text={["ok."]} me />}
        {sent && Array.from({ length: 17 }).map((_, i) => {
          const fi = cl(flood * 17 - i);
          if (fi <= 0) return null;
          return <Bubble key={i} x={SX + 20 + (i % 3) * 18} y={SY + 660 + i * 22 - flood * 120} w={330}
            text={[i % 4 === 3 ? "ANH ƠI???" : "ok là sao???"]} s={0.8 + 0.2 * fi} o={fi} fill="#FECACA" />;
        })}
        <rect x={SX + 20} y={SY + SH - 90} width={SW - 40} height={64} rx={32} fill="#fff" stroke={INK} strokeWidth={4} />
        <text x={SX + 50} y={SY + SH - 48} fontFamily={F} fontSize={26} fill={INK}>{sent ? "" : d.slice(0, shownChars) + (frame % 16 < 8 ? "|" : "")}</text>
      </PhoneShell>
      <svg width={980} height={1120} viewBox="0 0 980 1120" style={{ position: "absolute", inset: 0 }}>
        <Counter text={`GÕ-XÓA: ${edits} LẦN`} frame={frame} y={1060} />
      </svg>
    </Frame>
  );
};

// ---------- C7: tin của mẹ qua ba ngày ----------
export const MomChat: React.FC<SP> = ({ frame, p }) => {
  const day = p < 0.33 ? 1 : p < 0.6 ? 2 : 3;
  const calls = p > 0.7 ? Math.min(6, Math.floor((p - 0.7) / 0.02) + 1) : 0;
  const swipe = cl((p - 0.82) / 0.1); // vuốt tắt xong trước cuối cảnh để câu "con còn sống không con?" lộ rõ
  return (
    <Frame label={`VẬT CHỨNG C · NGÀY ${day}`} color="#2A1A0E" frame={frame}>
      <PhoneShell frame={frame} uid="mom" title="Mẹ" time={day === 1 ? "11:30" : day === 2 ? "19:02" : "21:40"} glow="#FDBA74">
        <text x={SX + SW / 2} y={SY + 175} textAnchor="middle" fontFamily={F} fontWeight={700} fontSize={22} fill="#6B7280">NGÀY 1</text>
        <Bubble x={SX + 24} y={SY + 195} w={330} text={["Con ăn cơm chưa?"]} />
        <g transform={`translate(${SX + 24} ${SY + 280})`} stroke={INK} strokeWidth={4}>
          <rect width={240} height={150} rx={18} fill="#FDF2F8" />
          {[0, 1, 2, 3, 4].map((i) => <ellipse key={i} cx={120 + Math.cos(i * 1.26) * 30} cy={62 + Math.sin(i * 1.26) * 22} rx={26} ry={14} fill="#F9A8D4" transform={`rotate(${i * 72} ${120 + Math.cos(i * 1.26) * 30} ${62 + Math.sin(i * 1.26) * 22})`} />)}
          <circle cx={120} cy={62} r={12} fill="#FDE047" />
          <text x={120} y={128} textAnchor="middle" fontFamily={HAND} fontSize={22} fill={INK} stroke="none">Chúc con ngày mới an lành</text>
        </g>
        <text x={SX + SW - 30} y={SY + 460} textAnchor="end" fontFamily={F} fontWeight={700} fontSize={22} fill="#6B7280">Đã xem ✓✓</text>
        {day >= 2 && <>
          <text x={SX + SW / 2} y={SY + 505} textAnchor="middle" fontFamily={F} fontWeight={700} fontSize={22} fill="#6B7280">NGÀY 2</text>
          <Bubble x={SX + 24} y={SY + 520} w={260} text={["Con bận hả"]} />
        </>}
        {day >= 3 && <>
          <text x={SX + SW / 2} y={SY + 625} textAnchor="middle" fontFamily={F} fontWeight={700} fontSize={22} fill="#6B7280">NGÀY 3</text>
          <Bubble x={SX + 24} y={SY + 640} w={390} text={["Con còn sống không", "con?"]} s={1 + 0.03 * Math.sin(frame / 4)} />
        </>}
        {Array.from({ length: calls }).map((_, i) => (
          <g key={i} transform={`translate(${SX + 30 + swipe * 500} ${SY + 140 + i * 14})`} opacity={1 - swipe}>
            <rect width={SW - 60} height={90} rx={20} fill="#FEE2E2" stroke={INK} strokeWidth={4} />
            <text x={24} y={56} fontFamily={F} fontWeight={900} fontSize={28} fill="#B91C1C">Mẹ · {i + 1} cuộc gọi nhỡ</text>
          </g>
        ))}
      </PhoneShell>
      <svg width={980} height={1120} viewBox="0 0 980 1120" style={{ position: "absolute", inset: 0 }}>
        {swipe > 0 && swipe < 1 && <Thumb tx={420 + swipe * 260} ty={330} />}
        {calls > 0 && <Counter text={`${calls} CUỘC GỌI NHỠ`} frame={frame} y={1060} color="#FCA5A5" />}
      </svg>
    </Frame>
  );
};

// ---------- C8: cậu con trong phòng trọ, gõ "Con ổn mẹ ơi" rồi xóa ----------
export const SonRoom: React.FC<SP> = ({ frame, p, talk }) => {
  const msg = "Con ổn mẹ ơi";
  const k = cl(p / 0.85);
  const n = Math.round(msg.length * (k < 0.55 ? k / 0.55 : 1 - (k - 0.55) / 0.45));
  return (
    <Frame label="PHÒNG TRỌ · 1:12 SÁNG" color="#0F172A" frame={frame}>
      <svg width={980} height={1120} viewBox="0 0 980 1120" style={{ position: "absolute", inset: 0 }}>
        <defs><Wobble id="w-son" frame={frame} scale={3} /></defs>
        <g filter="url(#w-son)" stroke={INK} strokeWidth={7} strokeLinejoin="round">
          <rect x={620} y={120} width={260} height={220} rx={10} fill="#1E293B" />
          <path d="M750 120 L750 340 M620 230 L880 230" />
          <circle cx={820} cy={170} r={20} fill="#FDE68A" opacity={0.7} />
          <rect x={60} y={760} width={860} height={160} rx={20} fill="#334155" />
          <rect x={60} y={720} width={300} height={80} rx={30} fill="#CBD5E1" />
          {/* mì gói, hóa đơn */}
          <rect x={700} y={680} width={140} height={90} rx={12} fill="#FCD34D" />
          <text x={770} y={736} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={24} fill={INK} stroke="none">MÌ GÓI</text>
          <rect x={560} y={700} width={110} height={70} fill="#F8FAFC" transform="rotate(-8 615 735)" />
          <text x={615} y={745} textAnchor="middle" fontFamily={HAND} fontSize={22} fill="#DC2626" stroke="none" transform="rotate(-8 615 735)">tiền trọ</text>
        </g>
        <ellipse cx={420} cy={560} rx={230} ry={200} fill="rgba(147,197,253,0.18)" />
        <g transform="translate(380 600)">
          <rect x={-90} y={-60} width={240} height={100} rx={22} fill="#fff" stroke={INK} strokeWidth={5} />
          <text x={-66} y={6} fontFamily={F} fontWeight={700} fontSize={34} fill={INK}>{msg.slice(0, n)}{frame % 16 < 8 ? "|" : ""}</text>
        </g>
      </svg>
      <div style={{ position: "absolute", left: 230, top: 380, width: 320, height: 440 }}>
        <HonX frame={frame} talk={talk} uid="hon-son" mood="tired" who="con" phone />
      </div>
    </Frame>
  );
};

// ---------- C8b: bếp nhà mẹ, cơm để phần, điện thoại sáng rồi tắt ----------
export const Kitchen: React.FC<SP> = ({ frame, p }) => {
  const lit = (frame % 90) < 45;
  const tick = Math.floor(frame / 15) % 2;
  return (
    <Frame label="NHÀ MẸ · 21:40" color="#3A2412" frame={frame}>
      <svg width={980} height={1120} viewBox="0 0 980 1120" style={{ position: "absolute", inset: 0 }}>
        <defs><Wobble id="w-kit" frame={frame} scale={3} /></defs>
        <ellipse cx={490} cy={260} rx={300} ry={160} fill="rgba(253,186,116,0.25)" />
        <g filter="url(#w-kit)" stroke={INK} strokeWidth={7} strokeLinejoin="round">
          <path d="M490 60 L490 150" />
          <path d="M420 150 L560 150 L520 200 L460 200 Z" fill="#F59E0B" />
          {/* đồng hồ treo tường */}
          <circle cx={800} cy={250} r={70} fill="#FEF3C7" />
          <path d={`M800 250 L800 200 M800 250 L${800 + (tick ? 38 : 34)} ${tick ? 262 : 270}`} strokeWidth={6} />
          {/* bàn ăn */}
          <rect x={80} y={700} width={820} height={60} rx={14} fill="#92400E" />
          <path d="M140 760 L140 1000 M840 760 L840 1000" strokeWidth={14} />
          {/* lồng bàn che cơm */}
          <path d="M240 700 C240 560 460 560 460 700 Z" fill="#FDE68A" />
          <path d="M270 690 C280 610 420 610 430 690 M350 570 L350 690" strokeWidth={4} />
          <circle cx={350} cy={560} r={14} fill="#B45309" />
          {/* điện thoại úp sẵn trên bàn */}
          <rect x={560} y={660} width={150} height={40} rx={10} fill="#1F2937" />
          <rect x={568} y={666} width={134} height={28} rx={6} fill={lit ? "#BAE6FD" : "#111827"} />
          {/* mẹ ngồi quay lưng */}
          <path d="M600 700 C600 560 780 560 780 700 Z" fill="#7C2D12" />
          <circle cx={690} cy={520} r={62} fill="#FCD9B6" />
          <path d="M630 500 Q690 430 750 500 Q720 470 690 472 Q660 470 630 500 Z" fill="#374151" />
          <circle cx={690} cy={458} r={26} fill="#374151" />
        </g>
        {lit && <ellipse cx={635} cy={640} rx={80} ry={40} fill="rgba(186,230,253,0.3)" />}
        <text x={160} y={1060} fontFamily={HAND} fontSize={46} fill="#FDE68A" transform="rotate(-3 160 1060)">cơm vẫn để phần...</text>
      </svg>
    </Frame>
  );
};

// ---------- C9: hồ sơ cũ của chú Tư (nâu cũ), lịch rơi, nháp dài ra ----------
const YEARS = [2006, 2008, 2010, 2013, 2016, 2019, 2022, 2026];
export const TuStory: React.FC<SP> = ({ frame, p, talk }) => {
  const yi = Math.min(YEARS.length - 1, Math.floor(ease(cl((p - 0.25) / 0.7)) * YEARS.length));
  const year = YEARS[yi];
  const old = yi >= 4;
  const draftLines = 2 + yi * 2;
  return (
    <Frame label={`HỒ SƠ CŨ · NĂM ${year}`} color="#C8A97E" frame={frame}>
      <svg width={980} height={1120} viewBox="0 0 980 1120" style={{ position: "absolute", inset: 0 }}>
        <defs><Wobble id="w-tu" frame={frame} scale={3} /></defs>
        <g filter="url(#w-tu)" stroke="#3B2A1A" strokeWidth={6} strokeLinejoin="round">
          {/* lịch treo tường */}
          <rect x={90} y={110} width={260} height={230} rx={14} fill="#F5E6C8" />
          <rect x={90} y={110} width={260} height={64} rx={14} fill="#B45309" />
          <text x={220} y={290} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={84} fill="#3B2A1A" stroke="none">{year}</text>
          {/* tờ lịch rơi */}
          <rect x={140 + (frame % 20) * 6} y={360 + (frame % 20) * 14} width={120} height={100} fill="#F5E6C8" opacity={1 - (frame % 20) / 20} transform={`rotate(${(frame % 20) * 9} 200 410)`} />
          {/* điện thoại cũ với bản nháp */}
          <rect x={530} y={120} width={360} height={620} rx={40} fill="#5B4636" />
          <rect x={555} y={170} width={310} height={520} rx={14} fill="#F5E6C8" />
        </g>
        <g fontFamily={F}>
          <rect x={570} y={190} width={280} height={80} rx={16} fill="#fff" stroke="#3B2A1A" strokeWidth={3} />
          <text x={586} y={222} fontSize={22} fontWeight={700} fill="#3B2A1A">Mày còn giận tao</text>
          <text x={586} y={252} fontSize={22} fontWeight={700} fill="#3B2A1A">hả?</text>
          <text x={575} y={300} fontSize={20} fontWeight={900} fill="#B45309">BẢN NHÁP ({draftLines * 12} dòng)</text>
          {Array.from({ length: Math.min(12, draftLines) }).map((_, i) => (
            <rect key={i} x={575} y={316 + i * 26} width={250 - (i % 3) * 40} height={12} rx={6} fill="#A8916E" />
          ))}
          <rect x={600} y={630} width={220} height={46} rx={23} fill="#B45309" />
          <text x={710} y={662} textAnchor="middle" fontSize={24} fontWeight={900} fill="#fff">LƯU NHÁP</text>
        </g>
      </svg>
      <div style={{ position: "absolute", left: 120, top: 480, width: 340, height: 470, filter: "sepia(0.7)" }}>
        <HonX frame={frame} talk={0} uid="tu" mood="tired" who={old ? "tuold" : "tu"} phone />
      </div>
      <div style={{ position: "absolute", bottom: 40, left: 0, right: 0, textAlign: "center", fontFamily: F, fontWeight: 900, fontSize: 48, color: "#3B2A1A" }}>
        {yi === 0 ? "1 NĂM" : year - 2006 >= 20 ? "20 NĂM LƯU NHÁP" : `${year - 2006} NĂM`}
      </div>
    </Frame>
  );
};

// ---------- C9b: bấm gửi... số không còn liên lạc → chú Tư ở Âm Phủ ----------
export const TuFail: React.FC<SP> = ({ frame, p }) => {
  const press = p > 0.15;
  const fail = p > 0.35;
  const afterlife = p > 0.7;
  if (afterlife) {
    return (
      <AbsoluteFill>
        <CourtBg frame={frame} />
        <div style={{ position: "absolute", left: 360, top: 900, width: 360, height: 495 }}>
          <HonX frame={frame} talk={0} uid="tu-old" mood="tired" who="tuold" phone />
        </div>
        <div style={{ position: "absolute", top: 760, left: 0, right: 0, textAlign: "center", fontFamily: F, fontWeight: 900, fontSize: 42, color: "#E5E7EB" }}>
          HÀNG GHẾ DỰ THÍNH · CHÚ TƯ
        </div>
      </AbsoluteFill>
    );
  }
  return (
    <Frame label="NĂM 2026" color="#C8A97E" frame={frame}>
      <svg width={980} height={1120} viewBox="0 0 980 1120" style={{ position: "absolute", inset: 0 }}>
        <rect x={300} y={120} width={380} height={720} rx={44} fill="#5B4636" stroke="#3B2A1A" strokeWidth={8} />
        <rect x={325} y={170} width={330} height={620} rx={14} fill="#F5E6C8" />
        <rect x={345} y={200} width={290} height={300} rx={16} fill="#DBEAFE" stroke="#3B2A1A" strokeWidth={3} />
        {Array.from({ length: 9 }).map((_, i) => <rect key={i} x={360} y={220 + i * 30} width={250 - (i % 3) * 40} height={12} rx={6} fill="#93C5FD" />)}
        <rect x={420} y={530} width={140} height={60} rx={30} fill={press ? "#1D4ED8" : "#3B82F6"} stroke="#3B2A1A" strokeWidth={4} transform={press && !fail ? "translate(0 4)" : ""} />
        <text x={490} y={570} textAnchor="middle" fontFamily={F} fontSize={28} fontWeight={900} fill="#fff">GỬI</text>
        {fail && <>
          <circle cx={620} cy={480} r={40} fill="#DC2626" stroke="#3B2A1A" strokeWidth={4} />
          <text x={620} y={498} textAnchor="middle" fontFamily={F} fontSize={52} fontWeight={900} fill="#fff">!</text>
          <rect x={340} y={620} width={300} height={140} rx={16} fill="#fff" stroke="#DC2626" strokeWidth={5} />
          <text x={490} y={668} textAnchor="middle" fontFamily={F} fontSize={26} fontWeight={900} fill="#DC2626">Không gửi được.</text>
          <text x={490} y={704} textAnchor="middle" fontFamily={F} fontSize={22} fontWeight={700} fill="#3B2A1A">Số này không còn</text>
          <text x={490} y={734} textAnchor="middle" fontFamily={F} fontSize={22} fontWeight={700} fill="#3B2A1A">liên lạc.</text>
        </>}
        {!press && <Thumb tx={520} ty={760} />}
      </svg>
    </Frame>
  );
};

// ---------- C9c: ba bị cáo tự cầm máy gửi; Diêm Vương đẩy hộp khăn giấy ----------
const SENDS = ["Con ăn rồi mẹ", "Cái nơ hồng, em mặc xinh", "Để mình làm phần 3"];
export const SendThree: React.FC<SP> = ({ frame, p, talk }) => {
  const who: Who[] = ["con", "ny", "sv"];
  const tissue = ease(cl((p - 0.55) / 0.35));
  return (
    <AbsoluteFill>
      <CourtBg frame={frame} />
      <div style={{ position: "absolute", left: 360, top: 260, width: 360, height: 420 }}>
        <DiemVuong frame={frame} talk={talk} uid="dv-send" mood="angry" />
      </div>
      {who.map((w, i) => {
        const k = ease(cl((p - i * 0.12) / 0.2));
        return (
          <React.Fragment key={i}>
            <div style={{ position: "absolute", left: 40 + i * 330, top: 1000, width: 280, height: 385 }}>
              <HonX frame={frame} talk={0} uid={`snd${i}`} mood={k > 0.9 ? "happy" : "tired"} who={w} phone />
            </div>
            <div style={{ position: "absolute", left: 20 + i * 330, top: 880 - i * 30, width: 320, transform: `scale(${k})`, opacity: k,
              fontFamily: F, fontWeight: 700, fontSize: 32, background: "#BFDBFE", border: `5px solid ${INK}`, borderRadius: 26, padding: "14px 20px", textAlign: "center" }}>
              {SENDS[i]} <span style={{ color: "#2563EB" }}>➤</span>
            </div>
          </React.Fragment>
        );
      })}
      {/* hộp khăn giấy trượt về phía hàng ghế của chú Tư */}
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
        <g transform={`translate(${620 + tissue * 300} ${720 + tissue * 40})`} stroke={INK} strokeWidth={6}>
          <rect width={130} height={80} rx={10} fill="#F9A8D4" />
          <path d="M40 0 Q65 -50 90 0" fill="#fff" />
        </g>
        <text x={860} y={700} fontFamily={HAND} fontSize={40} fill="#E5E7EB" textAnchor="middle" opacity={tissue}>→ chú Tư</text>
      </svg>
      <Flames frame={frame} y={1620} opacity={0.3} />
    </AbsoluteFill>
  );
};

// ---------- C10: cuộn phán quyết, 3 điều hiện theo lời đọc ----------
const RULES: [number, string, string][] = [
  [0.045, "1. Chưa rep được:", "gửi trước \"Đọc rồi, 21h trả lời\""],
  [0.33, "2. Tin cần nghĩ:", "bấm giữ → Đánh dấu chưa đọc"],
  [0.55, "3. 21h tối:", "10 phút rep hết tin tồn"],
  [0.735, "Tin của mẹ:", "chỉ cần \"Con ăn rồi\""],
];
export const Verdict2: React.FC<SP> = ({ frame, p, talk }) => {
  const open = ease(frame / 18);
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 30%, #4A1628 0%, #1A0A10 75%)" }}>
      <div style={{ position: "absolute", left: 380, top: 170, width: 320, height: 376 }}>
        <DiemVuong frame={frame} talk={talk} uid="dv-ver" mood="angry" />
      </div>
      <div style={{ position: "absolute", left: 70, right: 70, top: 560, height: 820 * open, overflow: "hidden",
        background: "#F3E9D2", border: `9px solid ${INK}`, borderRadius: 24, boxShadow: `12px 14px 0 ${INK}` }}>
        <div style={{ textAlign: "center", fontFamily: F, fontWeight: 900, fontSize: 58, color: "#B91C1C", marginTop: 26 }}>PHÁN QUYẾT</div>
        {RULES.map(([at, a, b], i) => {
          const k = ease(cl((p - at) / 0.08));
          return (
            <div key={i} style={{ margin: "26px 40px 0", opacity: k, transform: `translateX(${(1 - k) * -60}px)`, fontFamily: F }}>
              <div style={{ fontWeight: 900, fontSize: 44, color: i === 3 ? "#B45309" : INK }}>{a}</div>
              <div style={{ fontWeight: 700, fontSize: 40, color: INK, lineHeight: 1.25 }}>{b}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ---------- C10b: hình phạt "đang soạn tin..." hiện rồi tắt ----------
export const Punish: React.FC<SP> = ({ frame }) => {
  // Hình phạt = "gậy ông đập lưng ông": bắt người khác chờ, giờ tới lượt mình chờ crush mãi mãi.
  // Nhịp bám lời: "Và cả ba: kiếp sau nhắn crush (1.1s), lúc nào cũng thấy đang soạn tin... (3.2s) rồi tắt (6.3s)."
  const t = frame / 30;
  const sent = t > 1.6, seen = t > 2.6;
  const loop = t > 3.2 && t < 6.2;
  const cyc = ((t - 3.2) * 30) % 36;
  const typing = loop && cyc < 24;
  const times = loop ? Math.floor((t - 3.2) * 30 / 36) + 1 : 0;
  const dead = t >= 6.2;
  const wait = dead ? ["1 NGÀY", "1 THÁNG", "1 NĂM", "10 NĂM", "100 NĂM", "MÃI MÃI"][Math.min(5, Math.floor((t - 6.2) * 4))] : "";
  const ghosts: [Who, number, number][] = [["sv", 10, 230], ["con", 10, 610], ["ny", 740, 420]];
  const hope = typing;
  return (
    <Frame label="HÌNH PHẠT KIẾP SAU" color="#1E1B4B" frame={frame}>
      <PhoneShell frame={frame} uid="pun" title="Crush 💗" time={dead ? "3:00" : "21:00"} glow="#F472B6">
        {sent && <Bubble x={SX + SW - 330} y={SY + 200} w={300} me text={["Tối nay rảnh hông?", "🥺"]} s={ease(cl((t - 1.6) * 4))} />}
        {seen && <text x={SX + SW - 30} y={SY + 345} textAnchor="end" fontFamily={F} fontWeight={700} fontSize={28} fill="#6B7280">Đã xem ✓✓</text>}
        {typing && (
          <g>
            <rect x={SX + 24} y={SY + 380} width={200} height={90} rx={40} fill="#fff" stroke={INK} strokeWidth={4} />
            {[0, 1, 2].map((i) => <circle key={i} cx={SX + 74 + i * 50} cy={SY + 425} r={15} fill="#6B7280" opacity={0.35 + 0.65 * (((frame + i * 4) % 12) / 12)} />)}
            <text x={SX + 24} y={SY + 520} fontFamily={F} fontWeight={900} fontSize={34} fill="#DB2777">Crush đang soạn tin...</text>
          </g>
        )}
        {loop && !typing && <text x={SX + 24} y={SY + 520} fontFamily={F} fontWeight={900} fontSize={34} fill="#9CA3AF">(tắt rồi)</text>}
        {dead && <text x={SX + SW / 2} y={SY + 600} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={38} fill="#6B7280">...không có tin nào</text>}
      </PhoneShell>
      {ghosts.map(([w, x, y], i) => (
        <div key={i} style={{ position: "absolute", left: x, top: y, width: 220, height: 302,
          transform: `translateY(${hope ? -14 : 0}px) rotate(${dead ? Math.sin(frame * 1.5 + i) * 3 : 0}deg)` }}>
          <HonX frame={frame} talk={0} uid={`pun${i}`} mood={dead ? "scared" : hope ? "happy" : "tired"} who={w} phone />
        </div>
      ))}
      <svg width={980} height={1120} viewBox="0 0 980 1120" style={{ position: "absolute", inset: 0 }}>
        {times > 0 && !dead && <Counter text={`HIỆN RỒI TẮT: ${times} LẦN`} frame={frame} y={1060} color="#F9A8D4" />}
        {dead && <Counter text={`ĐÃ CHỜ: ${wait}`} frame={frame} y={1060} color="#FCA5A5" />}
      </svg>
    </Frame>
  );
};

// ---------- C11: đơn xin tăng lương của Mèo ----------
export const Twist: React.FC<SP> = ({ frame, p, talk }) => {
  const up = ease(frame / 16);
  const years = Math.round(847 * ease(cl((p - 0.55) / 0.35)));
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 35%, #4A1628 0%, #230A14 70%)" }}>
      <div style={{ position: "absolute", left: 90, right: 90, top: 300 + (1 - up) * 600, height: 760, background: "#FDE68A",
        border: `9px solid ${INK}`, borderRadius: 18, boxShadow: `12px 14px 0 ${INK}`, transform: `rotate(-3deg)`, fontFamily: F, padding: 40, boxSizing: "border-box" }}>
        <div style={{ fontWeight: 900, fontSize: 52, textAlign: "center", color: INK }}>ĐƠN XIN TĂNG LƯƠNG</div>
        <div style={{ fontWeight: 700, fontSize: 34, textAlign: "center", color: "#7C2D12", marginTop: 6 }}>Người làm đơn: Mèo Sổ</div>
        <div style={{ fontFamily: HAND, fontSize: 40, color: INK, marginTop: 36, lineHeight: 1.35 }}>
          Kính gửi Diêm Vương,<br />Mèo ghi sổ ngày đêm đã lâu, xin được tăng một con cá khô mỗi tháng...<br />Gửi năm Kỷ Dậu.
        </div>
        <div style={{ position: "absolute", right: 40, bottom: 34, fontWeight: 900, fontSize: 38, color: "#6B7280" }}>Đã xem ✓✓</div>
      </div>
      {p > 0.55 && (
        <div style={{ position: "absolute", top: 1100, left: 0, right: 0, textAlign: "center", fontFamily: F, fontWeight: 900, fontSize: 70, color: "#FDE047", WebkitTextStroke: `12px ${INK}`, paintOrder: "stroke fill" }}>
          ĐÃ XEM: {years} NĂM
        </div>
      )}
      <div style={{ position: "absolute", left: 700, top: 1150, width: 300, height: 368 }}>
        <MeoSo frame={frame} talk={talk} uid="meo-tw" />
      </div>
    </AbsoluteFill>
  );
};

// ---------- C11b: mặt Diêm Vương lần duy nhất đổi sắc: liếc ngang, đổ mồ hôi ----------
export const TwistFace: React.FC<SP> = ({ frame, p, talk }) => {
  const sweat = cl(frame / 30);
  const stamp = p > 0.55;
  const ss = interpolate(p, [0.55, 0.62], [2.2, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ background: "#230A14" }}>
      <div style={{ position: "absolute", left: -80, top: 200, width: 1240, height: 1460 }}>
        <DiemVuong frame={frame} talk={talk} uid="dv-tf" mood="smug" />
      </div>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
        {/* che mắt cũ, vẽ mắt liếc ngang */}
        <rect x={250} y={760} width={600} height={140} fill="#E0574F" />
        <g stroke={INK} strokeLinecap="round">
          <path d="M300 790 L460 820" strokeWidth={30} />
          <path d="M780 790 L620 820" strokeWidth={30} />
          <ellipse cx={380} cy={860} rx={60} ry={34} fill="#fff" strokeWidth={10} />
          <ellipse cx={700} cy={860} rx={60} ry={34} fill="#fff" strokeWidth={10} />
          <circle cx={420} cy={862} r={20} fill={INK} />
          <circle cx={740} cy={862} r={20} fill={INK} />
        </g>
        <path d={`M880 ${700 + sweat * 200} q30 50 0 76 q-30 -26 0 -76`} fill="#8EC5FF" stroke={INK} strokeWidth={6} />
        {stamp && (
          <g transform={`translate(540 1380) rotate(-10) scale(${ss})`}>
            <rect x={-260} y={-90} width={520} height={170} rx={20} fill="rgba(253,230,138,0.9)" stroke="#DC2626" strokeWidth={14} />
            <text x={0} y={30} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={110} fill="#DC2626">ĐÃ XEM</text>
          </g>
        )}
      </svg>
    </AbsoluteFill>
  );
};

// ---------- C12: Mèo nhìn thẳng người xem ----------
export const Cta2: React.FC<SP> = ({ frame, p, talk }) => (
  <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, #5B21B6 0%, #1A0A10 75%)" }}>
    <div style={{ position: "absolute", left: 60, right: 60, top: 260, textAlign: "center", fontFamily: F, fontWeight: 900, fontSize: 64, lineHeight: 1.2, color: "#fff", WebkitTextStroke: `12px ${INK}`, paintOrder: "stroke fill" }}>
      TIN CHƯA REP LÂU NHẤT<br />CỦA BẠN LÀ CỦA AI?
    </div>
    <div style={{ position: "absolute", left: 240, top: 560, width: 600, height: 736 }}>
      <MeoSo frame={frame} talk={talk} uid="meo-cta" />
    </div>
    {p > 0.7 && (
      <div style={{ position: "absolute", top: 1330, left: 0, right: 0, textAlign: "center", fontFamily: F, fontWeight: 900, fontSize: 48, color: "#D1D5DB" }}>Đã xem ✓✓</div>
    )}
  </AbsoluteFill>
);
