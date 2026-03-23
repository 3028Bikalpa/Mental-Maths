const historyKey = "memoriad-web-history-v1";

const firstNames = [
  "Amelia", "Jonas", "Lina", "Ravi", "Noah", "Sara", "Iris", "Dario", "Mina", "Tariq",
  "Evan", "Nadia", "Lea", "Yuki", "Omar", "Hana", "Mateo", "Ayla", "Zane", "Priya",
  "Lucia", "Felix", "Mira", "Arjun", "Sofia", "Daniel", "Ines", "Hugo", "Nora", "Kian",
  "Elena", "Mason", "Aya", "Theo", "Laila", "Jonah", "Ari", "Mila", "Samir", "Clara"
];

const lastNames = [
  "Hart", "Meyer", "Dubois", "Patel", "Silva", "Keller", "Nowak", "Costa", "Olsen", "Rahman",
  "Brooks", "Petrov", "Mercer", "Tanaka", "Saad", "Navarro", "Singh", "Fischer", "Romero", "Khan",
  "Bennett", "Ivanov", "Moreau", "Hassan", "Murphy", "Santos", "Ali", "Novak", "Lopez", "Wright",
  "Sharma", "Kim", "Ahmed", "Rossi", "Nguyen", "Cohen", "Weber", "Diaz", "Morgan", "Pereira"
];

const cardDeck = (() => {
  const suits = ["S", "H", "D", "C"];
  const ranks = ["A", "K", "Q", "J", "10", "9", "8", "7", "6", "5", "4", "3", "2"];
  const deck = [];
  for (const suit of suits) {
    for (const rank of ranks) deck.push(rank + suit);
  }
  return deck;
})();

function shuffle(list) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomDigits(count, digits = 1) {
  return Array.from({ length: count }, () => String(randInt(10 ** (digits - 1), (10 ** digits) - 1)));
}

function padDate(date) {
  return new Intl.DateTimeFormat("en-GB", { dateStyle: "medium" }).format(date);
}

function weekdayName(date) {
  return new Intl.DateTimeFormat("en-US", { weekday: "long", timeZone: "UTC" }).format(date);
}

function generateDate1600to2099() {
  const year = randInt(1600, 2099);
  const month = randInt(0, 11);
  const day = randInt(1, new Date(year, month + 1, 0).getDate());
  return new Date(Date.UTC(year, month, day));
}

function normalize(value) {
  return String(value || "").trim().replace(/\s+/g, " ");
}

function compareRow(target, guess) {
  let errors = Math.abs(target.length - guess.length);
  for (let i = 0; i < Math.min(target.length, guess.length); i++) {
    if (target[i] !== guess[i]) errors++;
  }
  return errors;
}

function formatScore(score) {
  return Number.isFinite(score) ? Number(score).toFixed(score % 1 === 0 ? 0 : 2) : "0";
}

function prettyKey(key) {
  return key.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase());
}

function loadHistory() {
  try {
    return JSON.parse(localStorage.getItem(historyKey) || "[]");
  } catch (error) {
    return [];
  }
}

function saveHistory(entries) {
  localStorage.setItem(historyKey, JSON.stringify(entries.slice(0, 100)));
}

