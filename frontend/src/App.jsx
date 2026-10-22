import { useEffect, useMemo, useState } from "react";

const TOKEN = "smart-campus-token";
const DEMO_EMAIL = "student@campus.edu";
const DEMO_PASSWORD = "Campus@123";
const MAX_IMAGE = 2 * 1024 * 1024;

async function api(path, options = {}) {
  const headers = { "Content-Type": "application/json", ...options.headers };
  const token = sessionStorage.getItem(TOKEN);
  if (token) headers.Authorization = `Bearer ${token}`;
  const response = await fetch(`/api${path}`, { ...options, headers });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "The request could not be completed.");
  return data;
}

function Logo() {
  return <div className="brand"><span className="brand-mark">S</span><span>Smart<span>Campus</span></span></div>;
}

function Tag({ children, tone = "blue" }) {
  return <span className={`tag tag-${tone}`}><i />{children}</span>;
}

function Status({ value }) {
  const tone = value === "Completed" || value === "Available"
    ? "green"
    : value === "Requires attention"
      ? "amber"
      : value === "Claimed"
        ? "violet"
        : "blue";
  return <Tag tone={tone}>{value}</Tag>;
}

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(event) {
    event.preventDefault(); setBusy(true); setError("");
    try {
      const result = await api("/login", { method: "POST", body: JSON.stringify({ email, password }) });
      sessionStorage.setItem(TOKEN, result.token); onLogin(result.user);
    } catch (issue) { setError(issue.message); }
    finally { setBusy(false); }
  }
  return <main className="login-screen">
    <div className="login-logo"><Logo /></div>
    <section className="login-form-wrap">
      <div className="live-label"><i /> CAMPUS LIFE, CONNECTED</div>
      <p className="eyebrow">WELCOME BACK</p>
      <h1>Your campus,<br /><em>all in one place.</em></h1>
      <p className="login-description">Care for shared spaces and help lost things find their way home.</p>
      <form className="login-form" onSubmit={submit}>
        <label htmlFor="email">Campus email</label>
        <input id="email" type="email" autoComplete="username" placeholder="you@campus.edu" value={email} onChange={event => setEmail(event.target.value)} required />
        <label htmlFor="password">Password</label>
        <input id="password" type="password" autoComplete="current-password" placeholder="Enter your password" value={password} onChange={event => setPassword(event.target.value)} required />
        {error && <p className="error-text" role="alert">{error}</p>}
        <button className="button primary wide" disabled={busy}>{busy ? "Signing in…" : "Sign in"}<span>→</span></button>
      </form>
     <div className="demo-box"><div><strong>Exploring the demo?</strong><small>Use the student demo account.</small></div><button type="button" onClick={() => { setEmail(DEMO_EMAIL); setPassword(DEMO_PASSWORD); }}>Fill demo</button></div>
      <p className="login-note">Student project prototype <b>·</b> Demo data saved locally</p>
    </section>
    <aside className="login-art"><div className="art-grid" /><div className="art-copy"><p className="eyebrow">A COMMUNITY THAT CARES</p><h2>Little things<br />make a <em>big</em> campus.</h2><span /><p>Report it. Find it. Make campus better for everyone.</p></div><div className="art-note"><b>✳</b><div><strong>Campus care, made simple</strong><small>One connected student community</small></div><span>↗</span></div><i className="art-orbit orbit-a" /><i className="art-orbit orbit-b" /></aside>
  </main>;
}

