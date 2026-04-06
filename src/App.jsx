import { useState, useEffect } from “react”;
import { initializeApp } from “firebase/app”;
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, serverTimestamp, query, orderBy } from “firebase/firestore”;

const firebaseConfig = {
apiKey: “AIzaSyA8J6bK5wiIUgHp4JsvHQQk5d1R”,
authDomain: “aniversario-cc915.firebaseapp.com”,
projectId: “aniversario-cc915”,
storageBucket: “aniversario-cc915.firebasestorage.app”,
messagingSenderId: “942035808793”,
appId: “1:942035808793:web:3f30bf8e306916”,
measurementId: “G-H5Y3Y200DJ”
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function getPage() {
if (typeof window !== “undefined”) {
return window.location.hash === “#admin” ? “admin” : “rsvp”;
}
return “rsvp”;
}

// Confetti pieces
const CONFETTI = [“🎊”,“⭐”,“🌟”,“✨”,“🎈”,“🎉”,“💫”,“🌸”];

function FloatingEmoji() {
const items = Array.from({length: 12}, (_, i) => ({
emoji: CONFETTI[i % CONFETTI.length],
left: `${5 + i * 8}%`,
delay: `${i * 0.4}s`,
duration: `${3 + (i % 3)}s`,
}));
return (
<div style={S.floatWrap}>
{items.map((it, i) => (
<span key={i} style={{
…S.floatEmoji,
left: it.left,
animationDelay: it.delay,
animationDuration: it.duration,
}}>{it.emoji}</span>
))}
</div>
);
}

// ── RSVP Page ────────────────────────────────────────────────────────────────
function RSVPPage() {
const [form, setForm] = useState({ name: “”, guests: “1”, message: “” });
const [status, setStatus] = useState(“idle”);

async function handleSubmit() {
if (!form.name.trim()) return;
setStatus(“loading”);
try {
await addDoc(collection(db, “rsvps”), {
name: form.name.trim(),
guests: parseInt(form.guests) || 1,
message: form.message.trim(),
confirmedAt: serverTimestamp(),
});
setStatus(“success”);
} catch (e) {
console.error(e);
setStatus(“error”);
}
}

if (status === “success”) return (
<div style={S.page}>
<FloatingEmoji />
<div style={S.card}>
<div style={S.successEmoji}>🎂</div>
<h2 style={S.successTitle}>Presença confirmada!</h2>
<p style={S.successText}>
Oba, <strong>{form.name}</strong>!<br/>
Mal podemos esperar para te ver na festa! 🥳
</p>
<div style={S.detailBox}>
<div style={S.detailRow}><span>📅</span><span>18 de abril de 2026 · 15h</span></div>
<div style={S.detailRow}><span>📍</span><span>Av. Getúlio Vargas, 908 — 10º andar · Patos de Minas - MG</span></div>
</div>
</div>
</div>
);

return (
<div style={S.page}>
<FloatingEmoji />

```
  {/* Header */}
  <div style={S.header}>
    <div style={S.headerTag}>De repente</div>
    <div style={S.headerNumber}>30</div>
  </div>

  <div style={S.card}>
    <div style={S.names}>Camila e Fernanda</div>
    <div style={S.detailBox}>
      <div style={S.detailRow}><span>📅</span><span>18 de abril de 2026 · 15h</span></div>
      <div style={S.detailRow}><span>📍</span><span>Av. Getúlio Vargas, 908 — 10º andar<br/>Patos de Minas - MG</span></div>
    </div>

    <div style={S.divider} />

    <p style={S.formTitle}>Confirme sua presença</p>

    <div style={S.form}>
      <label style={S.label}>Seu nome *</label>
      <input
        style={S.input}
        placeholder="Como você se chama?"
        value={form.name}
        onChange={e => setForm(f => ({...f, name: e.target.value}))}
      />

      <label style={S.label}>Quantas pessoas virão com você?</label>
      <select
        style={S.input}
        value={form.guests}
        onChange={e => setForm(f => ({...f, guests: e.target.value}))}
      >
        {[1,2,3,4,5].map(n => (
          <option key={n} value={n}>{n === 1 ? "Só eu 🙋" : `${n} pessoas 👫`}</option>
        ))}
      </select>

      <label style={S.label}>Recado para as aniversariantes (opcional)</label>
      <textarea
        style={{...S.input, height: 80, resize: "vertical"}}
        placeholder="Deixe um recadinho carinhoso..."
        value={form.message}
        onChange={e => setForm(f => ({...f, message: e.target.value}))}
      />

      {status === "error" && <p style={S.errorText}>Algo deu errado. Tente novamente!</p>}

      <button
        style={{...S.btn, opacity: !form.name.trim() || status === "loading" ? 0.6 : 1}}
        onClick={handleSubmit}
        disabled={!form.name.trim() || status === "loading"}
      >
        {status === "loading" ? "Enviando..." : "Confirmar presença 🎊"}
      </button>
    </div>
  </div>

  <p style={S.adminHint}>
    Camila ou Fernanda? <a href="#admin" style={S.link} onClick={() => window.location.reload()}>Ver confirmações →</a>
  </p>
</div>
```

);
}

// ── Admin Page ────────────────────────────────────────────────────────────────
function AdminPage() {
const [rsvps, setRsvps] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => { loadRsvps(); }, []);

async function loadRsvps() {
setLoading(true);
try {
const q = query(collection(db, “rsvps”), orderBy(“confirmedAt”, “desc”));
const snap = await getDocs(q);
setRsvps(snap.docs.map(d => ({id: d.id, …d.data()})));
} catch(e) {
console.error(e);
}
setLoading(false);
}

async function deleteRsvp(id) {
try {
await deleteDoc(doc(db, “rsvps”, id));
setRsvps(r => r.filter(x => x.id !== id));
} catch(e) { console.error(e); }
}

const total = rsvps.reduce((s, r) => s + (r.guests || 1), 0);

return (
<div style={S.page}>
<FloatingEmoji />

```
  <div style={S.header}>
    <div style={S.headerTag}>De repente</div>
    <div style={S.headerNumber}>30</div>
  </div>

  <div style={{...S.card, maxWidth: 560}}>
    <div style={S.names}>Painel das Aniversariantes 🎂</div>

    <div style={S.statsRow}>
      <div style={S.statBox}>
        <span style={S.statNum}>{rsvps.length}</span>
        <span style={S.statLabel}>confirmações</span>
      </div>
      <div style={S.statBox}>
        <span style={S.statNum}>{total}</span>
        <span style={S.statLabel}>pessoas no total</span>
      </div>
    </div>

    <div style={S.shareBox}>
      <p style={S.shareLabel}>🔗 Link para convidados</p>
      <div style={S.shareUrl}>{typeof window !== "undefined" ? window.location.href.replace("#admin","") : ""}</div>
      <button style={S.copyBtn} onClick={() => navigator.clipboard.writeText(window.location.href.replace("#admin",""))}>
        Copiar link
      </button>
    </div>

    <div style={S.divider} />

    {loading ? (
      <p style={S.emptyText}>Carregando...</p>
    ) : rsvps.length === 0 ? (
      <p style={S.emptyText}>Nenhuma confirmação ainda. Compartilhe o link! 🎉</p>
    ) : (
      rsvps.map(r => (
        <div key={r.id} style={S.rsvpRow}>
          <div style={S.avatar}>{r.name[0].toUpperCase()}</div>
          <div style={{flex:1}}>
            <div style={S.rsvpName}>{r.name}</div>
            <div style={S.rsvpMeta}>
              {r.guests === 1 ? "Só ela/ele" : `+ ${r.guests-1} pessoa${r.guests > 2 ? "s" : ""}`}
              {r.confirmedAt?.toDate && ` · ${r.confirmedAt.toDate().toLocaleDateString("pt-BR", {day:"2-digit", month:"short"})}`}
            </div>
            {r.message && <div style={S.rsvpMsg}>💬 {r.message}</div>}
          </div>
          <button style={S.deleteBtn} onClick={() => deleteRsvp(r.id)}>✕</button>
        </div>
      ))
    )}

    <button style={{...S.btn, marginTop:16, background:"rgba(0,0,0,0.08)", color:"#555"}} onClick={loadRsvps}>
      ↻ Atualizar lista
    </button>
  </div>

  <p style={S.adminHint}>
    <a href="#" style={S.link} onClick={() => { window.location.hash=""; window.location.reload(); }}>← Ver página do convidado</a>
  </p>
</div>
```

);
}

