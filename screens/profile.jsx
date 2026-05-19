/* eslint-disable */
// Profile / Settings — current user info + notification & sync prefs

function ProfileScreen() {
  const state = useStore();
  const me = store.me();
  const [name, setName] = React.useState(me?.name || "");
  const [pin, setPin] = React.useState(me?.pin || "");
  const [saved, setSaved] = React.useState(false);
  const [notif, setNotif] = React.useState({ daily: true, mentions: true, announcements: true });

  React.useEffect(() => { setName(me?.name || ""); setPin(me?.pin || ""); }, [me?.id]);

  const dirty = name !== me?.name || pin !== me?.pin;

  const save = () => {
    if (!name.trim()) return;
    if (pin.length !== 4) { alert("PIN ต้องมี 4 หลัก"); return; }
    store.updateUser(me.id, { name: name.trim(), pin });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const myNotes = Object.entries(state.notes).flatMap(([k, ns]) => ns.filter(n => n.author === me?.id).map(n => ({ ...n, dateKey: k })));
  const doneCount = myNotes.filter(n => n.done).length;

  return (
    <div className="page">
      <h1 className="h-page">โปรไฟล์ &amp; ตั้งค่า</h1>
      <p className="h-sub">จัดการข้อมูลส่วนตัว การแจ้งเตือน และการเชื่อมต่อ</p>

      <div className="profile-grid">
        <div>
          <div className="card profile-card">
            <div className="head">
              <div className="avatar-lg">{fmt.initials(me?.name)}</div>
              <div>
                <div className="name">{me?.name}</div>
                <div className="email">{me?.email}</div>
                <div style={{ marginTop: 6 }}>
                  <span className={"role-tag " + me?.role}>{me?.role?.toUpperCase()}</span>
                </div>
              </div>
            </div>

            <div className="kv-row">
              <div className="k">เข้าร่วมเมื่อ</div>
              <div className="v">{me?.joined}</div>
            </div>
            <div className="kv-row">
              <div className="k">งานทั้งหมด</div>
              <div className="v">{myNotes.length} งาน · <span style={{ color: "var(--green)" }}>{doneCount} เสร็จ</span></div>
            </div>
            <div className="kv-row">
              <div className="k">User ID</div>
              <div className="v" style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--muted)" }}>{me?.id}</div>
            </div>

            <button className="btn danger" style={{ width: "100%", justifyContent: "center", marginTop: 14 }} onClick={() => store.logout()}>
              <Icon name="logout" size={14}/> ออกจากระบบ
            </button>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="card">
            <h2 className="h-section">ข้อมูลส่วนตัว</h2>
            <div className="field"><label>ชื่อ-นามสกุล</label><input className="input" value={name} onChange={e => { setName(e.target.value); setSaved(false); }}/></div>
            <div className="field" style={{ marginTop: 12 }}>
              <label>อีเมล</label>
              <input className="input" value={me?.email} readOnly style={{ color: "var(--muted)" }}/>
              <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 4 }}>อีเมลแก้ไขไม่ได้ — ถ้าต้องเปลี่ยน ติดต่อแอดมิน</div>
            </div>
            <div className="field" style={{ marginTop: 12 }}>
              <label>PIN (4 หลัก)</label>
              <input className="input" type="tel" inputMode="numeric" maxLength={4}
                     value={pin}
                     onChange={e => { setPin(e.target.value.replace(/\D/g,"").slice(0,4)); setSaved(false); }}
                     style={{ letterSpacing: 8, fontFamily: "var(--mono)", fontSize: 18, textAlign: "center", maxWidth: 180 }}/>
            </div>
            <div className="row" style={{ marginTop: 14, gap: 10 }}>
              <button className="btn primary sm" onClick={save} disabled={!dirty || !name.trim() || pin.length !== 4}>
                <Icon name="check" size={12}/> บันทึก
              </button>
              {saved && <span style={{ fontSize: 12, color: "var(--green)" }}>✓ บันทึกแล้ว</span>}
              {dirty && !saved && <span style={{ fontSize: 12, color: "var(--amber)" }}>มีการเปลี่ยนแปลงที่ยังไม่ได้บันทึก</span>}
            </div>
          </div>

          <div className="card">
            <h2 className="h-section">การแจ้งเตือน</h2>
            {[
              { k: "daily",         label: "สรุปงานประจำวัน",          sub: "ทุก 09:00" },
              { k: "mentions",      label: "เมื่อมีคนแท็กในโน้ต",       sub: "เรียลไทม์" },
              { k: "announcements", label: "ประกาศใหม่จากแอดมิน",      sub: "ทันที" },
            ].map(it => (
              <div key={it.k} className="row between" style={{ padding: "12px 0", borderBottom: "1px solid var(--border)" }}>
                <div>
                  <div style={{ fontSize: 14, color: "var(--text)" }}>{it.label}</div>
                  <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>{it.sub}</div>
                </div>
                <div className={"toggle " + (notif[it.k] ? "on" : "")} onClick={() => setNotif(n => ({ ...n, [it.k]: !n[it.k] }))}></div>
              </div>
            ))}
          </div>

          <div className="card">
            <h2 className="h-section"><Icon name="github" size={14}/> เชื่อมต่อ GitHub</h2>
            <p style={{ color: "var(--muted)", fontSize: 12, marginTop: -8, marginBottom: 12 }}>
              ข้อมูลถูก sync ขึ้น repository ของทีมโดยอัตโนมัติ — แต่ละการแก้ไขจะถูกบันทึกเป็น commit
            </p>
            <div className="kv-row"><div className="k">Repository</div><div className="v" style={{ fontFamily: "var(--mono)", fontSize: 13 }}>github.com/{state.sync.repo}</div></div>
            <div className="kv-row"><div className="k">Branch</div><div className="v" style={{ fontFamily: "var(--mono)", fontSize: 13 }}>main</div></div>
            <div className="kv-row"><div className="k">Last sync</div><div className="v" style={{ fontSize: 13 }}>{fmt.relTime(state.sync.lastSyncAt)}</div></div>
            <div className="kv-row"><div className="k">สถานะ</div>
              <div className="v"><span className="sync-bar"><span className="dot"></span>{state.sync.status === "synced" ? "เชื่อมต่อ" : "กำลัง sync…"}</span></div>
            </div>
            <button className="btn" style={{ marginTop: 12 }} onClick={() => store.manualPush()}>
              <Icon name="refresh" size={14}/> Push การเปลี่ยนแปลงตอนนี้
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
window.ProfileScreen = ProfileScreen;
