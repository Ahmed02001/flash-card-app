const KEY = "lexis_v3";
const load = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || [];
  } catch {
    return [];
  }
};
const save = (w) => localStorage.setItem(KEY, JSON.stringify(w));
const esc = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/* SPEECH SYNTHESIS (TTS) */
function speak(text, event) {
  if (event) event.stopPropagation();
  if (!text || text === "your word" || text === "example sentence appears here…") return;
  
  window.speechSynthesis.cancel();
  
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  
  // Find a suitable English voice if loaded
  const voices = window.speechSynthesis.getVoices();
  const englishVoice = voices.find((v) => v.lang.startsWith("en-"));
  if (englishVoice) {
    utterance.voice = englishVoice;
  }
  
  window.speechSynthesis.speak(utterance);
}

let deck = [],
  ci = 0,
  flipped = false;

/* PANELS */
function show(id) {
  document
    .querySelectorAll(".panel")
    .forEach((p) => p.classList.remove("visible"));
  document.getElementById("panel-" + id).classList.add("visible");
  document
    .querySelectorAll("nav button")
    .forEach((b, i) =>
      b.classList.toggle("active", ["add", "list", "flash"][i] === id),
    );
  if (id === "list") renderList();
  if (id === "flash") initFlash();
  if (id === "add") updateStats();
}

/* LIVE PREVIEW */
document.getElementById("f-en").addEventListener("input", (e) => {
  document.getElementById("pv-en").textContent = e.target.value || "your word";
});
document.getElementById("f-ar").addEventListener("input", (e) => {
  document.getElementById("pv-ar").textContent = e.target.value || "كلمتك";
});
document.getElementById("f-ex").addEventListener("input", (e) => {
  document.getElementById("pv-ex").textContent =
    e.target.value || "example sentence appears here…";
});
["f-en", "f-ar", "f-ex"].forEach((id) =>
  document.getElementById(id).addEventListener("keydown", (e) => {
    if (e.key === "Enter") addWord();
  }),
);

/* ADD */
function addWord() {
  const en = document.getElementById("f-en").value.trim();
  const ar = document.getElementById("f-ar").value.trim();
  const ex = document.getElementById("f-ex").value.trim();
  if (!en || !ar) {
    shake(!en ? "f-en" : "f-ar");
    return;
  }
  const words = load();
  words.unshift({ id: Date.now(), en, ar, ex, ts: Date.now() });
  save(words);
  ["f-en", "f-ar", "f-ex"].forEach(
    (id) => (document.getElementById(id).value = ""),
  );
  document.getElementById("pv-en").textContent = "your word";
  document.getElementById("pv-ar").textContent = "كلمتك";
  document.getElementById("pv-ex").textContent =
    "example sentence appears here…";
  const t = document.getElementById("toast");
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 2500);
  updateStats();
  updateBadge();
}
function shake(id) {
  const el = document.getElementById(id);
  el.style.borderColor = "rgba(232,93,71,0.6)";
  el.style.boxShadow = "0 0 0 3px rgba(232,93,71,0.08)";
  setTimeout(() => {
    el.style.borderColor = "";
    el.style.boxShadow = "";
  }, 900);
  el.focus();
}
function updateStats() {
  const w = load();
  document.getElementById("s-total").textContent = w.length;
  const today = new Date().toDateString();
  document.getElementById("s-today").textContent = w.filter(
    (x) => new Date(x.ts).toDateString() === today,
  ).length;
  document.getElementById("s-last").textContent = w.length
    ? new Date(w[0].ts).toLocaleDateString("en", {
        month: "short",
        day: "numeric",
      })
    : "—";
}
function updateBadge() {
  const c = load().length;
  document.getElementById("badge").textContent =
    c + " word" + (c !== 1 ? "s" : "");
}

/* LIST */
function renderList() {
  const q = document.getElementById("search").value.toLowerCase();
  let w = load();
  if (q)
    w = w.filter((x) => x.en.toLowerCase().includes(q) || x.ar.includes(q));
  document.getElementById("cnt").textContent =
    w.length + " word" + (w.length !== 1 ? "s" : "");
  const g = document.getElementById("word-grid");
  if (!w.length) {
    g.innerHTML = `<div class="empty-msg"><span>EMPTY</span>${q ? "No matches found." : "Add words from the Add panel."}</div>`;
    return;
  }
  g.innerHTML = w
    .map(
      (x) => `
    <div class="wcard">
      <button class="wc-del" onclick="delWord(${x.id})">✕</button>
      <div class="wc-en-wrap">
        <div class="wc-en">${esc(x.en)}</div>
        <button class="speak-btn sm" onclick="speak(this.previousElementSibling.textContent, event)" title="Listen">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
          </svg>
        </button>
      </div>
      <div class="wc-ar">${esc(x.ar)}</div>
      ${x.ex ? `<div class="wc-ex">${esc(x.ex)}</div>` : ""}
    </div>`,
    )
    .join("");
}
function delWord(id) {
  save(load().filter((w) => w.id !== id));
  renderList();
  updateBadge();
  updateStats();
}

