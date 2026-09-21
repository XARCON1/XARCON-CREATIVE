"""Render XARCON's original eight-second CGI loop. Requires numpy, Pillow, ffmpeg.
Geometry input: the position/normal arrays from createBrandGeometry(1.8, 3).
Usage: python scripts/render-motion-film.py /path/to/geometry.json
"""
import json
import math
import subprocess
import sys
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw

root = Path(__file__).resolve().parents[1]
out = root / 'public/media'
out.mkdir(parents=True, exist_ok=True)
data = json.loads(Path(sys.argv[1]).read_text())
vertices = np.array(data['positions']).reshape(-1, 3)
triangles = vertices.reshape(-1, 3, 3)
centers = triangles.mean(axis=1)
normals = np.array(data['normals']).reshape(-1, 3, 3).mean(axis=1)
normals /= np.linalg.norm(normals, axis=1)[:, None]
W, H, FPS, FRAMES = 960, 600, 24, 192
yy, xx = np.mgrid[0:H, 0:W]
glow = np.exp(-((xx - W * .63) ** 2 / (W * .4) ** 2 + (yy - H * .45) ** 2 / (H * .55) ** 2) * 2)
background = np.stack([4 + glow * 8, 12 + glow * 27, 27 + glow * 42], axis=-1).astype('uint8')
light = np.array([-.5, .7, 1.0]); light /= np.linalg.norm(light)
rimlight = np.array([.8, -.25, -.65]); rimlight /= np.linalg.norm(rimlight)
rng = np.random.default_rng(32)
stars = rng.uniform([-12, -8, -10], [12, 8, 10], (95, 3))
command = ['ffmpeg', '-y', '-v', 'error', '-f', 'rawvideo', '-vcodec', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-', '-an', '-c:v', 'libx264', '-preset', 'medium', '-crf', '26', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', str(out / 'xarcon-future.mp4')]
encoder = subprocess.Popen(command, stdin=subprocess.PIPE)

for frame in range(FRAMES):
    t = frame / FRAMES * math.tau
    angle = .68 + math.sin(t) * .64
    camera = np.array([math.sin(angle) * 19, 3.6 + math.sin(t) * .5, math.cos(angle) * 19])
    forward = -camera / np.linalg.norm(camera)
    right = np.cross(forward, [0, 1, 0]); right /= np.linalg.norm(right)
    up = np.cross(right, forward)
    matrix = np.array([right, up, forward]).T
    def project(points):
        view = (points - camera) @ matrix
        return np.stack([W * .6 + view[:, 0] * 720 / view[:, 2], H * .47 - view[:, 1] * 720 / view[:, 2]], axis=-1)
    image = Image.fromarray(background)
    draw = ImageDraw.Draw(image, 'RGB')
    # Thin orbital trajectories establish a quiet sense of scale around the X.
    for ring in range(3):
        theta = np.linspace(0, math.tau, 180)
        radius = 7.2 + ring * .42
        points = np.stack([np.sin(theta) * radius, np.cos(theta + .7 + ring * .3) * 1.2 - 1.3, np.cos(theta) * radius], axis=-1)
        pts = project(points)
        draw.line([tuple(p) for p in pts], fill=(18 + ring * 4, 54 + ring * 4, 79 + ring * 7), width=1)
        start = int((frame * (ring + 1) / 2) % 180)
        for j in range(12):
            p = pts[(start + j) % 180]; glow_level = (12 - j) / 12
            draw.ellipse((p[0]-1.4,p[1]-1.4,p[0]+1.4,p[1]+1.4),fill=(int(85*glow_level),int(190*glow_level),int(238*glow_level)))
    for i, p in enumerate(project(stars)):
        lum = .45 + .35 * math.sin(t + i)
        draw.ellipse((p[0],p[1],p[0]+1.4,p[1]+1.4), fill=(int(69*lum),int(149*lum),int(206*lum)))
    projected = project(vertices).reshape(-1,3,2)
    view = camera - centers
    view /= np.linalg.norm(view,axis=1)[:,None]
    facing = np.sum(normals*view,axis=1)
    diffuse = np.maximum(normals @ light,0)
    blue = np.maximum(normals @ rimlight,0)
    reflection = 2 * (normals @ light)[:,None] * normals - light
    specular = np.maximum(np.sum(reflection*view,axis=1),0)**30
    rim = (1-np.abs(facing))**2
    colors = np.stack([18+diffuse*71+specular*155+rim*50, 47+diffuse*111+blue*29+specular*140+rim*74, 74+diffuse*133+blue*46+specular*120+rim*85],axis=-1)
    colors=np.clip(colors,0,255).astype('uint8')
    order = np.argsort(np.sum((centers-camera)**2,axis=1))[::-1]
    for i in order:
        if facing[i] < -.02: continue
        color=tuple(int(c) for c in colors[i])
        draw.polygon([tuple(p) for p in projected[i]],fill=color)
    if frame == 0: image.save(out/'xarcon-future-poster.webp',quality=90)
    encoder.stdin.write(image.tobytes())
encoder.stdin.close()
if encoder.wait() != 0: raise RuntimeError('Video encoding failed')
print(json.dumps({'video_bytes':(out/'xarcon-future.mp4').stat().st_size,'frames':FRAMES,'duration':FRAMES/FPS}))
