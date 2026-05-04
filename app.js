const APP_VERSION = "v16";
const DATA_VERSION = "Черновик по афише · Улетай 2026";
const USER_CACHE_NAME = "yletai-user-data-v1";
const PLAN_CACHE_URL = "./user-plan.json";

const SCHEDULE_CONFIG_URL = "./schedule-source.json";
const DEFAULT_SCHEDULE_CONFIG = {
  primaryScheduleUrl: "",
  fallbackScheduleUrl: "./schedule.json",
  timeoutMs: 3000,
};
let STAGES = [];
let DAYS = [];
let events = [];
let scheduleMeta = { source: DATA_VERSION };

const state = {
  day: "all",
  stage: "all",
  activeTab: "schedule",
  search: "",
  time: 19 * 60,
  favorites: new Set(),
  filtersOpen: false,
  planSavedAt: null,
  planStorageStatus: "Загружаем…",
};

function buildEvents(rawEvents) {
  return rawEvents.map(([day, stage, time, title], index) => {
    const dayIndex = DAYS.findIndex((d) => d.id === day);
    const minutes = toMinutes(time);
    return {
      id: `${day}-${stage}-${time}-${index}`,
      day,
      dayIndex,
      stage,
      time,
      minutes,
      sortMinutes: minutes < 8 * 60 ? minutes + 24 * 60 : minutes,
      title,
      uncertain: title === "Будет объявлено" || title === "Конкурсная программа",
    };
  });
}

const byId = (id) => document.getElementById(id);
const stageById = (id) => STAGES.find((stage) => stage.id === id);
const dayById = (id) => DAYS.find((day) => day.id === id);

if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

function toMinutes(time) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function formatMinutes(total) {
  const normalized = ((total % 1440) + 1440) % 1440;
  const hours = String(Math.floor(normalized / 60)).padStart(2, "0");
  const minutes = String(normalized % 60).padStart(2, "0");
  return `${hours}:${minutes}`;
}

function formatSavedTime(value) {
  if (!value) return "Ещё не сохранялся";
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function validFavoriteIds(ids) {
  const eventIds = new Set(events.map((event) => event.id));
  return ids.filter((id) => eventIds.has(id));
}

async function loadSchedule() {
  const config = await loadScheduleConfig();
  const sources = [
    { type: "remote", url: config.primaryScheduleUrl },
    { type: "fallback", url: config.fallbackScheduleUrl },
  ].filter((source) => Boolean(source.url));

  let lastError = null;
  for (const source of sources) {
    try {
      const data = await fetchScheduleJson(source.url, config.timeoutMs);
      applyScheduleData(data, source);
      return;
    } catch (error) {
      lastError = error;
      console.warn(`Schedule source failed: ${source.url}`, error);
    }
  }

  throw lastError || new Error("No schedule sources configured");
}

async function loadScheduleConfig() {
  const config = { ...DEFAULT_SCHEDULE_CONFIG };
  try {
    const response = await fetch(SCHEDULE_CONFIG_URL, { cache: "no-cache" });
    if (response.ok) {
      Object.assign(config, await response.json());
    }
  } catch {
    // The app can run with built-in defaults.
  }

  const params = new URLSearchParams(location.search);
  const override = params.get("scheduleUrl") || params.get("schedule");
  if (override) config.primaryScheduleUrl = override;

  config.timeoutMs = Number(config.timeoutMs) || DEFAULT_SCHEDULE_CONFIG.timeoutMs;
  return config;
}

async function fetchScheduleJson(url, timeoutMs) {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      cache: "no-cache",
      mode: url.startsWith("http") ? "cors" : "same-origin",
      signal: controller.signal,
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  } finally {
    window.clearTimeout(timer);
  }
}

function validateScheduleData(data) {
  if (!data || typeof data !== "object") throw new Error("Schedule is not an object");
  if (!Array.isArray(data.stages)) throw new Error("Schedule has no stages array");
  if (!Array.isArray(data.days)) throw new Error("Schedule has no days array");
  if (!Array.isArray(data.events)) throw new Error("Schedule has no events array");
}