function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("Overview");
  const [tickets, setTickets] = useState([]);
  const [items, setItems] = useState([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [dialog, setDialog] = useState(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const token = sessionStorage.getItem(TOKEN);
    if (token) api("/me").then(result => setUser(result.user)).catch(() => sessionStorage.removeItem(TOKEN));
  }, []);

  async function refresh() {
    setBusy(true); setError("");
    try {
      const [ticketData, itemData] = await Promise.all([api("/tickets"), api("/items")]);
      setTickets(ticketData.tickets); setItems(itemData.items);
    } catch (issue) { setError(issue.message); }
    finally { setBusy(false); }
  }

  useEffect(() => { if (user) refresh(); }, [user]);

  function notify(message) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  }

  async function logout() {
    try { await api("/logout", { method: "POST" }); } catch { /* The browser session is cleared below. */ }
    sessionStorage.removeItem(TOKEN); setUser(null); setPage("Overview");
  }

  async function submitTicket(values) {
    await api("/tickets", { method: "POST", body: JSON.stringify(values) });
    await refresh(); setPage("Cleaning service"); notify("Cleaning request sent to the care desk.");
  }

  async function completeTicket(ticket) {
    await api(`/tickets/${ticket.id}/complete`, { method: "PATCH" });
    await refresh(); notify("Request marked complete.");
  }

  async function submitItem(values) {
    await api("/items", { method: "POST", body: JSON.stringify(values) });
    await refresh(); setDialog(null); setPage("Lost & found"); notify("Your found item is on the board.");
  }

  async function messageFinder(item, message) {
    await api(`/items/${item.id}/messages`, { method: "POST", body: JSON.stringify({ message }) });
    await refresh(); setDialog(null); notify("Message sent to the finder.");
  }

  const filteredItems = useMemo(() => items.filter(item => `${item.title} ${item.location} ${item.category} ${item.finder}`.toLowerCase().includes(query.toLowerCase().trim())), [items, query]);
  if (!user) return <Login onLogin={setUser} />;
  const openCount = tickets.filter(ticket => ticket.status !== "Completed").length;
  const availableCount = items.filter(item => item.status === "Available").length;

  return <div className="app-shell">
    <aside className="sidebar">
      <Logo />
      <p className="side-label">WORKSPACE</p>
      <nav aria-label="Main navigation">
        <Nav name="Overview" current={page} icon="⌂" onSelect={setPage} />
        <p className="side-label nav-label">CAMPUS SERVICES</p>
        <Nav name="Cleaning service" current={page} icon="✳" onSelect={setPage} />
        <Nav name="Lost & found" current={page} icon="⌕" onSelect={setPage} />
      </nav>
      <div className="sidebar-bottom"><div className="side-tip"><b>✦</b><span><strong>Made better together</strong><small>Small actions make a campus.</small></span></div><div className="profile"><i>{initials(user.name)}</i><span><strong>{user.name}</strong><small>Student account</small></span><button onClick={logout} aria-label="Sign out">↗</button></div></div>
    </aside>
    <main className="main-area">
      <header className="topbar"><div className="breadcrumb">Smart Campus <b>/</b> <strong>{page}</strong></div><div className="top-actions"><Tag tone="green">CAMPUS CONNECTED</Tag><span className="avatar">{initials(user.name)}</span></div></header>
      <div className="content">
        {error && <div className="error-banner" role="alert">{error}<button onClick={refresh}>Retry</button></div>}
        {busy && <p className="loading"><i /> Loading campus data…</p>}
        {page === "Overview" && <Overview tickets={tickets} openCount={openCount} availableCount={availableCount} setPage={setPage} />}
        {page === "Cleaning service" && <Cleaning tickets={tickets} onCreate={submitTicket} onComplete={completeTicket} />}
        {page === "Lost & found" && <LostFound items={filteredItems} query={query} setQuery={setQuery} onPost={() => setDialog({ type: "post" })} onClaim={item => setDialog({ type: "claim", item })} />}
      </div>
      <footer className="footer"><span>Smart Campus <i>·</i> Campus life, connected</span><button onClick={logout}>Sign out ↗</button></footer>
    </main>
    {dialog?.type === "post" && <PostDialog onClose={() => setDialog(null)} onSubmit={submitItem} />}
    {dialog?.type === "claim" && <ClaimDialog item={dialog.item} onClose={() => setDialog(null)} onSend={messageFinder} />}
    {toast && <div className="toast" role="status">{toast}</div>}
  </div>;
}

function initials(name) { return name.split(" ").map(part => part[0]).slice(0, 2).join(""); }

function Nav({ name, current, icon, onSelect }) {
  return <button className={`nav-link ${current === name ? "active" : ""}`} onClick={() => onSelect(name)}><i>{icon}</i>{name}</button>;
}

