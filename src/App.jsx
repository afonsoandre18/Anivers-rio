import { useState, useEffect } from “react”;

const PARTY_KEY = “birthday-party-config”;
const RSVP_KEY = “birthday-rsvps”;

// Detect which “page” to show based on URL hash
function getPage() {
if (typeof window !== “undefined”) {
return window.location.hash === “#admin” ? “admin” : “rsvp”;
}
return “rsvp”;
}

// ── RSVP Page (for guests) ──────────────────────────────────────────────────
function RSVPPage() {
const [config, setConfig] = useState(null);
const [form, setForm] = useState({ name: “”, guests: “1”, message: “” });
const [status, setStatus] = useState(“idle”); // idle | success | error | already

useEffect(() => {
async function load() {
try {
const res = await window.storage.get(PARTY_KEY, true);
if (res) setConfig(JSON.parse(res.value));
else setConfig({ host: “Aniversariante”, date: “”, place: “”, theme: “” });
} catch {
setConfig({ host: “Aniversariante”, date: “”, place: “”, theme: “” });
}
}
load();
}, []);

async function handleSubmit() {
if (!form.name.trim()) return;
try {
const rsvpKey = `rsvp-${Date.now()}-${Math.random().toString(36).slice(2)}`;
const entry = {
id: rsvpKey,
name: form.name.trim(),
guests: parseInt(form.guests) || 1,
message: form.message.trim(),
confirmedAt: new Date().toISOString(),
};
await window.storage.set(rsvpKey, JSON.stringify(entry), true);
setStatus(“success”);
} catch {
setStatus(“error”);
}
}

if (!config) return (
<div style={styles.loading}>
<div style={styles.dot} />
</div>
);

if (status === “success”) return (
<div style={styles.wrap}>
<div style={styles.card}>
<div style={styles.successIcon}>🎉</div>
<h2 style={styles.successTitle}>Presença confirmada!</h2>
<p style={styles.successText}>
Oba, <strong>{form.name}</strong>! Sua presença foi registrada.<br />
Mal podemos esperar para te ver na festa!
</p>
</div>
</div>
);

const dateStr = config.date
? new Date(config.date + “T12:00:00”).toLocaleDateString(“pt-BR”, {
weekday: “long”, day: “numeric”, month: “long”, year: “numeric”
})
: null;

return (
<div style={styles.wrap}>
{/* Background blobs */}
<div style={styles.blob1} />
<div style={styles.blob2} />

```
  <div style={styles.card}>
    <div style={styles.confetti}>🎂</div>
    <h1 style={styles.title}>
      Você está convidado(a)!
    </h1>
    <p style={styles.subtitle}>
      Confirme sua presença na festa de <strong>{config.host}</strong>
    </p>

    {(dateStr || config.place) && (
      <div style={styles.infoBox}>
        {dateStr && <div style={styles.infoRow}><span>📅</span><span>{dateStr}</span></div>}
        {config.place && <div style={styles.infoRow}><span>📍</span><span>{config.place}</span></div>}
        {config.theme && <div style={styles.infoRow}><span>✨</span><span>Tema: {config.theme}</span></div>}
      </div>
    )}

    <div style={styles.form}>
      <label style={styles.label}>Seu nome *</label>
      <input
        style={styles.input}
        placeholder="Como você se chama?"
        value={form.name}
        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
      />

      <label style={styles.label}>Quantas pessoas virão com você?</label>
      <select
        style={styles.input}
        value={form.guests}
        onChange={e => setForm(f => ({ ...f, guests: e.target.value }))}
      >
        {[1,2,3,4,5].map(n => (
          <option key={n} value={n}>{n === 1 ? "Só eu" : `${n} pessoas`}</option>
        ))}
      </select>

      <label style={styles.label}>Mensagem para o(a) aniversariante (opcional)</label>
      <textarea
        style={{ ...styles.input, height: 90, resize: "vertical" }}
        placeholder="Deixe um recadinho carinhoso..."
        value={form.message}
        onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
      />

      {status === "error" && (
        <p style={styles.errorText}>Algo deu errado. Tente novamente.</p>
      )}

      <button
        style={styles.btn}
        onClick={handleSubmit}
        disabled={!form.name.trim()}
      >
        Confirmar presença 🎊
      </button>
    </div>
  </div>
  <p style={styles.hint}>
    Aniversariante? <a href="#admin" style={styles.link} onClick={() => window.location.reload()}>Ver confirmações</a>
  </p>
</div>
```

);
}

