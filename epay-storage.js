// epay-storage.js
// Storage and retrieval of real data for homepage, task page, history page, and profile page

const STORAGE_KEYS = {
  BALANCE: 'epay_balance',
  AGENT_STATS: 'epay_agent_stats',
  TASKS: 'epay_tasks',
  HISTORY: 'epay_history',
  PROFILE: 'epay_profile',
};

// Default data for first-time users
const DEFAULTS = {
  balance: 305.70,
  agentStats: {
    totalEarned: 5.70,
    tasksCompleted: 1,
    level: 1,
    commissionRate: 0.002,
  },
  tasks: [
    {
      id: '1750774110998',
      sender: { name: 'Lisa Chen', amount: 687, country: 'United States' },
      receiver: { name: 'Sophia Williams', amount: 4946.40, country: 'China' },
      exchangeRate: 7.20,
      commission: 1.37,
      status: 'pending',
      expires: Date.now() + 3 * 60 * 1000, // 3 minutes from now
    },
    // ... more tasks ...
  ],
  history: [
    {
      id: '1750774110997',
      sender: { name: 'John Doe', amount: 500, country: 'United States' },
      receiver: { name: 'Wang Li', amount: 3600, country: 'China' },
      exchangeRate: 7.20,
      commission: 1.00,
      status: 'completed',
      completedAt: Date.now() - 86400000, // 1 day ago
    },
    // ... more history ...
  ],
  profile: {
    name: 'Agent',
    email: 'agent@epay.com',
    phone: '',
    avatar: '',
    // ...other profile fields...
  },
};

function getOrInit(key, def) {
  const val = localStorage.getItem(key);
  if (val) return JSON.parse(val);
  localStorage.setItem(key, JSON.stringify(def));
  return def;
}

export function getUserBalance() {
  return getOrInit(STORAGE_KEYS.BALANCE, DEFAULTS.balance);
}

export function setUserBalance(amount) {
  localStorage.setItem(STORAGE_KEYS.BALANCE, JSON.stringify(amount));
}

export function getAgentStats() {
  return getOrInit(STORAGE_KEYS.AGENT_STATS, DEFAULTS.agentStats);
}

export function setAgentStats(stats) {
  localStorage.setItem(STORAGE_KEYS.AGENT_STATS, JSON.stringify(stats));
}

export function getTasks() {
  return getOrInit(STORAGE_KEYS.TASKS, DEFAULTS.tasks);
}

export function setTasks(tasks) {
  localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
}

export function getTaskById(id) {
  const tasks = getTasks();
  return tasks.find(t => t.id === id);
}

export function getHistory() {
  return getOrInit(STORAGE_KEYS.HISTORY, DEFAULTS.history);
}

export function addHistory(entry) {
  const history = getHistory();
  history.unshift(entry);
  localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
}

export function getProfile() {
  return getOrInit(STORAGE_KEYS.PROFILE, DEFAULTS.profile);
}

export function updateProfile(data) {
  const profile = { ...getProfile(), ...data };
  localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
}

// Utility: Reset all data (for development/testing)
export function resetEpayStorage() {
  Object.keys(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(STORAGE_KEYS[key]);
  });
}