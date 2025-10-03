const express = require('express');
const router = express.Router();
const {
  getProjects,
  saveProject,
  updateProject,
  deleteProject,
} = require('../CONTROLLERS/projectController');
const { protect } = require('../middleware/authMiddleware');

// All these routes are protected
router.route('/').get(protect, getProjects).post(protect, saveProject);
router
  .route('/:id')
  .put(protect, updateProject)
  .delete(protect, deleteProject);

module.exports = router;