// ── Admin Page (for the birthday person) ───────────────────────────────────
function AdminPage() {
const [config, setConfig] = useState({ host: “”, date: “”, place: “”, theme: “” });
const [rsvps, setRsvps] = useState([]);
const [tab, setTab] = useState(“list”); // list | config
const [saved, setSaved] = useState(false);
const [loading, setLoading] = useState(true);

useEffect(() => { loadAll(); }, []);

async function loadAll() {
setLoading(true);
try {
const cfgRes = await window.storage.get(PARTY_KEY, true);
if (cfgRes) setConfig(JSON.parse(cfgRes.value));

```
  const keys = await window.storage.list("rsvp-", true);
  const entries = await Promise.all(
    (keys?.keys || []).map(async k => {
      try {
        const r = await window.storage.get(k, true);
        return r ? JSON.parse(r.value) : null;
      } catch { return null; }
    })
  );
  setRsvps(entries.filter(Boolean).sort((a, b) => new Date(b.confirmedAt) - new Date(a.confirmedAt)));
} catch (e) {
  console.error(e);
}
setLoading(false);
```

}

async function saveConfig() {
await window.storage.set(PARTY_KEY, JSON.stringify(config), true);
setSaved(true);
setTimeout(() => setSaved(false), 2000);
}

async function deleteRsvp(id) {
try {
await window.storage.delete(id, true);
setRsvps(r => r.filter(x => x.id !== id));
} catch {}
}

const totalGuests = rsvps.reduce((s, r) => s + (r.guests || 1), 0);

return (
<div style={styles.wrap}>
<div style={styles.blob1} />
<div style={styles.blob2} />

```
  <div style={{ ...styles.card, maxWidth: 640 }}>
    <div style={styles.adminHeader}>
      <div>
        <div style={styles.confetti}>🎂</div>
        <h1 style={styles.title}>Painel da Festa</h1>
      </div>
    </div>

    <div style={styles.tabs}>
      <button style={tab === "list" ? styles.tabActive : styles.tabInactive} onClick={() => setTab("list")}>
        Lista de confirmados
      </button>
      <button style={tab === "config" ? styles.tabActive : styles.tabInactive} onClick={() => setTab("config")}>
        Configurar festa
      </button>
    </div>

    {tab === "config" && (
      <div style={styles.form}>
        <p style={styles.configNote}>
          Preencha os dados da sua festa. Essas informações aparecem na página de confirmação que você envia para os convidados.
        </p>
        <label style={styles.label}>Seu nome (aniversariante)</label>
        <input style={styles.input} placeholder="Ex: João" value={config.host}
          onChange={e => setConfig(c => ({ ...c, host: e.target.value }))} />

        <label style={styles.label}>Data da festa</label>
        <input style={styles.input} type="date" value={config.date}
          onChange={e => setConfig(c => ({ ...c, date: e.target.value }))} />

        <label style={styles.label}>Local</label>
        <input style={styles.input} placeholder="Ex: Rua das Flores, 123 — São Paulo" value={config.place}
          onChange={e => setConfig(c => ({ ...c, place: e.target.value }))} />

        <label style={styles.label}>Tema (opcional)</label>
        <input style={styles.input} placeholder="Ex: Anos 80, Havaiana, Branco e Dourado…" value={config.theme}
          onChange={e => setConfig(c => ({ ...c, theme: e.target.value }))} />

        <button style={styles.btn} onClick={saveConfig}>
          {saved ? "✅ Salvo!" : "Salvar configurações"}
        </button>

        <div style={styles.shareBox}>
          <p style={styles.shareTitle}>🔗 Link para compartilhar com os convidados</p>
          <div style={styles.shareUrl}>{typeof window !== "undefined" ? window.location.href.replace("#admin", "") : ""}</div>
          <button style={styles.copyBtn} onClick={() => {
            const url = window.location.href.replace("#admin", "");
            navigator.clipboard.writeText(url);
          }}>
            Copiar link
          </button>
        </div>
      </div>
    )}

    {tab === "list" && (
      <div>
        {loading ? (
          <p style={styles.emptyText}>Carregando...</p>
        ) : rsvps.length === 0 ? (
          <div style={styles.emptyBox}>
            <p>Nenhuma confirmação ainda.</p>
            <p style={{ fontSize: 13, opacity: 0.6 }}>Compartilhe o link com seus convidados!</p>
          </div>
        ) : (
          <>
            <div style={styles.statsRow}>
              <div style={styles.statBox}>
                <span style={styles.statNum}>{rsvps.length}</span>
                <span style={styles.statLabel}>confirmações</span>
              </div>
              <div style={styles.statBox}>
                <span style={styles.statNum}>{totalGuests}</span>
                <span style={styles.statLabel}>pessoas no total</span>
              </div>
            </div>
            {rsvps.map(r => (
              <div key={r.id} style={styles.rsvpItem}>
                <div style={styles.rsvpAvatar}>{r.name[0].toUpperCase()}</div>
                <div style={{ flex: 1 }}>
                  <div style={styles.rsvpName}>{r.name}</div>
                  <div style={styles.rsvpMeta}>
                    {r.guests === 1 ? "Só ela/ele" : `+ ${r.guests - 1} pessoa${r.guests > 2 ? "s" : ""}`}
                    {" · "}
                    {new Date(r.confirmedAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                  </div>
                  {r.message && <div style={styles.rsvpMsg}>💬 {r.message}</div>}
                </div>
                <button style={styles.deleteBtn} onClick={() => deleteRsvp(r.id)} title="Remover">✕</button>
              </div>
            ))}
          </>
        )}
        <button style={{ ...styles.btn, marginTop: 16, background: "rgba(255,255,255,0.1)" }} onClick={loadAll}>
          ↻ Atualizar lista
        </button>
      </div>
    )}
  </div>
  <p style={styles.hint}>
    <a href="#" style={styles.link} onClick={() => { window.location.hash = ""; window.location.reload(); }}>← Ver página do convidado</a>
  </p>
</div>
```

);
}

// ── Root ─────────────────────────────────────────────────────────────────────
export default function App() {
const [page, setPage] = useState(getPage());
useEffect(() => {
const handler = () => setPage(getPage());
window.addEventListener(“hashchange”, handler);
return () => window.removeEventListener(“hashchange”, handler);
}, []);
return page === “admin” ? <AdminPage /> : <RSVPPage />;
}

// ── Styles ────────────────────────────────────────────────────────────────────
const C = {
bg: “#0f0a1e”,
card: “rgba(255,255,255,0.06)”,
border: “rgba(255,255,255,0.1)”,
accent: “#f97316”,
accent2: “#ec4899”,
text: “#f1f5f9”,
muted: “#94a3b8”,
};

const styles = {
loading: { height: “100vh”, display: “flex”, alignItems: “center”, justifyContent: “center”, background: C.bg },
dot: { width: 12, height: 12, borderRadius: “50%”, background: C.accent, animation: “pulse 1s infinite” },
wrap: {
minHeight: “100vh”, background: C.bg, display: “flex”, flexDirection: “column”,
alignItems: “center”, justifyContent: “center”, padding: “32px 16px”,
fontFamily: “‘Georgia’, serif”, color: C.text, position: “relative”, overflow: “hidden”,
},
blob1: {
position: “fixed”, top: “-20%”, right: “-10%”, width: 500, height: 500,
borderRadius: “50%”, background: “radial-gradient(circle, rgba(249,115,22,0.15) 0%, transparent 70%)”,
pointerEvents: “none”,
},
blob2: {
position: “fixed”, bottom: “-20%”, left: “-10%”, width: 500, height: 500,
borderRadius: “50%”, background: “radial-gradient(circle, rgba(236,72,153,0.12) 0%, transparent 70%)”,
pointerEvents: “none”,
},
card: {
background: C.card, border: `1px solid ${C.border}`, borderRadius: 24,
padding: “40px 36px”, width: “100%”, maxWidth: 480,
backdropFilter: “blur(20px)”, position: “relative”, zIndex: 1,
},
confetti: { fontSize: 48, textAlign: “center”, marginBottom: 8 },
title: { fontSize: 28, fontWeight: 700, textAlign: “center”, margin: “0 0 8px”, color: “#fff” },
subtitle: { fontSize: 16, textAlign: “center”, color: C.muted, margin: “0 0 24px” },
infoBox: {
background: “rgba(249,115,22,0.08)”, border: “1px solid rgba(249,115,22,0.2)”,
borderRadius: 12, padding: “14px 18px”, marginBottom: 24, display: “flex”, flexDirection: “column”, gap: 8,
},
infoRow: { display: “flex”, gap: 10, fontSize: 14, color: C.text, alignItems: “flex-start” },
form: { display: “flex”, flexDirection: “column”, gap: 12 },
label: { fontSize: 13, color: C.muted, marginBottom: -6, fontFamily: “sans-serif” },
input: {
background: “rgba(255,255,255,0.06)”, border: `1px solid ${C.border}`,
borderRadius: 10, padding: “12px 14px”, fontSize: 15, color: C.text,
outline: “none”, fontFamily: “sans-serif”, width: “100%”, boxSizing: “border-box”,
},
btn: {
background: `linear-gradient(135deg, ${C.accent}, ${C.accent2})`,
border: “none”, borderRadius: 12, padding: “14px”, fontSize: 16,
color: “#fff”, fontWeight: 700, cursor: “pointer”, marginTop: 8,
fontFamily: “sans-serif”, letterSpacing: 0.3,
},
errorText: { color: “#f87171”, fontSize: 13, margin: 0 },
successIcon: { fontSize: 64, textAlign: “center” },
successTitle: { fontSize: 26, textAlign: “center”, color: “#fff”, margin: “8px 0” },
successText: { textAlign: “center”, color: C.muted, lineHeight: 1.6, margin: 0 },
hint: { marginTop: 16, fontSize: 13, color: C.muted, fontFamily: “sans-serif”, zIndex: 1 },
link: { color: C.accent, textDecoration: “none” },
// Admin
adminHeader: { display: “flex”, justifyContent: “space-between”, alignItems: “flex-start” },
tabs: { display: “flex”, gap: 4, marginBottom: 24, background: “rgba(255,255,255,0.05)”, borderRadius: 10, padding: 4 },
tabActive: {
flex: 1, padding: “10px 0”, background: `linear-gradient(135deg, ${C.accent}, ${C.accent2})`,
border: “none”, borderRadius: 8, color: “#fff”, fontWeight: 700, cursor: “pointer”, fontFamily: “sans-serif”, fontSize: 13,
},
tabInactive: {
flex: 1, padding: “10px 0”, background: “transparent”,
border: “none”, borderRadius: 8, color: C.muted, cursor: “pointer”, fontFamily: “sans-serif”, fontSize: 13,
},
configNote: { fontSize: 13, color: C.muted, marginTop: 0, lineHeight: 1.5 },
shareBox: {
marginTop: 8, background: “rgba(249,115,22,0.08)”, border: “1px solid rgba(249,115,22,0.2)”,
borderRadius: 12, padding: “16px”,
},
shareTitle: { margin: “0 0 8px”, fontSize: 13, fontWeight: 700, color: C.accent },
shareUrl: { fontSize: 12, color: C.muted, wordBreak: “break-all”, marginBottom: 10, fontFamily: “monospace” },
copyBtn: {
background: C.accent, border: “none”, borderRadius: 8, padding: “8px 16px”,
color: “#fff”, cursor: “pointer”, fontFamily: “sans-serif”, fontSize: 13, fontWeight: 600,
},
statsRow: { display: “flex”, gap: 12, marginBottom: 16 },
statBox: {
flex: 1, background: “rgba(255,255,255,0.05)”, borderRadius: 12, padding: “14px”,
display: “flex”, flexDirection: “column”, alignItems: “center”,
},
statNum: { fontSize: 28, fontWeight: 700, color: C.accent },
statLabel: { fontSize: 12, color: C.muted, fontFamily: “sans-serif” },
emptyBox: { textAlign: “center”, padding: “32px 0”, color: C.muted, fontFamily: “sans-serif” },
emptyText: { textAlign: “center”, color: C.muted, fontFamily: “sans-serif” },
rsvpItem: {
display: “flex”, alignItems: “flex-start”, gap: 12, padding: “14px 0”,
borderBottom: `1px solid ${C.border}`,
},
rsvpAvatar: {
width: 40, height: 40, borderRadius: “50%”,
background: `linear-gradient(135deg, ${C.accent}, ${C.accent2})`,
display: “flex”, alignItems: “center”, justifyContent: “center”,
fontWeight: 700, fontSize: 16, flexShrink: 0,
},
rsvpName: { fontWeight: 700, fontSize: 15, marginBottom: 2 },
rsvpMeta: { fontSize: 12, color: C.muted, fontFamily: “sans-serif” },
rsvpMsg: { fontSize: 13, color: C.text, marginTop: 4, fontStyle: “italic”, opacity: 0.8 },
deleteBtn: {
background: “none”, border: “none”, color: C.muted, cursor: “pointer”,
fontSize: 14, padding: “4px 6px”, borderRadius: 6,
},
};
