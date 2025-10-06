import React, { useEffect, useState } from 'react';
import { sampleUsers, saveUsersToStorage, loadUsersFromStorage } from './data/mockUsers';
import Leaderboard from './components/Leaderboard';

function App() {
  const [users, setUsers] = useState(() => loadUsersFromStorage() || sampleUsers());
  const [tab, setTab] = useState('individuals'); // 'individuals' | 'teams'
  const [mockRunning, setMockRunning] = useState(true);

  // persist users to localStorage on change
  useEffect(() => {
    saveUsersToStorage(users);
  }, [users]);

  // Mock Strava: every 20s add a random commute
  useEffect(() => {
    if (!mockRunning) return;
    const id = setInterval(() => {
      setUsers(prev => {
        const copy = JSON.parse(JSON.stringify(prev));
        const idx = Math.floor(Math.random() * copy.length);
        copy[idx].commutePoints = (copy[idx].commutePoints || 0) + 1;
        copy[idx].lastActivity = new Date().toISOString();
        return copy;
      });
    }, 20000);
    return () => clearInterval(id);
  }, [mockRunning]);

  const addCommuteFor = (userUuid) => {
    setUsers(prev => prev.map(u => u.uuid === userUuid ? {...u, commutePoints: (u.commutePoints||0) + 1, lastActivity: new Date().toISOString()} : u));
  };

  const resetAll = () => {
    if (!confirm('Сбросить все очки?')) return;
    setUsers(u => u.map(x => ({...x, commutePoints: 0})));
  };

  const toggleMock = () => setMockRunning(r => !r);

  return (
    <div className="app-wrap">
      <header className="header">
        <h1>Commute Points — Demo</h1>
        <div className="controls">
          <button onClick={() => setTab('individuals')} className={tab==='individuals'? 'active':''}>Individuals</button>
          <button onClick={() => setTab('teams')} className={tab==='teams'? 'active':''}>Teams</button>
          <button onClick={toggleMock}>{mockRunning ? 'Stop Mock Strava' : 'Start Mock Strava'}</button>
          <button onClick={resetAll}>Reset Points</button>
        </div>
      </header>

      <main className="main">
        <section className="left">
          <h2>Logged-in user</h2>
          <LoggedInPanel users={users} addCommuteFor={addCommuteFor} />
        </section>

        <section className="right">
          {tab === 'individuals' ? (
            <Leaderboard type="individuals" users={users} addCommuteFor={addCommuteFor} />
          ) : (
            <Leaderboard type="teams" users={users} addCommuteFor={addCommuteFor} />
          )}
        </section>
      </main>

      <footer className="footer">
        <small>Demo — данные хранятся в localStorage. Mock Strava генерирует поездки каждые 20 секунд.</small>
      </footer>
    </div>
  );
}

function LoggedInPanel({ users, addCommuteFor }) {
  // pick first user as "you" for demo
  const you = users[0];
  return (
    <div className="card">
      <h3>{you.name}</h3>
      <p><strong>Team:</strong> {you.team}</p>
      <p><strong>Points:</strong> {you.commutePoints || 0}</p>
      <button onClick={() => addCommuteFor(you.uuid)}>+ Add Commute</button>
      <p className="muted">Нажми, чтобы добавить 1 балл за поездку.</p>
    </div>
  );
}

export default App;
