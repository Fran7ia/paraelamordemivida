const canvas = document.getElementById("stars");
const ctx = canvas.getContext("2d");

let w, h, particles;

function resize(){
  const dpr = window.devicePixelRatio || 1;
  w = canvas.width = Math.floor(window.innerWidth * dpr);
  h = canvas.height = Math.floor(window.innerHeight * dpr);
  canvas.style.width = window.innerWidth + "px";
  canvas.style.height = window.innerHeight + "px";
  makeParticles(dpr);
}
window.addEventListener("resize", resize);

function makeParticles(dpr){
  const count = Math.floor((window.innerWidth * window.innerHeight) / 11000);
  const palette = [
    "rgba(255,95,162,0.75)",
    "rgba(255,154,208,0.70)",
    "rgba(183,123,255,0.60)",
    "rgba(255,210,235,0.55)"
  ];

  particles = Array.from({length: Math.max(90, count)}, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    r: (Math.random() * 1.7 + 0.4) * dpr,
    a: Math.random() * 0.55 + 0.25,
    s: (Math.random() * 0.25 + 0.05) * dpr,
    c: palette[Math.floor(Math.random() * palette.length)],
    tw: Math.random() * 0.02 + 0.006
  }));
}

function draw(){
  ctx.clearRect(0,0,w,h);

  const g1 = ctx.createRadialGradient(w*0.25, h*0.25, 0, w*0.25, h*0.25, Math.max(w,h)*0.75);
  g1.addColorStop(0, "rgba(255,95,162,0.18)");
  g1.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = g1;
  ctx.fillRect(0,0,w,h);

  const g2 = ctx.createRadialGradient(w*0.78, h*0.68, 0, w*0.78, h*0.68, Math.max(w,h)*0.8);
  g2.addColorStop(0, "rgba(183,123,255,0.16)");
  g2.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = g2;
  ctx.fillRect(0,0,w,h);

  ctx.save();
  ctx.globalCompositeOperation = "lighter";

  for(const p of particles){
    p.x += p.s;
    if(p.x > w + 20) p.x = -20;

    p.a += (Math.random() - 0.5) * p.tw;
    p.a = Math.max(0.15, Math.min(0.85, p.a));

    ctx.globalAlpha = p.a;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
    ctx.fillStyle = p.c;
    ctx.fill();
  }

  ctx.restore();
  ctx.globalAlpha = 1;

  requestAnimationFrame(draw);
}

resize();
draw();
