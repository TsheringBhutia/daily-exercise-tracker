const express = require('express');
const router = express.Router();
const { getGoals, addGoal, updateGoal, deleteGoal } = require('../controllers/goalController');
const authMiddleware = require('../middleware/authMiddleware');

// All goal routes are protected
router.use(authMiddleware);

router.route('/').get(getGoals).post(addGoal);
router.route('/:id').put(updateGoal).delete(deleteGoal);

module.exports = router;
