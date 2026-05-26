import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addWorkout } from '../services/api';
import toast from 'react-hot-toast';
import { FiSave } from 'react-icons/fi';

// Calorie estimates per minute for each exercise type
const calorieEstimates = {
  Running: 11,
  Pushups: 7,
  Cycling: 8,
  Yoga: 4,
  Gym: 9,
  Walking: 5,
};

/**
 * Add Exercise Page - Form to log a new workout
 */
const AddExercise = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    exerciseType: '',
    duration: '',
    caloriesBurned: '',
    date: new Date().toISOString().split('T')[0],
    notes: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...formData, [name]: value };

    // Auto-estimate calories when exercise type or duration changes
    if ((name === 'exerciseType' || name === 'duration') && updated.exerciseType && updated.duration) {
      const rate = calorieEstimates[updated.exerciseType] || 5;
      updated.caloriesBurned = Math.round(rate * Number(updated.duration));
    }

    setFormData(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.exerciseType || !formData.duration || !formData.caloriesBurned) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      await addWorkout({
        exerciseType: formData.exerciseType,
        duration: Number(formData.duration),
        caloriesBurned: Number(formData.caloriesBurned),
        date: formData.date,
        notes: formData.notes,
      });
      toast.success('Workout added successfully! 💪');
      navigate('/history');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add workout');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1>Add Exercise</h1>
        <p>Log your daily workout activity</p>
      </div>

      <div className="card" style={{ maxWidth: '640px' }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="exerciseType">Exercise Type *</label>
            <select
              id="exerciseType"
              name="exerciseType"
              className="form-control"
              value={formData.exerciseType}
              onChange={handleChange}
              required
            >
              <option value="">Select an exercise</option>
              <option value="Running">🏃 Running</option>
              <option value="Pushups">💪 Pushups</option>
              <option value="Cycling">🚴 Cycling</option>
              <option value="Yoga">🧘 Yoga</option>
              <option value="Gym">🏋️ Gym</option>
              <option value="Walking">🚶 Walking</option>
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="duration">Duration (minutes) *</label>
              <input
                type="number"
                id="duration"
                name="duration"
                className="form-control"
                placeholder="e.g. 30"
                min="1"
                max="600"
                value={formData.duration}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="caloriesBurned">Calories Burned *</label>
              <input
                type="number"
                id="caloriesBurned"
                name="caloriesBurned"
                className="form-control"
                placeholder="Auto-estimated"
                min="0"
                value={formData.caloriesBurned}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="date">Date</label>
            <input
              type="date"
              id="date"
              name="date"
              className="form-control"
              value={formData.date}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="notes">Notes (optional)</label>
            <input
              type="text"
              id="notes"
              name="notes"
              className="form-control"
              placeholder="How did the workout feel?"
              maxLength={200}
              value={formData.notes}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            id="add-exercise-btn"
          >
            <FiSave />
            {loading ? 'Saving...' : 'Save Workout'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddExercise;
