#!/usr/bin/env python3
import struct
import zlib
import os
import math

def create_png(width, height, pixels):
    def make_chunk(chunk_type, data):
        chunk = chunk_type + data
        crc = struct.pack('>I', zlib.crc32(chunk) & 0xffffffff)
        return struct.pack('>I', len(data)) + chunk + crc
    sig = b'\x89PNG\r\n\x1a\n'
    ihdr = struct.pack('>IIBBBBB', width, height, 8, 6, 0, 0, 0)
    raw = b''
    for y in range(height):
        raw += b'\x00'
        for x in range(width):
            idx = (y * width + x) * 4
            raw += bytes(pixels[idx:idx+4])
    idat = zlib.compress(raw, 9)
    return sig + make_chunk(b'IHDR', ihdr) + make_chunk(b'IDAT', idat) + make_chunk(b'IEND', b'')

# 7x9 thicker bitmap font
FONT = {
    'M': [
        [1,0,0,0,0,0,1],
        [1,1,0,0,0,1,1],
        [1,1,1,0,1,1,1],
        [1,1,0,1,0,1,1],
        [1,1,0,0,0,1,1],
        [1,1,0,0,0,1,1],
        [1,1,0,0,0,1,1],
        [1,1,0,0,0,1,1],
        [1,1,0,0,0,1,1],
    ],
    'P': [
        [1,1,1,1,1,0,0],
        [1,1,0,0,1,1,0],
        [1,1,0,0,1,1,0],
        [1,1,0,0,1,1,0],
        [1,1,1,1,1,0,0],
        [1,1,0,0,0,0,0],
        [1,1,0,0,0,0,0],
        [1,1,0,0,0,0,0],
        [1,1,0,0,0,0,0],
    ],
    'T': [
        [1,1,1,1,1,1,1],
        [0,0,1,1,1,0,0],
        [0,0,1,1,1,0,0],
        [0,0,1,1,1,0,0],
        [0,0,1,1,1,0,0],
        [0,0,1,1,1,0,0],
        [0,0,1,1,1,0,0],
        [0,0,1,1,1,0,0],
        [0,0,1,1,1,0,0],
    ],
}

WHITE = [255, 255, 255, 255]
GREEN = [0, 168, 87, 255]
TRANSPARENT = [0, 0, 0, 0]

def is_in_rounded_rect(x, y, w, h, radius):
    """Check if pixel is inside a rounded rectangle."""
    if radius <= 0:
        return True
    rx = min(radius, w // 2)
    ry = min(radius, h // 2)
    if x < rx and y < ry:
        dx = rx - x
        dy = ry - y
        return dx * dx + dy * dy <= rx * rx
    if x >= w - rx and y < ry:
        dx = x - (w - rx - 1)
        dy = ry - y
        return dx * dx + dy * dy <= rx * rx
    if x < rx and y >= h - ry:
        dx = rx - x
        dy = y - (h - ry - 1)
        return dx * dx + dy * dy <= rx * rx
    if x >= w - rx and y >= h - ry:
        dx = x - (w - rx - 1)
        dy = y - (h - ry - 1)
        return dx * dx + dy * dy <= rx * rx
    return True

def render_icon(size):
    pixels = []
    radius = size // 5
    for y in range(size):
        for x in range(size):
            if is_in_rounded_rect(x, y, size, size, radius):
                pixels.extend(WHITE)
            else:
                pixels.extend(TRANSPARENT)

    text = "MPT"
    font_w = 7
    font_h = 9
    char_spacing = 1
    total_text_w = len(text) * font_w + (len(text) - 1) * char_spacing
    scale = max(1, size // (total_text_w + 6))
    scaled_text_w = total_text_w * scale
    scaled_text_h = font_h * scale
    offset_x = (size - scaled_text_w) // 2
    offset_y = (size - scaled_text_h) // 2

    for ci, ch in enumerate(text):
        glyph = FONT[ch]
        char_offset_x = offset_x + ci * (font_w + char_spacing) * scale
        for gy in range(font_h):
            for gx in range(font_w):
                if glyph[gy][gx]:
                    for sy in range(scale):
                        for sx in range(scale):
                            px = char_offset_x + gx * scale + sx
                            py = offset_y + gy * scale + sy
                            if 0 <= px < size and 0 <= py < size:
                                idx = (py * size + px) * 4
                                pixels[idx] = GREEN[0]
                                pixels[idx+1] = GREEN[1]
                                pixels[idx+2] = GREEN[2]
                                pixels[idx+3] = GREEN[3]
    return pixels

def create_ico(sizes, pixels_data):
    count = len(sizes)
    header = struct.pack('<HHH', 0, 1, count)
    entries = b''
    offset = 6 + count * 16
    pngs = []
    for size, pixels in zip(sizes, pixels_data):
        png_data = create_png(size, size, pixels)
        pngs.append(png_data)
        w = size if size < 256 else 0
        h = size if size < 256 else 0
        entries += struct.pack('<BBBBHHII', w, h, 0, 0, 1, 32, len(png_data), offset)
        offset += len(png_data)
    return header + entries + b''.join(pngs)

def create_icns(sizes, pixels_data):
    icons = b''
    size_map = {32: b'ic07', 128: b'ic08', 256: b'ic09', 512: b'ic10'}
    for size, pixels in zip(sizes, pixels_data):
        if size in size_map:
            png_data = create_png(size, size, pixels)
            icon_type = size_map[size]
            icons += icon_type + struct.pack('>I', len(png_data) + 8) + png_data
    return b'icns' + struct.pack('>I', len(icons) + 8) + icons

icon_dir = os.path.dirname(os.path.abspath(__file__))
sizes_png = [32, 128, 256]
pixels_by_size = {s: render_icon(s) for s in sizes_png}
for size in sizes_png:
    with open(os.path.join(icon_dir, f"{size}x{size}.png"), 'wb') as f:
        f.write(create_png(size, size, pixels_by_size[size]))
    print(f"Created {size}x{size}.png")
with open(os.path.join(icon_dir, "128x128@2x.png"), 'wb') as f:
    f.write(create_png(256, 256, pixels_by_size[256]))
print("Created 128x128@2x.png")
ico_sizes = [16, 32, 48, 64, 128, 256]
with open(os.path.join(icon_dir, "icon.ico"), 'wb') as f:
    f.write(create_ico(ico_sizes, [render_icon(s) for s in ico_sizes]))
print("Created icon.ico")
icns_sizes = [32, 128, 256]
with open(os.path.join(icon_dir, "icon.icns"), 'wb') as f:
    f.write(create_icns(icns_sizes, [render_icon(s) for s in icns_sizes]))
print("Created icon.icns")
print("All icons generated!")
