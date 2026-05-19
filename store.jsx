/* eslint-disable */
// Data store + seed data + small SVG icons.
// Exposes to window: store, useStore, Icon, fmt, GitHubSync

// ---------- SEED DATA ----------
const SEED_USERS = [
  { id: "u1", email: "admin@wiptown.co", name: "WIP-Town", role: "admin",  pin: "1111", joined: "2024-08-12" },
  { id: "u2", email: "graphic@wiptown.co", name: "GRAPHIC-WIP",     role: "editor", pin: "2222", joined: "2024-11-02" },
  { id: "u3", email: "dev@wiptown.co",   name: "DEV-Wip",   role: "member", pin: "3333", joined: "2025-03-21" },
  { id: "u4", email: "head@wiptown.co",    name: "HEAD-WIP",     role: "member", pin: "4444", joined: "2025-09-04" },
  { id: "u5", email: "support@wiptown.co",   name: "SUPPORT-WIP",      role: "member", pin: "5555", joined: "2026-01-15" },
];

const SEED_PENDING = [
  { id: "p1", email: "sky@wiptown.co", name: "Winter",  pin: "3012", requestedAt: "2026-05-18 09:42" },
  { id: "p2", email: "shujai@wiptown.co",  name: "Shujai",   pin: "8888", requestedAt: "2026-05-19 14:08" },
];

const SEED_CATEGORIES = [
  { id: "c-prod",   name: "ลิสต์งานหลัก",  color: "#a78bfa" },
  { id: "c-design", name: "ลิสต์งาน Dev",      color: "#f0abfc" },
  { id: "c-mkt",    name: "ลิสต์งาน ADmin",   color: "#7736df" },
  { id: "c-meet",   name: "ลิสต์งาน Graphic",     color: "#3764a8" },
  { id: "c-rel",    name: "กาชา",     color: "#fb7185" },
  { id: "c-hr",     name: "รถ",    color: "#6366f1" },
];

const SEED_ANNOUNCEMENTS = [
  {
    id: "a1",
    title: "เปิดตัวระบบปฏิทินทีม WIP Town v2.0",
    body: "ตอนนี้ทุกคนสามารถจดโน้ตประจำวัน เช็คสถานะงาน และแนบรูปอ้างอิงในแต่ละวันได้แล้ว — แอดมินมีสิทธิ์จัดการประกาศ หมวดหมู่ และผู้ใช้งานทั้งหมดผ่านหน้า Admin",
    author: "u1",
    date: "2026-05-18",
    tag: "release",
    pinned: true,
  },
  {
    id: "a2",
    title: "Sprint 21 เริ่ม จันทร์นี้ 25 พ.ค. — ดูปฏิทิน",
    body: "เป้าหมาย: ปิด Backend sync v2 และ UI Hand-off สำหรับ Mobile ภายในวันที่ 6 มิ.ย. รายละเอียดดูในวัน 26 พ.ค.",
    author: "u2",
    date: "2026-05-17",
    tag: "production",
    pinned: true,
  },
  {
    id: "a3",
    title: "Town Hall — พฤหัสฯ 21 พ.ค. 14:00 ห้องประชุมใหญ่",
    body: "สรุปผลงานไตรมาส 2 และเปิดโอกาส Q&A ทีมผู้บริหารตอบทุกคำถาม ลิงก์ Zoom ในวันที่ 21 พ.ค.",
    author: "u1",
    date: "2026-05-15",
    tag: "meeting",
    pinned: false,
  },
  {
    id: "a4",
    title: "พนักงานใหม่ ทักทายคุณมิ้นท์ พิจิตรา",
    body: "ยินดีต้อนรับมิ้นท์เข้าทีม Brand Design เริ่มงาน 15 ม.ค. ที่ผ่านมา ทักทายได้ที่ #welcome",
    author: "u1",
    date: "2026-05-12",
    tag: "hr",
    pinned: false,
  },
];

