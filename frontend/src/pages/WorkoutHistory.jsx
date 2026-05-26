import { useState, useEffect } from 'react';
import { getWorkouts, deleteWorkout, updateWorkout } from '../services/api';
import toast from 'react-hot-toast';
import { FiTrash2, FiEdit2, FiX, FiCheck } from 'react-icons/fi';

const badgeClass = {
  Running: 'badge-running', Pushups: 'badge-pushups', Cycling: 'badge-cycling',
  Yoga: 'badge-yoga', Gym: 'badge-gym', Walking: 'badge-walking',
};

/**
 * Workout History Page - View, edit, and delete workout entries
 */
const WorkoutHistory = () => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});

  useEffect(() => { fetchWorkouts(); }, []);

  const fetchWorkouts = async () => {
    try {
      const { data } = await getWorkouts();
      setWorkouts(data);
    } catch (err) {
      toast.error('Failed to load workouts');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this workout?')) return;
    try {
      await deleteWorkout(id);
      setWorkouts((prev) => prev.filter((w) => w._id !== id));
      toast.success('Workout deleted');
    } catch {
      toast.error('Failed to delete');
    }
  };

  const startEdit = (w) => {
    setEditId(w._id);
    setEditData({
      exerciseType: w.exerciseType,
      duration: w.duration,
      caloriesBurned: w.caloriesBurned,
    });
  };

  const handleEditSave = async () => {
    try {
      const { data } = await updateWorkout(editId, editData);
      setWorkouts((prev) => prev.map((w) => (w._id === editId ? data : w)));
      setEditId(null);
      toast.success('Workout updated');
    } catch {
      toast.error('Failed to update');
    }
  };

  const formatDate = (d) =>
    new Date(d).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
    });

  if (loading) {
    return <div className="loading-spinner"><div className="spinner"></div></div>;
  }

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1>Workout History</h1>
        <p>All your logged exercises ({workouts.length} total)</p>
      </div>

      {workouts.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h3>No workouts logged yet</h3>
            <p>Head to "Add Exercise" to log your first workout!</p>
          </div>
        </div>
      ) : (
        <div className="table-container card" style={{ padding: 0 }}>
          <table>
            <thead>
              <tr>
                <th>Exercise</th>
                <th>Duration</th>
                <th>Calories</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {workouts.map((w) => (
                <tr key={w._id}>
                  <td>
                    {editId === w._id ? (
                      <select
                        className="form-control"
                        value={editData.exerciseType}
                        onChange={(e) => setEditData({ ...editData, exerciseType: e.target.value })}
                        style={{ padding: '6px 10px', fontSize: '0.8rem' }}
                      >
                        {['Running','Pushups','Cycling','Yoga','Gym','Walking'].map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    ) : (
                      <span className={`badge ${badgeClass[w.exerciseType] || ''}`}>
                        {w.exerciseType}
                      </span>
                    )}
                  </td>
                  <td>
                    {editId === w._id ? (
                      <input
                        type="number"
                        className="form-control"
                        value={editData.duration}
                        onChange={(e) => setEditData({ ...editData, duration: e.target.value })}
                        style={{ width: '80px', padding: '6px 10px', fontSize: '0.8rem' }}
                      />
                    ) : (
                      `${w.duration} min`
                    )}
                  </td>
                  <td>
                    {editId === w._id ? (
                      <input
                        type="number"
                        className="form-control"
                        value={editData.caloriesBurned}
                        onChange={(e) => setEditData({ ...editData, caloriesBurned: e.target.value })}
                        style={{ width: '80px', padding: '6px 10px', fontSize: '0.8rem' }}
                      />
                    ) : (
                      `${w.caloriesBurned} cal`
                    )}
                  </td>
                  <td>{formatDate(w.date)}</td>
                  <td>
                    {editId === w._id ? (
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button className="btn btn-sm btn-success" onClick={handleEditSave} title="Save">
                          <FiCheck />
                        </button>
                        <button className="btn btn-sm btn-ghost" onClick={() => setEditId(null)} title="Cancel">
                          <FiX />
                        </button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button className="btn btn-sm btn-ghost" onClick={() => startEdit(w)} title="Edit">
                          <FiEdit2 />
                        </button>
                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(w._id)} title="Delete">
                          <FiTrash2 />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default WorkoutHistory;