function applyScheduleData(data, source) {
  validateScheduleData(data);
  STAGES = Array.isArray(data.stages) ? data.stages : [];
  DAYS = Array.isArray(data.days) ? data.days : [];
  scheduleMeta = {
    ...scheduleMeta,
    ...(data.meta || {}),
    loadedFrom: source.type,
    loadedUrl: source.url,
  };
  events = buildEvents(
    (Array.isArray(data.events) ? data.events : []).map((event) => [
      event.day,
      event.stage,
      event.time,
      event.title,
    ]),
  );
}

function getFilteredEvents() {
  const query = state.search.trim().toLocaleLowerCase("ru-RU");
  return events
    .filter((event) => state.day === "all" || event.day === state.day)
    .filter((event) => state.stage === "all" || event.stage === state.stage)
    .filter((event) => !query || event.title.toLocaleLowerCase("ru-RU").includes(query))
    .sort((a, b) => a.dayIndex - b.dayIndex || a.sortMinutes - b.sortMinutes || a.stage.localeCompare(b.stage));
}

function getNextEvents() {
  const activeDays = state.day === "all" ? DAYS.map((day) => day.id) : [state.day];
  return events
    .filter((event) => activeDays.includes(event.day))
    .filter((event) => state.stage === "all" || event.stage === state.stage)
    .filter((event) => event.sortMinutes >= state.time)
    .sort((a, b) => a.dayIndex - b.dayIndex || a.sortMinutes - b.sortMinutes)
    .slice(0, 5);
}

function getPlanEvents() {
  return events
    .filter((event) => state.favorites.has(event.id))
    .sort((a, b) => a.dayIndex - b.dayIndex || a.sortMinutes - b.sortMinutes || a.stage.localeCompare(b.stage));
}

function createEventCard(event, compact = false) {
  const stage = stageById(event.stage);
  const favorite = state.favorites.has(event.id);
  const article = document.createElement("article");
  article.className = "event-card";
  article.style.setProperty("--stage-color", stage.color);
  article.dataset.testid = `card-event-${event.id}`;
  article.innerHTML = `
    <div class="event-time">${event.time}</div>
    <div class="event-main">
      <strong class="event-title">${event.title}</strong>
      <div class="event-meta">
        <span><i class="stage-dot" aria-hidden="true"></i> ${stage.short}</span>
        <span>${dayById(event.day).label}, ${dayById(event.day).weekday}</span>
        ${event.uncertain ? "<span>черновой слот</span>" : ""}
      </div>
    </div>
    <button class="favorite-button ${favorite ? "is-active" : ""}" type="button" aria-label="${favorite ? "Убрать из плана" : "Добавить в план"}" data-favorite="${event.id}" data-testid="button-favorite-${event.id}">
      ${favorite ? "★" : "☆"}
    </button>
  `;
  if (compact) {
    article.querySelector(".event-meta").insertAdjacentHTML("beforeend", `<span>через ${Math.max(0, event.sortMinutes - state.time)} мин</span>`);
  }
  return article;
}

function renderChips() {
  byId("dayFilters").innerHTML = [
    `<button class="chip ${state.day === "all" ? "is-active" : ""}" type="button" data-day="all" data-testid="chip-day-all">Все дни</button>`,
    ...DAYS.map(
      (day) =>
        `<button class="chip ${state.day === day.id ? "is-active" : ""}" type="button" data-day="${day.id}" data-testid="chip-day-${day.id}">${day.label}</button>`,
    ),
  ].join("");

  byId("stageFilters").innerHTML = [
    `<button class="chip ${state.stage === "all" ? "is-active" : ""}" type="button" data-stage="all" data-testid="chip-stage-all">Все сцены</button>`,
    ...STAGES.map(
      (stage) =>
        `<button class="chip ${state.stage === stage.id ? "is-active" : ""}" type="button" data-stage="${stage.id}" data-testid="chip-stage-${stage.id}">${stage.short}</button>`,
    ),
  ].join("");
}

