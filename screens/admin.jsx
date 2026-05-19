/* eslint-disable */
// Admin panel — tabs: announcements, users, categories, hero, activity

function AdminScreen() {
  const state = useStore();
  const me = store.me();
  const [tab, setTab] = React.useState("announcements");

  if (me?.role !== "admin") {
    return (
      <div className="page">
        <div className="card" style={{ maxWidth: 480, margin: "60px auto", textAlign: "center", padding: 40 }}>
          <Icon name="shield" size={36} style={{ color: "var(--rose)", marginBottom: 12 }}/>
          <h2 style={{ margin: "0 0 6px", fontSize: 20 }}>ไม่มีสิทธิ์เข้าถึง</h2>
          <p style={{ color: "var(--muted)", fontSize: 13 }}>หน้านี้สำหรับผู้ใช้ที่มียศ Admin เท่านั้น</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <h1 className="h-page">Admin Panel</h1>
      <p className="h-sub">จัดการเนื้อหา ผู้ใช้งาน และตั้งค่าระบบทั้งหมด</p>

      <div className="tab-row">
        {[
          { id: "announcements", label: "ประกาศ", icon: "bell" },
          { id: "pending",       label: "คำขอเข้าใช้งาน", icon: "shield", badge: state.pending?.length },
          { id: "users",         label: "ผู้ใช้งาน", icon: "user" },
          { id: "categories",    label: "หมวดหมู่", icon: "filter" },
          { id: "hero",          label: "Hero Image", icon: "img" },
          { id: "activity",      label: "Activity Log", icon: "clock" },
        ].map(t => (
          <button key={t.id} className={"tab " + (tab === t.id ? "active" : "")} onClick={() => setTab(t.id)}>
            <Icon name={t.icon} size={13} style={{ verticalAlign: "middle", marginRight: 6 }}/>
            {t.label}
            {t.badge > 0 && <span style={{ marginLeft: 6, background: "var(--rose)", color: "#fff", fontSize: 10, padding: "1px 6px", borderRadius: 999, fontWeight: 600 }}>{t.badge}</span>}
          </button>
        ))}
      </div>

      {tab === "announcements" && <AnnouncementsAdmin state={state}/>}
      {tab === "pending" && <PendingAdmin state={state}/>}
      {tab === "users" && <UsersAdmin state={state}/>}
      {tab === "categories" && <CategoriesAdmin state={state}/>}
      {tab === "hero" && <HeroAdmin state={state}/>}
      {tab === "activity" && <ActivityAdmin state={state}/>}
    </div>
  );
}

// ---------- Announcements ----------
function AnnouncementsAdmin({ state }) {
  return (
    <div className="card">
      <div className="row between" style={{ marginBottom: 12 }}>
        <h2 className="h-section">ประกาศทั้งหมด <span className="count">{state.announcements.length}</span></h2>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th style={{ width: 30 }}></th>
            <th>หัวข้อ</th>
            <th style={{ width: 100 }}>หมวด</th>
            <th style={{ width: 140 }}>ผู้ลง</th>
            <th style={{ width: 110 }}>วันที่</th>
            <th style={{ width: 90 }}></th>
          </tr>
        </thead>
        <tbody>
          {state.announcements.map(a => {
            const u = store.user(a.author);
            return (
              <tr key={a.id}>
                <td>
                  <button className="icon-btn" onClick={() => store.togglePinned(a.id)}>
                    <Icon name="pin" size={14} style={{ color: a.pinned ? "var(--pink)" : "var(--muted-2)" }}/>
                  </button>
                </td>
                <td style={{ color: "var(--text)", fontWeight: 500 }}>{a.title}</td>
                <td>
                  {(() => {
                    const cat = state.categories.find(c => c.id === a.tag);
                    const color = cat?.color || "#a78bfa";
                    return (
                      <span className="badge" style={{ color, background: color + "22", borderColor: color + "55" }}>
                        <span className="dot" style={{ background: color }}></span>{cat?.name || a.tag || "—"}
                      </span>
                    );
                  })()}
                </td>
                <td>
                  <div className="row" style={{ gap: 6 }}>
                    <div className="avatar" style={{ width: 22, height: 22, fontSize: 10 }}>{fmt.initials(u?.name)}</div>
                    <span style={{ fontSize: 12 }}>{u?.name}</span>
                  </div>
                </td>
                <td style={{ fontSize: 12, color: "var(--muted)", fontFamily: "var(--mono)" }}>{a.date}</td>
                <td>
                  <div className="row">
                    <button className="icon-btn"><Icon name="edit" size={13}/></button>
                    <button className="icon-btn" onClick={() => { if (confirm("ลบประกาศ?")) store.removeAnnouncement(a.id); }}><Icon name="trash" size={13}/></button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ---------- Pending Requests ----------
function PendingAdmin({ state }) {
  const pending = state.pending || [];
  return (
    <div className="card">
      <div className="row between" style={{ marginBottom: 12 }}>
        <h2 className="h-section">
          <Icon name="shield" size={14}/>
          คำขอเข้าใช้งานจากผู้ใช้ใหม่
          <span className="count">{pending.length}</span>
        </h2>
        <span style={{ fontSize: 12, color: "var(--muted)" }}>อีเมลจะใช้งานได้หลังจากอนุมัติ</span>
      </div>
      {pending.length === 0 && <div className="empty">ยังไม่มีคำขอรอดำเนินการ</div>}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {pending.map(p => <PendingRow key={p.id} req={p}/>)}
      </div>
    </div>
  );
}

function PendingRow({ req }) {
  const [role, setRole] = React.useState("member");
  const [showPin, setShowPin] = React.useState(false);
  return (
    <div className="pending-row">
      <div className="avatar" style={{ width: 38, height: 38, fontSize: 13 }}>{fmt.initials(req.name)}</div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 500, color: "var(--text)" }}>{req.name}</div>
        <div style={{ fontSize: 12, color: "var(--text-2)", fontFamily: "var(--mono)" }}>{req.email}</div>
        <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 4 }}>
          ยื่นคำขอ {req.requestedAt} · PIN 
          <span style={{ fontFamily: "var(--mono)", marginLeft: 4, padding: "1px 6px", borderRadius: 4, background: "var(--surface-3)", cursor: "pointer" }}
                onClick={() => setShowPin(s => !s)}>
            {showPin ? req.pin : "••••"}
          </span>
        </div>
      </div>
      <div className="row" style={{ gap: 8 }}>
        <select className="select" style={{ padding: "6px 10px", fontSize: 12, width: 130 }} value={role} onChange={e => setRole(e.target.value)}>
          <option value="member">Member</option>
          <option value="editor">Editor</option>
          <option value="admin">Admin</option>
        </select>
        <button className="btn sm" onClick={() => { if (confirm("ปฏิเสธคำขอของ " + req.email + "?")) store.rejectPending(req.id); }}>
          <Icon name="x" size={12}/> ปฏิเสธ
        </button>
        <button className="btn primary sm" onClick={() => store.approvePending(req.id, role)}>
          <Icon name="check" size={12}/> อนุมัติ
        </button>
      </div>
    </div>
  );
}

// ---------- Users ----------
function UsersAdmin({ state }) {
  const [showAdd, setShowAdd] = React.useState(false);
  return (
    <>
      <div className="row between" style={{ marginBottom: 14 }}>
        <h2 className="h-section">ผู้ใช้งาน <span className="count">{state.users.length}</span></h2>
        <button className="btn primary sm" onClick={() => setShowAdd(true)}><Icon name="plus" size={14}/> เพิ่มผู้ใช้</button>
      </div>
      <div className="card" style={{ padding: 0 }}>
        <table className="table">
          <thead>
            <tr>
              <th>ชื่อ</th>
              <th>อีเมล</th>
              <th style={{ width: 140 }}>ยศ</th>
              <th style={{ width: 120 }}>เข้าร่วม</th>
              <th style={{ width: 80 }}></th>
            </tr>
          </thead>
          <tbody>
            {state.users.map(u => (
              <tr key={u.id}>
                <td>
                  <div className="name-cell">
                    <div className="avatar" style={{ width: 30, height: 30, fontSize: 11 }}>{fmt.initials(u.name)}</div>
                    {u.name}
                  </div>
                </td>
                <td style={{ fontFamily: "var(--mono)", fontSize: 12 }}>{u.email}</td>
                <td>
                  <select className="select" style={{ padding: "5px 8px", fontSize: 12, width: 110 }} value={u.role} onChange={e => store.setUserRole(u.id, e.target.value)}>
                    <option value="admin">Admin</option>
                    <option value="editor">Editor</option>
                    <option value="member">Member</option>
                  </select>
                </td>
                <td style={{ fontSize: 12, color: "var(--muted)" }}>{u.joined}</td>
                <td>
                  {u.id !== store.me()?.id && (
                    <button className="icon-btn" onClick={() => { if (confirm("ลบผู้ใช้?")) store.removeUser(u.id); }}>
                      <Icon name="trash" size={13}/>
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showAdd && <AddUserModal onClose={() => setShowAdd(false)}/>}
    </>
  );
}

function AddUserModal({ onClose }) {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [pin, setPin] = React.useState("");
  const [role, setRole] = React.useState("member");
  const submit = () => {
    if (!name || !email || pin.length !== 4) return;
    store.addUser({ name, email, pin, role });
    onClose();
  };
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 480 }}>
        <div className="modal-head">
          <div><h2>เพิ่มผู้ใช้ใหม่</h2><div className="day-meta">ผู้ใช้จะสามารถเข้าระบบได้ทันทีด้วยอีเมล + PIN</div></div>
          <button className="icon-btn" onClick={onClose}><Icon name="x"/></button>
        </div>
        <div className="modal-body">
          <div className="field"><label>ชื่อ-นามสกุล</label><input className="input" value={name} onChange={e => setName(e.target.value)} autoFocus/></div>
          <div className="field"><label>อีเมล</label><input className="input" type="email" value={email} onChange={e => setEmail(e.target.value)}/></div>
          <div className="field"><label>PIN 4 หลัก</label>
            <input className="input" type="tel" inputMode="numeric" maxLength={4} placeholder="••••" value={pin}
                   onChange={e => setPin(e.target.value.replace(/\D/g,"").slice(0,4))}
                   style={{ letterSpacing: 8, fontFamily: "var(--mono)", fontSize: 18, textAlign: "center" }}/>
          </div>
          <div className="field"><label>ยศ</label>
            <select className="select" value={role} onChange={e => setRole(e.target.value)}>
              <option value="admin">Admin — แก้ไขทั้งระบบ</option>
              <option value="editor">Editor — ลงประกาศ + แก้ไขเนื้อหา</option>
              <option value="member">Member — โน้ตและอ่านได้</option>
            </select>
          </div>
        </div>
        <div className="modal-foot">
          <span></span>
          <div className="row">
            <button className="btn ghost" onClick={onClose}>ยกเลิก</button>
            <button className="btn primary" onClick={submit} disabled={!name || !email || pin.length !== 4}><Icon name="check" size={14}/> เพิ่ม</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------- Categories ----------
function CategoriesAdmin({ state }) {
  const [name, setName] = React.useState("");
  const [color, setColor] = React.useState("#a78bfa");
  const palette = ["#a78bfa","#f0abfc","#fbbf24","#34d399","#fb7185","#6366f1","#22d3ee","#fb923c"];
  const submit = () => { if (!name.trim()) return; store.addCategory({ name, color }); setName(""); };
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 22 }}>
      <div className="card">
        <h2 className="h-section">หมวดหมู่งาน <span className="count">{state.categories.length}</span></h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {state.categories.map(c => {
            const count = Object.values(state.notes).flat().filter(n => n.cat === c.id).length;
            return (
              <div key={c.id} className="cat-card">
                <div className="label">
                  <div className="dot" style={{ background: c.color }}></div>
                  {c.name}
                  <span className="badge" style={{ marginLeft: 6 }}>{count} งาน</span>
                </div>
                <button className="icon-btn" onClick={() => { if (confirm("ลบหมวดหมู่ '" + c.name + "'?")) store.removeCategory(c.id); }}>
                  <Icon name="trash" size={13}/>
                </button>
              </div>
            );
          })}
        </div>
      </div>
      <div className="card">
        <h2 className="h-section">เพิ่มหมวดหมู่ใหม่</h2>
        <div className="field"><label>ชื่อ</label><input className="input" value={name} onChange={e => setName(e.target.value)} placeholder="เช่น Finance"/></div>
        <div className="field" style={{ marginTop: 12 }}>
          <label>สี</label>
          <div className="row wrap" style={{ gap: 8 }}>
            {palette.map(p => (
              <button key={p} onClick={() => setColor(p)}
                style={{ width: 28, height: 28, borderRadius: 8, background: p, border: color === p ? "2px solid #fff" : "2px solid transparent", boxShadow: color === p ? "0 0 0 2px " + p : "none", cursor: "pointer" }}/>
            ))}
          </div>
        </div>
        <button className="btn primary" style={{ marginTop: 18, width: "100%", justifyContent: "center" }} onClick={submit} disabled={!name.trim()}>
          <Icon name="plus" size={14}/> เพิ่มหมวดหมู่
        </button>
      </div>
    </div>
  );
}

// ---------- Hero ----------
function HeroAdmin({ state }) {
  const onUpload = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => store.setHero(r.result);
    r.readAsDataURL(f);
  };
  const presets = [
    "assets/hero.png",
    "https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=1600&q=80",
    "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1600&q=80",
  ];
  return (
    <div>
      <h2 className="h-section">รูปภาพหน้า Hero</h2>
      <p style={{ color: "var(--muted)", fontSize: 13, marginTop: -4, marginBottom: 16 }}>รูปนี้จะแสดงที่ด้านบนของหน้าแรกและหน้าล็อกอิน</p>

      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ height: 240, backgroundImage: `url(${state.heroImage})`, backgroundSize: "cover", backgroundPosition: "center", position: "relative" }}>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(8,8,15,0.7), rgba(8,8,15,0.2))" }}></div>
          <div style={{ position: "absolute", left: 24, bottom: 24, color: "#fff", fontWeight: 600, fontSize: 22 }}>WIP Town — ยินดีต้อนรับ</div>
        </div>
        <div style={{ padding: 18, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 12, color: "var(--muted)" }}>ขนาดที่แนะนำ 2000 × 800 px (.png / .jpg)</div>
          <label className="btn primary">
            <Icon name="upload" size={14}/> อัปโหลดรูปใหม่
            <input type="file" accept="image/*" style={{ display: "none" }} onChange={onUpload}/>
          </label>
        </div>
      </div>

      <h3 className="h-section" style={{ marginTop: 22 }}>หรือเลือกจาก preset</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12 }}>
        {presets.map((p, i) => (
          <div key={i} onClick={() => store.setHero(p)}
            style={{
              height: 110, borderRadius: 10, cursor: "pointer",
              backgroundImage: `url(${p})`, backgroundSize: "cover", backgroundPosition: "center",
              border: state.heroImage === p ? "2px solid var(--indigo)" : "1px solid var(--border)",
              position: "relative", overflow: "hidden"
            }}>
            {state.heroImage === p && (
              <div style={{ position: "absolute", top: 8, right: 8, background: "var(--indigo)", borderRadius: "50%", width: 22, height: 22, display: "grid", placeItems: "center" }}>
                <Icon name="check" size={12} stroke={3} style={{ color: "#fff" }}/>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------- Activity ----------
function ActivityAdmin({ state }) {
  return (
    <div className="card">
      <div className="row between" style={{ marginBottom: 8 }}>
        <h2 className="h-section">Activity Log <span className="count">{state.activity.length}</span></h2>
        <span className="badge"><Icon name="github" size={11}/> sync to git history</span>
      </div>
      <div>
        {state.activity.map(l => {
          const u = store.user(l.who);
          return (
            <div key={l.id} className="log-item">
              <div className="avatar" style={{ width: 32, height: 32, fontSize: 12 }}>{fmt.initials(u?.name)}</div>
              <div>
                <div className="text"><strong>{u?.name || "—"}</strong> {l.action}: <span style={{ color: "var(--text)" }}>{l.target}</span></div>
              </div>
              <div className="when">{l.at}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

window.AdminScreen = AdminScreen;
