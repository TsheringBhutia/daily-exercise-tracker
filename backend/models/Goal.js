const mongoose = require('mongoose');

/**
 * Goal Schema
 * Stores fitness goals for users with progress tracking
 */
const goalSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    goalType: {
      type: String,
      required: [true, 'Goal type is required'],
      enum: {
        values: ['Running', 'Pushups', 'Cycling', 'Yoga', 'Gym', 'Walking', 'Calories', 'Duration'],
        message: '{VALUE} is not a valid goal type',
      },
    },
    target: {
      type: Number,
      required: [true, 'Target value is required'],
      min: [1, 'Target must be at least 1'],
    },
    progress: {
      type: Number,
      default: 0,
      min: [0, 'Progress cannot be negative'],
    },
    unit: {
      type: String,
      default: 'minutes',
      enum: ['minutes', 'calories', 'sessions'],
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    deadline: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient user-based queries
goalSchema.index({ userId: 1, isCompleted: 1 });

module.exports = mongoose.model('Goal', goalSchema);
