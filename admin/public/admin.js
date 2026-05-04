let schedule = null;

const byId = (id) => document.getElementById(id);

function tokenHeaders() {
  const token = byId("tokenInput").value.trim();
  return token ? { Authorization: `Bearer ${token}`, "X-Admin-Token": token } : {};
}

function setStatus(message, error = false) {
  const status = byId("status");
  status.textContent = message;
  status.classList.toggle("is-error", error);
}

function validateSchedule(data) {
  if (!data || typeof data !== "object") throw new Error("schedule должен быть объектом");
  if (!data.meta || typeof data.meta !== "object") throw new Error("Нет meta");
  if (!Array.isArray(data.stages)) throw new Error("Нет stages[]");
  if (!Array.isArray(data.days)) throw new Error("Нет days[]");
  if (!Array.isArray(data.events)) throw new Error("Нет events[]");
  const ids = new Set();
  data.events.forEach((event, index) => {
    if (!event.id || typeof event.id !== "string") throw new Error(`Событие #${index + 1}: нет id`);
    if (ids.has(event.id)) throw new Error(`Дублирующийся id события: ${event.id}`);
    ids.add(event.id);
  });
}

function normalizeSchedule(data) {
  data.meta.schemaVersion = Number(data.meta.schemaVersion || 1);
  data.events = data.events.map((event, index) => ({
    id: event.id || legacyEventId(event, index),
    day: event.day,
    stage: event.stage,
    time: event.time,
    title: event.title,
  }));
  ensureUniqueEventIds(data.events);
  validateSchedule(data);
  return data;
}

async function loadSchedule() {
  setStatus("Загрузка…");
  const response = await fetch("/api/schedule", { headers: tokenHeaders() });
  if (!response.ok) throw new Error(await response.text());
  schedule = normalizeSchedule(await response.json());
  render();
  setStatus("Загружено");
}

async function saveSchedule() {
  syncFromMeta();
  applyAdvancedJson(false);
  sortEvents();
  validateSchedule(schedule);
  const response = await fetch("/api/schedule", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...tokenHeaders(),
    },
    body: JSON.stringify(schedule),
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.error || "Не удалось сохранить");
  render();
  setStatus(`Сохранено ${new Date(result.savedAt).toLocaleTimeString("ru-RU")}`);
}

function sortEvents() {
  const dayOrder = new Map(schedule.days.map((day, index) => [day.id, index]));
  schedule.events.sort((a, b) => {
    const dayDiff = (dayOrder.get(a.day) ?? 999) - (dayOrder.get(b.day) ?? 999);
    return dayDiff || sortMinutes(a.time) - sortMinutes(b.time) || a.stage.localeCompare(b.stage);
  });
}

function sortMinutes(time) {
  const [hours, minutes] = time.split(":").map(Number);
  const total = hours * 60 + minutes;
  return total < 8 * 60 ? total + 24 * 60 : total;
}

function legacyEventId(event, index) {
  return `${event.day}-${event.stage}-${event.time}-${index}`;
}

function generateEventId() {
  const existing = new Set(schedule.events.map((event) => event.id));
  let id = "";
  do {
    id = `event-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  } while (existing.has(id));
  return id;
}

function ensureUniqueEventIds(events) {
  const seen = new Set();
  events.forEach((event) => {
    if (!event.id || seen.has(event.id)) {
      event.id = `event-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
    }
    seen.add(event.id);
  });
}

function render() {
  renderMeta();
  renderFilters();
  renderAdvancedJson();
  renderEvents();
}

function renderMeta() {
  document.querySelectorAll("[data-meta]").forEach((input) => {
    input.value = schedule.meta[input.dataset.meta] || "";
  });
}

function syncFromMeta() {
  document.querySelectorAll("[data-meta]").forEach((input) => {
    schedule.meta[input.dataset.meta] = input.value.trim();
  });
}

function renderFilters() {
  const dayFilter = byId("dayFilter");
  const stageFilter = byId("stageFilter");
  const previousDay = dayFilter.value || "all";
  const previousStage = stageFilter.value || "all";

  dayFilter.innerHTML = [
    `<option value="all">Все дни</option>`,
    ...schedule.days.map((day) => `<option value="${day.id}">${day.label}</option>`),
  ].join("");
  stageFilter.innerHTML = [
    `<option value="all">Все сцены</option>`,
    ...schedule.stages.map((stage) => `<option value="${stage.id}">${stage.short}</option>`),
  ].join("");

  dayFilter.value = [...dayFilter.options].some((option) => option.value === previousDay) ? previousDay : "all";
  stageFilter.value = [...stageFilter.options].some((option) => option.value === previousStage) ? previousStage : "all";
}

