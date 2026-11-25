# Phiên tòa Âm Phủ: mã dựng video

Mã dựng các tập short dọc 1080x1920 của kênh "Phiên tòa Âm Phủ" bằng Remotion. Một tập gồm một file kịch bản `episodes/epNNN.json`, file giọng từng câu và các cảnh vẽ bằng SVG.

Repo này chỉ chứa mã, kịch bản và tài liệu. Video, ảnh, file giọng và link ElevenLabs không đưa lên git (xem `.gitignore`), cũng không có khóa API nào.

## Cài một lần
- Node.js 20+, Python 3.10+, ffmpeg
- `npm install`
- `pip install edge-tts` (chỉ cần nếu muốn giọng thử edge-tts)

## Làm một tập
1. Viết kịch bản `episodes/epNNN.json`. Mỗi câu có `speaker` (`dv` Diêm Vương, `meo` Mèo Sổ, `hon` bị cáo), `scene`, `text` (phụ đề), `tts` (lời nhắc cho ElevenLabs) và tùy chọn `hold` (giây giữ hình sau câu).
2. Chốt kịch bản xong mới lồng tiếng bằng ElevenLabs với bộ giọng cố định (ID nằm trong `speakers` của file json). Mèo Sổ luôn giọng miền Nam.
3. Lưu file giọng từng câu vào `public/epNNN/lines/00.opus`, `01.opus`... (mp3 cũng được).
4. Tạo giọng ghép và mốc thời gian phụ đề:
   ```
   npm run voice -- episodes/epNNN.json --engine files
   ```
   Kết quả: `public/epNNN/voice.wav` và `public/epNNN/timeline.json`. Phụ đề được canh theo đoạn có tiếng nên khớp giọng.
   `--engine edge` dùng giọng edge-tts, `--engine espeak` giọng robot offline, chỉ để thử nhịp.
5. Xem và chỉnh: `npm run preview`
6. Xuất video:
   ```
   npm run render -- Short2 out/am-phu-ep002.mp4 --props='{"id":"ep002"}'
   ```
7. Ảnh bìa riêng: `npm run still -- Cover2 out/am-phu-ep002-bia.png`

Trên máy cloud không tải được Chrome Headless Shell, thêm `--browser-executable=/opt/pw-browsers/chromium-1243/chrome-linux64/chrome`.

## Các bản dựng (composition)
| Tên | Dùng cho |
| --- | --- |
| `Short`, `Thumb` | Tập 1 "Thức khuya" (khung dựng đời đầu) |
| `Short2`, `Thumb2` | Tập 2 "Seen không rep" (khung mới, nên dùng cho các tập sau) |
| `Cover1`, `Cover2` | Khuôn ảnh bìa riêng. Props: `ep`, `crime` (1-2 dòng), `face` |

## Cấu trúc
- `src/Cast.tsx`: dàn nhân vật gốc vẽ SVG nét rung (Diêm Vương, Mèo Sổ, linh hồn bị cáo), nhép miệng
- `src/Scenes.tsx`, `src/Details.tsx`: cảnh và chi tiết tập 1 (công đường, phòng ngủ, điện thoại...)
- `src/Ep2Scenes.tsx`: cảnh tập 2 (nhóm chat, màn hình "Đã xem", hình phạt...)
- `src/Episode.tsx`, `src/Episode2.tsx`: dựng video: máy quay zoom người nói, tên người nói, phụ đề karaoke, thẻ "TỘI" ở khung đầu, dấu mộc
- `src/Cover.tsx`: khuôn ảnh bìa (chữ và mặt nằm trong vùng y 420..1500 để cắt 1:1 và 3:4 vẫn đọc được)
- `scripts/voice.py`: ghép giọng, canh phụ đề theo tiếng, trường `hold`
- `public/ep001/timeline.json`: mốc thời gian tập 1 (file giọng không kèm)
- `docs/`: bí quyết làm short video cho kênh