function hashString(value) {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function pick(list, seed, offset = 0) {
  return list[(seed + offset) % list.length];
}

function generateAvatarSvg(index, name) {
  const seed = hashString(`${name}-${Date.now()}-${Math.random()}-${index}`);
  const skin = pick(["#F6D1B1", "#E8BC95", "#DDA37B", "#B97A56", "#8B5A3C"], seed, 3);
  const hair = pick(["#2B211E", "#5B3A29", "#8B5E3C", "#201815", "#6A4C3B", "#A66A3F"], seed, 7);
  const shirt = pick(["#CB5B35", "#1E7A74", "#305F9B", "#8C5F26", "#6B4876", "#2F7D32"], seed, 11);
  const bg1 = pick(["#F7E2D1", "#D8ECE9", "#E7E2F4", "#F3EAC7", "#D9E5F6"], seed, 13);
  const bg2 = pick(["#F3C4A3", "#9ED2CB", "#C4B7E8", "#D9C27A", "#A7C3E8"], seed, 17);
  const eye = pick(["#2B211E", "#3A2C20", "#1D2D3A", "#3B2C44"], seed, 19);
  const mouthY = 124 + (seed % 10);
  const hairStyle = seed % 4;
  const browTilt = (seed % 5) - 2;
  const accessory = seed % 5;

  let hairSvg = "";
  if (hairStyle === 0) {
    hairSvg = `<path d="M55 82c4-34 28-54 73-54 44 0 70 21 74 55-16-10-37-14-64-14-35 0-58 5-83 13Z" fill="${hair}"/>`;
  } else if (hairStyle === 1) {
    hairSvg = `<path d="M50 92c7-40 37-62 79-62 46 0 72 23 76 62-10-7-18-10-27-12-10 20-33 31-62 31-26 0-48-8-66-19Z" fill="${hair}"/>`;
  } else if (hairStyle === 2) {
    hairSvg = `<path d="M58 78c10-29 34-46 70-46 43 0 66 18 72 52-12-4-22-6-32-6-20 0-38 6-58 6-18 0-32-4-52-6Z" fill="${hair}"/>`;
  } else {
    hairSvg = `<path d="M52 88c5-37 32-58 76-58 45 0 72 20 76 58-21-15-49-20-74-20-27 0-54 8-78 20Z" fill="${hair}"/>`;
  }

  let accessorySvg = "";
  if (accessory === 1) {
    accessorySvg = `<g stroke="${eye}" stroke-width="3" fill="none"><circle cx="94" cy="102" r="11"/><circle cx="142" cy="102" r="11"/><path d="M105 102h26"/></g>`;
  } else if (accessory === 2) {
    accessorySvg = `<path d="M87 137c12 7 47 8 61 0" stroke="${eye}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
  } else if (accessory === 3) {
    accessorySvg = `<path d="M80 74c20-15 56-15 76 0" stroke="${hair}" stroke-width="6" fill="none" stroke-linecap="round"/>`;
  }

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 236 236">
      <defs>
        <linearGradient id="bg-${seed}" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${bg1}"/>
          <stop offset="100%" stop-color="${bg2}"/>
        </linearGradient>
      </defs>
      <rect width="236" height="236" rx="28" fill="url(#bg-${seed})"/>
      <circle cx="118" cy="86" r="52" fill="rgba(255,255,255,0.22)"/>
      <path d="M40 214c12-42 38-63 78-63s66 21 78 63" fill="${shirt}"/>
      <ellipse cx="118" cy="112" rx="49" ry="57" fill="${skin}"/>
      ${hairSvg}
      <path d="M88 ${93 + browTilt}q8-4 16 0" stroke="${eye}" stroke-width="3" fill="none" stroke-linecap="round"/>
      <path d="M132 ${93 - browTilt}q8-4 16 0" stroke="${eye}" stroke-width="3" fill="none" stroke-linecap="round"/>
      <circle cx="96" cy="103" r="4" fill="${eye}"/>
      <circle cx="144" cy="103" r="4" fill="${eye}"/>
      <path d="M119 106c-5 8-8 15-8 23 0 4 4 7 9 7" stroke="#8E5F49" stroke-width="3" fill="none" stroke-linecap="round"/>
      <path d="M95 ${mouthY}q23 15 46 0" stroke="#9A4D49" stroke-width="4" fill="none" stroke-linecap="round"/>
      ${accessorySvg}
    </svg>
  `;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

const categories = [
  {
    id: "mental-addition",
    name: "Mental Additions",
    family: "Calculation",
    summary: "Ten lines of ten 10-digit additions in simulator style.",
    defaults: { questions: 10, addends: 10, digits: 10, timeLimit: 600 },
    note: "Official-style setup: ten answers, each summing ten large numbers.",
    prepare(config) {
      const questions = Array.from({ length: Number(config.questions) }, () => {
        const parts = Array.from({ length: Number(config.addends) }, () => randInt(10 ** (config.digits - 1), (10 ** config.digits) - 1));
        const prompt = parts.map((part, index) => `${index === 0 ? "  " : "+ "}${part}`).join("\n");
        return { prompt, answer: String(parts.reduce((a, b) => a + b, 0)) };
      });
      return { questions, mode: "list-inputs" };
    },
    score(attempt, config) {
      const correct = attempt.questions.filter((q, i) => normalize(attempt.answers[i]) === q.answer).length;
      let score = correct;
      if (correct === attempt.questions.length && attempt.elapsed < Number(config.timeLimit)) {
        score = (Number(config.timeLimit) / Math.max(attempt.elapsed, 1)) * attempt.questions.length;
      }
      return { score, summary: `${correct}/${attempt.questions.length} correct` };
    }
  },
  {
    id: "mental-multiplication",
    name: "Mental Multiplications",
    family: "Calculation",
    summary: "Two-factor multiplication sets with configurable digit sizes.",
    defaults: { questions: 10, digitsA: 8, digitsB: 8, timeLimit: 900 },
    note: "Default mirrors the published Memoriad multiplication setup.",
    prepare(config) {
      const questions = Array.from({ length: Number(config.questions) }, () => {
        const a = randInt(10 ** (config.digitsA - 1), (10 ** config.digitsA) - 1);
        const b = randInt(10 ** (config.digitsB - 1), (10 ** config.digitsB) - 1);
        const prompt = [`  ${a}`, `× ${b}`].join("\n");
        return { prompt, answer: String(a * b) };
      });
      return { questions, mode: "list-inputs" };
    },
    score(attempt, config) {
      const correct = attempt.questions.filter((q, i) => normalize(attempt.answers[i]) === q.answer).length;
      let score = correct;
      if (correct === attempt.questions.length && attempt.elapsed < Number(config.timeLimit)) {
        score = (Number(config.timeLimit) / Math.max(attempt.elapsed, 1)) * attempt.questions.length;
      }
      return { score, summary: `${correct}/${attempt.questions.length} correct` };
    }
  },
  {
    id: "mental-division",
    name: "Mental Divisions",
    family: "Calculation",
    summary: "Exact division drill matching the 10-digit by 5-digit Memoriad pattern.",
    defaults: { questions: 10, divisorDigits: 5, quotientDigits: 5, timeLimit: 900 },
    note: "Problems divide exactly, so every quotient is a clean integer.",
    prepare(config) {
      const questions = Array.from({ length: Number(config.questions) }, () => {
        const divisor = randInt(10 ** (config.divisorDigits - 1), (10 ** config.divisorDigits) - 1);
        const quotient = randInt(10 ** (config.quotientDigits - 1), (10 ** config.quotientDigits) - 1);
        const dividend = divisor * quotient;
        const prompt = [`  ${dividend}`, `÷ ${divisor}`].join("\n");
        return { prompt, answer: String(quotient) };
      });
      return { questions, mode: "list-inputs" };
    },
    score(attempt) {
      const correct = attempt.questions.filter((q, i) => normalize(attempt.answers[i]) === q.answer).length;
      return { score: correct, summary: `${correct}/${attempt.questions.length} exact` };
    }
  },
  {
    id: "mental-sqrt",
    name: "Mental Square Roots",
    family: "Calculation",
    summary: "Square-root extraction with configurable precision.",
    defaults: { questions: 10, digits: 6, decimals: 5, timeLimit: 900 },
    note: "Graded by left-to-right correct characters after rounding.",
    prepare(config) {
      const questions = Array.from({ length: Number(config.questions) }, () => {
        const n = randInt(10 ** (config.digits - 1), (10 ** config.digits) - 1);
        return { prompt: `sqrt(${n})`, answer: Math.sqrt(n).toFixed(Number(config.decimals)) };
      });
      return { questions, mode: "list-inputs" };
    },
    score(attempt) {
      let score = 0;
      for (let i = 0; i < attempt.questions.length; i++) {
        const target = attempt.questions[i].answer;
        const guess = normalize(attempt.answers[i]);
        let streak = 0;
        for (let c = 0; c < Math.min(target.length, guess.length); c++) {
          if (target[c] !== guess[c]) break;
          if (target[c] !== ".") streak++;
        }
        score += (streak * (streak + 1)) / 2;
      }
      return { score, summary: "Triangular partial-credit scoring" };
    }
  },
  {
    id: "calendar-dates",
    name: "Mental Calendar Dates",
    family: "Calculation",
    summary: "Weekday calculation for Gregorian dates from 1600 to 2099.",
    defaults: { questions: 25, timeLimit: 60 },
    note: "One blank or mistake is tolerated; the second breaks the chain.",
    prepare(config) {
      const questions = Array.from({ length: Number(config.questions) }, () => {
        const date = generateDate1600to2099();
        return { prompt: padDate(date), answer: weekdayName(date) };
      });
      return { questions, mode: "list-inputs" };
    },
    score(attempt) {
      let misses = 0;
      let chain = 0;
      for (let i = 0; i < attempt.questions.length; i++) {
        const ok = normalize(attempt.answers[i]).toLowerCase() === attempt.questions[i].answer.toLowerCase();
        if (!ok) misses++;
        if (misses >= 2) break;
        chain = i + 1;
      }
      return { score: Math.max(chain - 1, 0), summary: `${chain} reached before second miss` };
    }
  },
  {
    id: "flash-anzan",
    name: "Flash Anzan",
    family: "Calculation",
    summary: "Rapid flashing addition sequences with 1 to 4 digit numbers.",
    defaults: { numbers: 12, digits: 2, flashMs: 700, timeLimit: 45 },
    note: "Numbers flash in sequence. After the stream ends, enter the total.",
    prepare(config) {
      const values = randomDigits(Number(config.numbers), Number(config.digits)).map(Number);
      return {
        sequence: values.map(String),
        questions: [{ prompt: "Enter the sum of all flashed numbers", answer: String(values.reduce((a, b) => a + b, 0)) }],
        mode: "single-input",
        flash: true
      };
    },
    score(attempt, config) {
      const correct = normalize(attempt.answers[0]) === attempt.questions[0].answer;
      const t = Number(config.flashMs) / 1000;
      const n = Number(config.numbers);
      const m = Number(config.digits);
      return { score: correct ? (1 / (t * t)) * n * m * 2 ** (m - 1) : 0, summary: correct ? "Exact total" : "Incorrect total" };
    }
  },
  {
    id: "flash-numbers",
    name: "Flash Numbers",
    family: "Memory",
    summary: "Digit recall after a flashing sequence.",
    defaults: { length: 30, flashMs: 900, timeLimit: 90 },
    note: "The display flashes one digit at a time, then you type the full sequence.",
    prepare(config) {
      const sequence = randomDigits(Number(config.length), 1);
      return { sequence, questions: [{ prompt: "Recall the full digit sequence", answer: sequence.join("") }], mode: "single-text", flash: true };
    },
    score(attempt) {
      const target = attempt.questions[0].answer;
      const guess = normalize(attempt.answers[0]);
      let score = 0;
      for (let i = 0; i < Math.min(target.length, guess.length); i++) {
        if (target[i] !== guess[i]) break;
        score++;
      }
      return { score, summary: `${score} correct from the start` };
    }
  },
  {
    id: "spoken-numbers",
    name: "Spoken Numbers",
    family: "Memory",
    summary: "Speech-based number memory drill using the browser speech engine.",
    defaults: { length: 20, intervalMs: 1100, timeLimit: 90 },
    note: "On supported browsers the numbers are spoken aloud.",
    prepare(config) {
      const sequence = randomDigits(Number(config.length), 1);
      return { sequence, questions: [{ prompt: "Type the spoken sequence", answer: sequence.join("") }], mode: "single-text", flash: true, spoken: true };
    },
    score(attempt) {
      const target = attempt.questions[0].answer;
      const guess = normalize(attempt.answers[0]);
      let score = 0;
      for (let i = 0; i < Math.min(target.length, guess.length); i++) {
        if (target[i] !== guess[i]) break;
        score++;
      }
      return { score, summary: `${score} leading digits preserved` };
    }
  },
  {
    id: "binary-digits",
    name: "Binary Digits",
    family: "Memory",
    summary: "Binary string memory with row scoring.",
    defaults: { rows: 8, digitsPerRow: 30, timeLimit: 180 },
    note: "Binary rows are shown for memorization, then hidden for recall.",
    prepare(config) {
      const rows = Array.from({ length: Number(config.rows) }, () => Array.from({ length: Number(config.digitsPerRow) }, () => randInt(0, 1)).join(""));
      return { rows, questions: rows.map((row, i) => ({ prompt: `Row ${i + 1}`, answer: row })), mode: "list-inputs" };
    },
    score(attempt) {
      let score = 0;
      attempt.questions.forEach((q, i) => {
        const guess = normalize(attempt.answers[i]);
        const errors = compareRow(q.answer, guess);
        if (guess.length >= q.answer.length) {
          if (errors === 0) score += q.answer.length;
          else if (errors === 1) score += Math.ceil(q.answer.length / 2);
        } else {
          const partialErrors = compareRow(q.answer.slice(0, guess.length), guess);
          if (partialErrors <= 1) score += Math.ceil(guess.length / 2);
        }
      });
      return { score, summary: "Binary row scoring" };
    }
  },
  {
    id: "speed-cards",
    name: "Speed Cards",
    family: "Memory",
    summary: "Full shuffled deck memorization with first-mistake stop scoring.",
    defaults: { timeLimit: 300 },
    note: "Cards are displayed in order. Enter them space-separated, like `AS KD 10H`.",
    prepare() {
      const deck = shuffle(cardDeck);
      return { deck, questions: [{ prompt: "Recall the deck order, space-separated", answer: deck.join(" ") }], mode: "single-text" };
    },
    score(attempt) {
      const target = attempt.questions[0].answer.split(/\s+/);
      const guess = normalize(attempt.answers[0]).toUpperCase().split(/\s+/).filter(Boolean);
      let correct = 0;
      for (let i = 0; i < Math.min(target.length, guess.length); i++) {
        if (target[i] !== guess[i]) break;
        correct++;
      }
      return { score: correct, summary: `${correct} cards before first miss` };
    }
  },
  {
    id: "names-faces",
    name: "Names and Faces",
    family: "Memory",
    summary: "Memorize avatar portraits and associated names, then recall both fields.",
    defaults: { count: 8, timeLimit: 180 },
    note: "Portraits are generated SVG avatars paired with randomized names.",
    prepare(config) {
      const used = new Set();
      const entries = Array.from({ length: Number(config.count) }, (_, i) => {
        let first = "";
        let last = "";
        let full = "";
        while (!full || used.has(full)) {
          first = firstNames[randInt(0, firstNames.length - 1)];
          last = lastNames[randInt(0, lastNames.length - 1)];
          full = `${first} ${last}`;
        }
        used.add(full);
        return { prompt: `Face ${i + 1}`, answer: full, face: generateAvatarSvg(i, full) };
      });
      return { entries, questions: entries, mode: "list-inputs" };
    },
    score(attempt) {
      let score = 0;
      attempt.questions.forEach((q, i) => {
        const [first, ...rest] = q.answer.split(" ");
        const last = rest.join(" ");
        const guess = normalize(attempt.answers[i]).toLowerCase().split(/\s+/);
        if (guess[0] === first.toLowerCase()) score += 1;
        if (guess.slice(1).join(" ") === last.toLowerCase()) score += 1;
      });
      return { score, summary: "1 point each for first and surname" };
    }
  }
];

function initHomePage() {
  const history = loadHistory();
  const calcCount = categories.filter((c) => c.family === "Calculation").length;
  const memCount = categories.filter((c) => c.family === "Memory").length;
  const stats = {
    totalEvents: categories.length,
    calculationEvents: calcCount,
    memoryEvents: memCount,
    attempts: history.length,
    best: history.reduce((max, entry) => Math.max(max, entry.score), 0)
  };

  document.getElementById("homeTotalEvents").textContent = String(stats.totalEvents);
  document.getElementById("homeCalcEvents").textContent = String(stats.calculationEvents);
  document.getElementById("homeMemoryEvents").textContent = String(stats.memoryEvents);
  document.getElementById("homeAttempts").textContent = String(stats.attempts);
  document.getElementById("homeBest").textContent = formatScore(stats.best);

  const historyBody = document.getElementById("homeHistoryBody");
  historyBody.innerHTML = "";
  if (!history.length) {
    historyBody.innerHTML = `<tr><td colspan="4" class="subtle">No attempts saved yet.</td></tr>`;
    return;
  }

  history.slice(0, 10).forEach((entry) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${entry.date}</td>
      <td>${entry.categoryName}</td>
      <td>${formatScore(entry.score)}</td>
      <td>${entry.elapsed.toFixed(2)}s</td>
    `;
    historyBody.appendChild(tr);
  });
}

function initTrainerPage(family) {
  const filteredCategories = categories.filter((category) => category.family === family);
  const state = {
    filteredCategories,
    history: loadHistory(),
    selectedId: filteredCategories[0].id,
    currentConfig: {},
    round: null,
    timer: null,
    flashTimer: null,
    unlockTimer: null
  };

  const elements = {
    categoryList: document.getElementById("categoryList"),
    searchInput: document.getElementById("searchInput"),
    heroDescription: document.getElementById("heroDescription"),
    statCategories: document.getElementById("statCategories"),
    statAttempts: document.getElementById("statAttempts"),
    statBest: document.getElementById("statBest"),
    eventName: document.getElementById("eventName"),
    eventSummary: document.getElementById("eventSummary"),
    eventFamily: document.getElementById("eventFamily"),
    configGrid: document.getElementById("configGrid"),
    flashValue: document.getElementById("flashValue"),
    promptBlock: document.getElementById("promptBlock"),
    questionGrid: document.getElementById("questionGrid"),
    answersGrid: document.getElementById("answersGrid"),
    metricElapsed: document.getElementById("metricElapsed"),
    metricRemaining: document.getElementById("metricRemaining"),
    metricScore: document.getElementById("metricScore"),
    metricBestEvent: document.getElementById("metricBestEvent"),
    statusText: document.getElementById("statusText"),
    roundNote: document.getElementById("roundNote"),
    metricEventAttempts: document.getElementById("metricEventAttempts"),
    metricEventAverage: document.getElementById("metricEventAverage"),
    historyBody: document.getElementById("historyBody"),
    heroStart: document.getElementById("heroStart"),
    startRound: document.getElementById("startRound"),
    demoRound: document.getElementById("demoRound"),
    submitRound: document.getElementById("submitRound"),
    revealRound: document.getElementById("revealRound"),
    resetStats: document.getElementById("resetStats")
  };

  function currentCategory() {
    return filteredCategories.find((category) => category.id === state.selectedId);
  }

  function eventHistory(id) {
    return state.history.filter((entry) => entry.categoryId === id);
  }

  function stopClock() {
    if (state.timer) clearInterval(state.timer);
    state.timer = null;
  }

  function stopTimers() {
    stopClock();
    if (state.flashTimer) clearTimeout(state.flashTimer);
    state.flashTimer = null;
    if (state.unlockTimer) clearTimeout(state.unlockTimer);
    state.unlockTimer = null;
    if (window.speechSynthesis) window.speechSynthesis.cancel();
  }

  function setInputsLocked(locked) {
    document.querySelectorAll("[data-answer-index]").forEach((input) => {
      input.disabled = locked;
      input.placeholder = locked ? "Wait for the demonstration to finish" : "Type your answer";
    });
  }

  function focusFirstAnswerInput() {
    const firstInput = document.querySelector("[data-answer-index]");
    if (!firstInput || firstInput.disabled) return;
    firstInput.focus();
    firstInput.select();
  }

  function routeTypingToAnswer(event) {
    if (!state.round || state.round.inputsLocked) return;
    if (event.metaKey || event.ctrlKey || event.altKey) return;
    if (event.key.length !== 1 && event.key !== "Backspace") return;
    const active = document.activeElement;
    if (active && (active.tagName === "INPUT" || active.tagName === "TEXTAREA")) return;
    const firstInput = document.querySelector("[data-answer-index]");
    if (!firstInput || firstInput.disabled) return;
    firstInput.focus();
    if (event.key === "Backspace") return;
    firstInput.value += event.key;
    state.round.answers[Number(firstInput.dataset.answerIndex)] = firstInput.value;
    event.preventDefault();
  }

  function beginAnswerPhase(round, promptText) {
    if (!state.round || state.round !== round) return;
    round.inputsLocked = false;
    round.startAt = Date.now();
    round.elapsed = 0;
    if (promptText) elements.promptBlock.textContent = promptText;
    setInputsLocked(false);
    requestAnimationFrame(() => {
      focusFirstAnswerInput();
      setTimeout(focusFirstAnswerInput, 0);
    });
    runClock();
  }

  function updateSidebar() {
    const query = elements.searchInput.value.trim().toLowerCase();
    const shown = filteredCategories.filter((category) => `${category.name} ${category.summary}`.toLowerCase().includes(query));
    elements.categoryList.innerHTML = "";
    shown.forEach((category) => {
      const btn = document.createElement("button");
      btn.className = `category-button ${category.id === state.selectedId ? "active" : ""}`;
      btn.innerHTML = `<strong>${category.name}</strong><span>${category.summary}</span>`;
      btn.addEventListener("click", () => {
        state.selectedId = category.id;
        render();
      });
      elements.categoryList.appendChild(btn);
    });
  }

  function buildConfig() {
    const category = currentCategory();
    state.currentConfig = { ...category.defaults };
    elements.configGrid.innerHTML = "";
    Object.entries(category.defaults).forEach(([key, value]) => {
      const field = document.createElement("div");
      field.className = "field";
      field.innerHTML = `
        <label>${prettyKey(key)}</label>
        <input type="number" min="1" step="1" value="${value}" data-key="${key}">
      `;
      elements.configGrid.appendChild(field);
    });
    elements.configGrid.querySelectorAll("[data-key]").forEach((input) => {
      input.addEventListener("input", () => {
        state.currentConfig[input.dataset.key] = Number(input.value);
      });
    });
  }

  function renderHero() {
    const category = currentCategory();
    const bestOverall = state.history.reduce((max, entry) => Math.max(max, entry.score), 0);
    const bestEvent = eventHistory(category.id).reduce((max, entry) => Math.max(max, entry.score), 0);
    elements.heroDescription.textContent = category.summary;
    elements.statCategories.textContent = String(filteredCategories.length);
    elements.statAttempts.textContent = String(state.history.length);
    elements.statBest.textContent = formatScore(bestOverall);
    elements.metricBestEvent.textContent = formatScore(bestEvent);
  }

  function renderSelection() {
    const category = currentCategory();
    const history = eventHistory(category.id);
    const avg = history.length ? history.reduce((sum, entry) => sum + entry.score, 0) / history.length : 0;
    elements.eventName.textContent = category.name;
    elements.eventSummary.textContent = category.summary;
    elements.eventFamily.textContent = category.family;
    elements.roundNote.textContent = category.note;
    elements.metricEventAttempts.textContent = String(history.length);
    elements.metricEventAverage.textContent = formatScore(avg);
  }

  function clearRoundSurface() {
    elements.flashValue.textContent = "Ready";
    elements.promptBlock.textContent = "Choose an event and start a round.";
    elements.questionGrid.classList.add("hidden");
    elements.questionGrid.classList.remove("sequence-grid");
    elements.answersGrid.classList.add("hidden");
    elements.questionGrid.innerHTML = "";
    elements.answersGrid.innerHTML = "";
    elements.metricElapsed.textContent = "0.0s";
    elements.metricRemaining.textContent = "-";
    elements.metricScore.textContent = "0";
    elements.statusText.textContent = "Ready";
    stopTimers();
  }

  function buildAnswerInputs(round) {
    const inlineInputs = document.querySelectorAll("[data-answer-index]");
    if (inlineInputs.length) {
      inlineInputs.forEach((input) => {
        input.addEventListener("input", () => {
          state.round.answers[Number(input.dataset.answerIndex)] = input.value;
        });
      });
      setInputsLocked(Boolean(round.inputsLocked));
      elements.answersGrid.classList.add("hidden");
      elements.answersGrid.innerHTML = "";
      return;
    }

    elements.answersGrid.classList.remove("hidden");
    elements.answersGrid.innerHTML = "";
    round.questions.forEach((question, index) => {
      const row = document.createElement("div");
      row.className = "answer-row";
      row.innerHTML = `
        <strong>${round.questions.length === 1 ? question.prompt : `#${index + 1}`}</strong>
        <input type="text" data-answer-index="${index}" placeholder="Type your answer">
      `;
      elements.answersGrid.appendChild(row);
    });
    elements.answersGrid.querySelectorAll("[data-answer-index]").forEach((input) => {
      input.addEventListener("input", () => {
        state.round.answers[Number(input.dataset.answerIndex)] = input.value;
      });
    });
    setInputsLocked(Boolean(round.inputsLocked));
  }

  function renderRound() {
    clearRoundSurface();
    const round = state.round;
    if (!round) return;

    elements.statusText.textContent = "Running";
    elements.metricRemaining.textContent = `${Number(round.config.timeLimit || 0).toFixed(0)}s`;
    elements.promptBlock.textContent = round.questions.length === 1 ? round.questions[0].prompt : "Solve or recall each item below.";

    if (round.rows) {
      elements.questionGrid.classList.remove("hidden");
      elements.questionGrid.classList.add("sequence-grid");
      round.rows.forEach((row, index) => {
        const card = document.createElement("div");
        card.className = "question-card sequence-card";
        card.innerHTML = `<strong>Row ${index + 1}</strong><code>${row}</code>`;
        elements.questionGrid.appendChild(card);
      });
      setTimeout(() => {
        if (state.round === round) {
          elements.questionGrid.classList.add("hidden");
          beginAnswerPhase(round, "Recall the hidden rows in order.");
        }
      }, 6000);
    } else if (round.deck) {
      elements.questionGrid.classList.remove("hidden");
      elements.questionGrid.classList.add("sequence-grid");
      elements.questionGrid.innerHTML = `<div class="question-card sequence-card"><strong>Deck Order</strong><code>${round.deck.join(" ")}</code></div>`;
      setTimeout(() => {
        if (state.round === round) {
          elements.questionGrid.classList.add("hidden");
          beginAnswerPhase(round, "Enter the full card order, separated by spaces.");
        }
      }, 7000);
    } else if (round.entries) {
      elements.questionGrid.classList.remove("hidden");
      round.entries.forEach((entry, index) => {
        const card = document.createElement("div");
        card.className = "question-card";
        card.innerHTML = `<strong>Face ${index + 1}</strong><img class="face-portrait" src="${entry.face}" alt="${entry.answer}"><code>${entry.answer}</code>`;
        elements.questionGrid.appendChild(card);
      });
      setTimeout(() => {
        if (state.round === round) {
          elements.questionGrid.classList.add("hidden");
          beginAnswerPhase(round, "Recall each name and surname.");
        }
      }, 7000);
    } else if (!round.flash && round.questions.length > 1) {
      elements.questionGrid.classList.remove("hidden");
      round.questions.forEach((question, index) => {
        const card = document.createElement("div");
        card.className = "question-card";
        card.innerHTML = `
          <strong>#${index + 1}</strong>
          <code>${question.prompt}</code>
          <div class="question-input"><input type="text" data-answer-index="${index}" placeholder="Type your answer"></div>
        `;
        elements.questionGrid.appendChild(card);
      });
    }

    buildAnswerInputs(round);
  }

  function runClock() {
    stopClock();
    const round = state.round;
    state.timer = setInterval(() => {
      if (!state.round || state.round !== round) return;
      round.elapsed = (Date.now() - round.startAt) / 1000;
      const left = Math.max(Number(round.config.timeLimit || 0) - round.elapsed, 0);
      elements.metricElapsed.textContent = `${round.elapsed.toFixed(1)}s`;
      elements.metricRemaining.textContent = `${left.toFixed(1)}s`;
      if (round.config.timeLimit && left <= 0) submitRound();
    }, 100);
  }

  function runFlashSequence() {
    const round = state.round;
    if (!round || !round.sequence) return;
    const interval = Number(round.config.flashMs || round.config.intervalMs || 1000);
    let index = 0;

    function step() {
      if (!state.round || state.round !== round) return;
      if (index >= round.sequence.length) {
        elements.flashValue.textContent = "Answer";
        beginAnswerPhase(round, round.questions[0].prompt);
        return;
      }
      const value = round.sequence[index];
      elements.flashValue.textContent = value;
      if (round.spoken && window.speechSynthesis) {
        const utterance = new SpeechSynthesisUtterance(value.split("").join(" "));
        utterance.rate = 1;
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utterance);
      }
      index++;
      state.flashTimer = setTimeout(step, interval);
    }

    step();
  }

  function startRound(demo = false) {
    stopTimers();
    const category = currentCategory();
    const config = { ...state.currentConfig };
    if (demo) {
      if ("questions" in config) config.questions = Math.min(Number(config.questions), 3);
      if ("rows" in config) config.rows = Math.min(Number(config.rows), 3);
      if ("count" in config) config.count = Math.min(Number(config.count), 4);
      if ("length" in config) config.length = Math.min(Number(config.length), 12);
      if ("numbers" in config) config.numbers = Math.min(Number(config.numbers), 6);
      config.timeLimit = Math.min(Number(config.timeLimit || 60), 45);
    }
    state.round = {
      categoryId: category.id,
      categoryName: category.name,
      category,
      config,
      ...category.prepare(config),
      answers: [],
      startAt: family === "Memory" ? null : Date.now(),
      elapsed: 0,
      submitted: false,
      inputsLocked: family === "Memory"
    };
    renderRound();
    if (family !== "Memory") runClock();
    if (state.round.flash) runFlashSequence();
    if (family === "Memory" && !state.round.flash && !state.round.rows && !state.round.deck && !state.round.entries) {
      beginAnswerPhase(state.round);
    }
  }

  function submitRound() {
    if (!state.round || state.round.submitted) return;
    state.round.submitted = true;
    state.round.elapsed = state.round.elapsed || (Date.now() - state.round.startAt) / 1000;
    stopTimers();
    const result = state.round.category.score(state.round, state.round.config);
    elements.metricScore.textContent = formatScore(result.score);
    elements.flashValue.textContent = formatScore(result.score);
    elements.promptBlock.textContent = `Round complete. ${result.summary}`;
    elements.statusText.textContent = "Completed";
    state.history.unshift({
      date: new Date().toLocaleString(),
      categoryId: state.round.categoryId,
      categoryName: state.round.categoryName,
      score: Number(result.score),
      elapsed: Number(state.round.elapsed.toFixed(2)),
      summary: result.summary
    });
    saveHistory(state.history);
    renderHistory();
    renderHero();
    renderSelection();
  }

  function revealSolutions() {
    if (!state.round) return;
    elements.questionGrid.classList.remove("hidden");
    elements.questionGrid.innerHTML = "";
    state.round.questions.forEach((question, index) => {
      const card = document.createElement("div");
      card.className = "question-card";
      card.innerHTML = `<strong>Solution ${index + 1}</strong><code>${question.prompt}\n=> ${question.answer}</code>`;
      elements.questionGrid.appendChild(card);
    });
  }

  function renderHistory() {
    elements.historyBody.innerHTML = "";
    const rows = state.history.slice(0, 20);
    if (!rows.length) {
      elements.historyBody.innerHTML = `<tr><td colspan="5" class="subtle">No attempts saved yet.</td></tr>`;
      return;
    }
    rows.forEach((entry) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${entry.date}</td>
        <td>${entry.categoryName}</td>
        <td>${formatScore(entry.score)}</td>
        <td>${entry.elapsed.toFixed(2)}s</td>
        <td>${entry.summary}</td>
      `;
      elements.historyBody.appendChild(tr);
    });
  }

  function render() {
    updateSidebar();
    buildConfig();
    renderHero();
    renderSelection();
    clearRoundSurface();
    renderHistory();
  }

  elements.searchInput.addEventListener("input", updateSidebar);
  elements.heroStart.addEventListener("click", () => startRound(false));
  elements.startRound.addEventListener("click", () => startRound(false));
  elements.demoRound.addEventListener("click", () => startRound(true));
  elements.submitRound.addEventListener("click", submitRound);
  elements.revealRound.addEventListener("click", revealSolutions);
  elements.resetStats.addEventListener("click", () => {
    state.history = [];
    saveHistory(state.history);
    render();
  });
  document.addEventListener("keydown", routeTypingToAnswer);

  render();
}

document.addEventListener("DOMContentLoaded", () => {
  const page = document.body.dataset.page;
  if (page === "home") initHomePage();
  if (page === "calculation") initTrainerPage("Calculation");
  if (page === "memory") initTrainerPage("Memory");
});
