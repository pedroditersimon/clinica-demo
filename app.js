(() => {
  'use strict';

  const STORAGE_KEY = 'clara.clinica.v1';
  const app = document.querySelector('#app');
  const today = new Date();
  const localDate = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  const daysAgo = (days) => { const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() - days); return localDate(date); };
  const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
  const formatDate = (value) => { if (!value) return 'Sin consultas'; const [y, m, d] = value.split('-').map(Number); const date = new Date(y, m - 1, d); return Number.isNaN(date.getTime()) ? '—' : new Intl.DateTimeFormat('es-AR', { day: '2-digit', month: 'short', year: 'numeric' }).format(date); };
  const age = (birth) => { if (!birth) return '—'; const [y, m, d] = birth.split('-').map(Number); if (!y || !m || !d) return '—'; let years = today.getFullYear() - y; if (today.getMonth() + 1 < m || (today.getMonth() + 1 === m && today.getDate() < d)) years--; return `${years} años`; };
  const initials = (name) => name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase() || '').join('');
  const uid = () => typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const visit = (days, reason, diagnosis, treatment, notes, images = [], professional = 'Dra. Lucía Fernández') => ({ id: uid(), date: daysAgo(days), professional, reason, diagnosis, treatment, notes, images });
  const seed = () => ([
    { id: 'p1', name: 'María González', dni: '28456789', birth: '1982-06-14', phone: '11 4567-8901', email: 'maria.gonzalez@email.com', observations: 'Alergia a la penicilina. Seguimiento por hipertensión.', visits: [visit(0, 'Control de presión arterial', 'Hipertensión arterial controlada', 'Continuar tratamiento actual. Control en 30 días.', 'Valores de presión estables. Refiere buena adherencia al tratamiento.'), visit(43, 'Consulta de seguimiento', 'Hipertensión arterial', 'Iniciar control domiciliario de presión.', 'Se indican controles diarios y registro de valores.') ] },
    { id: 'p2', name: 'Julián Martínez', dni: '32678901', birth: '1990-03-22', phone: '11 4321-5678', email: 'julian.martinez@email.com', observations: '', visits: [visit(1, 'Dolor de rodilla derecha', 'Probable tendinitis rotuliana', 'Reposo relativo, hielo local y control en 2 semanas.', 'Molestia al correr. Se revisaron estudios aportados.', ['Radiografía de rodilla', 'Ecografía de rodilla']), visit(78, 'Chequeo general', 'Examen físico sin particularidades', 'Actividad física regular.', 'Control preventivo anual.')] },
    { id: 'p3', name: 'Sofía Ramírez', dni: '40123456', birth: '1997-11-08', phone: '11 5999-2345', email: 'sofia.ramirez@email.com', observations: 'Paciente en seguimiento.', visits: [visit(2, 'Seguimiento de tratamiento', 'Dermatitis atópica en evolución favorable', 'Continuar crema hidratante y tratamiento tópico por 7 días.', 'Disminución de lesiones. Sin efectos adversos.', ['Fotografía de seguimiento']), visit(28, 'Erupción cutánea', 'Dermatitis atópica', 'Iniciar tratamiento tópico. Reevaluar en un mes.', 'Lesiones en miembros superiores.')] },
    { id: 'p4', name: 'Ricardo López', dni: '21765432', birth: '1971-01-30', phone: '11 4789-1122', email: 'ricardo.lopez@email.com', observations: 'Diabetes tipo 2.', visits: [visit(5, 'Control metabólico', 'Diabetes tipo 2 en seguimiento', 'Mantener plan alimentario y medicación habitual.', 'Se evaluaron resultados de laboratorio.', ['Análisis de laboratorio']), visit(95, 'Control trimestral', 'Diabetes tipo 2', 'Solicitar laboratorio de control.', 'Sin cambios clínicos relevantes.')] },
    { id: 'p5', name: 'Valentina Torres', dni: '38567234', birth: '1994-08-19', phone: '11 6123-8800', email: 'valentina.torres@email.com', observations: '', visits: [visit(0, 'Consulta por cefalea', 'Cefalea tensional', 'Hidratación, descanso y control si persiste.', 'Episodios leves durante la última semana.')] },
    { id: 'p6', name: 'Camila Fernández', dni: '42567890', birth: '2001-05-03', phone: '11 5556-7788', email: 'camila.fernandez@email.com', observations: 'Paciente nueva.', visits: [] },
    { id: 'p7', name: 'Andrés Pérez', dni: '30198765', birth: '1986-12-05', phone: '11 4500-1234', email: 'andres.perez@email.com', observations: '', visits: [visit(12, 'Molestia lumbar', 'Lumbalgia mecánica', 'Ejercicios suaves y evaluación en 3 semanas.', 'Sin signos de alarma.') ] },
    { id: 'p8', name: 'Lucía Herrera', dni: '35789123', birth: '1992-09-17', phone: '11 4678-2233', email: 'lucia.herrera@email.com', observations: '', visits: [visit(18, 'Control clínico', 'Sin hallazgos patológicos', 'Continuar hábitos saludables.', 'Chequeo de rutina.') ] },
    { id: 'p9', name: 'Pablo Romero', dni: '27456321', birth: '1978-04-24', phone: '11 4320-8899', email: 'pablo.romero@email.com', observations: 'En seguimiento por lesión de hombro.', visits: [visit(7, 'Control de hombro', 'Evolución favorable de lesión muscular', 'Continuar kinesiología durante 4 semanas.', 'Mayor amplitud de movimiento.', ['Resonancia de hombro']), visit(55, 'Dolor de hombro', 'Lesión muscular', 'Solicitar estudio por imágenes e iniciar kinesiología.', 'Dolor posterior a actividad deportiva.')] },
    { id: 'p10', name: 'Elena Castro', dni: '24321987', birth: '1968-07-11', phone: '11 4890-4321', email: 'elena.castro@email.com', observations: '', visits: [] }
  ]);

  let patients;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const parsed = stored ? JSON.parse(stored) : null;
    patients = Array.isArray(parsed) ? parsed : seed();
    if (!stored) localStorage.setItem(STORAGE_KEY, JSON.stringify(patients));
  } catch { patients = seed(); }
  let query = '';
  let pendingImages = [];
  let toastTimer;

  function save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(patients)); return true; }
    catch { showToast('No se pudo guardar en este navegador. Revisá el almacenamiento disponible.'); return false; }
  }
  function showToast(message) { const el = document.querySelector('#toast'); el.textContent = message; el.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove('show'), 3500); }
  function clearPreviews() { pendingImages.forEach((image) => URL.revokeObjectURL(image.url)); pendingImages = []; }
  const lastVisit = (patient) => patient.visits?.length ? [...patient.visits].sort((a, b) => b.date.localeCompare(a.date))[0].date : null;
  const recentPatients = () => [...patients].filter((patient) => lastVisit(patient)).sort((a, b) => lastVisit(b).localeCompare(lastVisit(a)));
  const patientRow = (patient, index) => `<tr><td><span class="patient-cell"><span class="initials alt-${index % 4}">${escapeHtml(initials(patient.name))}</span>${escapeHtml(patient.name)}</span></td><td>${escapeHtml(patient.dni)}</td><td>${escapeHtml(patient.phone || '—')}</td><td>${formatDate(lastVisit(patient))}</td><td><a class="btn btn-secondary btn-sm" href="#patient/${encodeURIComponent(patient.id)}">Historial →</a></td></tr>`;
  const table = (list, emptyMessage = 'No hay pacientes para mostrar.') => `<div class="card table-card">${list.length ? `<table class="table"><thead><tr><th>Paciente</th><th>DNI</th><th>Teléfono</th><th>Última consulta</th><th></th></tr></thead><tbody>${list.map(patientRow).join('')}</tbody></table>` : `<div class="empty"><strong>Sin resultados</strong>${escapeHtml(emptyMessage)}</div>`}</div>`;
  const pageHeader = (title, action = '') => `<div class="page-header"><h1>${title}</h1>${action}</div>`;
  const newPatientButton = '<a class="btn btn-primary" href="#patient/new">+ Nuevo paciente</a>';

  function dashboard() {
    const todayVisits = patients.reduce((count, patient) => count + (patient.visits || []).filter((item) => item.date === localDate(today)).length, 0);
    app.innerHTML = `${pageHeader('Dashboard', newPatientButton)}<div class="stat-grid"><div class="card stat-card"><div class="stat-top">Pacientes</div><div class="stat-number">${patients.length}</div></div><div class="card stat-card"><div class="stat-top">Consultas hoy</div><div class="stat-number">${todayVisits}</div></div></div><div class="section-heading"><h2>Últimos pacientes</h2><a class="text-link" href="#patients">Ver todos →</a></div>${table(recentPatients().slice(0, 5))}`;
  }

  function filteredPatients() { const needle = query.trim().toLocaleLowerCase('es'); return patients.filter((patient) => patient.name.toLocaleLowerCase('es').includes(needle) || patient.dni.includes(needle)); }
  function renderPatientResults() { const list = filteredPatients(); document.querySelector('#patient-results').innerHTML = table(list, 'No se encontraron pacientes.'); }
  function patientList() {
    app.innerHTML = `${pageHeader('Pacientes', newPatientButton)}<div class="search-row"><div class="search-box"><span aria-hidden="true">⌕</span><input id="patient-search" type="search" placeholder="Buscar nombre o DNI" aria-label="Buscar pacientes por nombre o DNI" value="${escapeHtml(query)}"></div></div><div id="patient-results"></div>`;
    renderPatientResults();
    document.querySelector('#patient-search').addEventListener('input', (event) => { query = event.target.value; renderPatientResults(); });
  }

  function patientForm(patient) {
    const editing = Boolean(patient);
    const back = editing ? `#patient/${encodeURIComponent(patient.id)}` : '#patients';
    app.innerHTML = `<a href="${back}" class="back-link">← Volver</a>${pageHeader(editing ? 'Editar paciente' : 'Nuevo paciente')}<form id="patient-form" class="card form-card"><div class="form-grid"><div class="field"><label for="name">Nombre y apellido *</label><input id="name" name="name" required maxlength="100" autocomplete="name" value="${escapeHtml(patient?.name)}"></div><div class="field"><label for="dni">DNI *</label><input id="dni" name="dni" required inputmode="numeric" pattern="[0-9]{7,8}" title="Ingresá 7 u 8 números, sin puntos" maxlength="8" value="${escapeHtml(patient?.dni)}"></div><div class="field"><label for="birth">Fecha de nacimiento *</label><input id="birth" name="birth" type="date" max="${localDate(today)}" required value="${escapeHtml(patient?.birth)}"></div><div class="field"><label for="phone">Teléfono *</label><input id="phone" name="phone" type="tel" required maxlength="30" value="${escapeHtml(patient?.phone)}"></div><div class="field"><label for="email">Email</label><input id="email" name="email" type="email" maxlength="120" autocomplete="email" value="${escapeHtml(patient?.email)}"></div><div class="field full"><label for="observations">Observaciones</label><textarea id="observations" name="observations" maxlength="3000">${escapeHtml(patient?.observations)}</textarea></div></div><div class="form-actions">${editing ? '<button class="btn btn-danger" id="delete-patient" type="button">Eliminar</button>' : ''}<a class="btn btn-secondary" href="${back}">Cancelar</a><button class="btn btn-primary" type="submit">Guardar</button></div></form>`;
    document.querySelector('#patient-form').addEventListener('submit', (event) => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      const dni = String(data.get('dni')).trim();
      if (patients.some((item) => item.dni === dni && item.id !== patient?.id)) { document.querySelector('#dni').setCustomValidity('Ya existe un paciente con este DNI.'); document.querySelector('#dni').reportValidity(); return; }
      const values = { name: String(data.get('name')).trim(), dni, birth: String(data.get('birth')), phone: String(data.get('phone')).trim(), email: String(data.get('email')).trim(), observations: String(data.get('observations')).trim() };
      if (!values.name || !values.phone) { showToast('Completá los campos obligatorios.'); return; }
      const snapshot = JSON.stringify(patients);
      const id = patient?.id || uid();
      if (editing) Object.assign(patient, values); else patients.unshift({ id, ...values, visits: [] });
      if (!save()) { patients = JSON.parse(snapshot); return; }
      showToast(editing ? 'Paciente actualizado.' : 'Paciente creado.'); location.hash = `#patient/${encodeURIComponent(id)}`; render();
    });
    document.querySelector('#dni').addEventListener('input', (event) => event.target.setCustomValidity(''));
    document.querySelector('#delete-patient')?.addEventListener('click', () => {
      if (!confirm(`¿Eliminar a ${patient.name} y todo su historial? Esta acción no se puede deshacer.`)) return;
      const snapshot = patients; patients = patients.filter((item) => item.id !== patient.id);
      if (!save()) { patients = snapshot; return; }
      showToast('Paciente eliminado.'); location.hash = '#patients'; render();
    });
  }

  function visitCard(item) {
    return `<div class="timeline-item"><article class="card visit-card"><div class="visit-header"><div><span class="visit-date">${formatDate(item.date)}</span><h3 class="visit-title">${escapeHtml(item.reason)}</h3></div><span class="visit-professional">${escapeHtml(item.professional || '—')}</span></div><div class="visit-fields">${item.diagnosis ? `<div class="visit-field"><span class="detail-label">Diagnóstico</span><p>${escapeHtml(item.diagnosis)}</p></div>` : ''}${item.treatment ? `<div class="visit-field"><span class="detail-label">Tratamiento</span><p>${escapeHtml(item.treatment)}</p></div>` : ''}${item.notes ? `<div class="visit-field full"><span class="detail-label">Notas</span><p>${escapeHtml(item.notes)}</p></div>` : ''}${item.images?.length ? `<div class="visit-field full"><span class="detail-label">Imágenes</span><div class="image-list">${item.images.map((image) => `<div class="mock-image" role="img" aria-label="Imagen: ${escapeHtml(image)}" data-label="${escapeHtml(image)}">▧</div>`).join('')}</div></div>` : ''}</div></article></div>`;
  }
  function profile(patient) {
    const visits = [...(patient.visits || [])].sort((a, b) => b.date.localeCompare(a.date));
    app.innerHTML = `<a href="#patients" class="back-link">← Pacientes</a><div class="card profile-hero"><div class="profile-main"><div class="profile-identity"><span class="initials">${escapeHtml(initials(patient.name))}</span><h1>${escapeHtml(patient.name)}</h1></div><div class="detail-grid"><div><span class="detail-label">Edad</span><span class="detail-value">${age(patient.birth)}</span></div><div><span class="detail-label">DNI</span><span class="detail-value">${escapeHtml(patient.dni)}</span></div><div><span class="detail-label">Teléfono</span><span class="detail-value">${escapeHtml(patient.phone || '—')}</span></div><div><span class="detail-label">Última consulta</span><span class="detail-value">${formatDate(lastVisit(patient))}</span></div></div>${patient.observations ? `<div class="notes-box">${escapeHtml(patient.observations)}</div>` : ''}</div><div class="profile-actions"><a class="btn btn-secondary" href="#patient/${encodeURIComponent(patient.id)}/edit">Editar</a><a class="btn btn-primary" href="#patient/${encodeURIComponent(patient.id)}/visit/new">+ Nueva consulta</a></div></div><div class="section-heading"><h2>Historial</h2></div>${visits.length ? `<div class="timeline">${visits.map(visitCard).join('')}</div>` : `<div class="card empty">Sin consultas</div>`}`;
  }

  function visitForm(patient) {
    app.innerHTML = `<a href="#patient/${encodeURIComponent(patient.id)}" class="back-link">← Historial</a>${pageHeader('Nueva consulta · ' + escapeHtml(patient.name))}<form id="visit-form" class="card form-card"><div class="form-grid"><div class="field"><label for="visit-date">Fecha *</label><input id="visit-date" name="date" type="date" required max="${localDate(today)}" value="${localDate(today)}"></div><div class="field"><label for="professional">Profesional *</label><input id="professional" name="professional" required maxlength="100" value="Dra. Lucía Fernández"></div><div class="field full"><label for="reason">Motivo *</label><input id="reason" name="reason" required maxlength="160"></div><div class="field full"><label for="notes">Notas clínicas</label><textarea id="notes" name="notes" maxlength="5000"></textarea></div><div class="field full"><label for="diagnosis">Diagnóstico</label><textarea id="diagnosis" name="diagnosis" maxlength="3000"></textarea></div><div class="field full"><label for="treatment">Tratamiento</label><textarea id="treatment" name="treatment" maxlength="3000"></textarea></div><div class="field full"><span class="upload-label">Imágenes</span><div class="upload-area"><label class="upload-trigger" for="image-input">+ Agregar imágenes</label><input id="image-input" type="file" accept="image/*" multiple hidden><p class="help-text">Hasta 4 · solo se guarda el nombre</p><div id="upload-previews" class="upload-previews"></div></div></div></div><div class="form-actions"><a class="btn btn-secondary" href="#patient/${encodeURIComponent(patient.id)}">Cancelar</a><button class="btn btn-primary" type="submit">Guardar</button></div></form>`;
    document.querySelector('#image-input').addEventListener('change', (event) => {
      const files = [...event.target.files];
      if (files.length + pendingImages.length > 4) { showToast('Podés agregar hasta 4 imágenes por consulta.'); event.target.value = ''; return; }
      files.forEach((file) => { if (file.type.startsWith('image/')) pendingImages.push({ name: file.name, url: URL.createObjectURL(file) }); });
      event.target.value = '';
      renderPreviews();
    });
    document.querySelector('#upload-previews').addEventListener('click', (event) => {
      const button = event.target.closest('[data-remove]'); if (!button) return;
      const index = Number(button.dataset.remove); URL.revokeObjectURL(pendingImages[index].url); pendingImages.splice(index, 1); renderPreviews();
    });
    document.querySelector('#visit-form').addEventListener('submit', (event) => {
      event.preventDefault(); const data = new FormData(event.currentTarget);
      const record = { id: uid(), date: String(data.get('date')), professional: String(data.get('professional')).trim(), reason: String(data.get('reason')).trim(), notes: String(data.get('notes')).trim(), diagnosis: String(data.get('diagnosis')).trim(), treatment: String(data.get('treatment')).trim(), images: pendingImages.map((image) => image.name) };
      if (!record.reason || !record.professional) { showToast('Completá los campos obligatorios.'); return; }
      patient.visits ||= []; patient.visits.push(record);
      if (!save()) { patient.visits.pop(); return; }
      clearPreviews(); showToast('Consulta guardada en el historial.'); location.hash = `#patient/${encodeURIComponent(patient.id)}`; render();
    });
  }
  function renderPreviews() { document.querySelector('#upload-previews').innerHTML = pendingImages.map((image, index) => `<div class="preview"><img src="${escapeHtml(image.url)}" alt="Vista previa de ${escapeHtml(image.name)}"><button type="button" class="remove-image" data-remove="${index}" aria-label="Quitar ${escapeHtml(image.name)}">×</button><span class="preview-name" title="${escapeHtml(image.name)}">${escapeHtml(image.name)}</span></div>`).join(''); }
  function render() {
    clearPreviews();
    const segments = (location.hash.slice(1) || 'dashboard').split('/');
    const route = segments[0]; const id = segments[1] ? decodeURIComponent(segments[1]) : null;
    const patient = patients.find((item) => item.id === id);
    let title = 'Dashboard';
    if (route === 'dashboard') dashboard();
    else if (route === 'patients') { title = 'Pacientes'; patientList(); }
    else if (route === 'patient' && id === 'new') { title = 'Nuevo paciente'; patientForm(null); }
    else if (route === 'patient' && patient) { if (segments[2] === 'edit') { title = 'Editar paciente'; patientForm(patient); } else if (segments[2] === 'visit' && segments[3] === 'new') { title = 'Nueva consulta'; visitForm(patient); } else { title = patient.name; profile(patient); } }
    else { location.hash = '#patients'; return; }
    document.querySelector('#breadcrumb').textContent = title;
    document.querySelectorAll('[data-nav]').forEach((link) => { const active = link.dataset.nav === (route === 'patient' ? 'patients' : route); link.classList.toggle('active', active); if (active) link.setAttribute('aria-current', 'page'); else link.removeAttribute('aria-current'); });
    document.querySelector('.sidebar').classList.remove('open'); document.querySelector('#menu-button').setAttribute('aria-expanded', 'false');
    document.title = `${title} · Clara`;
  }
  document.querySelector('#menu-button').addEventListener('click', () => { const open = document.querySelector('.sidebar').classList.toggle('open'); document.querySelector('#menu-button').setAttribute('aria-expanded', String(open)); });
  document.addEventListener('click', (event) => { if (event.target.closest('a[href^="#"]') && event.target.closest('a[href^="#"]').hash === location.hash) render(); });
  window.addEventListener('hashchange', render);
  render();
})();
