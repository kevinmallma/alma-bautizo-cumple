const canvas = document.getElementById("ocean");
const ctx = canvas.getContext("2d");
let W,
  H,
  t = 0;
let fish = [],
  bubbles = [],
  seaweeds = [],
  corals = [],
  pebbles = [];

function rnd(a, b) {
  return a + (b - a) * Math.random();
}

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  W = canvas.width;
  H = canvas.height;
  initScene();
}

const PALETTES = [
  {
    body: "#FF7D3A",
    belly: "#FFBE8A",
    fin: "#D95000",
    stripe: "#FF4500",
    shine: "#FFD0A0",
    pupil: "#111",
  },
  {
    body: "#00C2C7",
    belly: "#90EEF0",
    fin: "#007A8A",
    stripe: "#00A5B0",
    shine: "#C0F4F5",
    pupil: "#023E8A",
  },
  {
    body: "#FFD600",
    belly: "#FFF0A0",
    fin: "#C47A00",
    stripe: "#FF9900",
    shine: "#FFEC6A",
    pupil: "#3A1A00",
  },
  {
    body: "#FF4D8B",
    belly: "#FFB3CC",
    fin: "#B3004F",
    stripe: "#FF007A",
    shine: "#FFCCE0",
    pupil: "#3A0020",
  },
  {
    body: "#7B5CF0",
    belly: "#C9B8FF",
    fin: "#3D1FA0",
    stripe: "#5A3FD0",
    shine: "#D8CCFF",
    pupil: "#1A0044",
  },
  {
    body: "#00B761",
    belly: "#90F0C0",
    fin: "#006830",
    stripe: "#00953A",
    shine: "#AAFFD4",
    pupil: "#001A0A",
  },
  {
    body: "#4FC3F7",
    belly: "#B3E9FF",
    fin: "#0277BD",
    stripe: "#039BE5",
    shine: "#CCF0FF",
    pupil: "#01234F",
  },
  {
    body: "#FF6B35",
    belly: "#FFD0B0",
    fin: "#A03000",
    stripe: "#D04A10",
    shine: "#FFE0C0",
    pupil: "#222",
  },
];

function makeFish() {
  const fromLeft = Math.random() < 0.5;
  const pal = PALETTES[Math.floor(Math.random() * PALETTES.length)];
  const s = rnd(0.6, 1.7);
  const speed = rnd(0.5, 1.6) * s;
  const types = ["normal", "normal", "round", "fancy"];
  const type = types[Math.floor(Math.random() * types.length)];
  return {
    x: fromLeft ? rnd(-180, -60) : rnd(W + 60, W + 180),
    y: rnd(H * 0.07, H * 0.78),
    dir: fromLeft ? 1 : -1,
    vx: (fromLeft ? 1 : -1) * speed,
    vy: 0,
    wave: Math.random() * Math.PI * 2,
    waveSpeed: rnd(0.025, 0.06),
    waveAmp: rnd(0.9, 2.3),
    tail: Math.random() * Math.PI * 2,
    tailSpeed: rnd(0.1, 0.18),
    pal,
    s,
    type,
    depth: rnd(0.3, 1.0),
    blink: 0,
    blinkTimer: rnd(80, 220),
  };
}

function makeSeaweed(x) {
  const segs = Math.floor(rnd(7, 14));
  const h = rnd(55, 130);
  return {
    x,
    segs,
    h,
    segH: h / segs,
    phase: Math.random() * Math.PI * 2,
    speed: rnd(0.018, 0.04),
    baseColor: `hsl(${rnd(100, 155)},${rnd(50, 75)}%,${rnd(28, 45)}%)`,
    leafColor: `hsl(${rnd(100, 155)},${rnd(55, 80)}%,${rnd(38, 58)}%)`,
  };
}

function makeCoral(x) {
  const types = ["fan", "tube", "brain"];
  const colors = [
    "#FF4F6B",
    "#FF8C42",
    "#FF3E9D",
    "#FFD166",
    "#06D6A0",
    "#A78BFA",
    "#60D0E4",
  ];
  return {
    x,
    y: H * 0.895,
    type: types[Math.floor(Math.random() * types.length)],
    color: colors[Math.floor(Math.random() * colors.length)],
    size: rnd(0.7, 1.3),
    phase: Math.random() * Math.PI * 2,
  };
}

function initScene() {
  fish = [];
  seaweeds = [];
  corals = [];
  pebbles = [];
  bubbles = [];
  for (let i = 0; i < 14; i++) fish.push(makeFish());
  const swCount = Math.floor(W / 45);
  for (let i = 0; i < swCount; i++) seaweeds.push(makeSeaweed(rnd(10, W - 10)));
  const coralCount = Math.floor(W / 60);
  for (let i = 0; i < coralCount; i++) corals.push(makeCoral(rnd(20, W - 20)));
  const pebCount = Math.floor(W / 18);
  for (let i = 0; i < pebCount; i++)
    pebbles.push({
      x: rnd(0, W),
      r: rnd(3, 10),
      color: `hsl(210,${rnd(10, 30)}%,${rnd(50, 75)}%)`,
    });
}