export default function App() {
const [page, setPage] = useState(getPage());
useEffect(() => {
const h = () => setPage(getPage());
window.addEventListener(“hashchange”, h);
return () => window.removeEventListener(“hashchange”, h);
}, []);
return page === “admin” ? <AdminPage /> : <RSVPPage />;
}

// ── Styles ────────────────────────────────────────────────────────────────────
const S = {
page: {
minHeight: “100vh”,
background: “#f5f0e8”,
backgroundImage: “url("data:image/svg+xml,%3Csvg width=‘60’ height=‘60’ viewBox=‘0 0 60 60’ xmlns=‘http://www.w3.org/2000/svg’%3E%3Cg fill=‘none’ fill-rule=‘evenodd’%3E%3Cg fill=’%23d4c5a9’ fill-opacity=‘0.2’%3E%3Cpath d=‘M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z’/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")”,
display: “flex”,
flexDirection: “column”,
alignItems: “center”,
padding: “20px 16px 40px”,
fontFamily: “‘Georgia’, serif”,
position: “relative”,
overflow: “hidden”,
},
floatWrap: {
position: “fixed”, top: 0, left: 0, right: 0, height: “100vh”,
pointerEvents: “none”, zIndex: 0, overflow: “hidden”,
},
floatEmoji: {
position: “absolute”, top: “-10%”, fontSize: 20,
animation: “floatDown 4s ease-in infinite”,
opacity: 0.4,
},
header: {
textAlign: “center”, marginBottom: 8, zIndex: 1, position: “relative”,
},
headerTag: {
fontFamily: “‘Georgia’, serif”,
fontSize: 28, fontWeight: 700,
background: “linear-gradient(135deg, #e05c3a, #d4a017, #3a8c4e, #c44569, #4a7fb5)”,
WebkitBackgroundClip: “text”, WebkitTextFillColor: “transparent”,
letterSpacing: 2, textTransform: “uppercase”,
filter: “drop-shadow(1px 1px 0 rgba(0,0,0,0.1))”,
},
headerNumber: {
fontSize: 72, fontWeight: 900, lineHeight: 1,
background: “linear-gradient(135deg, #d4a017, #c8880a)”,
WebkitBackgroundClip: “text”, WebkitTextFillColor: “transparent”,
filter: “drop-shadow(2px 2px 0 rgba(212,160,23,0.3))”,
},
card: {
background: “rgba(255,255,255,0.85)”,
backdropFilter: “blur(10px)”,
border: “2px solid rgba(212,160,23,0.2)”,
borderRadius: 20,
padding: “28px 24px”,
width: “100%”, maxWidth: 480,
boxShadow: “0 8px 32px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)”,
zIndex: 1, position: “relative”,
},
names: {
fontSize: 22, fontWeight: 700, textAlign: “center”,
color: “#2d2d2d”, marginBottom: 16, letterSpacing: 0.5,
},
detailBox: {
background: “linear-gradient(135deg, #fef9ec, #fdf0f4)”,
border: “1px solid rgba(212,160,23,0.25)”,
borderRadius: 12, padding: “12px 16px”,
display: “flex”, flexDirection: “column”, gap: 8,
},
detailRow: {
display: “flex”, gap: 10, fontSize: 14, color: “#444”,
alignItems: “flex-start”, lineHeight: 1.5,
},
divider: {
height: 1, background: “linear-gradient(90deg, transparent, rgba(212,160,23,0.3), transparent)”,
margin: “20px 0”,
},
formTitle: {
fontSize: 16, fontWeight: 700, color: “#2d2d2d”,
textAlign: “center”, marginBottom: 12, marginTop: 0,
},
form: { display: “flex”, flexDirection: “column”, gap: 10 },
label: { fontSize: 12, color: “#888”, fontFamily: “sans-serif”, marginBottom: -6 },
input: {
background: “#fafafa”, border: “1.5px solid #e5ddd0”,
borderRadius: 10, padding: “12px 14px”, fontSize: 15,
color: “#2d2d2d”, outline: “none”, fontFamily: “sans-serif”,
width: “100%”, boxSizing: “border-box”,
},
btn: {
background: “linear-gradient(135deg, #e05c3a, #c44569)”,
border: “none”, borderRadius: 12, padding: “14px”,
fontSize: 16, color: “#fff”, fontWeight: 700,
cursor: “pointer”, fontFamily: “sans-serif”,
letterSpacing: 0.3, marginTop: 4,
},
errorText: { color: “#e05c3a”, fontSize: 13, margin: 0, fontFamily: “sans-serif” },
successEmoji: { fontSize: 56, textAlign: “center”, marginBottom: 8 },
successTitle: { fontSize: 24, textAlign: “center”, color: “#2d2d2d”, margin: “0 0 8px” },
successText: { textAlign: “center”, color: “#666”, lineHeight: 1.6, margin: “0 0 16px” },
adminHint: { marginTop: 12, fontSize: 13, color: “#888”, fontFamily: “sans-serif”, zIndex: 1 },
link: { color: “#c44569”, textDecoration: “none”, fontWeight: 600 },
// Admin
statsRow: { display: “flex”, gap: 10, marginBottom: 16 },
statBox: {
flex: 1, background: “linear-gradient(135deg, #fef9ec, #fdf0f4)”,
border: “1px solid rgba(212,160,23,0.2)”,
borderRadius: 12, padding: “12px”, display: “flex”,
flexDirection: “column”, alignItems: “center”,
},
statNum: { fontSize: 28, fontWeight: 800, color: “#c44569” },
statLabel: { fontSize: 11, color: “#888”, fontFamily: “sans-serif” },
shareBox: {
background: “#fafafa”, border: “1.5px dashed #e5ddd0”,
borderRadius: 12, padding: “14px”, marginBottom: 4,
},
shareLabel: { margin: “0 0 6px”, fontSize: 13, fontWeight: 700, color: “#c44569” },
shareUrl: { fontSize: 11, color: “#888”, wordBreak: “break-all”, marginBottom: 8, fontFamily: “monospace” },
copyBtn: {
background: “#c44569”, border: “none”, borderRadius: 8,
padding: “8px 14px”, color: “#fff”, cursor: “pointer”,
fontFamily: “sans-serif”, fontSize: 13, fontWeight: 600,
},
emptyText: { textAlign: “center”, color: “#888”, fontFamily: “sans-serif”, padding: “16px 0” },
rsvpRow: {
display: “flex”, alignItems: “flex-start”, gap: 12,
padding: “12px 0”, borderBottom: “1px solid #f0e8dc”,
},
avatar: {
width: 38, height: 38, borderRadius: “50%”,
background: “linear-gradient(135deg, #e05c3a, #c44569)”,
display: “flex”, alignItems: “center”, justifyContent: “center”,
fontWeight: 700, fontSize: 16, color: “#fff”, flexShrink: 0,
},
rsvpName: { fontWeight: 700, fontSize: 15, color: “#2d2d2d”, marginBottom: 2 },
rsvpMeta: { fontSize: 12, color: “#888”, fontFamily: “sans-serif” },
rsvpMsg: { fontSize: 13, color: “#555”, marginTop: 4, fontStyle: “italic” },
deleteBtn: {
background: “none”, border: “none”, color: “#ccc”,
cursor: “pointer”, fontSize: 14, padding: “4px”,
},
};

// Inject animation
if (typeof document !== “undefined”) {
const style = document.createElement(“style”);
style.textContent = `@keyframes floatDown { 0% { transform: translateY(-10%) rotate(0deg); opacity: 0; } 10% { opacity: 0.4; } 90% { opacity: 0.3; } 100% { transform: translateY(110vh) rotate(360deg); opacity: 0; } }`;
document.head.appendChild(style);
}