function Heading({ label, title, description, action }) {
  return <section className="page-heading"><div><p className="eyebrow">{label}</p><h1>{title}</h1><p>{description}</p></div>{action}</section>;
}

function Overview({ tickets, openCount, availableCount, setPage }) {
  const recent = tickets[0];
  return <>
    <Heading label="MONDAY · YOUR CAMPUS AT A GLANCE" title={<>A better campus, <em>together.</em></>} description="Good afternoon, Bhoomika. Here's what's happening around campus." action={<div className="heading-badge">✳<i /></div>} />
    <section className="hero"><div><span className="hero-kicker"><i /> YOUR CAMPUS CARE DESK</span><h2>Take care of the<br />place we <em>share.</em></h2><p>Request a room refresh or help a lost item find its way home.</p><div className="hero-buttons"><button className="button bright" onClick={() => setPage("Cleaning service")}>Request cleaning <span>→</span></button><button className="button hero-link" onClick={() => setPage("Lost & found")}>Explore lost &amp; found <span>↗</span></button></div></div><div className="hero-art"><div className="hero-ring" /><div className="mock-window"><div className="mock-top"><i /><i /><i /></div><div className="mock-content"><b>✓</b><span><i /><i /><i /></span></div></div><span className="hero-star star-a">✦</span><span className="hero-star star-b">✳</span></div></section>
    <section className="stats"><article className="stat-card"><div className="stat-caption">OPEN CLEANING REQUESTS <span>✳</span></div><strong>{openCount}<small>active</small></strong><button onClick={() => setPage("Cleaning service")}>View service desk →</button></article><article className="stat-card"><div className="stat-caption">ITEMS WAITING TO BE FOUND <span>⌕</span></div><strong>{availableCount}<small>available</small></strong><button onClick={() => setPage("Lost & found")}>Browse the board →</button></article><article className="stat-card quote"><b>“</b><p>Look after the spaces we share.<br /><em>Look out for one another.</em></p><small>THE SMART CAMPUS WAY</small></article></section>
    <section className="lower-grid"><article className="panel recent-panel"><div className="panel-head"><div><p className="eyebrow">THE LATEST</p><h3>Recent cleaning requests</h3></div><button className="inline-link" onClick={() => setPage("Cleaning service")}>See all →</button></div>{recent ? <div className="recent-line"><span className="recent-icon">✳</span><div><strong>{recent.issue}</strong><small>{recent.building} · {recent.room}</small></div><Status value={recent.status} /></div> : <Empty>No requests yet. Send the first one from Cleaning Service.</Empty>}<div className="panel-note">✦ Reports help keep shared spaces ready for everyone.</div></article><article className="panel found-callout"><span className="small-label">A LITTLE HELP GOES A LONG WAY</span><h3>Found something?<br /><em>Give it a way home.</em></h3><p>Post a photo and a few details. The right person might be looking for it.</p><button className="button primary" onClick={() => setPage("Lost & found")}>Visit the board <span>→</span></button><span className="callout-shape">⌁</span></article></section>
  </>;
}

function Empty({ children }) { return <div className="empty-state">{children}</div>; }

