const APP_VERSION = "v13";
const DATA_VERSION = "Черновик по афише · Улетай 2026";
const USER_CACHE_NAME = "yletai-user-data-v1";
const PLAN_CACHE_URL = "./user-plan.json";

const STAGES = [
  { id: "main", name: "Сцена РЕН ТВ", short: "РЕН ТВ", color: "#e6e04f" },
  { id: "south", name: "Южная сцена", short: "Южная", color: "#62c7db" },
  { id: "west", name: "Западная сцена", short: "Западная", color: "#ff9c59" },
];

const DAYS = [
  { id: "2026-07-08", label: "8 июля", weekday: "среда" },
  { id: "2026-07-09", label: "9 июля", weekday: "четверг" },
  { id: "2026-07-10", label: "10 июля", weekday: "пятница" },
  { id: "2026-07-11", label: "11 июля", weekday: "суббота" },
  { id: "2026-07-12", label: "12 июля", weekday: "воскресенье" },
];

const RAW_EVENTS = [
  ["2026-07-08", "south", "15:00", "Будет объявлено"],
  ["2026-07-08", "south", "16:00", "Будет объявлено"],
  ["2026-07-08", "south", "17:00", "Будет объявлено"],
  ["2026-07-08", "south", "18:00", "Москвитин"],
  ["2026-07-08", "south", "19:00", "Лучший Самый День"],
  ["2026-07-08", "south", "20:00", "Калевала"],
  ["2026-07-08", "south", "21:00", "Ангел-Хранитель"],
  ["2026-07-08", "south", "22:00", "Обе-Рек"],
  ["2026-07-08", "south", "23:00", "Сколот"],
  ["2026-07-08", "south", "00:00", "Кирпичи"],
  ["2026-07-08", "south", "01:00", "Тролль Гнет Ель"],
  ["2026-07-08", "west", "16:00", "Тапок"],
  ["2026-07-08", "west", "17:00", "Мухоморы"],
  ["2026-07-08", "west", "18:00", "Магнитная Аномалия"],
  ["2026-07-08", "west", "19:00", "Будет объявлено"],
  ["2026-07-08", "west", "20:00", "Разные Люди"],
  ["2026-07-08", "west", "21:00", "Федулова"],
  ["2026-07-08", "west", "22:00", "Включай Микрофон!"],
  ["2026-07-08", "west", "23:00", "Черный Обелиск"],
  ["2026-07-08", "west", "00:00", "Семь Штук Баксов / 7000$"],

  ["2026-07-09", "main", "15:00", "Гран-Куражъ"],
  ["2026-07-09", "main", "16:00", "Калинов Мост"],
  ["2026-07-09", "main", "17:05", "Мара"],
  ["2026-07-09", "main", "18:10", "МультFильмы"],
  ["2026-07-09", "main", "19:15", "Монгол Шуудан"],
  ["2026-07-09", "main", "20:20", "Ундервуд"],
  ["2026-07-09", "main", "21:25", "Крематорий"],
  ["2026-07-09", "main", "22:35", "Lumen"],
  ["2026-07-09", "south", "16:00", "Донэра"],
  ["2026-07-09", "south", "17:00", "Багира / Bagira"],
  ["2026-07-09", "south", "18:00", "Афинаж"],
  ["2026-07-09", "south", "19:00", "Павел Пиковский"],
  ["2026-07-09", "south", "20:00", "Другой Ветер"],
  ["2026-07-09", "south", "21:00", "Без Б / Bez B"],
  ["2026-07-09", "south", "22:00", "Nagart"],
  ["2026-07-09", "south", "23:00", "Хельвеген / Helvegen"],
  ["2026-07-09", "south", "00:00", "Конец Фильма"],
  ["2026-07-09", "south", "01:00", "Rock Privet"],
  ["2026-07-09", "west", "12:00", "Конкурсная программа"],
  ["2026-07-09", "west", "14:00", "Будет объявлено"],
  ["2026-07-09", "west", "15:00", "Будет объявлено"],
  ["2026-07-09", "west", "16:00", "Фан Мод / Fun Mode"],
  ["2026-07-09", "west", "17:00", "Нина Смит"],
  ["2026-07-09", "west", "18:00", "Астра"],
  ["2026-07-09", "west", "19:00", "Саша и Сирожа"],
  ["2026-07-09", "west", "20:00", "Отморозки"],
  ["2026-07-09", "west", "21:00", "Рязанoff"],
  ["2026-07-09", "west", "22:00", "ОтАва Ё"],
  ["2026-07-09", "west", "23:00", "Дистемпер / Distemper"],
  ["2026-07-09", "west", "00:00", "Рванина / Ravanna"],

  ["2026-07-10", "main", "14:00", "Мельница"],
  ["2026-07-10", "main", "15:00", "7Б"],
  ["2026-07-10", "main", "16:10", "Сурганова и Оркестр"],
  ["2026-07-10", "main", "17:20", "Эпидемия"],
  ["2026-07-10", "main", "18:30", "Мураками"],
  ["2026-07-10", "main", "19:40", "Браво"],
  ["2026-07-10", "main", "21:00", "СерьГа"],
  ["2026-07-10", "main", "22:10", "Горшенев"],
  ["2026-07-10", "main", "23:30", "Алиса"],
  ["2026-07-10", "south", "14:00", "Декабрь"],
  ["2026-07-10", "south", "15:00", "Ласкала / LaScala"],
  ["2026-07-10", "south", "16:05", "Хмыров"],
  ["2026-07-10", "south", "17:10", "ПолинаЛюбви / Polnalyubvi"],
  ["2026-07-10", "south", "18:15", "Пламенев"],
  ["2026-07-10", "south", "19:20", "Слот"],
  ["2026-07-10", "south", "20:25", "Нэил Шери"],
  ["2026-07-10", "south", "21:30", "F.P.G."],
  ["2026-07-10", "south", "22:35", "Операция Пластилин"],
  ["2026-07-10", "south", "23:40", "Amatory"],
  ["2026-07-10", "south", "01:00", "ВИА «Волга-Волга»"],
  ["2026-07-10", "west", "12:00", "Конкурсная программа"],
  ["2026-07-10", "west", "13:00", "Конкурсная программа"],
  ["2026-07-10", "west", "14:00", "НебоНамеНя"],
  ["2026-07-10", "west", "15:00", "Мещера"],
  ["2026-07-10", "west", "16:00", "Аннушка"],
  ["2026-07-10", "west", "17:00", "ДМЦ"],
  ["2026-07-10", "west", "18:00", "Рекорд Оркестр"],
  ["2026-07-10", "west", "19:00", "ОРВА"],
  ["2026-07-10", "west", "20:00", "7раса"],
  ["2026-07-10", "west", "21:00", "Василий Уриевский"],
  ["2026-07-10", "west", "22:00", "Тайна"],
  ["2026-07-10", "west", "23:00", "Яшинкина"],
  ["2026-07-10", "west", "00:00", "Ключевая"],

  ["2026-07-11", "main", "14:00", "КняZz"],
  ["2026-07-11", "main", "15:00", "Пилот"],
  ["2026-07-11", "main", "16:20", "Костя Кулясов. АнимациЯ"],
  ["2026-07-11", "main", "17:40", "Сергей Бобунец"],
  ["2026-07-11", "main", "19:00", "Вячеслав Бутусов"],
  ["2026-07-11", "main", "20:20", "Ария"],
  ["2026-07-11", "main", "21:40", "Пикник"],
  ["2026-07-11", "main", "23:00", "Вадим Самойлов"],
  ["2026-07-11", "south", "14:00", "Будет объявлено"],
  ["2026-07-11", "south", "15:00", "Будет объявлено"],
  ["2026-07-11", "south", "16:00", "Кэжуал / Casual"],
  ["2026-07-11", "south", "17:00", "Инкогнито"],
  ["2026-07-11", "south", "18:00", "Drummatix"],
  ["2026-07-11", "south", "19:00", "Стигмата / Stigmata"],
  ["2026-07-11", "south", "20:00", "Потомучто"],
  ["2026-07-11", "south", "21:10", "Биртман"],
  ["2026-07-11", "south", "22:20", "Йорш"],
  ["2026-07-11", "south", "23:30", "Radio Tapok"],
  ["2026-07-11", "south", "01:10", "Нейромонах Феофан"],
  ["2026-07-11", "west", "12:00", "Конкурсная программа"],
  ["2026-07-11", "west", "14:20", "Будет объявлено"],
  ["2026-07-11", "west", "15:00", "Майвл"],
  ["2026-07-11", "west", "16:00", "Аня из Питера"],
  ["2026-07-11", "west", "17:00", "Арктида"],
  ["2026-07-11", "west", "18:00", "Будет объявлено"],
  ["2026-07-11", "west", "19:00", "Селлаут / Sellout"],
  ["2026-07-11", "west", "20:00", "Бахыт-Компот"],
  ["2026-07-11", "west", "21:00", "Питоны 3000"],
  ["2026-07-11", "west", "22:00", "Джоконда"],
  ["2026-07-11", "west", "23:00", "Торба-на-Круче"],
  ["2026-07-11", "west", "00:00", "Наконечный"],

  ["2026-07-12", "main", "12:00", "Ангел Небес"],
  ["2026-07-12", "main", "13:00", "Бригадный Подряд"],
  ["2026-07-12", "main", "14:15", "Znaki"],
  ["2026-07-12", "main", "15:30", "Игорь Растеряев"],
];

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

const events = RAW_EVENTS.map(([day, stage, time, title], index) => {
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
  byId("appVersion").textContent = APP_VERSION;
  byId("dataVersion").textContent = DATA_VERSION;
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
  status.textContent = message;
  status.classList.remove("is-checking", "is-updating", "is-ready");
  status.classList.add(`is-${mode}`);
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
  await loadSavedPlan();
  renderAll();
  requestAnimationFrame(() => {
    document.querySelector("main")?.scrollTo({ top: 0, left: 0 });
  });
}

init();