function renderSchedule() {
  const list = byId("scheduleList");
  const filtered = getFilteredEvents();
  byId("statEvents").textContent = events.length;
  byId("statFavorites").textContent = state.favorites.size;
  renderSearchState(filtered.length);
  renderEventGroups(list, filtered, "Ничего не найдено. Попробуй другой день, сцену или запрос.");
}

function renderSearchState(count) {
  const query = state.search.trim();
  document.body.classList.toggle("is-searching", Boolean(query));
  const dayLabel = state.day === "all" ? "" : dayById(state.day).label;
  const stageLabel = state.stage === "all" ? "" : stageById(state.stage).short;
  const activeFilters = [dayLabel, stageLabel].filter(Boolean);
  const filterText = activeFilters.length ? ` · ${activeFilters.join(", ")}` : "";
  byId("resultSummary").textContent = query
    ? `Найдено: ${count}${filterText}`
    : count === events.length
      ? "Показаны все выступления"
      : `Показано: ${count}${filterText}`;

  const toggle = byId("filterToggle");
  const drawer = byId("filterDrawer");
  toggle.textContent = activeFilters.length ? `Фильтры · ${activeFilters.length}` : "Фильтры";
  toggle.classList.toggle("has-active", activeFilters.length > 0 || state.filtersOpen);
  toggle.setAttribute("aria-expanded", String(state.filtersOpen));
  drawer.hidden = !state.filtersOpen;
}

function renderEventGroups(list, filtered, emptyMessage) {
  if (!filtered.length) {
    list.innerHTML = `<div class="empty-state">${emptyMessage}</div>`;
    return;
  }

  const grouped = new Map();
  filtered.forEach((event) => {
    if (!grouped.has(event.day)) grouped.set(event.day, []);
    grouped.get(event.day).push(event);
  });

  list.innerHTML = "";
  grouped.forEach((dayEvents, dayId) => {
    const day = dayById(dayId);
    const block = document.createElement("div");
    block.className = "day-block";
    block.innerHTML = `
      <div class="day-title">
        <h3>${day.label}</h3>
        <span>${day.weekday} · ${dayEvents.length} выступлений</span>
      </div>
    `;
    dayEvents.forEach((event) => block.appendChild(createEventCard(event)));
    list.appendChild(block);
  });
}

function renderPlan() {
  const list = byId("planList");
  const selected = getPlanEvents();
  byId("statFavorites").textContent = state.favorites.size;
  renderEventGroups(list, selected, "План пока пустой. Открой расписание и нажми звёздочки у нужных групп.");
}

function renderNext() {
  byId("timeLabel").textContent = formatMinutes(state.time);
  const list = byId("nextList");
  const nextEvents = getNextEvents();
  list.innerHTML = "";
  if (!nextEvents.length) {
    list.innerHTML = `<div class="empty-state">После выбранного времени выступлений не найдено.</div>`;
    return;
  }
  nextEvents.forEach((event) => list.appendChild(createEventCard(event, true)));
}

function getConflicts() {
  const selected = events
    .filter((event) => state.favorites.has(event.id))
    .sort((a, b) => a.dayIndex - b.dayIndex || a.sortMinutes - b.sortMinutes);

  const conflicts = [];
  selected.forEach((event, index) => {
    const next = selected[index + 1];
    if (!next || next.day !== event.day) return;
    if (next.sortMinutes - event.sortMinutes < 45) {
      conflicts.push(`${event.time} ${event.title} и ${next.time} ${next.title}`);
    }
  });
  return conflicts;
}

function renderConflicts() {
  const panel = byId("noticePanel");
  const conflicts = getConflicts();
  if (!conflicts.length) {
    panel.hidden = true;
    return;
  }
  panel.hidden = false;
  byId("conflictText").textContent = conflicts.slice(0, 3).join("; ");
}

