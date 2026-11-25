"""Tạo giọng đọc + timeline cho một tập.
Dùng: python scripts/voice.py episodes/ep001.json --engine edge|espeak
- edge  : edge-tts (cần mạng, giọng tự nhiên) -> dùng trên máy Vi
- espeak: espeak-ng (offline, giọng robot) -> chỉ để thử nhịp
- files : dùng file có sẵn public/<id>/lines/NN.mp3 (ví dụ tải từ ElevenLabs)
Kết quả: public/<id>/voice.wav và public/<id>/timeline.json
"""
import argparse, json, subprocess, wave, os, struct, asyncio, re

FPS = 30
GAP = 0.35  # giây nghỉ giữa các câu

def synth_espeak(text, out, args=None):
    subprocess.run(["espeak-ng", "-v", "vi", *(args or ["-s", "165"]), "-w", out, text], check=True)

def synth_edge(text, out, voice, rate="+8%", pitch="+0Hz"):
    import edge_tts
    mp3 = out.replace(".wav", ".mp3")
    asyncio.run(edge_tts.Communicate(text, voice, rate=rate, pitch=pitch).save(mp3))
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", mp3, out], check=True)

def to_mono16k(src, dst, pad=GAP):
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", src, "-ac", "1", "-ar", "24000",
                    "-af", f"apad=pad_dur={pad}", dst], check=True)

def read_wav(path):
    with wave.open(path) as w:
        n, sr = w.getnframes(), w.getframerate()
        data = struct.unpack(f"<{n}h", w.readframes(n))
    return data, sr


LEAD = 0.08  # hiện chữ sớm một chút: mắt thấy chữ cùng lúc tai nghe, không bị trễ

