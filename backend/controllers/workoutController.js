const Workout = require('../models/Workout');

/**
 * @desc    Get all workouts for the logged-in user
 * @route   GET /api/workouts
 * @access  Private
 */
const getWorkouts = async (req, res) => {
  try {
    const workouts = await Workout.find({ userId: req.user._id }).sort({ date: -1 });
    res.json(workouts);
  } catch (error) {
    console.error('Get workouts error:', error.message);
    res.status(500).json({ message: 'Error fetching workouts', error: error.message });
  }
};

/**
 * @desc    Add a new workout entry
 * @route   POST /api/workouts
 * @access  Private
 */
const addWorkout = async (req, res) => {
  try {
    const { exerciseType, duration, caloriesBurned, date, notes } = req.body;

    // Validate required fields
    if (!exerciseType || !duration || caloriesBurned === undefined) {
      return res.status(400).json({ message: 'Please provide exercise type, duration, and calories burned' });
    }

    const workout = await Workout.create({
      userId: req.user._id,
      exerciseType,
      duration,
      caloriesBurned,
      date: date || Date.now(),
      notes,
    });

    res.status(201).json(workout);
  } catch (error) {
    console.error('Add workout error:', error.message);
    res.status(500).json({ message: 'Error adding workout', error: error.message });
  }
};

/**
 * @desc    Update a workout entry
 * @route   PUT /api/workouts/:id
 * @access  Private
 */
const updateWorkout = async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);

    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }

    // Ensure user owns this workout
    if (workout.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this workout' });
    }

    const updatedWorkout = await Workout.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedWorkout);
  } catch (error) {
    console.error('Update workout error:', error.message);
    res.status(500).json({ message: 'Error updating workout', error: error.message });
  }
};

/**
 * @desc    Delete a workout entry
 * @route   DELETE /api/workouts/:id
 * @access  Private
 */
const deleteWorkout = async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);

    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }

    // Ensure user owns this workout
    if (workout.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this workout' });
    }

    await Workout.findByIdAndDelete(req.params.id);
    res.json({ message: 'Workout deleted successfully', id: req.params.id });
  } catch (error) {
    console.error('Delete workout error:', error.message);
    res.status(500).json({ message: 'Error deleting workout', error: error.message });
  }
};

/**
 * @desc    Get workout statistics for dashboard
 * @route   GET /api/workouts/stats
 * @access  Private
 */
const getWorkoutStats = async (req, res) => {
  try {
    const userId = req.user._id;

    // Total workouts
    const totalWorkouts = await Workout.countDocuments({ userId });

    // Total calories burned
    const caloriesResult = await Workout.aggregate([
      { $match: { userId: userId } },
      { $group: { _id: null, totalCalories: { $sum: '$caloriesBurned' } } },
    ]);
    const totalCalories = caloriesResult.length > 0 ? caloriesResult[0].totalCalories : 0;

    // Calculate streak (consecutive days with workouts)
    const workouts = await Workout.find({ userId }).sort({ date: -1 }).select('date');
    let streak = 0;
    if (workouts.length > 0) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      let checkDate = new Date(today);
      // Check if there's a workout today or yesterday to start the streak
      const latestWorkout = new Date(workouts[0].date);
      latestWorkout.setHours(0, 0, 0, 0);

      const diffDays = Math.floor((today - latestWorkout) / (1000 * 60 * 60 * 24));
      if (diffDays > 1) {
        streak = 0;
      } else {
        // Count consecutive days backwards
        const workoutDates = new Set(
          workouts.map((w) => {
            const d = new Date(w.date);
            d.setHours(0, 0, 0, 0);
            return d.getTime();
          })
        );

        checkDate = new Date(latestWorkout);
        while (workoutDates.has(checkDate.getTime())) {
          streak++;
          checkDate.setDate(checkDate.getDate() - 1);
        }
      }
    }

    // Recent workouts (last 5)
    const recentWorkouts = await Workout.find({ userId }).sort({ date: -1 }).limit(5);

    // Completed workout days (unique days)
    const uniqueDays = await Workout.aggregate([
      { $match: { userId: userId } },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$date' },
          },
        },
      },
    ]);

    res.json({
      totalWorkouts,
      totalCalories,
      streak,
      completedDays: uniqueDays.length,
      recentWorkouts,
    });
  } catch (error) {
    console.error('Get stats error:', error.message);
    res.status(500).json({ message: 'Error fetching statistics', error: error.message });
  }
};

module.exports = { getWorkouts, addWorkout, updateWorkout, deleteWorkout, getWorkoutStats };