// Build notes spanning current month so calendar always looks alive
function seedNotesForCurrentMonth() {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();
  const k = (d) => `${y}-${String(m+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
  return {
    [k(3)]: [
      { id: "n1", text: "Kickoff Sprint 21 — สรุป backlog ทั้งหมดและจัดลำดับ", cat: "c-meet",   done: true,  author: "u2", at: "09:00" },
      { id: "n2", text: "ส่ง mockup หน้า Settings v2 ให้ทีม Eng review",       cat: "c-design", done: true,  author: "u3", at: "14:20" },
    ],
    [k(5)]: [
      { id: "n3", text: "Weekly 1:1 — feedback round กับทีม Backend", cat: "c-hr", done: true, author: "u1", at: "10:00" },
    ],
    [k(8)]: [
      { id: "n4", text: "ปล่อย hotfix v1.9.2 — auth retry logic",        cat: "c-rel",  done: true,  author: "u2", at: "16:30" },
      { id: "n5", text: "อัปเดต changelog ลง #release-notes",             cat: "c-rel",  done: true,  author: "u4", at: "17:00" },
    ],
    [k(12)]: [
      { id: "n6", text: "ประชุม Brand refresh — round 2",                  cat: "c-mkt",   done: true,  author: "u3", at: "13:00" },
      { id: "n7", text: "ออกแบบ social asset campaign เมษา–พ.ค.",       cat: "c-design",done: false, author: "u5", at: "15:00" },
    ],
    [k(15)]: [
      { id: "n8", text: "Audit dependency ทั้ง monorepo + bump versions", cat: "c-prod", done: true, author: "u4", at: "11:00" },
    ],
    [k(19)]: [
      { id: "n9", text: "เตรียมสไลด์ Town Hall ส่งให้ผู้บริหารรีวิว",       cat: "c-meet",  done: false, author: "u1", at: "10:30" },
      { id: "n10",text: "ออกแบบโปสเตอร์ประกาศ Town Hall",                 cat: "c-design",done: false, author: "u3", at: "16:00", images: ["placeholder"] },
    ],
    [k(20)]: [
      { id: "n11", text: "Daily Standup — สรุป blockers ทั้งสัปดาห์", cat: "c-meet", done: false, author: "u2", at: "09:30" },
      { id: "n12", text: "Code review PR #482 backend sync v2",       cat: "c-prod", done: false, author: "u4", at: "11:00" },
      { id: "n13", text: "ส่งของ swag ใหม่ให้พนักงานใหม่ (3 คน)",       cat: "c-hr",   done: true,  author: "u1", at: "14:00" },
    ],
    [k(21)]: [
      { id: "n14", text: "Town Hall Q2 — ห้องประชุมใหญ่ 14:00",       cat: "c-meet",  done: false, author: "u1", at: "14:00" },
      { id: "n15", text: "Recording + Q&A doc แชร์ลง drive",          cat: "c-meet",  done: false, author: "u2", at: "16:30" },
    ],
    [k(22)]: [
      { id: "n16", text: "Retro ทีม Design — แบ่ง breakout 3 กลุ่ม",   cat: "c-meet",  done: false, author: "u3", at: "13:00" },
    ],
    [k(25)]: [
      { id: "n17", text: "Sprint 21 Start — Planning Poker",          cat: "c-meet",  done: false, author: "u2", at: "10:00" },
      { id: "n18", text: "Mobile UI hand-off package เริ่มเตรียม",      cat: "c-design",done: false, author: "u3", at: "14:00" },
    ],
    [k(28)]: [
      { id: "n19", text: "Marketing email blast — feature launch",     cat: "c-mkt",   done: false, author: "u5", at: "09:00" },
      { id: "n20", text: "ตรวจสอบ analytics dashboard ก่อนปล่อย",      cat: "c-prod",  done: false, author: "u4", at: "11:30" },
    ],
  };
}

const SEED_ACTIVITY = (() => {
  const d = new Date();
  const y = d.getFullYear(), m = d.getMonth();
  const k = (day) => `${y}-${String(m+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
  return [
    { id: "l1", who: "u1", action: "ลงประกาศใหม่", target: "เปิดตัวระบบปฏิทินทีม v2.0", at: "2026-05-18 09:12" },
    { id: "l2", who: "u3", action: "เพิ่มงาน",      target: "ออกแบบโปสเตอร์ประกาศ Town Hall", at: "2026-05-17 16:42", link: { dateKey: k(19), kind: "add" } },
    { id: "l3", who: "u2", action: "ปิดงาน",        target: "Kickoff Sprint 21",              at: "2026-05-17 11:30", link: { dateKey: k(3),  kind: "done" } },
    { id: "l4", who: "u4", action: "อัปโหลดรูป",    target: "3 ไฟล์ · code review snapshot",  at: "2026-05-16 14:08", link: { dateKey: k(15), kind: "image" } },
    { id: "l5", who: "u3", action: "เพิ่มงาน",      target: "ออกแบบ social asset campaign",  at: "2026-05-15 10:00", link: { dateKey: k(12), kind: "add" } },
    { id: "l6", who: "u1", action: "เปลี่ยน Hero image", target: "WIP Town v2", at: "2026-05-12 10:00" },
    { id: "l7", who: "u4", action: "เพิ่มหมวดหมู่", target: "Release", at: "2026-04-28 13:20" },
  ];
})();

const DEFAULT_STATE = () => ({
  currentUserId: null,
  users: SEED_USERS,
  pending: SEED_PENDING,
  categories: SEED_CATEGORIES,
  announcements: SEED_ANNOUNCEMENTS,
  notes: seedNotesForCurrentMonth(), // { "YYYY-MM-DD": [ {id, text, cat, done, author, at, images?} ] }
  activity: SEED_ACTIVITY,
  heroImage: "assets/hero.png",
  theme: "dark",
  sync: { status: "synced", lastSyncAt: new Date().toISOString(), repo: "wiptown/calendar-hub" },
});

// ---------- STORE ----------
const STORAGE_KEY = "wiptown_calendar_v7";

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE();
    const data = JSON.parse(raw);
    // Always re-seed notes for current month, since seed depends on now()
    if (!data._notesMonth || data._notesMonth !== currentMonthKey()) {
      data.notes = { ...seedNotesForCurrentMonth(), ...(data.notes || {}) };
      data._notesMonth = currentMonthKey();
    }
    return { ...DEFAULT_STATE(), ...data };
  } catch (e) {
    return DEFAULT_STATE();
  }
}
function currentMonthKey() {
  const d = new Date(); return `${d.getFullYear()}-${d.getMonth()}`;
}
function saveState(state) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state, _notesMonth: currentMonthKey() })); }
  catch (e) {}
}