function drawBg() {
  const grd = ctx.createLinearGradient(0, 0, 0, H);
  grd.addColorStop(0, "#0096C7");
  grd.addColorStop(0.45, "#0077B6");
  grd.addColorStop(1, "#03045E");
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, W, H);
  for (let i = 0; i < 14; i++) {
    const bx = ((i * 85 + t * 12) % (W + 120)) - 60;
    const by = 20 + Math.sin(t * 0.5 + i * 0.7) * 18;
    ctx.beginPath();
    ctx.ellipse(
      bx,
      by,
      70 + Math.sin(t * 0.3 + i) * 20,
      6,
      0.2,
      0,
      Math.PI * 2,
    );
    ctx.fillStyle = "rgba(220,240,255,0.09)";
    ctx.fill();
  }
}

function drawSand() {
  const sandY = H * 0.88; // Altura donde empieza la arena

  // --- 1. CAPA DE ARENA TRASERA (Para dar profundidad) ---
  ctx.fillStyle = "#01497c";
  ctx.beginPath();
  ctx.moveTo(0, sandY - 10); // Empezamos un poco más arriba
  for (let x = 0; x <= W + 50; x += 50) {
    ctx.lineTo(x, sandY - 10 + Math.sin(x * 0.02 + t * 0.2) * 10);
  }
  ctx.lineTo(W, H); // Bajamos a la esquina inferior derecha
  ctx.lineTo(0, H); // Vamos a la esquina inferior izquierda
  ctx.closePath();
  ctx.fill();

  // --- 2. CAPA DE ARENA PRINCIPAL (La que ves al frente) ---
  const grd = ctx.createLinearGradient(0, sandY, 0, H);
  grd.addColorStop(0, "#4cc9f0"); // Color de la superficie de la arena
  grd.addColorStop(1, "#0077b6"); // Sombra que se pierde en el fondo
  ctx.fillStyle = grd;

  ctx.beginPath();
  ctx.moveTo(0, sandY);
  // Dibujamos la ondulación de la superficie
  for (let x = 0; x <= W + 50; x += 25) {
    ctx.lineTo(x, sandY + Math.sin(x * 0.04 + t * 0.4) * 5);
  }

  // --- EL TRUCO PARA QUE LLEGUE AL FIN DE LA PANTALLA ---
  ctx.lineTo(W, H); // Forzamos la línea hasta el borde inferior derecho
  ctx.lineTo(0, H); // Forzamos la línea hasta el borde inferior izquierdo
  ctx.closePath(); // Cerramos el polígono (esto rellena todo el bloque inferior)
  ctx.fill();

  // --- 3. PIEDRAS (Ancladas a la arena) ---
  pebbles.forEach((p) => {
    // Calculamos la posición Y de la arena en la X de la piedra para que no flote
    const stoneY = sandY + 15 + Math.sin(p.x * 0.04 + t * 0.4) * 5;

    ctx.beginPath();
    ctx.ellipse(p.x, stoneY, p.r, p.r * 0.6, 0, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.fill();

    // Brillo en la piedra
    ctx.fillStyle = "rgba(255,255,255,0.2)";
    ctx.beginPath();
    ctx.ellipse(
      p.x - p.r * 0.2,
      stoneY - p.r * 0.1,
      p.r * 0.4,
      p.r * 0.2,
      0.4,
      0,
      6.28,
    );
    ctx.fill();
  });
}

function drawSeaweed(sw) {
  const baseY = H * 0.885;
  ctx.save();
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  let px = sw.x,
    py = baseY;
  for (let i = 0; i < sw.segs; i++) {
    const progress = (i + 1) / sw.segs;
    const sway =
      Math.sin(t * sw.speed * 40 + sw.phase + i * 0.45) * 7 * progress;
    const nx = sw.x + sway,
      ny = baseY - sw.segH * (i + 1);
    const thick = Math.max(1.2, 3.5 - i * 0.22);
    ctx.strokeStyle = sw.baseColor;
    ctx.lineWidth = thick;
    ctx.beginPath();
    ctx.moveTo(px, py);
    ctx.quadraticCurveTo(px + sway * 0.5, py - sw.segH * 0.5, nx, ny);
    ctx.stroke();
    if (i > 1 && i % 2 === 0) {
      const ld = i % 4 === 0 ? 1 : -1;
      ctx.strokeStyle = sw.leafColor;
      ctx.lineWidth = thick * 0.7;
      ctx.beginPath();
      ctx.moveTo(nx, ny);
      ctx.quadraticCurveTo(
        nx + ld * 14 * progress,
        ny - 6,
        nx + ld * 20 * progress,
        ny + 2,
      );
      ctx.stroke();
    }
    px = nx;
    py = ny;
  }
  ctx.restore();
}

function drawFanCoral(c) {
  ctx.save();
  ctx.translate(c.x, c.y);
  ctx.scale(c.size, c.size);
  const sway = Math.sin(t * 0.7 + c.phase) * 3;
  ctx.strokeStyle = c.color;
  ctx.lineCap = "round";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(sway, -55);
  ctx.stroke();
  for (let a = -45; a <= 45; a += 9) {
    const rad = (a * Math.PI) / 180;
    ctx.beginPath();
    ctx.moveTo(sway * 0.3, -11);
    ctx.quadraticCurveTo(
      sway + Math.sin(rad) * 24,
      -33,
      sway + Math.sin(rad) * 40,
      -49.5 + Math.cos(rad) * 8,
    );
    ctx.lineWidth = 0.8;
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.arc(sway, -55, 40, Math.PI * 0.9, Math.PI * 0.1, true);
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.restore();
}

function drawTubeCoral(c) {
  ctx.save();
  ctx.translate(c.x, c.y);
  ctx.scale(c.size, c.size);
  [
    { dx: -8, h: 40 },
    { dx: 0, h: 52 },
    { dx: 9, h: 44 },
    { dx: -3, h: 35 },
  ].forEach((tb) => {
    const sway = Math.sin(t * 0.9 + c.phase + tb.dx) * 2;
    ctx.fillStyle = c.color;
    ctx.beginPath();
    ctx.moveTo(tb.dx - 4 + sway, 0);
    ctx.lineTo(tb.dx - 5 + sway, -tb.h + 5);
    ctx.quadraticCurveTo(tb.dx + sway, -tb.h - 8, tb.dx + 5 + sway, -tb.h + 5);
    ctx.lineTo(tb.dx + 4 + sway, 0);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.25)";
    ctx.beginPath();
    ctx.ellipse(tb.dx + sway, -tb.h + 2, 4, 3, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(0,0,0,0.2)";
    ctx.beginPath();
    ctx.moveTo(tb.dx - 1 + sway, 0);
    ctx.lineTo(tb.dx - 1.5 + sway, -tb.h + 6);
    ctx.lineTo(tb.dx + 1.5 + sway, -tb.h + 6);
    ctx.lineTo(tb.dx + 1 + sway, 0);
    ctx.closePath();
    ctx.fill();
  });
  ctx.restore();
}

function drawBrainCoral(c) {
  ctx.save();
  ctx.translate(c.x, c.y);
  ctx.scale(c.size, c.size);
  ctx.fillStyle = c.color;
  ctx.beginPath();
  ctx.arc(0, -24, 24, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "rgba(0,0,0,0.2)";
  ctx.lineWidth = 1.2;
  for (let i = 0; i < 5; i++) {
    const a = (i * Math.PI) / 4 - Math.PI * 0.4;
    ctx.beginPath();
    ctx.moveTo(Math.cos(a) * 7.2, -24 + Math.sin(a) * 7.2);
    ctx.quadraticCurveTo(
      Math.cos(a + 0.5) * 16.8,
      -24 + Math.sin(a + 0.5) * 16.8,
      Math.cos(a + 1) * 21.6,
      -24 + Math.sin(a + 1) * 21.6,
    );
    ctx.stroke();
  }
  ctx.fillStyle = "rgba(255,255,255,0.2)";
  ctx.beginPath();
  ctx.ellipse(-7, -32, 7, 4, Math.PI * 0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawFish(f) {
  ctx.save();
  ctx.translate(f.x, f.y);
  ctx.scale(f.dir, 1); // Voltear según dirección
  ctx.globalAlpha = 0.55 + f.depth * 0.45;

  const p = f.pal,
    sc = f.s;
  const bwu = 50,
    bhu = f.type === "round" ? 28 : 20;

  ctx.save();
  ctx.scale(sc, sc);

  // --- 1. ALETA TRASERA (COLA) ---
  // La cola ahora tiene un movimiento de balanceo más fluido
  ctx.save();
  ctx.translate(-bwu * 0.45, 0);
  ctx.rotate(Math.sin(f.tail) * 0.15);
  ctx.fillStyle = p.fin;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  // Creamos una cola con forma de media luna estilizada
  ctx.bezierCurveTo(-15, -15, -25, -12, -22 + Math.sin(f.tail) * 5, -18);
  ctx.bezierCurveTo(-20, -5, -20, 5, -22 + Math.sin(f.tail) * 5, 18);
  ctx.bezierCurveTo(-25, 12, -15, 15, 0, 0);
  ctx.fill();
  ctx.restore();

  // --- 2. CUERPO (FORMA DE GOTA) ---
  const bgrd = ctx.createLinearGradient(-bwu * 0.5, 0, bwu * 0.5, 0);
  bgrd.addColorStop(0, p.fin); // Cola oscura
  bgrd.addColorStop(0.6, p.body); // Cuerpo color base
  bgrd.addColorStop(1, p.shine); // Cabeza brillante

  ctx.fillStyle = bgrd;
  ctx.beginPath();
  // Dibujamos el cuerpo usando dos curvas para que no sea un óvalo perfecto
  ctx.moveTo(bwu * 0.5, 0); // Punta de la nariz
  ctx.bezierCurveTo(bwu * 0.4, -bhu, -bwu * 0.4, -bhu, -bwu * 0.5, 0); // Parte superior
  ctx.bezierCurveTo(-bwu * 0.4, bhu, bwu * 0.4, bhu, bwu * 0.5, 0); // Parte inferior
  ctx.fill();

  // --- 3. ALETA PECTORAL (LATERAL) ---
  // Solo una aleta en el costado para dar efecto 2D/3D
  ctx.save();
  ctx.translate(-bwu * 0.05, bhu * 0.1);
  ctx.rotate(Math.sin(f.tail * 0.7) * 0.4); // Aleteo independiente
  ctx.fillStyle = p.fin;
  ctx.globalAlpha = 0.8;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(8, 2, 12, 12, 4, 15);
  ctx.bezierCurveTo(0, 12, -4, 4, 0, 0);
  ctx.fill();
  ctx.restore();

  // --- 4. OJO ---
  const eyeX = bwu * 0.28,
    eyeY = -bhu * 0.2,
    eyeR = sc > 1 ? 5 : 3.5;

  // Esclerótica
  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.arc(eyeX, eyeY, eyeR, 0, Math.PI * 2);
  ctx.fill();

  // Pupila con parpadeo
  ctx.fillStyle = p.pupil;
  ctx.save();
  ctx.translate(eyeX, eyeY);
  ctx.scale(1, f.blink > 0 ? 1 - f.blink : 1);
  ctx.beginPath();
  ctx.arc(0, 0, eyeR * 0.6, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Brillo pequeño en el ojo
  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.arc(eyeX + eyeR * 0.3, eyeY - eyeR * 0.3, eyeR * 0.2, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore(); // Fin escala sc
  ctx.restore(); // Fin translate general
}

function drawBubble(b) {
  ctx.save();
  ctx.globalAlpha = b.life * 0.55;
  ctx.beginPath();
  ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(180,230,255,0.9)";
  ctx.lineWidth = 1.1;
  ctx.stroke();
  ctx.fillStyle = "rgba(200,240,255,0.1)";
  ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,0.75)";
  ctx.beginPath();
  ctx.arc(b.x - b.r * 0.3, b.y - b.r * 0.3, b.r * 0.22, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function update() {
  t += 0.016;
  fish.forEach((f) => {
    f.wave += f.waveSpeed;
    f.vy = Math.sin(f.wave) * f.waveAmp * 0.14;
    f.x += f.vx;
    f.y += f.vy;
    f.tail += f.tailSpeed;
    f.blinkTimer--;
    if (f.blinkTimer <= 0) {
      f.blinkTimer = rnd(80, 220);
      f.blink = 1;
    }
    if (f.blink > 0) f.blink = Math.max(0, f.blink - 0.12);
    if (f.dir === 1 && f.x > W + 180) {
      f.x = rnd(-180, -60);
      f.y = rnd(H * 0.07, H * 0.78);
    }
    if (f.dir === -1 && f.x < -180) {
      f.x = rnd(W + 60, W + 180);
      f.y = rnd(H * 0.07, H * 0.78);
    }
    f.y = Math.max(18, Math.min(H * 0.78, f.y));
  });
  if (Math.random() < 0.07) {
    bubbles.push({
      x: rnd(15, W - 15),
      y: H * 0.87,
      r: rnd(2, 6),
      vy: -rnd(0.4, 1.1),
      life: 1,
      vx: rnd(-0.15, 0.15),
    });
  }
  bubbles.forEach((b) => {
    b.y += b.vy;
    b.x += b.vx;
    b.life -= 0.0035;
  });
  bubbles = bubbles.filter((b) => b.life > 0 && b.y > -15);
}

function draw() {
  ctx.clearRect(0, 0, W, H);
  drawBg();
  drawSand();
  seaweeds.forEach(drawSeaweed);
  corals.forEach((c) => {
    if (c.type === "fan") drawFanCoral(c);
    else if (c.type === "tube") drawTubeCoral(c);
    else drawBrainCoral(c);
  });
  fish.sort((a, b) => a.depth - b.depth).forEach(drawFish);
  bubbles.forEach(drawBubble);
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}
window.addEventListener("resize", resize);
resize();
loop();
