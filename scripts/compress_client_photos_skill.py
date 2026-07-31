#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
批量压缩客片 —— 复用「智能图片压缩」技能自带的 compress_image 函数。

关键点（满足主人要求）：
- 等比例缩放：长边 <= MAX_EDGE(1600)，宽高用同一比例，长宽比不变
- 自动按 EXIF 方向转正（手机竖拍不躺平）
- 默认去 EXIF
- 通过二分搜索把体积压到 target_ratio 以内
- 逐张校验：压缩前 / 压缩后的 aspect(宽/高) 必须一致，否则报错

输出文件名沿用 client{客片}-{序号}.jpg，作品集 data.ts 无需改动。
"""
import os
import sys
import json

# 引入技能脚本
SKILL_SCRIPT_DIR = "~/.workbuddy/skills/smart-image-compressor__skillhub/scripts"
sys.path.insert(0, SKILL_SCRIPT_DIR)
from compress_image import compress_image  # noqa: E402

from PIL import Image, ImageOps  # noqa: E402

SRC_ROOT = "~/Desktop/领证跟拍"
OUT_DIR = "~/WorkBuddy/个人网页开发/photo-dlidex-site/public/photos"
MAX_EDGE = 1600      # 长边上限（像素），等比缩放
QUALITY = 72         # JPEG 质量（技能默认 50，这里兼顾画质）
TARGET_RATIO = 0.3   # 目标压缩后/前体积比
CLIENT_DIRS = ["客片1", "客片2", "客片3"]


def max_width_for_long_edge(w, h, max_edge):
    """根据原图宽高，算出让长边 == max_edge 的 max_width。"""
    if max(w, h) <= max_edge:
        return None  # 已经够小，不缩放
    if w >= h:
        return max_edge          # 横图：限制宽
    return int(round(max_edge * w / h))  # 竖图：限制宽使高==max_edge


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    manifest = []
    problems = []

    for ci, client in enumerate(CLIENT_DIRS, start=1):
        client_path = os.path.join(SRC_ROOT, client)
        files = sorted(
            f for f in os.listdir(client_path)
            if f.lower().endswith((".jpg", ".jpeg", ".png", ".webp", ".heic"))
        )
        for fi, fname in enumerate(files, start=1):
            src = os.path.join(client_path, fname)
            out_name = f"client{ci}-{fi}.jpg"
            out_path = os.path.join(OUT_DIR, out_name)

            # 原图真实尺寸 + 比例（先按 EXIF 转正，与 compress 内部一致）
            with Image.open(src) as im0:
                im0 = ImageOps.exif_transpose(im0)
                ow, oh = im0.width, im0.height
            aspect_before = ow / oh

            mw = max_width_for_long_edge(ow, oh, MAX_EDGE)
            result = compress_image(
                src,
                output_path=out_path,
                quality=QUALITY,
                target_ratio=TARGET_RATIO,
                output_format="JPEG",
                max_width=mw,
            )

            # 压缩后真实尺寸 + 比例（从结果 dimensions 解析）
            cw, ch = (int(x) for x in result["dimensions"].split("x"))
            aspect_after = cw / ch
            ratio_diff = abs(aspect_before - aspect_after)

            ok = ratio_diff < 0.01
            if not ok:
                problems.append(f"{out_name}: 长宽比不一致 before={aspect_before:.4f} after={aspect_after:.4f}")

            print(
                f"[{'OK' if ok else 'XX'}] {client}/{fname} -> {out_name} | "
                f"{ow}x{oh}->{cw}x{ch} | {result['human_readable']['original']}->{result['human_readable']['compressed']} "
                f"(-{result['reduction_pct']}%) | q={result['quality_used']}"
            )
            manifest.append({
                "client": ci, "srcFile": fname, "outName": out_name,
                "title": f"领证跟拍 · 客片{ci}-{fi}",
                "width": cw, "height": ch,
            })

    with open(os.path.join(OUT_DIR, "_verify_aspect.json"), "w", encoding="utf-8") as f:
        json.dump({"items": manifest, "problems": problems}, f, ensure_ascii=False, indent=2)

    print("\n=== 长宽比校验 ===")
    if problems:
        print("发现不一致！")
        for p in problems:
            print(" -", p)
        sys.exit(1)
    print(f"全部 {len(manifest)} 张等比缩放通过，长宽比未改变 ✅")


if __name__ == "__main__":
    main()
