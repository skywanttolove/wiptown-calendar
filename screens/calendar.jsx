/* eslint-disable */
// Calendar month view + Day detail modal

function CalendarScreen() {
  const state = useStore();
  const today = new Date();
  const [view, setView] = React.useState(() => {
    if (window.__openDay) {
      const { y, m } = fmt.parseKey(window.__openDay);
      return { y, m };
    }
    return { y: today.getFullYear(), m: today.getMonth() };
  });
  const [activeCats, setActiveCats] = React.useState(() => new Set(state.categories.map(c => c.id)));
  const [openKey, setOpenKey] = React.useState(() => {
    const k = window.__openDay;
    if (k) { delete window.__openDay; return k; }
    return null;
  });

  const toggleCat = (id) => {
    setActiveCats(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };
  const allActive = activeCats.size === state.categories.length;
  const toggleAll = () => setActiveCats(allActive ? new Set() : new Set(state.categories.map(c => c.id)));

  const prev = () => setView(v => v.m === 0 ? { y: v.y-1, m: 11 } : { ...v, m: v.m-1 });
  const next = () => setView(v => v.m === 11 ? { y: v.y+1, m: 0 } : { ...v, m: v.m+1 });
  const toToday = () => setView({ y: today.getFullYear(), m: today.getMonth() });

  // Build grid (start Sunday)
  const firstDow = new Date(view.y, view.m, 1).getDay();
  const lastDay = new Date(view.y, view.m+1, 0).getDate();
  const prevLast = new Date(view.y, view.m, 0).getDate();

  const cells = [];
  for (let i = firstDow - 1; i >= 0; i--) {
    cells.push({ off: true, d: prevLast - i, y: view.m === 0 ? view.y-1 : view.y, m: view.m === 0 ? 11 : view.m - 1 });
  }
  for (let d = 1; d <= lastDay; d++) {
    cells.push({ off: false, d, y: view.y, m: view.m });
  }
  while (cells.length % 7) {
    const last = cells[cells.length-1];
    const nd = last.off || last.m !== view.m ? last.d + 1 : last.d + 1;
    cells.push({ off: true, d: nd, y: view.m === 11 ? view.y + 1 : view.y, m: view.m === 11 ? 0 : view.m + 1 });
    if (cells.length > 42) break;
  }

  return (
    <div className="page">
      <div className="cal-toolbar">
        <div className="left">
          <button className="nav-btn" onClick={prev}><Icon name="chevL" size={14}/></button>
          <button className="nav-btn" onClick={next}><Icon name="chevR" size={14}/></button>
          <button className="btn sm" onClick={toToday}>วันนี้</button>
          <div className="month-title" style={{ marginLeft: 8 }}>{fmt.thMonthYear(view.y, view.m)}</div>
        </div>
        <div className="right">
          <div className="cat-chips">
            <button className={"cat-chip " + (allActive ? "active" : "")} onClick={toggleAll}>
              <Icon name="filter" size={11}/> ทั้งหมด
            </button>
            {state.categories.map(c => (
              <button key={c.id} className={"cat-chip " + (activeCats.has(c.id) ? "active" : "")} onClick={() => toggleCat(c.id)}>
                <span className="dot" style={{ background: c.color }}></span>{c.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="cal-grid">
        {["อาทิตย์","จันทร์","อังคาร","พุธ","พฤหัสบดี","ศุกร์","เสาร์"].map(d => (
          <div key={d} className="dow-header">{d}</div>
        ))}
        {cells.map((c, i) => {
          const key = fmt.dateKey(c.y, c.m, c.d);
          const isToday = !c.off && c.y === today.getFullYear() && c.m === today.getMonth() && c.d === today.getDate();
          const allNotes = state.notes[key] || [];
          const notes = allNotes.filter(n => activeCats.has(n.cat));
          const visible = notes.slice(0, 3);
          const more = notes.length - visible.length;
          const images = allNotes.flatMap(n => n.images || []).filter(Boolean).slice(0, 4);
          return (
            <div key={i} className={"cal-day" + (c.off ? " off" : "") + (isToday ? " today" : "")}
                 onClick={() => setOpenKey(key)}>
              <div className="day-head">
                <span className="day-num">{c.d}</span>
                {notes.length > 0 && <span className="day-count">{notes.filter(n => n.done).length}/{notes.length}</span>}
              </div>
              <div className="day-notes">
                {visible.map(n => {
                  const cat = store.category(n.cat);
                  return (
                    <div key={n.id} className={"cal-note" + (n.done ? " done" : "")} style={{ borderLeftColor: cat?.color || "var(--violet)" }} title={n.text}>
                      <span className="cat-dot" style={{ background: cat?.color }}></span>
                      {n.text}
                    </div>
                  );
                })}
                {more > 0 && <div className="more">+{more} อื่นๆ</div>}
              </div>
              {images.length > 0 && (
                <div className="pic-strip">
                  {images.map((src, idx) => (
                    src !== "placeholder"
                      ? <img key={idx} src={src} alt="" onError={(e) => e.target.style.display='none'}/>
                      : <div key={idx} style={{ width: 18, height: 18, borderRadius: 3, background: "linear-gradient(135deg, var(--indigo), var(--pink))" }}></div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {openKey && <DayDetail dateKey={openKey} onClose={() => setOpenKey(null)} />}
    </div>
  );
}

// ---------- Day Detail ----------
function DayDetail({ dateKey, onClose }) {
  const state = useStore();
  const me = store.me();
  const notes = state.notes[dateKey] || [];
  const done = notes.filter(n => n.done).length;
  const allImages = notes.flatMap(n => (n.images || []).map(src => ({ src, noteId: n.id })));

  const [text, setText] = React.useState("");
  const [cat, setCat] = React.useState(state.categories[0]?.id);
  const fileRef = React.useRef();
  const [tab, setTab] = React.useState("notes"); // notes | images
  const [lightbox, setLightbox] = React.useState(null); // { images: [...], index: 0 }

  const openLightbox = (allList, src) => {
    const list = allList.filter(s => s && s !== "placeholder");
    const idx = list.indexOf(src);
    if (idx < 0) return;
    setLightbox({ images: list, index: idx });
  };

  const submit = () => {
    if (!text.trim()) return;
    store.addNote(dateKey, { text, cat, author: me?.id });
    setText("");
  };

  const onUpload = (e, noteId) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const readers = files.map(f => new Promise(res => {
      const r = new FileReader();
      r.onload = () => res(r.result);
      r.readAsDataURL(f);
    }));
    Promise.all(readers).then(urls => {
      if (noteId) {
        const note = notes.find(n => n.id === noteId);
        store.updateNote(dateKey, noteId, { images: [...(note?.images || []), ...urls] });
      } else {
        // Attach to a generic image-only note for this day
        store.addNote(dateKey, { text: `อัปโหลด ${urls.length} ไฟล์`, cat, author: me?.id, images: urls });
      }
    });
    e.target.value = "";
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal wide" onClick={e => e.stopPropagation()}>
        <div className="modal-head">
          <div>
            <h2>{fmt.longThai(dateKey)}</h2>
            <div className="day-meta">
              {notes.length} งาน · <strong style={{ color: "var(--green)" }}>{done} เสร็จ</strong> · {notes.length - done} ค้าง
              {allImages.length > 0 && <> · {allImages.length} รูป</>}
            </div>
          </div>
          <button className="icon-btn" onClick={onClose}><Icon name="x"/></button>
        </div>

        <div style={{ borderBottom: "1px solid var(--border)", padding: "0 26px" }}>
          <div className="tab-row" style={{ borderBottom: "none", marginBottom: 0 }}>
            <button className={"tab " + (tab === "notes" ? "active" : "")} onClick={() => setTab("notes")}>
              งาน &amp; โน้ต ({notes.length})
            </button>
            <button className={"tab " + (tab === "images" ? "active" : "")} onClick={() => setTab("images")}>
              รูปและไฟล์แนบ ({allImages.length})
            </button>
          </div>
        </div>

        <div className="modal-body">
          {tab === "notes" && (
            <>
              {notes.length === 0 && (
                <div className="empty" style={{ padding: "20px 0" }}>
                  ยังไม่มีโน้ตในวันนี้ — เพิ่มงานแรกได้เลย ↓
                </div>
              )}
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {notes.map(n => {
                  const c = store.category(n.cat);
                  const author = store.user(n.author);
                  return (
                    <div key={n.id} className={"note-item " + (n.done ? "done" : "")}>
                      <div className={"checkbox " + (n.done ? "checked" : "")} onClick={() => store.updateNote(dateKey, n.id, { done: !n.done })}>
                        {n.done && <Icon name="check" size={12} stroke={3}/>}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <p className="note-text">{n.text}</p>
                        <div className="note-meta">
                          {c && <span className="badge" style={{ color: c.color, background: c.color + "22", borderColor: c.color + "55" }}>
                            <span className="dot" style={{ background: c.color }}></span>{c.name}
                          </span>}
                          {n.at && <span><Icon name="clock" size={10}/> {n.at}</span>}
                          <span className="author"><span className="avatar-xs">{fmt.initials(author?.name)}</span>{author?.name?.split(" ")[0] || "?"}</span>
                        </div>
                        {(n.images && n.images.length > 0) && (
                          <div style={{ display: "flex", gap: 4, marginTop: 8, flexWrap: "wrap" }}>
                            {n.images.map((src, i) =>
                              src === "placeholder"
                                ? <div key={i} style={{ width: 50, height: 50, borderRadius: 6, background: "linear-gradient(135deg, var(--indigo), var(--pink))" }}/>
                                : <img key={i} src={src} alt=""
                                       className="thumb-clickable"
                                       style={{ width: 50, height: 50, borderRadius: 6, objectFit: "cover", cursor: "zoom-in" }}
                                       onClick={() => openLightbox(n.images, src)}/>
                            )}
                            <label className="image-tile upload" style={{ width: 50, height: 50, aspectRatio: "auto" }}>
                              <input type="file" multiple accept="image/*" style={{ display: "none" }} onChange={(e) => onUpload(e, n.id)}/>
                              <Icon name="plus" size={16}/>
                            </label>
                          </div>
                        )}
                      </div>
                      <div className="row" style={{ gap: 2 }}>
                        {(!n.images || n.images.length === 0) && (
                          <label className="icon-btn" title="แนบรูป">
                            <input type="file" multiple accept="image/*" style={{ display: "none" }} onChange={(e) => onUpload(e, n.id)}/>
                            <Icon name="img" size={14}/>
                          </label>
                        )}
                        <button className="icon-btn" title="ลบ" onClick={() => { if (confirm("ลบโน้ตนี้?")) store.removeNote(dateKey, n.id); }}>
                          <Icon name="trash" size={14}/>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="note-add">
                <textarea className="textarea" placeholder="เพิ่มสิ่งที่ต้องทำในวันนี้…" value={text} onChange={e => setText(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) submit(); }}/>
                <div className="row" style={{ justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
                  <div className="row" style={{ gap: 6 }}>
                    <select className="select" style={{ width: "auto", padding: "6px 10px", fontSize: 12 }} value={cat} onChange={e => setCat(e.target.value)}>
                      {state.categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    <span style={{ fontSize: 11, color: "var(--muted)" }}>กด ⌘+Enter เพื่อบันทึก</span>
                  </div>
                  <button className="btn primary sm" onClick={submit} disabled={!text.trim()}>
                    <Icon name="plus" size={12}/> เพิ่มงาน
                  </button>
                </div>
              </div>
            </>
          )}

          {tab === "images" && (
            <div>
              <div className="image-grid">
                <label className="image-tile upload">
                  <input type="file" multiple accept="image/*" ref={fileRef} style={{ display: "none" }} onChange={(e) => onUpload(e, null)}/>
                  <Icon name="upload" size={22}/>
                  <div>คลิกหรือลากไฟล์มาวาง</div>
                  <div style={{ fontSize: 10, color: "var(--muted-2)" }}>PNG, JPG, GIF</div>
                </label>
                {allImages.map((img, i) => (
                  <div key={i} className="image-tile" onClick={() => openLightbox(allImages.map(x => x.src), img.src)} style={{ cursor: "zoom-in" }}>
                    {img.src === "placeholder"
                      ? <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, var(--indigo), var(--pink))" }}/>
                      : <img src={img.src} alt=""/>
                    }
                    <button className="del" onClick={(e) => {
                      e.stopPropagation();
                      const note = notes.find(n => n.id === img.noteId);
                      if (!note) return;
                      store.updateNote(dateKey, img.noteId, { images: note.images.filter(s => s !== img.src) });
                    }}><Icon name="x" size={12}/></button>
                  </div>
                ))}
                {allImages.length === 0 && (
                  <div style={{ gridColumn: "span 3", color: "var(--muted)", fontSize: 12, textAlign: "center", padding: 20 }}>
                    ยังไม่มีรูปสำหรับวันนี้
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="modal-foot">
          <div style={{ fontSize: 11, color: "var(--muted)" }}>
            <Icon name="github" size={11} style={{ verticalAlign: "middle" }}/> ทุกการเปลี่ยนแปลง sync ไปยัง github
          </div>
          <button className="btn" onClick={onClose}>ปิด</button>
        </div>
      </div>
      {lightbox && (
        <Lightbox
          images={lightbox.images}
          index={lightbox.index}
          onClose={() => setLightbox(null)}
          onChange={i => setLightbox(lb => ({ ...lb, index: i }))}
        />
      )}
    </div>
  );
}

function Lightbox({ images, index, onClose, onChange }) {
  React.useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft")  onChange((index - 1 + images.length) % images.length);
      else if (e.key === "ArrowRight") onChange((index + 1) % images.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, images, onChange, onClose]);

  const src = images[index];
  const prev = () => onChange((index - 1 + images.length) % images.length);
  const next = () => onChange((index + 1) % images.length);

  return (
    <div className="lightbox" onClick={(e) => { e.stopPropagation(); onClose(); }}>
      <button className="lb-close" onClick={onClose} title="Esc"><Icon name="x" size={20}/></button>
      <div className="lb-counter">{index + 1} / {images.length}</div>

      {images.length > 1 && (
        <button className="lb-nav prev" onClick={(e) => { e.stopPropagation(); prev(); }} title="←">
          <Icon name="chevL" size={26}/>
        </button>
      )}
      <img className="lb-img" src={src} alt="" onClick={(e) => e.stopPropagation()}/>
      {images.length > 1 && (
        <button className="lb-nav next" onClick={(e) => { e.stopPropagation(); next(); }} title="→">
          <Icon name="chevR" size={26}/>
        </button>
      )}

      <div className="lb-actions" onClick={(e) => e.stopPropagation()}>
        <a className="btn sm" href={src} download={`image-${index+1}.png`} target="_blank" rel="noreferrer">
          <Icon name="upload" size={12} style={{ transform: "rotate(180deg)" }}/> ดาวน์โหลด
        </a>
        <a className="btn sm" href={src} target="_blank" rel="noreferrer">
          <Icon name="eye" size={12}/> เปิดในแท็บใหม่
        </a>
      </div>

      {images.length > 1 && (
        <div className="lb-strip" onClick={(e) => e.stopPropagation()}>
          {images.map((s, i) => (
            <img key={i} src={s} alt="" className={i === index ? "active" : ""} onClick={() => onChange(i)}/>
          ))}
        </div>
      )}
    </div>
  );
}

window.CalendarScreen = CalendarScreen;
