// mockUsers: sample users for the demo; uses localStorage for persistence

export function sampleUsers() {
  return [
    { uuid: 'u-1', name: 'Demo User', team: 'Alpha', commutePoints: 0 },
    { uuid: 'u-2', name: 'Olga Ivanova', team: 'Alpha', commutePoints: 2 },
    { uuid: 'u-3', name: 'John Smith', team: 'Beta', commutePoints: 5 },
    { uuid: 'u-4', name: 'Maria Lopez', team: 'Beta', commutePoints: 1 },
    { uuid: 'u-5', name: 'Chen Wei', team: 'Gamma', commutePoints: 3 }
  ];
}

const STORAGE_KEY = 'commute_demo_users_v1';

export function saveUsersToStorage(users) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  } catch (e) {
    // ignore
  }
}

export function loadUsersFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}