/* FLASH */
function initFlash() {
  const w = load();
  const r = document.getElementById("flash-root");
  if (!w.length) {
    r.innerHTML = `<div class="no-flash"><big>EMPTY DECK</big><p>Add words first, then come back to study.</p></div>`;
    return;
  }
  deck = [...w];
  ci = 0;
  flipped = false;
  renderFlash(r);
}
function renderFlash(r) {
  r.innerHTML = `
    <div class="flash-wrap">
      <div>
        <div class="flash-top">
          <div class="fpos"><strong id="ci-n">1</strong> / <span id="ci-t">${deck.length}</span></div>
          <div class="prog-track"><div class="prog-bar" id="prog" style="width:${((1 / deck.length) * 100).toFixed(1)}%"></div></div>
        </div>
        <div class="scene" id="scene" onclick="flipCard()">
          <div class="flipper" id="flipper">
            <div class="face face-f">
              <span class="ctag">English — tap to reveal</span>
              <div class="c-en-wrap">
                <div class="c-en-w" id="c-en"></div>
                <button class="speak-btn" onclick="speak(deck[ci].en, event)" title="Listen">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
                  </svg>
                </button>
              </div>
              <div class="c-en-ex" id="c-ex"></div>
            </div>
            <div class="face face-b">
              <span class="ctag">الترجمة العربية</span>
              <div class="c-ar-w" id="c-ar"></div>
            </div>
          </div>
        </div>
        <p class="flip-hint"><span>↕</span> &nbsp; CLICK CARD OR PRESS SPACE TO FLIP</p>
        <div class="card-acts">
          <button class="ca" id="pbtn" onclick="nav(-1)">← Prev</button>
          <button class="ca flip" onclick="flipCard()">Flip Card</button>
          <button class="ca" id="nbtn" onclick="nav(1)">Next →</button>
        </div>
      </div>
      <div class="sidebar">
        <div class="sbox">
          <div class="stitle">Options</div>
          <div class="tog-row">Shuffle Deck
            <label class="tog">
              <input type="checkbox" id="shuf" onchange="reshuffle()">
              <div class="tog-track"></div>
              <div class="tog-thumb"></div>
            </label>
          </div>
          <button class="rst-btn" onclick="restart()">↺ &nbsp; Restart Deck</button>
        </div>
        <div class="sbox">
          <div class="stitle">Deck — ${deck.length} cards</div>
          <div class="deck-list" id="dl"></div>
        </div>
      </div>
    </div>`;
  updateCard();
}
function updateCard() {
  const w = deck[ci];
  document.getElementById("c-en").textContent = w.en;
  document.getElementById("c-ex").textContent = w.ex || "";
  document.getElementById("c-ar").textContent = w.ar;
  document.getElementById("ci-n").textContent = ci + 1;
  document.getElementById("prog").style.width =
    (((ci + 1) / deck.length) * 100).toFixed(1) + "%";
  document.getElementById("pbtn").disabled = ci === 0;
  document.getElementById("nbtn").disabled = ci === deck.length - 1;
  document.getElementById("flipper").classList.remove("flipped");
  flipped = false;
  document.getElementById("dl").innerHTML = deck
    .map(
      (d, i) => `
    <div class="di ${i === ci ? "cur" : ""}" onclick="jumpTo(${i})">
      <span class="di-n">${String(i + 1).padStart(2, "0")}</span>
      <span class="di-w">${esc(d.en)}</span>
    </div>`,
    )
    .join("");
  const active = document.querySelector(".di.cur");
  if (active) active.scrollIntoView({ block: "nearest", behavior: "smooth" });
}
function flipCard() {
  flipped = !flipped;
  document.getElementById("flipper").classList.toggle("flipped", flipped);
}
function nav(d) {
  ci = Math.max(0, Math.min(deck.length - 1, ci + d));
  updateCard();
}
function jumpTo(i) {
  ci = i;
  updateCard();
}
function restart() {
  ci = 0;
  updateCard();
}
function reshuffle() {
  deck = document.getElementById("shuf").checked
    ? shuffle([...load()])
    : [...load()];
  ci = 0;
  updateCard();
}
function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

document.addEventListener("keydown", (e) => {
  if (!document.getElementById("panel-flash").classList.contains("visible"))
    return;
  if (e.key === " ") {
    e.preventDefault();
    flipCard();
  }
  if (e.key === "ArrowRight") nav(1);
  if (e.key === "ArrowLeft") nav(-1);
});

updateStats();
updateBadge();