function renderInfo() {
  if (byId("appVersion")) byId("appVersion").textContent = APP_VERSION;
  if (byId("dataVersion")) byId("dataVersion").textContent = scheduleMeta.source || DATA_VERSION;
  byId("planCountInfo").textContent = `${state.favorites.size}`;
  byId("planStorageInfo").textContent = state.planStorageStatus;
  byId("planSavedAt").textContent = formatSavedTime(state.planSavedAt);
}

function updateUrl() {
  const params = new URLSearchParams();
  if (state.favorites.size) params.set("plan", [...state.favorites].join(","));
  const next = `${location.pathname}${params.toString() ? `?${params}` : ""}${location.hash}`;
  history.replaceState(null, "", next);
}

function readPlanFromUrl() {
  const params = new URLSearchParams(location.search);
  const plan = params.get("plan");
  if (!plan) return;
  plan.split(",").forEach((id) => {
    if (events.some((event) => event.id === id)) state.favorites.add(id);
  });
}

async function loadSavedPlan() {
  try {
    if ("caches" in window) {
      const cache = await caches.open(USER_CACHE_NAME);
      const response = await cache.match(PLAN_CACHE_URL);
      if (response) {
        const data = await response.json();
        validFavoriteIds(Array.isArray(data.favorites) ? data.favorites : []).forEach((id) => state.favorites.add(id));
        state.planSavedAt = data.updatedAt || null;
        state.planStorageStatus = "Сохранён на устройстве";
        updateUrl();
        return;
      }
    }
  } catch {
    state.planStorageStatus = "Не удалось прочитать сохранение";
  }

  readPlanFromUrl();
  state.planStorageStatus = state.favorites.size ? "Загружен из ссылки" : "Пока пусто";
}

async function persistPlan() {
  const updatedAt = new Date().toISOString();
  const payload = {
    version: APP_VERSION,
    updatedAt,
    favorites: [...state.favorites],
  };

  try {
    if (!("caches" in window)) {
      state.planSavedAt = null;
      state.planStorageStatus = "Сохранение недоступно";
      updateUrl();
      return false;
    }
    const cache = await caches.open(USER_CACHE_NAME);
    await cache.put(
      PLAN_CACHE_URL,
      new Response(JSON.stringify(payload), {
        headers: { "Content-Type": "application/json; charset=utf-8" },
      }),
    );
    state.planSavedAt = updatedAt;
    state.planStorageStatus = "Сохранён на устройстве";
    updateUrl();
    return true;
  } catch {
    state.planStorageStatus = "Ошибка сохранения";
    updateUrl();
    return false;
  }
}

async function clearSavedPlan() {
  state.favorites.clear();
  state.planSavedAt = null;
  state.planStorageStatus = "Пока пусто";
  try {
    if ("caches" in window) {
      const cache = await caches.open(USER_CACHE_NAME);
      await cache.delete(PLAN_CACHE_URL);
    }
  } catch {
    state.planStorageStatus = "Не удалось очистить сохранение";
  }
  updateUrl();
}

function renderAll() {
  renderChips();
  renderSchedule();
  renderPlan();
  renderNext();
  renderConflicts();
  renderInfo();
  renderTabs();
}

function renderTabs() {
  document.querySelectorAll("[data-panel]").forEach((panel) => {
    panel.hidden = panel.dataset.panel !== state.activeTab;
  });
  document.querySelectorAll("[data-tab]").forEach((button) => {
    const active = button.dataset.tab === state.activeTab;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-current", active ? "page" : "false");
  });
}

function showToast(message) {
  const toast = byId("toast");
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("is-visible"), 1800);
}

function setUpdateStatus(message, mode = "checking") {
  const status = byId("updateStatus");
  if (!status) return;
  window.clearTimeout(setUpdateStatus.hideTimer);
  status.textContent = message;
  status.classList.remove("is-checking", "is-updating", "is-ready", "is-hidden");
  status.classList.add(`is-${mode}`);
  if (message === "Версия актуальна") {
    setUpdateStatus.hideTimer = window.setTimeout(() => {
      status.classList.add("is-hidden");
    }, 5000);
  }
}