const subscribers = new Set();
let _state = loadState();

const store = {
  get() { return _state; },
  set(updater) {
    const patch = typeof updater === "function" ? updater(_state) : updater;
    _state = { ..._state, ...patch };
    saveState(_state);
    subscribers.forEach(fn => fn(_state));
  },
  subscribe(fn) { subscribers.add(fn); return () => subscribers.delete(fn); },
  reset() { _state = DEFAULT_STATE(); saveState(_state); subscribers.forEach(fn => fn(_state)); },

  // Mutations
  login(email, pin) {
    const e = (email || "").trim().toLowerCase();
    const u = _state.users.find(x => x.email.toLowerCase() === e);
    if (!u) {
      const isPending = _state.pending.find(p => p.email.toLowerCase() === e);
      return { error: isPending ? "pending" : "not_found" };
    }
    if (pin !== undefined && String(u.pin) !== String(pin)) {
      return { error: "bad_pin" };
    }
    store.set({ currentUserId: u.id });
    store.log(u.id, "เข้าสู่ระบบ", u.email);
    return { user: u };
  },
  requestAccess({ email, name, pin }) {
    const e = (email || "").trim().toLowerCase();
    if (_state.users.find(u => u.email.toLowerCase() === e)) return { error: "exists" };
    if (_state.pending.find(p => p.email.toLowerCase() === e)) return { error: "already_pending" };
    const req = { id: "p" + Date.now(), email, name, pin, requestedAt: nowFull() };
    store.set(s => ({ pending: [req, ...s.pending] }));
    store.log(null, "ยื่นขอเข้าใช้งาน", email);
    return { ok: true };
  },
  approvePending(id, role = "member") {
    const me = store.me();
    const req = _state.pending.find(p => p.id === id);
    if (!req) return;
    const newUser = { id: "u" + Date.now(), email: req.email, name: req.name, pin: req.pin, role, joined: new Date().toISOString().slice(0,10) };
    store.set(s => ({ users: [...s.users, newUser], pending: s.pending.filter(p => p.id !== id) }));
    store.log(me?.id, "อนุมัติผู้ใช้ใหม่", req.email + " (" + role + ")");
    store.markSyncing();
  },
  rejectPending(id) {
    const me = store.me();
    const req = _state.pending.find(p => p.id === id);
    store.set(s => ({ pending: s.pending.filter(p => p.id !== id) }));
    store.log(me?.id, "ปฏิเสธคำขอเข้าใช้งาน", req?.email || id);
    store.markSyncing();
  },
  logout() { store.set({ currentUserId: null }); },
  user(id) { return _state.users.find(u => u.id === id); },
  me() { return _state.users.find(u => u.id === _state.currentUserId); },
  category(id) { return _state.categories.find(c => c.id === id); },

  // Notes
  addNote(dateKey, note) {
    const me = store.me();
    const next = { ..._state.notes };
    const newNote = { id: "n" + Date.now(), images: [], done: false, ...note, at: note.at || nowHM() };
    next[dateKey] = [...(next[dateKey] || []), newNote];
    store.set({ notes: next });
    store.log(me?.id, "เพิ่มงาน", newNote.text, { dateKey, kind: "add", noteId: newNote.id });
    store.markSyncing();
  },
  updateNote(dateKey, noteId, patch) {
    const me = store.me();
    const prev = (_state.notes[dateKey] || []).find(n => n.id === noteId);
    const next = { ..._state.notes };
    next[dateKey] = (next[dateKey] || []).map(n => n.id === noteId ? { ...n, ...patch } : n);
    store.set({ notes: next });
    // Smart log: completion / edit / image add
    if (patch.done !== undefined && prev?.done !== patch.done) {
      store.log(me?.id, patch.done ? "ปิดงาน" : "เปิดงานอีกครั้ง", prev?.text || "", { dateKey, kind: patch.done ? "done" : "undone", noteId });
    } else if (patch.images && (patch.images.length || 0) > (prev?.images?.length || 0)) {
      const added = patch.images.length - (prev?.images?.length || 0);
      store.log(me?.id, "อัปโหลดรูป", `${added} ไฟล์ · ${prev?.text || ""}`, { dateKey, kind: "image", noteId });
    } else if (patch.text) {
      store.log(me?.id, "แก้ไขโน้ต", patch.text, { dateKey, kind: "edit", noteId });
    }
    store.markSyncing();
  },
  removeNote(dateKey, noteId) {
    const me = store.me();
    const prev = (_state.notes[dateKey] || []).find(n => n.id === noteId);
    const next = { ..._state.notes };
    next[dateKey] = (next[dateKey] || []).filter(n => n.id !== noteId);
    if (next[dateKey].length === 0) delete next[dateKey];
    store.set({ notes: next });
    store.log(me?.id, "ลบโน้ต", prev?.text || "", { dateKey, kind: "remove" });
    store.markSyncing();
  },

  // Announcements
  addAnnouncement(a) {
    const me = store.me();
    const next = [{ id: "a" + Date.now(), date: new Date().toISOString().slice(0,10), author: me?.id, pinned: false, tag: "general", ...a }, ..._state.announcements];
    store.set({ announcements: next });
    store.log(me?.id, "ลงประกาศใหม่", a.title);
    store.markSyncing();
  },
  togglePinned(id) {
    store.set(s => ({ announcements: s.announcements.map(a => a.id === id ? { ...a, pinned: !a.pinned } : a) }));
  },
  removeAnnouncement(id) {
    const me = store.me();
    const a = _state.announcements.find(x => x.id === id);
    store.set(s => ({ announcements: s.announcements.filter(x => x.id !== id) }));
    store.log(me?.id, "ลบประกาศ", a?.title || id);
    store.markSyncing();
  },

  // Categories
  addCategory(c) { store.set(s => ({ categories: [...s.categories, { id: "c-" + Date.now(), color: "#a78bfa", ...c }] })); store.markSyncing(); },
  removeCategory(id) { store.set(s => ({ categories: s.categories.filter(c => c.id !== id) })); store.markSyncing(); },

  // Users
  addUser(u) {
    const me = store.me();
    store.set(s => ({ users: [...s.users, { id: "u" + Date.now(), role: "member", joined: new Date().toISOString().slice(0,10), ...u }] }));
    store.log(me?.id, "เพิ่มผู้ใช้", u.email);
    store.markSyncing();
  },
  removeUser(id) {
    const me = store.me();
    const target = _state.users.find(u => u.id === id);
    store.set(s => ({ users: s.users.filter(u => u.id !== id) }));
    store.log(me?.id, "ลบผู้ใช้", target?.email || id);
    store.markSyncing();
  },
  setUserRole(id, role) {
    store.set(s => ({ users: s.users.map(u => u.id === id ? { ...u, role } : u) }));
    store.markSyncing();
  },

  setHero(url) {
    const me = store.me();
    store.set({ heroImage: url });
    store.log(me?.id, "เปลี่ยน Hero image", "ใหม่");
    store.markSyncing();
  },

  log(who, action, target, link) {
    const entry = { id: "l" + Date.now() + Math.random().toString(36).slice(2,5), who, action, target, at: nowFull() };
    if (link) entry.link = link;
    store.set(s => ({ activity: [entry, ...s.activity].slice(0, 80) }));
  },

  setTheme(t) {
    store.set({ theme: t });
    document.documentElement.setAttribute("data-theme", t);
  },

  markSyncing() {
    store.set(s => ({ sync: { ...s.sync, status: "syncing" } }));
    clearTimeout(window.__syncTimer);
    window.__syncTimer = setTimeout(() => {
      store.set(s => ({ sync: { ...s.sync, status: "synced", lastSyncAt: new Date().toISOString() } }));
    }, 1200);
  },
  manualPush() {
    store.set(s => ({ sync: { ...s.sync, status: "syncing" } }));
    setTimeout(() => {
      store.set(s => ({ sync: { ...s.sync, status: "synced", lastSyncAt: new Date().toISOString() } }));
    }, 1800);
  },
};

