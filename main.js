(function(){
  "use strict";

  // ---------- DATA: calendario de lecciones ----------
  // Tomado de las fechas de clase del cuaderno.
  const SESSIONS = [
    { label: "19 de junio",      lessons: [1,2] },
    { label: "26 de junio",      lessons: [3,4] },
    { label: "3 de julio",       lessons: [5,6] },
    { label: "10 de julio",      lessons: [7,8] },
    { label: "17 de julio",      lessons: [9,10] },
    { label: "24 de julio",      lessons: [11,12] },
    { label: "31 de julio",      lessons: [13,14], note: "Fiesta JAS · Resúmenes" },
    { label: "7 de agosto",      lessons: [15,16] },
    { label: "14 de agosto",     lessons: [20,21,22], note: "PFJ JAS" },
    { label: "21 de agosto",     lessons: [17,18,19] },
    { label: "28 de agosto",     lessons: [23,24,25] },
    { label: "4 de septiembre",  lessons: [26,27,28] },
  ];

  const ALL_LESSONS = SESSIONS.flatMap(s => s.lessons).sort((a,b)=>a-b);
  const TOTAL_LESSONS = ALL_LESSONS.length;

  // ---------- STORAGE ----------
  const STORAGE_KEY = "jas_familia_eterna_v1";

  function loadState(){
    try{
      const raw = localStorage.getItem(STORAGE_KEY);
      if(!raw) return { students: [] };
      const parsed = JSON.parse(raw);
      if(!Array.isArray(parsed.students)) return { students: [] };
      return parsed;
    }catch(e){
      console.warn("No se pudo leer localStorage", e);
      return { students: [] };
    }
  }

  function saveState(){
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  let state = loadState();
  // state.students: [{ id, name, done: [lessonNumbers] }]

  // ---------- SEED (data/students.js) ----------
  // Combina el archivo de datos base con lo guardado en el navegador,
  // sin borrar nada que ya esté marcado localmente.
  function applySeed(){
    if(typeof SEED_STUDENTS === "undefined") return;
    let changed = false;
    Object.entries(SEED_STUDENTS).forEach(([name, lessons]) => {
      let st = state.students.find(s => s.name === name);
      if(!st){
        st = { id: uid(), name, done: [] };
        state.students.push(st);
        changed = true;
      }
      (lessons || []).forEach(n => {
        if(!st.done.includes(n)){
          st.done.push(n);
          changed = true;
        }
      });
    });
    if(changed) saveState();
  }

  function uid(){
    return "s" + Date.now().toString(36) + Math.random().toString(36).slice(2,7);
  }

  function findStudent(id){
    return state.students.find(s => s.id === id);
  }

  // ---------- STUDENT ACTIONS ----------
  function addStudent(name){
    name = name.trim();
    if(!name) return;
    state.students.push({ id: uid(), name, done: [] });
    saveState();
  }

  function addStudentsBulk(text){
    text.split("\n")
      .map(n => n.trim())
      .filter(Boolean)
      .forEach(addStudent);
  }

  function removeStudent(id){
    state.students = state.students.filter(s => s.id !== id);
    saveState();
  }

  function toggleLesson(studentId, lessonNum){
    const st = findStudent(studentId);
    if(!st) return;
    const idx = st.done.indexOf(lessonNum);
    if(idx >= 0) st.done.splice(idx,1);
    else st.done.push(lessonNum);
    saveState();
  }

  function pendingFor(student){
    return ALL_LESSONS.filter(n => !student.done.includes(n));
  }

  // ---------- RENDER: CALENDARIO ----------
  function renderCalendar(){
    const tbody = document.querySelector("#calendar-table tbody");
    tbody.innerHTML = "";
    SESSIONS.forEach(s => {
      const tr = document.createElement("tr");
      const lessonsTxt = s.lessons.length > 1
        ? `Lecciones ${s.lessons[0]}–${s.lessons[s.lessons.length-1]}`
        : `Lección ${s.lessons[0]}`;
      tr.innerHTML = `
        <td>${s.label}</td>
        <td>${lessonsTxt}</td>
        <td>${s.note ? `<span class="tag-note">${s.note}</span>` : ""}</td>
      `;
      tbody.appendChild(tr);
    });
  }

  // ---------- RENDER: ASISTENCIA ----------
  const openRows = new Set();

  function renderAsistencia(){
    const list = document.getElementById("asistencia-list");
    const empty = document.getElementById("asistencia-empty");
    list.innerHTML = "";

    if(state.students.length === 0){
      empty.hidden = false;
      return;
    }
    empty.hidden = true;

    state.students
      .slice()
      .sort((a,b)=> a.name.localeCompare(b.name,'es'))
      .forEach(st => {
        const row = document.createElement("div");
        row.className = "student-row" + (openRows.has(st.id) ? " open" : "");

        const head = document.createElement("div");
        head.className = "student-row__head";
        head.innerHTML = `
          <span class="student-row__caret">▶</span>
          <span class="student-row__name">${escapeHtml(st.name)}</span>
          <span class="student-row__count">${st.done.length}/${TOTAL_LESSONS}</span>
          <button class="student-row__delete" title="Eliminar alumno">✕</button>
        `;
        head.addEventListener("click", (e) => {
          if(e.target.closest(".student-row__delete")) return;
          if(openRows.has(st.id)) openRows.delete(st.id);
          else openRows.add(st.id);
          renderAsistencia();
        });
        head.querySelector(".student-row__delete").addEventListener("click", () => {
          if(confirm(`¿Eliminar a "${st.name}" y su registro de lecciones?`)){
            removeStudent(st.id);
            renderAsistencia();
            renderPendientes();
          }
        });

        const body = document.createElement("div");
        body.className = "student-row__body";
        SESSIONS.forEach(s => {
          const block = document.createElement("div");
          block.className = "session-block";
          block.innerHTML = `<div class="session-block__title">${s.label}${s.note ? " · " + s.note : ""}</div>`;
          const wrap = document.createElement("div");
          s.lessons.forEach(n => {
            const checked = st.done.includes(n);
            const lbl = document.createElement("label");
            lbl.className = "lesson-check" + (checked ? " checked" : "");
            lbl.innerHTML = `<input type="checkbox" ${checked ? "checked" : ""}> Lección ${n}`;
            lbl.querySelector("input").addEventListener("change", () => {
              toggleLesson(st.id, n);
              renderAsistencia();
              renderPendientes();
            });
            wrap.appendChild(lbl);
          });
          block.appendChild(wrap);
          body.appendChild(block);
        });

        row.appendChild(head);
        row.appendChild(body);
        list.appendChild(row);
      });
  }

  // ---------- RENDER: PENDIENTES ----------
  function renderPendientes(){
    const list = document.getElementById("pendientes-list");
    const empty = document.getElementById("pendientes-empty");
    const search = document.getElementById("search-alumno").value.trim().toLowerCase();
    const soloPendientes = document.getElementById("solo-pendientes").checked;
    const resumen = document.getElementById("resumen-count");

    list.innerHTML = "";

    if(state.students.length === 0){
      empty.hidden = false;
      resumen.textContent = "";
      return;
    }
    empty.hidden = true;

    let students = state.students.slice().sort((a,b)=> a.name.localeCompare(b.name,'es'));

    if(search){
      students = students.filter(s => s.name.toLowerCase().includes(search));
    }

    const withPending = students.filter(s => pendingFor(s).length > 0);
    resumen.textContent = `${withPending.length} de ${state.students.length} con pendientes`;

    if(soloPendientes){
      students = withPending;
    }

    if(students.length === 0){
      list.innerHTML = `<p class="empty-state">No hay alumnos que coincidan con el filtro.</p>`;
      return;
    }

    students.forEach(st => {
      const pending = pendingFor(st);
      const doneCount = st.done.length;
      const pct = Math.round((doneCount / TOTAL_LESSONS) * 100);

      const card = document.createElement("div");
      card.className = "student-card";

      let groupsHtml = "";
      if(pending.length === 0){
        groupsHtml = `<div class="all-done">✓ Al día con todas las lecciones</div>`;
      }else{
        groupsHtml = `<div class="pending-groups">` + SESSIONS.map(s => {
          const missing = s.lessons.filter(n => pending.includes(n));
          if(missing.length === 0) return "";
          return `<div class="pending-group"><b>${s.label}${s.note ? " (" + s.note + ")" : ""}:</b> ` +
            missing.map(n => `<span class="pending-chip">L${n}</span>`).join("") +
            `</div>`;
        }).filter(Boolean).join("") + `</div>`;
      }

      card.innerHTML = `
        <div class="student-card__head">
          <span class="student-card__name">${escapeHtml(st.name)}</span>
          <span class="student-card__status ${pending.length ? 'student-card__status--pending' : 'student-card__status--ok'}">
            ${pending.length ? pending.length + " pendientes" : "al día"}
          </span>
        </div>
        <div class="progress"><div class="progress__fill" style="width:${pct}%"></div></div>
        <div class="progress__label">${doneCount} de ${TOTAL_LESSONS} lecciones (${pct}%)</div>
        ${groupsHtml}
      `;
      list.appendChild(card);
    });
  }

  function escapeHtml(str){
    return str.replace(/[&<>"']/g, c => ({
      "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
    }[c]));
  }

  // ---------- TABS ----------
  function setupTabs(){
    document.querySelectorAll(".tab").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".tab").forEach(b => b.classList.remove("active"));
        document.querySelectorAll(".panel").forEach(p => p.classList.remove("active"));
        btn.classList.add("active");
        document.getElementById("tab-" + btn.dataset.tab).classList.add("active");
      });
    });
  }

  // ---------- WIRE UP ----------
  function setupAsistenciaForm(){
    document.getElementById("btn-add-alumno").addEventListener("click", () => {
      const input = document.getElementById("nuevo-alumno");
      if(input.value.trim()){
        addStudent(input.value);
        input.value = "";
        renderAsistencia();
        renderPendientes();
      }
    });
    document.getElementById("nuevo-alumno").addEventListener("keydown", (e) => {
      if(e.key === "Enter") document.getElementById("btn-add-alumno").click();
    });

    const bulkBox = document.getElementById("bulk-box");
    document.getElementById("btn-bulk-toggle").addEventListener("click", () => {
      bulkBox.hidden = !bulkBox.hidden;
    });
    document.getElementById("btn-bulk-cancel").addEventListener("click", () => {
      bulkBox.hidden = true;
      document.getElementById("bulk-textarea").value = "";
    });
    document.getElementById("btn-bulk-confirm").addEventListener("click", () => {
      const ta = document.getElementById("bulk-textarea");
      addStudentsBulk(ta.value);
      ta.value = "";
      bulkBox.hidden = true;
      renderAsistencia();
      renderPendientes();
    });
  }

  function setupPendientesFilters(){
    document.getElementById("search-alumno").addEventListener("input", renderPendientes);
    document.getElementById("solo-pendientes").addEventListener("change", renderPendientes);
  }

  function setupDataActions(){
    document.getElementById("btn-export").addEventListener("click", () => {
      const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "la-familia-eterna-datos.json";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    });

    document.getElementById("btn-import").addEventListener("change", (e) => {
      const file = e.target.files[0];
      if(!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try{
          const parsed = JSON.parse(reader.result);
          if(!Array.isArray(parsed.students)) throw new Error("Formato inválido");
          state = parsed;
          saveState();
          renderAsistencia();
          renderPendientes();
          alert("Datos importados correctamente.");
        }catch(err){
          alert("El archivo no tiene un formato válido.");
        }
        e.target.value = "";
      };
      reader.readAsText(file);
    });
  }

  // ---------- INIT ----------
  document.addEventListener("DOMContentLoaded", () => {
    applySeed();
    setupTabs();
    setupAsistenciaForm();
    setupPendientesFilters();
    setupDataActions();
    renderCalendar();
    renderAsistencia();
    renderPendientes();
  });

})();
