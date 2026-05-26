import { useState, useEffect } from 'react';
import { getWorkoutStats, getGoals } from '../services/api';
import { FiActivity, FiZap, FiTarget, FiTrendingUp, FiAward } from 'react-icons/fi';

// Exercise type icon/color mapping
const exerciseStyles = {
  Running:  { icon: '🏃', bg: 'rgba(9, 132, 227, 0.15)', color: '#74b9ff' },
  Pushups:  { icon: '💪', bg: 'rgba(225, 112, 85, 0.15)', color: '#e17055' },
  Cycling:  { icon: '🚴', bg: 'rgba(0, 206, 201, 0.15)', color: '#00cec9' },
  Yoga:     { icon: '🧘', bg: 'rgba(253, 121, 168, 0.15)', color: '#fd79a8' },
  Gym:      { icon: '🏋️', bg: 'rgba(108, 92, 231, 0.15)', color: '#a29bfe' },
  Walking:  { icon: '🚶', bg: 'rgba(85, 239, 196, 0.15)', color: '#55efc4' },
};

/**
 * Dashboard Page - Shows fitness overview with stats and recent workouts
 */
const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, goalsRes] = await Promise.all([getWorkoutStats(), getGoals()]);
      setStats(statsRes.data);
      setGoals(goalsRes.data);
    } catch (err) {
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric',
    });
  };

  if (loading) {
    return <div className="loading-spinner"><div className="spinner"></div></div>;
  }

  const activeGoals = goals.filter((g) => !g.isCompleted).length;

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Your fitness overview at a glance</p>
      </div>

      {/* Stat Cards */}
      <div className="stat-grid">
        <div className="stat-card purple">
          <div className="stat-icon"><FiActivity /></div>
          <div className="stat-value">{stats?.totalWorkouts || 0}</div>
          <div className="stat-label">Total Workouts</div>
        </div>

        <div className="stat-card teal">
          <div className="stat-icon"><FiZap /></div>
          <div className="stat-value">{stats?.totalCalories?.toLocaleString() || 0}</div>
          <div className="stat-label">Calories Burned</div>
        </div>

        <div className="stat-card orange">
          <div className="stat-icon"><FiTarget /></div>
          <div className="stat-value">{activeGoals}</div>
          <div className="stat-label">Active Goals</div>
        </div>

        <div className="stat-card pink">
          <div className="stat-icon"><FiTrendingUp /></div>
          <div className="stat-value">{stats?.streak || 0}</div>
          <div className="stat-label">Day Streak 🔥</div>
        </div>

        <div className="stat-card blue">
          <div className="stat-icon"><FiAward /></div>
          <div className="stat-value">{stats?.completedDays || 0}</div>
          <div className="stat-label">Workout Days</div>
        </div>
      </div>

      {/* Recent Workouts */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.1rem', marginBottom: '16px', fontWeight: 600 }}>
          Recent Workouts
        </h2>
        {stats?.recentWorkouts?.length > 0 ? (
          <div className="workout-list">
            {stats.recentWorkouts.map((w) => {
              const style = exerciseStyles[w.exerciseType] || exerciseStyles.Running;
              return (
                <div className="workout-item" key={w._id}>
                  <div
                    className="workout-item-icon"
                    style={{ background: style.bg, color: style.color }}
                  >
                    {style.icon}
                  </div>
                  <div className="workout-item-info">
                    <h4>{w.exerciseType}</h4>
                    <p>{w.duration} min</p>
                  </div>
                  <div className="workout-item-meta">
                    <div className="calories">{w.caloriesBurned} cal</div>
                    <div className="date">{formatDate(w.date)}</div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">🏃</div>
            <h3>No workouts yet</h3>
            <p>Start adding exercises to see them here!</p>
          </div>
        )}
      </div>

      {/* Active Goals Summary */}
      {goals.filter((g) => !g.isCompleted).length > 0 && (
        <div className="card">
          <h2 style={{ fontSize: '1.1rem', marginBottom: '16px', fontWeight: 600 }}>
            Active Goals
          </h2>
          <div className="goals-grid">
            {goals.filter((g) => !g.isCompleted).slice(0, 4).map((goal) => {
              const pct = Math.min(Math.round((goal.progress / goal.target) * 100), 100);
              return (
                <div className="goal-card" key={goal._id}>
                  <div className="goal-header">
                    <span className="goal-type">{goal.goalType}</span>
                    <span className="goal-percentage">{pct}%</span>
                  </div>
                  <div className="progress-bar-container">
                    <div className="progress-bar-fill" style={{ width: `${pct}%` }}></div>
                  </div>
                  <div className="goal-stats">
                    <span>{goal.progress} / {goal.target} {goal.unit}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
