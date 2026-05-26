const express = require('express');
const router = express.Router();
const {
  getWorkouts,
  addWorkout,
  updateWorkout,
  deleteWorkout,
  getWorkoutStats,
} = require('../controllers/workoutController');
const authMiddleware = require('../middleware/authMiddleware');

// All workout routes are protected
router.use(authMiddleware);

// GET /api/workouts/stats - must be before /:id route
router.get('/stats', getWorkoutStats);

// CRUD routes
router.route('/').get(getWorkouts).post(addWorkout);
router.route('/:id').put(updateWorkout).delete(deleteWorkout);

module.exports = router;