function Cleaning({ tickets, onCreate, onComplete }) {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(event) {
    event.preventDefault(); setError(""); setBusy(true);
    const formNode = event.currentTarget;
    const form = new FormData(formNode);
    try {
      await onCreate({ issue: form.get("issue"), building: form.get("building"), floor: form.get("floor"), room: form.get("room"), details: form.get("details") });
      formNode.reset();
    } catch (issue) { setError(issue.message); }
    finally { setBusy(false); }
  }
  return <>
    <Heading label="CAMPUS CARE · MODULE 01" title={<>Cleaning <em>service.</em></>} description="A cleaner shared space starts with a simple heads-up." action={<div className="heading-badge badge-green">✳<i /></div>} />
    <section className="module-grid"><article className="panel form-panel"><div className="panel-head"><div><p className="eyebrow">ROOM REFRESH</p><h3>Request a cleaning</h3><small>Tell the campus care team where to help.</small></div><span className="panel-spark">⌁</span></div><form className="fields" onSubmit={submit}><label className="full">What's the issue?<input name="issue" maxLength="100" placeholder="e.g. Room needs a quick refresh" required /></label><label>Building<select name="building" defaultValue="" required><option value="" disabled>Choose a building</option><option>North Block</option><option>South Block</option><option>Library</option><option>Science Centre</option><option>Arts Building</option><option>Student Centre</option></select></label><label>Floor<select name="floor" defaultValue="" required><option value="" disabled>Choose a floor</option><option>Ground</option><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option></select></label><label className="full">Room or area<input name="room" maxLength="60" placeholder="e.g. 204 or west study lounge" required /></label><label className="full">Anything else? <small>OPTIONAL</small><textarea name="details" maxLength="240" rows="3" placeholder="Add a helpful detail for the care team" /></label>{error && <p className="error-text full">{error}</p>}<button className="button primary full" disabled={busy}>{busy ? "Sending…" : "Send cleaning request"}<span>→</span></button><small className="form-note full">✦ Your report helps the campus team respond faster.</small></form></article><aside className="panel how-panel"><span className="how-icon">✳</span><p className="eyebrow">HOW IT WORKS</p><h3>Shared spaces,<br /><em>cared for.</em></h3><div className="steps"><Step num="01" title="Tell us where" text="Choose a building, floor and room."/><Step num="02" title="We let the team know" text="Your request appears on the care desk."/><Step num="03" title="Space is refreshed" text="Completed requests are marked closed."/></div><div className="team-line"><i /> Campus care desk is ready</div></aside></section>
    <section className="panel ticket-panel"><div className="panel-head"><div><p className="eyebrow">SERVICE DESK</p><h3>Recent requests <span className="count">{tickets.length}</span></h3></div><small className="sort">LATEST FIRST</small></div><div className="ticket-list">{tickets.length ? tickets.map(ticket => <article className="ticket-row" key={ticket.id}><span className="ticket-symbol">✳</span><div className="ticket-details"><div><strong>{ticket.issue}</strong><Status value={ticket.status}/></div><p>{ticket.building} · Floor {ticket.floor} · {ticket.room}</p><small>{ticket.id} · {new Date(ticket.createdAt).toLocaleString()}</small></div>{ticket.status !== "Completed" ? <button className="button outline" onClick={() => onComplete(ticket).catch(issue => setError(issue.message))}>Mark complete <span>✓</span></button> : <span className="closed">Closed ✓</span>}</article>) : <Empty>No requests yet. Add the first one above.</Empty>}</div></section>
  </>;
}

function Step({ num, title, text }) { return <div className="step"><i>{num}</i><span><strong>{title}</strong><small>{text}</small></span></div>; }

function LostFound({ items, query, setQuery, onPost, onClaim }) {
  return <>
    <Heading label="CAMPUS CARE · MODULE 02" title={<>Lost &amp; <em>found.</em></>} description="A little community can bring the things we miss back." action={<div className="heading-badge badge-violet">⌕<i /></div>} />
    <section className="board-banner"><div><p className="eyebrow">THE COMMUNITY BOARD</p><h2>Every lost thing has<br />a <em>way back.</em></h2></div><div><p>Found something on campus? Leave a few details so its owner can find it.</p><button className="button primary" onClick={onPost}>Post a found item <span>＋</span></button></div></section>
    <section className="board-tools"><div><strong>{items.length} <small>items</small></strong><span>shared by your campus community</span></div><label className="search"><span>⌕</span><input type="search" aria-label="Search found items" placeholder="Search items or places..." value={query} onChange={event => setQuery(event.target.value)} /></label></section>
    {items.length ? <section className="item-grid">{items.map(item => <ItemCard item={item} key={item.id} onClick={() => onClaim(item)}/>)}</section> : <div className="panel empty-board">{query ? "No items match that search." : "Nothing on the board yet. Be the first to help someone find theirs."}</div>}
  </>;
}

