#!/usr/bin/env python3
import struct
import zlib
import os

def create_png(width, height, pixels):
    """Create a PNG file from RGBA pixel data."""
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

# 5x7 bitmap font for M, P, T
FONT = {
    'M': [
        [1,0,0,0,1],
        [1,1,0,1,1],
        [1,0,1,0,1],
        [1,0,0,0,1],
        [1,0,0,0,1],
        [1,0,0,0,1],
        [1,0,0,0,1],
    ],
    'P': [
        [1,1,1,0,0],
        [1,0,0,1,0],
        [1,0,0,1,0],
        [1,1,1,0,0],
        [1,0,0,0,0],
        [1,0,0,0,0],
        [1,0,0,0,0],
    ],
    'T': [
        [1,1,1,1,1],
        [0,0,1,0,0],
        [0,0,1,0,0],
        [0,0,1,0,0],
        [0,0,1,0,0],
        [0,0,1,0,0],
        [0,0,1,0,0],
    ],
}

WHITE = [255, 255, 255, 255]
GREEN = [0, 168, 87, 255]

def render_icon(size):
    """Render MPT icon at given size."""
    pixels = []
    for y in range(size):
        for x in range(size):
            pixels.extend(WHITE)

    text = "MPT"
    font_w = 5
    font_h = 7
    char_spacing = 1
    total_text_w = len(text) * font_w + (len(text) - 1) * char_spacing

    scale = max(1, size // (total_text_w + 4))
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
    """Create ICO file from multiple PNG sizes."""
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
    """Create ICNS file from multiple PNG sizes."""
    icons = b''
    size_map = {
        32: b'ic07',
        128: b'ic08',
        256: b'ic09',
        512: b'ic10',
    }
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
    fname = f"{size}x{size}.png"
    with open(os.path.join(icon_dir, fname), 'wb') as f:
        f.write(create_png(size, size, pixels_by_size[size]))
    print(f"Created {fname}")

with open(os.path.join(icon_dir, "128x128@2x.png"), 'wb') as f:
    f.write(create_png(256, 256, pixels_by_size[256]))
print("Created 128x128@2x.png")

ico_sizes = [16, 32, 48, 64, 128, 256]
ico_pixels = [render_icon(s) for s in ico_sizes]
with open(os.path.join(icon_dir, "icon.ico"), 'wb') as f:
    f.write(create_ico(ico_sizes, ico_pixels))
print("Created icon.ico")

icns_sizes = [32, 128, 256]
icns_pixels = [render_icon(s) for s in icns_sizes]
with open(os.path.join(icon_dir, "icon.icns"), 'wb') as f:
    f.write(create_icns(icns_sizes, icns_pixels))
print("Created icon.icns")

print("All icons generated successfully!")