def align_words(words, data, sr, t0):
    """Mốc từng từ bám giọng thật: chỉ chia thời gian cho đoạn CÓ TIẾNG (bỏ khoảng ngừng
    "D-dạ... con..."), mỗi từ tiếng Việt ~ một âm tiết nên trọng số gần đều, nhích theo độ dài."""
    hop = sr // 100  # khung 10ms
    rms = []
    for i in range(0, max(len(data), 1), hop):
        seg = data[i:i + hop] or [0]
        rms.append((sum(x * x for x in seg) / len(seg)) ** 0.5)
    peak = max(rms) or 1
    voiced = [r > peak * 0.08 for r in rms]
    # lấp các lỗ ngắn < 120ms (phụ âm tắc, hơi thở giữa từ) để chỉ ngừng thật mới bị bỏ
    i = 0
    while i < len(voiced):
        if not voiced[i]:
            j = i
            while j < len(voiced) and not voiced[j]: j += 1
            if j - i < 12 and i > 0 and j < len(voiced):
                for k in range(i, j): voiced[k] = True
            i = j
        else: i += 1
    # các đoạn có tiếng liền mạch (ngăn bởi khoảng ngừng >= 120ms)
    segs, k = [], 0
    while k < len(voiced):
        if voiced[k]:
            j = k
            while j < len(voiced) and voiced[j]: j += 1
            segs.append((k, j)); k = j
        else: k += 1
    if not segs: segs = [(0, len(voiced) or 1)]
    # cụm từ: tách ở dấu câu (... , . ? ! :) - chỗ người đọc hay ngừng
    phrases, cur = [], []
    for wi, w in enumerate(words):
        cur.append(wi)
        if w[-1] in ".,!?…:" or wi == len(words) - 1: phrases.append(cur); cur = []
    wts = [1.0 + 0.12 * len(w.strip(".,!?…:")) for w in words]
    pw = [sum(wts[i] for i in ph) for ph in phrases]
    # gộp cụm nhỏ nhất nếu số cụm nhiều hơn số đoạn có tiếng
    while len(phrases) > len(segs):
        m = min(range(len(phrases) - 1), key=lambda i: pw[i] + pw[i + 1])
        phrases[m:m + 2] = [phrases[m] + phrases[m + 1]]; pw[m:m + 2] = [pw[m] + pw[m + 1]]
    n, m = len(phrases), len(segs)
    sd = [e - s0 for s0, e in segs]; TD = sum(sd); TW = sum(pw)
    # DP: gán mỗi cụm cho một dãy đoạn liên tiếp, sao cho tỉ lệ thời lượng khớp tỉ lệ chữ
    INF = float("inf"); best = [[INF] * (m + 1) for _ in range(n + 1)]; back = [[0] * (m + 1) for _ in range(n + 1)]
    best[0][0] = 0
    for i in range(1, n + 1):
        for j in range(i, m - (n - i) + 1):
            for q in range(i - 1, j):
                if best[i - 1][q] == INF: continue
                c = best[i - 1][q] + (sum(sd[q:j]) / TD - pw[i - 1] / TW) ** 2
                if c < best[i][j]: best[i][j], back[i][j] = c, q
    runs, j = [], m
    for i in range(n, 0, -1):
        q = back[i][j]; runs.append((q, j)); j = q
    runs.reverse()
    out = []
    for ph, (q, j) in zip(phrases, runs):
        fr = [f for s0, e in segs[q:j] for f in range(s0, e)]  # các khung có tiếng của cụm
        tw = sum(wts[i] for i in ph); acc = 0
        for i in ph:
            a = fr[min(len(fr) - 1, int(len(fr) * acc / tw))]; acc += wts[i]
            b = fr[min(len(fr) - 1, max(0, int(len(fr) * acc / tw) - 1))] + 1
            out.append({"w": words[i], "start": round(max(0, t0 + a / 100 - LEAD), 3), "end": round(t0 + b / 100 - LEAD, 3)})
    # nối liền: từ trước giữ tới khi từ sau bắt đầu (không nhấp nháy trong khoảng ngừng)
    for x, y in zip(out, out[1:]): x["end"] = y["start"]
    return out

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("episode"); ap.add_argument("--engine", default="edge")
    a = ap.parse_args()
    ep = json.load(open(a.episode, encoding="utf-8"))
    outdir = os.path.join("public", ep["id"]); os.makedirs(outdir, exist_ok=True)
    parts, lines, t = [], [], 0.0
    for i, ln in enumerate(ep["lines"]):
        raw, norm = f"{outdir}/raw{i}.wav", f"{outdir}/line{i}.wav"
        sp = ep.get("speakers", {}).get(ln.get("speaker", ""), {})
        if a.engine == "files":
            src = next((f"{outdir}/lines/{i:02d}.{e}" for e in ("opus","mp3","wav") if os.path.exists(f"{outdir}/lines/{i:02d}.{e}")), f"{outdir}/lines/{i:02d}.mp3")
            subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", src, "-af",
                            "silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse",
                            raw], check=True)
        elif a.engine == "espeak": synth_espeak(ln["text"], raw, sp.get("espeak"))
        else: synth_edge(ln["text"], raw, sp.get("voice", ep.get("voice", "vi-VN-NamMinhNeural")),
                         sp.get("rate", "+8%"), sp.get("pitch", "+0Hz"))
        pad = GAP + float(ln.get("hold", 0))  # "hold": giây giữ hình thêm sau câu (nhịp cảm xúc/hài)
        to_mono16k(raw, norm, pad); os.remove(raw)
        data, sr = read_wav(norm)
        dur = len(data) / sr
        speech = dur - pad
        words = ln["text"].split()
        wt = align_words(words, data[:int(speech * sr)], sr, t)
        lines.append({**ln, "start": round(t, 3), "end": round(t + dur, 3), "words": wt})
        parts.append((data, sr)); t += dur
    sr = parts[0][1]; allv = [s for d, _ in parts for s in d]
    with wave.open(f"{outdir}/voice.wav", "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr)
        w.writeframes(struct.pack(f"<{len(allv)}h", *allv))
    for i in range(len(parts)): os.remove(f"{outdir}/line{i}.wav")
    # Biên độ mỗi khung hình -> nhép miệng
    spf = sr // FPS; amp = []
    for f in range(len(allv) // spf + 1):
        seg = allv[f*spf:(f+1)*spf] or [0]
        amp.append(round(min(1.0, (sum(abs(x) for x in seg) / len(seg)) / 6000), 3))
    tl = {"id": ep["id"], "title": ep["title"], "fps": FPS, "speakers": ep.get("speakers", {}), "duration": round(t + 1.0, 3),
          "lines": lines, "amp": amp}
    json.dump(tl, open(f"{outdir}/timeline.json", "w", encoding="utf-8"), ensure_ascii=False)
    print(f"{ep['id']}: {t:.1f}s, {len(lines)} câu")

if __name__ == "__main__":
    main()