function ItemCard({ item, onClick }) {
  const marker = item.category === "Electronics" ? "⌁" : item.category === "Bottle" ? "♧" : item.category === "Clothing" ? "⌂" : "✳";
  return <article className="item-card"><div className="item-image">{item.image ? <img src={item.image} alt={`Found ${item.title}`} /> : <span>{marker}</span>}<small>{item.category}</small>{item.status === "Claimed" && <label>CLAIM IN PROGRESS</label>}</div><div className="item-body"><div className="item-meta"><span>{item.category}</span><Status value={item.status}/></div><h3>{item.title}</h3><p className="item-location">⌖ {item.location}</p><div className="finder"><i>{initials(item.finder)}</i><span>Found by <b>{item.finder}</b></span><time>{new Date(item.date).toLocaleDateString()}</time></div><button className={`button item-action ${item.status === "Available" ? "outline" : "muted"}`} onClick={onClick}>{item.status === "Available" ? "This might be mine" : "View conversation"}<span>→</span></button></div></article>;
}

function Modal({ title, subtitle, onClose, children }) {
  useEffect(() => {
    function closeOnEscape(event) { if (event.key === "Escape") onClose(); }
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [onClose]);
  return <div className="modal-backdrop" onMouseDown={event => { if (event.target === event.currentTarget) onClose(); }}><section className="modal" role="dialog" aria-modal="true" aria-labelledby="dialog-title"><button className="close" onClick={onClose} aria-label="Close">×</button><p className="eyebrow">SMART CAMPUS COMMUNITY</p><h2 id="dialog-title">{title}</h2><p className="modal-subtitle">{subtitle}</p>{children}</section></div>;
}

function PostDialog({ onClose, onSubmit }) {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(event) {
    event.preventDefault(); setBusy(true); setError("");
    const form = new FormData(event.currentTarget);
    const file = form.get("photo");
    let image = "";
    if (file?.size) {
      if (!["image/jpeg", "image/png"].includes(file.type)) { setBusy(false); return setError("Choose a JPEG or PNG image."); }
      if (file.size > MAX_IMAGE) { setBusy(false); return setError("Choose an image smaller than 2 MB."); }
      image = await new Promise((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(reader.result); reader.onerror = reject; reader.readAsDataURL(file); });
    }
    try { await onSubmit({ title: form.get("title"), category: form.get("category"), location: form.get("location"), image }); }
    catch (issue) { setError(issue.message); }
    finally { setBusy(false); }
  }
  return <Modal title="Help it find its way home." subtitle="Share a few details so its owner can reach out." onClose={onClose}><form className="fields modal-fields" onSubmit={submit}><label className="full">What did you find?<input name="title" maxLength="70" placeholder="e.g. Navy blue notebook" required /></label><label>Category<select name="category"><option>Everyday</option><option>Electronics</option><option>Clothing</option><option>Bottle</option><option>Books</option><option>Other</option></select></label><label>Where did you find it?<input name="location" maxLength="90" placeholder="Building and area" required /></label><label className="upload full"><b>↑</b><strong>Add a photo <small>OPTIONAL · JPEG/PNG · 2 MB MAX</small></strong><input type="file" name="photo" accept="image/jpeg,image/png" /></label>{error && <p className="error-text full">{error}</p>}<button className="button primary full" disabled={busy}>{busy ? "Posting…" : "Share on the board"}<span>→</span></button></form></Modal>;
}

function ClaimDialog({ item, onClose, onSend }) {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(event) {
    event.preventDefault(); setBusy(true); setError("");
    try { await onSend(item, new FormData(event.currentTarget).get("message")); }
    catch (issue) { setError(issue.message); }
    finally { setBusy(false); }
  }
  return <Modal title={item.status === "Claimed" ? "Your conversation." : "Could this be yours?"} subtitle={`${item.title} · found by ${item.finder}`} onClose={onClose}><div className="chat"><div className="bubble"><small>{item.finder}</small><p>Hi! I found this near {item.location}. Does it belong to you?</p></div>{(item.messages || []).map((message, index) => <div className="bubble own" key={`${item.id}-${index}`}><small>You</small><p>{message}</p></div>)}</div>{error && <p className="error-text">{error}</p>}<form className="message-form" onSubmit={submit}><label className="sr-only" htmlFor="message">Message the finder</label><input id="message" name="message" maxLength="240" placeholder="Write a message..." required /><button className="button primary" disabled={busy}>Send <span>→</span></button></form></Modal>;
}

export default App;