function renderAdvancedJson() {
  byId("stagesJson").value = JSON.stringify(schedule.stages, null, 2);
  byId("daysJson").value = JSON.stringify(schedule.days, null, 2);
}

function applyAdvancedJson(shouldRender = true) {
  schedule.stages = JSON.parse(byId("stagesJson").value);
  schedule.days = JSON.parse(byId("daysJson").value);
  if (shouldRender) {
    renderFilters();
    renderEvents();
    setStatus("Сцены и дни применены");
  }
}

function renderEvents() {
  syncFromMeta();
  const day = byId("dayFilter").value;
  const stage = byId("stageFilter").value;
  const query = byId("searchInput").value.trim().toLocaleLowerCase("ru-RU");
  const dayOptions = schedule.days.map((item) => `<option value="${item.id}">${item.label}</option>`).join("");
  const stageOptions = schedule.stages.map((item) => `<option value="${item.id}">${item.short}</option>`).join("");

  const filtered = schedule.events
    .map((event, index) => ({ event, index }))
    .filter(({ event }) => day === "all" || event.day === day)
    .filter(({ event }) => stage === "all" || event.stage === stage)
    .filter(({ event }) => !query || event.title.toLocaleLowerCase("ru-RU").includes(query));

  byId("summary").textContent = `${filtered.length} из ${schedule.events.length} событий`;
  byId("eventsBody").innerHTML = filtered
    .map(
      ({ event, index }) => `
        <tr data-index="${index}">
          <td><select data-field="day">${dayOptions}</select></td>
          <td><select data-field="stage">${stageOptions}</select></td>
          <td><input data-field="time" value="${escapeHtml(event.time)}" pattern="^([01][0-9]|2[0-3]):[0-5][0-9]$" /></td>
          <td><input data-field="title" value="${escapeHtml(event.title)}" /></td>
          <td><button class="delete-button" type="button" data-delete="${index}">Удалить</button></td>
        </tr>
      `,
    )
    .join("");

  byId("eventsBody").querySelectorAll("tr").forEach((row) => {
    const event = schedule.events[Number(row.dataset.index)];
    row.querySelector('[data-field="day"]').value = event.day;
    row.querySelector('[data-field="stage"]').value = event.stage;
  });
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function addEvent() {
  schedule.events.push({
    id: generateEventId(),
    day: schedule.days[0]?.id || "",
    stage: schedule.stages[0]?.id || "",
    time: "12:00",
    title: "Новый слот",
  });
  renderEvents();
  setStatus("Добавлен новый слот");
}

function downloadSchedule() {
  syncFromMeta();
  applyAdvancedJson(false);
  const blob = new Blob([`${JSON.stringify(schedule, null, 2)}\n`], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "schedule.json";
  link.click();
  URL.revokeObjectURL(url);
}

async function importSchedule(file) {
  const data = JSON.parse(await file.text());
  schedule = normalizeSchedule(data);
  render();
  setStatus("JSON импортирован");
}

document.addEventListener("input", (event) => {
  const row = event.target.closest("tr[data-index]");
  if (row && event.target.dataset.field) {
    const item = schedule.events[Number(row.dataset.index)];
    item[event.target.dataset.field] = event.target.value;
  }
});

document.addEventListener("click", async (event) => {
  try {
    if (event.target.closest("#loadButton")) await loadSchedule();
    if (event.target.closest("#saveButton")) await saveSchedule();
    if (event.target.closest("#downloadButton")) downloadSchedule();
    if (event.target.closest("#addEventButton")) addEvent();
    if (event.target.closest("#applyJsonButton")) applyAdvancedJson(true);
    const deleteButton = event.target.closest("[data-delete]");
    if (deleteButton) {
      schedule.events.splice(Number(deleteButton.dataset.delete), 1);
      renderEvents();
      setStatus("Слот удалён");
    }
  } catch (error) {
    setStatus(error.message, true);
  }
});

byId("dayFilter").addEventListener("change", renderEvents);
byId("stageFilter").addEventListener("change", renderEvents);
byId("searchInput").addEventListener("input", renderEvents);
byId("importInput").addEventListener("change", (event) => {
  const [file] = event.target.files;
  if (!file) return;
  importSchedule(file).catch((error) => setStatus(error.message, true));
});

loadSchedule().catch((error) => setStatus(error.message, true));
