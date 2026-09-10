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

  // ---------- DATA: alumnos (data/students.js) ----------
  const students = typeof SEED_STUDENTS !== "undefined"
    ? Object.entries(SEED_STUDENTS).map(([name, done]) => ({ name, done: done || [] }))
    : [];

  function pendingFor(student){
    return ALL_LESSONS.filter(n => !student.done.includes(n));
  }

  function escapeHtml(str){
    return str.replace(/[&<>"']/g, c => ({
      "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
    }[c]));
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

  // ---------- RENDER: BUSCAR ALUMNO (tomadas / pendientes) ----------
  function renderPendientes(){
    const list = document.getElementById("pendientes-list");
    const empty = document.getElementById("pendientes-empty");
    const search = document.getElementById("search-alumno").value.trim().toLowerCase();

    list.innerHTML = "";

    if(!search){
      empty.hidden = false;
      empty.textContent = "Escribe un nombre para ver sus lecciones tomadas y pendientes.";
      return;
    }

    const matches = students
      .filter(s => s.name.toLowerCase().includes(search))
      .sort((a,b)=> a.name.localeCompare(b.name,'es'));

    if(matches.length === 0){
      empty.hidden = false;
      empty.textContent = "No hay alumnos que coincidan con la búsqueda.";
      return;
    }
    empty.hidden = true;

    matches.forEach(st => {
      const pending = pendingFor(st);
      const done = st.done.slice().sort((a,b)=>a-b);
      const doneCount = done.length;
      const pct = Math.round((doneCount / TOTAL_LESSONS) * 100);

      const card = document.createElement("div");
      card.className = "student-card";

      const takenHtml = done.length
        ? `<div class="pending-group"><b>Tomadas:</b> ` +
          done.map(n => `<span class="pending-chip pending-chip--ok">L${n}</span>`).join("") +
          `</div>`
        : `<div class="pending-group"><b>Tomadas:</b> ninguna todavía</div>`;

      const pendingHtml = pending.length
        ? `<div class="pending-group"><b>Pendientes:</b> ` +
          pending.map(n => `<span class="pending-chip">L${n}</span>`).join("") +
          `</div>`
        : `<div class="all-done">✓ Al día con todas las lecciones</div>`;

      card.innerHTML = `
        <div class="student-card__head">
          <span class="student-card__name">${escapeHtml(st.name)}</span>
          <span class="student-card__status ${pending.length ? 'student-card__status--pending' : 'student-card__status--ok'}">
            ${pending.length ? pending.length + " pendientes" : "al día"}
          </span>
        </div>
        <div class="progress"><div class="progress__fill" style="width:${pct}%"></div></div>
        <div class="progress__label">${doneCount} de ${TOTAL_LESSONS} lecciones (${pct}%)</div>
        <div class="pending-groups">
          ${takenHtml}
          ${pendingHtml}
        </div>
      `;
      list.appendChild(card);
    });
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

  function setupPendientesFilters(){
    document.getElementById("search-alumno").addEventListener("input", renderPendientes);
  }

  // ---------- INIT ----------
  document.addEventListener("DOMContentLoaded", () => {
    setupTabs();
    setupPendientesFilters();
    renderCalendar();
    renderPendientes();
  });

})();