function useStore() {
  const [state, setState] = React.useState(store.get());
  React.useEffect(() => store.subscribe(setState), []);
  return state;
}

// ---------- HELPERS ----------
function nowHM() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`;
}
function nowFull() {
  const d = new Date();
  return `${d.toISOString().slice(0,10)} ${nowHM()}`;
}
const THAI_MONTHS = ["มกราคม","กุมภาพันธ์","มีนาคม","เมษายน","พฤษภาคม","มิถุนายน","กรกฎาคม","สิงหาคม","กันยายน","ตุลาคม","พฤศจิกายน","ธันวาคม"];
const THAI_MONTHS_SHORT = ["ม.ค.","ก.พ.","มี.ค.","เม.ย.","พ.ค.","มิ.ย.","ก.ค.","ส.ค.","ก.ย.","ต.ค.","พ.ย.","ธ.ค."];
const DOW_TH = ["อา","จ","อ","พ","พฤ","ศ","ส"];
const DOW_TH_FULL = ["อาทิตย์","จันทร์","อังคาร","พุธ","พฤหัสบดี","ศุกร์","เสาร์"];

const fmt = {
  dateKey(y, m, d) { return `${y}-${String(m+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`; },
  parseKey(k) { const [y,m,d] = k.split("-").map(Number); return { y, m: m-1, d }; },
  longThai(k) {
    const { y, m, d } = fmt.parseKey(k);
    const date = new Date(y, m, d);
    return `${DOW_TH_FULL[date.getDay()]}ที่ ${d} ${THAI_MONTHS[m]} ${y + 543}`;
  },
  shortThai(d, m) { return `${d} ${THAI_MONTHS_SHORT[m]}`; },
  initials(name) {
    if (!name) return "?";
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0,2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  },
  relTime(iso) {
    const t = new Date(iso).getTime();
    const diff = (Date.now() - t) / 1000;
    if (diff < 60) return "เมื่อสักครู่";
    if (diff < 3600) return `${Math.floor(diff/60)} นาทีที่แล้ว`;
    if (diff < 86400) return `${Math.floor(diff/3600)} ชม.ที่แล้ว`;
    return `${Math.floor(diff/86400)} วันที่แล้ว`;
  },
  thMonthYear(y, m) { return `${THAI_MONTHS[m]} ${y + 543}`; },
  thMonths: THAI_MONTHS,
  thMonthsShort: THAI_MONTHS_SHORT,
  dowShort: DOW_TH,
  dowFull: DOW_TH_FULL,
};

// ---------- ICONS (inline) ----------
const _i = {
  home: "M3 11l9-8 9 8v10a2 2 0 0 1-2 2h-4v-6h-6v6H5a2 2 0 0 1-2-2V11z",
  cal:  "M3 7h18M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2zM8 3v4M16 3v4",
  bell: "M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9zM10 21a2 2 0 0 0 4 0",
  user: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  shield:"M12 2l8 3v6c0 5-3.5 9-8 11-4.5-2-8-6-8-11V5l8-3z",
  cog:  "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1.03 1.56V21a2 2 0 1 1-4 0v-.08A1.7 1.7 0 0 0 8.99 19.36a1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.7 1.7 0 0 0 .34-1.87 1.7 1.7 0 0 0-1.56-1.03H3a2 2 0 1 1 0-4h.08A1.7 1.7 0 0 0 4.64 8.99a1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.7 1.7 0 0 0 1.87.34H9a1.7 1.7 0 0 0 1.03-1.56V3a2 2 0 1 1 4 0v.08a1.7 1.7 0 0 0 1.03 1.56 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.7 1.7 0 0 0-.34 1.87V9c.43.17.81.43 1.12.76",
  plus: "M12 5v14M5 12h14",
  check:"M5 12l4 4L19 7",
  x:    "M18 6L6 18M6 6l12 12",
  chevL:"M15 18l-6-6 6-6",
  chevR:"M9 18l6-6-6-6",
  pin:  "M12 17v5M9 3h6l-1 8h3l-5 6-5-6h3l-1-8z",
  trash:"M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6",
  edit: "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z",
  upload:"M12 19V5M5 12l7-7 7 7",
  img:  "M3 5h18v14H3zM3 16l5-5 5 5 3-3 5 5",
  github:"M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22",
  search:"M21 21l-4.35-4.35M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16z",
  filter:"M22 3H2l8 9.46V19l4 2v-8.54L22 3z",
  logout:"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9",
  dot: "M12 12m-2 0a2 2 0 1 0 4 0 2 2 0 1 0 -4 0",
  star:"M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  refresh:"M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15",
  eye: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  clock:"M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 6v6l4 2",
};
function Icon({ name, size = 16, stroke = 2, className = "", style = {} }) {
  const d = _i[name] || _i.dot;
  const fill = name === "dot" ? "currentColor" : "none";
  return (
    <svg className={"ico " + className} style={{ width: size, height: size, ...style }} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
      <path d={d}></path>
    </svg>
  );
}

// ---------- EXPORT ----------
Object.assign(window, { store, useStore, Icon, fmt });
