const gate = document.getElementById("gate");
const main = document.getElementById("main");

const typeEl = document.getElementById("type");
const pwd = document.getElementById("pwd");
const confirmBtn = document.getElementById("confirmBtn");
const authMsg = document.getElementById("authMsg");

const loader = document.getElementById("loader");
const barFill = document.getElementById("barFill");
const enterBtn = document.getElementById("enterBtn");

// Audios
const bgAudio = document.getElementById("bgAudio");
const feelAudio = document.getElementById("feelAudio");
const wantAudio = document.getElementById("wantAudio");

const lines = [
  "Iniciando protocolo...",
  "Conectando con el recuerdo...",
  "Ubicación confirmada: Vía Láctea",
  "Frecuencia emocional: estable",
  "Nivel de amorrr: infinito",
  "",
  "Listo para confirmar identidad."
];

let i = 0, j = 0;

function typeNext(){
  if(i >= lines.length) return;
  const line = lines[i];

  if(j <= line.length){
    typeEl.textContent =
      lines.slice(0,i).join("\n") + "\n" + line.slice(0,j) + (j < line.length ? "▌" : "");
    j++;
    setTimeout(typeNext, 22 + Math.random()*35);
  } else {
    i++; j = 0;
    setTimeout(typeNext, 220);
  }
}
typeNext();

function setMsg(text, kind){
  authMsg.textContent = text;
  authMsg.classList.remove("err","ok");
  if(kind) authMsg.classList.add(kind);
}

function normalize(s){
  return (s ?? "").trim().toLowerCase();
}

async function tryPlay(audioEl){
  try{
    audioEl.currentTime = 0;
    await audioEl.play();
  } catch (e){}
}

function stopAudio(audioEl){
  try{ audioEl.pause(); audioEl.currentTime = 0; } catch(e){}
}
function pauseAudio(audioEl){
  try{ audioEl.pause(); } catch(e){}
}

function resumeBg(){
  stopAudio(feelAudio);
  stopAudio(wantAudio);
  tryPlay(bgAudio);
}

confirmBtn.addEventListener("click", async () => {
  const value = normalize(pwd.value);
  if(value !== "samy"){
    setMsg("Identidad no confirmada. Intenta de nuevo.", "err");
    return;
  }

  setMsg("Identidad confirmada ✅", "ok");
  confirmBtn.disabled = true;
  pwd.disabled = true;

  loader.hidden = false;

  let p = 0;
  const timer = setInterval(() => {
    p += 4 + Math.random()*6;
    p = Math.min(100, p);
    barFill.style.width = p + "%";
    if(p >= 100){
      clearInterval(timer);
      enterBtn.hidden = false;
      enterBtn.disabled = false;
    }
  }, 120);
});

pwd.addEventListener("keydown", (e) => {
  if(e.key === "Enter") confirmBtn.click();
});

enterBtn.addEventListener("click", async () => {
  gate.classList.remove("active");
  gate.setAttribute("aria-hidden", "true");
  main.classList.add("active");
  main.setAttribute("aria-hidden", "false");
  window.scrollTo({top:0, behavior:"instant"});

  stopAudio(feelAudio);
  stopAudio(wantAudio);
  await tryPlay(bgAudio);
});

document.querySelectorAll(".actionCard").forEach(btn => {
  btn.addEventListener("click", async () => {
    const id = btn.dataset.modal;
    const dialog = document.getElementById(id);

    pauseAudio(bgAudio);

    if(id === "feel"){
      stopAudio(wantAudio);
      await tryPlay(feelAudio);
    } else if(id === "want"){
      stopAudio(feelAudio);
      await tryPlay(wantAudio);
    }

    dialog.showModal();
  });
});

document.querySelectorAll("[data-close]").forEach(btn => {
  btn.addEventListener("click", () => {
    const dialog = btn.closest("dialog");
    dialog.close();
    resumeBg();
  });
});

["feel","want"].forEach(id => {
  const d = document.getElementById(id);
  d.addEventListener("close", () => resumeBg());
});