function setTab(tab) {
  state.activeTab = tab;
  renderAll();
}

async function checkForUpdates() {
  if (!("serviceWorker" in navigator)) {
    setUpdateStatus("Офлайн-кэш недоступен", "ready");
    return;
  }
  setUpdateStatus("Проверяем обновления…", "checking");
  try {
    const registration = await navigator.serviceWorker.getRegistration();
    if (!registration) {
      setUpdateStatus("Версия актуальна", "ready");
      return;
    }
    await registration.update();
    setUpdateStatus("Версия актуальна", "ready");
  } catch {
    setUpdateStatus("Проверка недоступна", "ready");
  }
}

document.addEventListener("click", async (event) => {
  const favoriteButton = event.target.closest("[data-favorite]");
  if (favoriteButton) {
    const id = favoriteButton.dataset.favorite;
    const selected = state.favorites.has(id);
    if (selected) {
      state.favorites.delete(id);
      showToast("Убрано из плана");
    } else {
      state.favorites.add(id);
      showToast("Добавлено в план");
    }
    await persistPlan();
    renderAll();
    return;
  }

  const dayButton = event.target.closest("[data-day]");
  if (dayButton) {
    state.day = dayButton.dataset.day;
    renderAll();
    return;
  }

  const stageButton = event.target.closest("[data-stage]");
  if (stageButton) {
    state.stage = stageButton.dataset.stage;
    renderAll();
    return;
  }

  const tabButton = event.target.closest("[data-tab]");
  if (tabButton) {
    setTab(tabButton.dataset.tab);
    return;
  }

  if (event.target.closest("#filterToggle")) {
    state.filtersOpen = !state.filtersOpen;
    renderAll();
    return;
  }

  if (event.target.closest("#clearButton")) {
    await clearSavedPlan();
    renderAll();
    showToast("План очищен");
  }

  if (event.target.closest("#resetTimeButton")) {
    state.time = 19 * 60;
    byId("timeSlider").value = state.time;
    renderAll();
  }

  if (event.target.closest("#checkUpdateButton")) {
    await checkForUpdates();
    showToast("Проверка обновлений выполнена");
  }

  if (event.target.closest("#clearSavedPlanButton")) {
    await clearSavedPlan();
    renderAll();
    showToast("Сохранённый план сброшен");
  }
});

byId("searchInput").addEventListener("input", (event) => {
  state.search = event.target.value;
  if (state.search.trim()) state.filtersOpen = false;
  renderAll();
});

byId("timeSlider").addEventListener("input", (event) => {
  state.time = Number(event.target.value);
  renderAll();
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    let refreshing = false;
    setUpdateStatus("Проверяем обновления…", "checking");

    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (refreshing) return;
      refreshing = true;
      setUpdateStatus("Обновлено, перезапускаем…", "updating");
      showToast("Приложение обновлено");
      window.setTimeout(() => window.location.reload(), 900);
    });

    try {
      const registration = await navigator.serviceWorker.register("./service-worker.js");
      await registration.update();
      setUpdateStatus("Версия актуальна", "ready");

      registration.addEventListener("updatefound", () => {
        const worker = registration.installing;
        if (!worker) return;
        setUpdateStatus("Загружаем обновление…", "updating");
        worker.addEventListener("statechange", () => {
          if (worker.state === "installed" && navigator.serviceWorker.controller) {
            worker.postMessage({ type: "SKIP_WAITING" });
          } else if (worker.state === "activated") {
            setUpdateStatus("Версия актуальна", "ready");
          }
        });
      });
    } catch {
      setUpdateStatus("Офлайн-режим", "ready");
      // Приложение остается рабочим даже без service worker.
    }
  });
} else {
  setUpdateStatus("Офлайн-кэш недоступен", "ready");
}

async function init() {
  await loadSchedule();
  await loadSavedPlan();
  renderAll();
  requestAnimationFrame(() => {
    document.querySelector("main")?.scrollTo({ top: 0, left: 0 });
  });
}

init();
