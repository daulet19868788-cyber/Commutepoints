import React from 'react';

// Leaderboard component supports two modes:
// - type === 'individuals' : show users sorted by commutePoints
// - type === 'teams' : aggregate by team and show team totals
//
// Props:
// - users: array of user objects { uuid, name, team, commutePoints }
// - addCommuteFor: function(uuid) to add a point for a user

function Individuals({ users, addCommuteFor }) {
  const sorted = [...users].sort((a,b) => (b.commutePoints||0) - (a.commutePoints||0));
  return (
    <div className="card">
      <h3>Individuals Leaderboard</h3>
      <ol className="leaderboard-list">
        {sorted.map(u => (
          <li key={u.uuid}>
            <div className="row">
              <div>
                <strong>{u.name}</strong>
                <div className="muted small">Team: {u.team}</div>
              </div>
              <div className="right">
                <span className="points">{u.commutePoints||0} pts</span>
                <button className="small" onClick={() => addCommuteFor(u.uuid)}>+1</button>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

function Teams({ users, addCommuteFor }) {
  const map = {};
  users.forEach(u => {
    const t = u.team || 'No team';
    map[t] = map[t] || { team: t, points: 0, members: [] };
    map[t].points += (u.commutePoints||0);
    map[t].members.push(u);
  });
  const list = Object.values(map).sort((a,b) => b.points - a.points);

  return (
    <div className="card">
      <h3>Teams Leaderboard</h3>
      <ol className="leaderboard-list">
        {list.map(t => (
          <li key={t.team}>
            <div className="row">
              <div>
                <strong>{t.team}</strong>
                <div className="muted small">{t.members.length} members</div>
              </div>
              <div className="right">
                <span className="points">{t.points} pts</span>
                {/* quick add to first member of team for demo */}
                <button className="small" onClick={() => addCommuteFor(t.members[0].uuid)}>+1 (to member)</button>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function Leaderboard({ type = 'individuals', users, addCommuteFor }) {
  return type === 'teams' ? <Teams users={users} addCommuteFor={addCommuteFor} /> : <Individuals users={users} addCommuteFor={addCommuteFor} />;
}
