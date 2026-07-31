#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
客片批量处理脚本 — 用于把客户原图压缩成网站作品集用的 Web 图。

功能：
- 长边缩放到 <= MAX_EDGE（默认 1600px），保持比例
- 按 EXIF Orientation 自动转正（避免手机竖拍变横）
- 去除所有 EXIF 隐私信息
- 统一导出为 JPEG（质量 QUALITY）
- 输出 manifest JSON（文件名 / 真实宽高 / 客户编号），供写 data.ts 用

用法：
  python3 process_client_photos.py
可改下面的 SRC_ROOT / OUT_DIR / MAX_EDGE / QUALITY
"""
import json
import os
from PIL import Image, ImageOps

SRC_ROOT = "~/Desktop/领证跟拍"
OUT_DIR = "~/WorkBuddy/个人网页开发/photo-dlidex-site/public/photos"
MAX_EDGE = 1600
QUALITY = 85

# 客户目录顺序（决定作品集排列）
CLIENT_DIRS = ["客片1", "客片2", "客片3"]


def process_image(src_path: str, out_path: str) -> dict:
    img = Image.open(src_path)
    # 按 EXIF 方向转正，并丢弃 orientation 元数据
    img = ImageOps.exif_transpose(img)
    # 统一转 RGB（处理 PNG 的透明通道 / 调色板）
    if img.mode in ("RGBA", "P", "LA"):
        # 白底合成，避免透明区域变黑
        bg = Image.new("RGB", img.size, (255, 255, 255))
        if img.mode == "P":
            img = img.convert("RGBA")
        bg.paste(img, mask=img.split()[-1] if img.mode in ("RGBA", "LA") else None)
        img = bg
    elif img.mode != "RGB":
        img = img.convert("RGB")

    w, h = img.size
    long_edge = max(w, h)
    if long_edge > MAX_EDGE:
        scale = MAX_EDGE / float(long_edge)
        new_w = max(1, round(w * scale))
        new_h = max(1, round(h * scale))
        img = img.resize((new_w, new_h), Image.LANCZOS)
        w, h = new_w, new_h

    img.save(out_path, "JPEG", quality=QUALITY, optimize=True, progressive=True)
    return {"width": w, "height": h}


def main() -> None:
    os.makedirs(OUT_DIR, exist_ok=True)
    manifest = []
    for ci, client in enumerate(CLIENT_DIRS, start=1):
        client_path = os.path.join(SRC_ROOT, client)
        if not os.path.isdir(client_path):
            print(f"[warn] 跳过不存在的客户目录: {client_path}")
            continue
        files = sorted(
            f
            for f in os.listdir(client_path)
            if f.lower().endswith((".jpg", ".jpeg", ".png", ".webp", ".heic"))
        )
        for fi, fname in enumerate(files, start=1):
            src = os.path.join(client_path, fname)
            out_name = f"client{ci}-{fi}.jpg"
            out = os.path.join(OUT_DIR, out_name)
            info = process_image(src, out)
            size_kb = os.path.getsize(out) / 1024.0
            print(
                f"[ok] {client}/{fname} -> {out_name} "
                f"({info['width']}x{info['height']}, {size_kb:.0f}KB)"
            )
            manifest.append(
                {
                    "client": ci,
                    "srcFile": fname,
                    "outName": out_name,
                    "title": f"领证跟拍 · 客片{ci}-{fi}",
                    "width": info["width"],
                    "height": info["height"],
                }
            )

    manifest_path = os.path.join(OUT_DIR, "_manifest_client_photos.json")
    with open(manifest_path, "w", encoding="utf-8") as f:
        json.dump(manifest, f, ensure_ascii=False, indent=2)
    print(f"\n[done] 共处理 {len(manifest)} 张，manifest -> {manifest_path}")


if __name__ == "__main__":
    main()
