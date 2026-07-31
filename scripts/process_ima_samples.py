#!/usr/bin/env python3
# 基于 ima 知识库「dlidex网站/04-客片原图/领证跟拍」的分类，处理领证跟拍样片。
# - 客片1/2/3（7 张）→ 用「智能图片压缩」技能压缩（长边<=1600、等比、去 EXIF）
# - 其他（1 张 png）→ 不压缩，原样复制
# 说明：ima MCP 为只读，无法导出原图；经核对 ima 内文件名与本地 Desktop/Downloads 同源，
#       故直接用本地同源文件处理，等价于“ima 里的客片”。
import sys, os, json, shutil
from pathlib import Path

SKILL = "~/.workbuddy/skills/smart-image-compressor__skillhub/scripts"
sys.path.insert(0, SKILL)
from compress_image import compress_image  # 智能图片压缩技能核心函数
from PIL import Image

BASE = "~/WorkBuddy/个人网页开发/photo-dlidex-site"
DEST = os.path.join(BASE, "public/photos")
MAX_DIM = 1600
QUALITY = 72
TARGET_RATIO = 0.3

# (源路径, 目标文件名, 是否压缩, title)
ITEMS = [
    ("~/Desktop/领证跟拍/客片1/IMG_5921.jpg", "c1-1.jpg", True,  "领证跟拍 · 客片1-1"),
    ("~/Desktop/领证跟拍/客片1/IMG_6020.jpg", "c1-2.jpg", True,  "领证跟拍 · 客片1-2"),
    ("~/Desktop/领证跟拍/客片1/IMG_5697.jpg", "c1-3.jpg", True,  "领证跟拍 · 客片1-3"),
    ("~/Desktop/领证跟拍/客片1/IMG_5584.jpg", "c1-4.jpg", True,  "领证跟拍 · 客片1-4"),
    ("~/Desktop/领证跟拍/客片2/IMG_5255.jpg", "c2-1.jpg", True,  "领证跟拍 · 客片2-1"),
    ("~/Desktop/领证跟拍/客片2/1aa7d110-57b7-4e07-9668-ce2416f3afe8.png", "c2-2.jpg", True, "领证跟拍 · 客片2-2"),
    ("~/Desktop/领证跟拍/客片3/IMG_4119.jpg", "c3-1.jpg", True,  "领证跟拍 · 客片3-1"),
    ("~/Downloads/0a78c0c6-4392-4361-a930-43073f04c75e.png", "c4-1.png", False, "领证跟拍 · 其他-1"),
]

os.makedirs(DEST, exist_ok=True)
results = []
for src, dest_name, compress, title in ITEMS:
    dst = os.path.join(DEST, dest_name)
    if not os.path.isfile(src):
        print(f"✗ 缺失源文件: {src}")
        sys.exit(1)
    if compress:
        with Image.open(src) as im:
            w, h = im.size
        # 长边 <= MAX_DIM：竖图按 height 算等效 max_width，保证等比且长边不超过 MAX_DIM
        mw = MAX_DIM if w >= h else round(MAX_DIM * w / h)
        r = compress_image(src, output_path=dst, max_width=mw, quality=QUALITY,
                           target_ratio=TARGET_RATIO, output_format="jpg", keep_exif=False)
        with Image.open(dst) as im2:
            fw, fh = im2.size
        results.append({"src": os.path.basename(src), "dest": dest_name, "title": title,
                        "compressed": True, "orig": r["human_readable"]["original"],
                        "new": r["human_readable"]["compressed"], "pct": r["reduction_pct"],
                        "w": fw, "h": fh})
        print(f"✓ {dest_name:12s} {r['human_readable']['original']:>9s} -> {r['human_readable']['compressed']:>9s} ({r['reduction_pct']}%)  {fw}x{fh}")
    else:
        shutil.copy(src, dst)
        with Image.open(dst) as im2:
            fw, fh = im2.size
        sz = os.path.getsize(dst)
        results.append({"src": os.path.basename(src), "dest": dest_name, "title": title,
                        "compressed": False, "new": f"{sz/1024:.1f} KB", "w": fw, "h": fh})
        print(f"✓ {dest_name:12s} (不压缩) {sz/1024:.1f} KB  {fw}x{fh}")

with open(os.path.join(BASE, "scripts/ima_samples_manifest.json"), "w", encoding="utf-8") as f:
    json.dump(results, f, ensure_ascii=False, indent=2)
print(f"\n完成 {len(results)} 张，manifest → scripts/ima_samples_manifest.json")
