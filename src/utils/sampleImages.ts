import portraitYoungWoman from '../assets/images/portrait_young_woman_1791695480567.jpg';
import landscapeAlpineLake from '../assets/images/landscape_alpine_lake_1791695494103.jpg';

export function createSamplePortrait(): string {
  if (portraitYoungWoman) {
    return portraitYoungWoman;
  }
  const canvas = document.createElement('canvas');
  canvas.width = 800;
  canvas.height = 1000;
  const ctx = canvas.getContext('2d')!;

  // Smooth warm studio gradient backdrop
  const bg = ctx.createLinearGradient(0, 0, 800, 1000);
  bg.addColorStop(0, '#f1f5f9');
  bg.addColorStop(0.5, '#e2e8f0');
  bg.addColorStop(1, '#cbd5e1');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 800, 1000);

  // Soft studio vignette
  const radial = ctx.createRadialGradient(400, 420, 100, 400, 420, 500);
  radial.addColorStop(0, 'rgba(255, 255, 255, 0.6)');
  radial.addColorStop(1, 'rgba(148, 163, 184, 0.4)');
  ctx.fillStyle = radial;
  ctx.fillRect(0, 0, 800, 1000);

  // Torso / Outfit (Vibrant Teal jacket/shirt)
  ctx.fillStyle = '#0f766e';
  ctx.beginPath();
  ctx.moveTo(150, 1000);
  ctx.lineTo(260, 680);
  ctx.quadraticCurveTo(400, 720, 540, 680);
  ctx.lineTo(650, 1000);
  ctx.closePath();
  ctx.fill();

  // Collar
  ctx.fillStyle = '#042f2e';
  ctx.beginPath();
  ctx.moveTo(330, 690);
  ctx.lineTo(400, 780);
  ctx.lineTo(470, 690);
  ctx.lineTo(400, 640);
  ctx.closePath();
  ctx.fill();

  // Neck
  ctx.fillStyle = '#e0a98b';
  ctx.beginPath();
  ctx.moveTo(340, 540);
  ctx.lineTo(340, 670);
  ctx.quadraticCurveTo(400, 700, 460, 670);
  ctx.lineTo(460, 540);
  ctx.closePath();
  ctx.fill();

  // Head / Face
  ctx.fillStyle = '#f3be9e';
  ctx.beginPath();
  ctx.ellipse(400, 420, 160, 210, 0, 0, Math.PI * 2);
  ctx.fill();

  // Hair
  ctx.fillStyle = '#292524';
  ctx.beginPath();
  ctx.ellipse(400, 270, 180, 140, 0, 0, Math.PI * 2);
  ctx.fill();

  // Cheeks blush
  ctx.fillStyle = 'rgba(239, 68, 68, 0.15)';
  ctx.beginPath();
  ctx.ellipse(320, 440, 45, 30, 0, 0, Math.PI * 2);
  ctx.ellipse(480, 440, 45, 30, 0, 0, Math.PI * 2);
  ctx.fill();

  // Eyes
  ctx.fillStyle = '#1c1917';
  ctx.beginPath();
  ctx.ellipse(330, 390, 18, 12, 0, 0, Math.PI * 2);
  ctx.ellipse(470, 390, 18, 12, 0, 0, Math.PI * 2);
  ctx.fill();

  // Eye highlights
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(334, 386, 5, 0, Math.PI * 2);
  ctx.arc(474, 386, 5, 0, Math.PI * 2);
  ctx.fill();

  // Smile
  ctx.strokeStyle = '#991b1b';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(400, 470, 45, 0.2, Math.PI - 0.2);
  ctx.stroke();

  // Sunglasses / Glasses frame
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 8;
  ctx.strokeRect(280, 360, 100, 65);
  ctx.strokeRect(420, 360, 100, 65);
  ctx.beginPath();
  ctx.moveTo(380, 390);
  ctx.lineTo(420, 390);
  ctx.stroke();

  return canvas.toDataURL('image/png');
}

export function createSampleLandscape(): string {
  if (landscapeAlpineLake) {
    return landscapeAlpineLake;
  }
  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 800;
  const ctx = canvas.getContext('2d')!;

  // Sunset sky gradient
  const sky = ctx.createLinearGradient(0, 0, 0, 500);
  sky.addColorStop(0, '#1e1b4b');
  sky.addColorStop(0.3, '#4338ca');
  sky.addColorStop(0.6, '#ec4899');
  sky.addColorStop(0.85, '#f97316');
  sky.addColorStop(1, '#fde047');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, 1200, 500);

  // Glowing sun
  const sun = ctx.createRadialGradient(600, 360, 20, 600, 360, 180);
  sun.addColorStop(0, '#ffffff');
  sun.addColorStop(0.2, '#fef08a');
  sun.addColorStop(0.5, '#f97316');
  sun.addColorStop(1, 'transparent');
  ctx.fillStyle = sun;
  ctx.beginPath();
  ctx.arc(600, 360, 180, 0, Math.PI * 2);
  ctx.fill();

  // Distant mountain ridge
  ctx.fillStyle = '#4c1d95';
  ctx.beginPath();
  ctx.moveTo(0, 500);
  ctx.lineTo(150, 340);
  ctx.lineTo(380, 430);
  ctx.lineTo(600, 280);
  ctx.lineTo(820, 420);
  ctx.lineTo(1050, 310);
  ctx.lineTo(1200, 480);
  ctx.lineTo(1200, 500);
  ctx.closePath();
  ctx.fill();

  // Near mountain ridge
  ctx.fillStyle = '#1e1b4b';
  ctx.beginPath();
  ctx.moveTo(0, 500);
  ctx.lineTo(250, 380);
  ctx.lineTo(520, 460);
  ctx.lineTo(750, 350);
  ctx.lineTo(980, 440);
  ctx.lineTo(1200, 390);
  ctx.lineTo(1200, 500);
  ctx.closePath();
  ctx.fill();

  // Lake water reflection
  const water = ctx.createLinearGradient(0, 500, 0, 800);
  water.addColorStop(0, '#0f172a');
  water.addColorStop(0.3, '#312e81');
  water.addColorStop(0.6, '#831843');
  water.addColorStop(1, '#020617');
  ctx.fillStyle = water;
  ctx.fillRect(0, 500, 1200, 300);

  // Water reflection shimmer
  ctx.fillStyle = 'rgba(254, 240, 138, 0.4)';
  for (let y = 510; y < 780; y += 12) {
    const width = 100 + (y - 500) * 0.8;
    ctx.fillRect(600 - width / 2, y, width, 3);
  }

  return canvas.toDataURL('image/jpeg', 0.94);
}
