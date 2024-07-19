const express = require('express');
const router = express.Router();
const {
  createTag,
  createNote,
  getUserNotes,
  getArchivedNotes,
  getTrashedNotes,
  searchNotes,
  archiveNote,
  trashNote,
  unArchiveNote,
  unTrashNote,
  updateNote
} = require('../controllers/noteController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, createTag);
router.post('/', authMiddleware, createNote);
router.get('/', authMiddleware, getUserNotes);
router.get('/archived', authMiddleware, getArchivedNotes);
router.get('/trashed', authMiddleware, getTrashedNotes);
router.get('/search', authMiddleware, searchNotes);
router.put('/:id/archive', authMiddleware, archiveNote);
router.put('/:id/trash', authMiddleware, trashNote);
router.put('/:id/unarchive', authMiddleware, unArchiveNote);
router.put('/:id/untrash', authMiddleware, unTrashNote);
router.put('/:id', authMiddleware, updateNote);

module.exports = router;