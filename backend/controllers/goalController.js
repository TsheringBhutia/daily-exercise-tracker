const Goal = require('../models/Goal');

/**
 * @desc    Get all goals for the logged-in user
 * @route   GET /api/goals
 * @access  Private
 */
const getGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(goals);
  } catch (error) {
    console.error('Get goals error:', error.message);
    res.status(500).json({ message: 'Error fetching goals', error: error.message });
  }
};

/**
 * @desc    Create a new goal
 * @route   POST /api/goals
 * @access  Private
 */
const addGoal = async (req, res) => {
  try {
    const { goalType, target, unit, deadline } = req.body;

    // Validate required fields
    if (!goalType || !target) {
      return res.status(400).json({ message: 'Please provide goal type and target' });
    }

    const goal = await Goal.create({
      userId: req.user._id,
      goalType,
      target,
      unit: unit || 'minutes',
      deadline,
    });

    res.status(201).json(goal);
  } catch (error) {
    console.error('Add goal error:', error.message);
    res.status(500).json({ message: 'Error creating goal', error: error.message });
  }
};

/**
 * @desc    Update goal progress
 * @route   PUT /api/goals/:id
 * @access  Private
 */
const updateGoal = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);

    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    // Ensure user owns this goal
    if (goal.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this goal' });
    }

    const { progress, target, goalType, unit, deadline } = req.body;

    // Update fields
    if (progress !== undefined) goal.progress = progress;
    if (target !== undefined) goal.target = target;
    if (goalType) goal.goalType = goalType;
    if (unit) goal.unit = unit;
    if (deadline) goal.deadline = deadline;

    // Check if goal is completed
    if (goal.progress >= goal.target) {
      goal.isCompleted = true;
    }

    const updatedGoal = await goal.save();
    res.json(updatedGoal);
  } catch (error) {
    console.error('Update goal error:', error.message);
    res.status(500).json({ message: 'Error updating goal', error: error.message });
  }
};

/**
 * @desc    Delete a goal
 * @route   DELETE /api/goals/:id
 * @access  Private
 */
const deleteGoal = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);

    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    // Ensure user owns this goal
    if (goal.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this goal' });
    }

    await Goal.findByIdAndDelete(req.params.id);
    res.json({ message: 'Goal deleted successfully', id: req.params.id });
  } catch (error) {
    console.error('Delete goal error:', error.message);
    res.status(500).json({ message: 'Error deleting goal', error: error.message });
  }
};

module.exports = { getGoals, addGoal, updateGoal, deleteGoal };
