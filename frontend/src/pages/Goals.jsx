import { useState, useEffect } from 'react';
import { getGoals, addGoal, updateGoal, deleteGoal } from '../services/api';
import toast from 'react-hot-toast';
import { FiPlus, FiTrash2, FiTrendingUp } from 'react-icons/fi';

/**
 * Goals Page - Set, track, and manage fitness goals
 */
const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    goalType: '', target: '', unit: 'minutes',
  });

  useEffect(() => { fetchGoals(); }, []);

  const fetchGoals = async () => {
    try {
      const { data } = await getGoals();
      setGoals(data);
    } catch {
      toast.error('Failed to load goals');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.goalType || !formData.target) {
      toast.error('Please fill in all fields');
      return;
    }
    try {
      const { data } = await addGoal({
        goalType: formData.goalType,
        target: Number(formData.target),
        unit: formData.unit,
      });
      setGoals([data, ...goals]);
      setFormData({ goalType: '', target: '', unit: 'minutes' });
      setShowForm(false);
      toast.success('Goal created! 🎯');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create goal');
    }
  };

  const handleProgressUpdate = async (goal, increment) => {
    const newProgress = Math.max(0, goal.progress + increment);
    try {
      const { data } = await updateGoal(goal._id, { progress: newProgress });
      setGoals((prev) => prev.map((g) => (g._id === goal._id ? data : g)));
      if (data.isCompleted) toast.success('🎉 Goal completed! Great job!');
    } catch {
      toast.error('Failed to update progress');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this goal?')) return;
    try {
      await deleteGoal(id);
      setGoals((prev) => prev.filter((g) => g._id !== id));
      toast.success('Goal deleted');
    } catch {
      toast.error('Failed to delete goal');
    }
  };

  if (loading) {
    return <div className="loading-spinner"><div className="spinner"></div></div>;
  }

  const activeGoals = goals.filter((g) => !g.isCompleted);
  const completedGoals = goals.filter((g) => g.isCompleted);

  return (
    <div className="fade-in">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1>Goals</h1>
          <p>Set targets and track your progress</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)} id="add-goal-btn">
          <FiPlus /> New Goal
        </button>
      </div>

      {/* Add Goal Form */}
      {showForm && (
        <div className="card" style={{ marginBottom: '24px', maxWidth: '640px' }}>
          <h2 style={{ fontSize: '1.1rem', marginBottom: '16px' }}>Create New Goal</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="goalType">Goal Type</label>
                <select
                  id="goalType"
                  className="form-control"
                  value={formData.goalType}
                  onChange={(e) => setFormData({ ...formData, goalType: e.target.value })}
                >
                  <option value="">Select type</option>
                  {['Running','Pushups','Cycling','Yoga','Gym','Walking','Calories','Duration'].map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="target">Target</label>
                <input
                  type="number"
                  id="target"
                  className="form-control"
                  placeholder="e.g. 100"
                  min="1"
                  value={formData.target}
                  onChange={(e) => setFormData({ ...formData, target: e.target.value })}
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="unit">Unit</label>
              <select
                id="unit"
                className="form-control"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              >
                <option value="minutes">Minutes</option>
                <option value="calories">Calories</option>
                <option value="sessions">Sessions</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button type="submit" className="btn btn-primary" id="save-goal-btn">Save Goal</button>
              <button type="button" className="btn btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Active Goals */}
      {activeGoals.length > 0 && (
        <>
          <h2 style={{ fontSize: '1rem', marginBottom: '16px', color: 'var(--text-secondary)' }}>
            Active Goals ({activeGoals.length})
          </h2>
          <div className="goals-grid" style={{ marginBottom: '32px' }}>
            {activeGoals.map((goal) => {
              const pct = Math.min(Math.round((goal.progress / goal.target) * 100), 100);
              return (
                <div className="goal-card" key={goal._id}>
                  <div className="goal-header">
                    <span className="goal-type">🎯 {goal.goalType}</span>
                    <span className="goal-percentage">{pct}%</span>
                  </div>
                  <div className="progress-bar-container">
                    <div className="progress-bar-fill" style={{ width: `${pct}%` }}></div>
                  </div>
                  <div className="goal-stats">
                    <span>{goal.progress} / {goal.target} {goal.unit}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '6px', marginTop: '12px' }}>
                    <button
                      className="btn btn-sm btn-ghost"
                      onClick={() => handleProgressUpdate(goal, goal.unit === 'sessions' ? 1 : 10)}
                      title="Add progress"
                    >
                      <FiTrendingUp /> +{goal.unit === 'sessions' ? 1 : 10}
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(goal._id)}
                      title="Delete goal"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Completed Goals */}
      {completedGoals.length > 0 && (
        <>
          <h2 style={{ fontSize: '1rem', marginBottom: '16px', color: 'var(--text-secondary)' }}>
            ✅ Completed ({completedGoals.length})
          </h2>
          <div className="goals-grid">
            {completedGoals.map((goal) => (
              <div className="goal-card" key={goal._id} style={{ opacity: 0.7 }}>
                <div className="goal-header">
                  <span className="goal-type">🎯 {goal.goalType}</span>
                  <span className="goal-percentage" style={{ color: 'var(--success)' }}>100%</span>
                </div>
                <div className="progress-bar-container">
                  <div className="progress-bar-fill" style={{ width: '100%' }}></div>
                </div>
                <div className="goal-stats">
                  <span>{goal.target} / {goal.target} {goal.unit}</span>
                </div>
                <div style={{ marginTop: '12px' }}>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(goal._id)}>
                    <FiTrash2 /> Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {goals.length === 0 && !showForm && (
        <div className="card">
          <div className="empty-state">
            <div className="empty-icon">🎯</div>
            <h3>No goals set yet</h3>
            <p>Click "New Goal" to set your first fitness target!</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Goals;
