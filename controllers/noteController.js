const { Note, Tag, UserProfile } = require('../models');
const { Op } = require('sequelize');

exports.createNote = async (req, res) => {
  try {
    const { title, content, background_colour, tag_ids = [] } = req.body;
    if (tag_ids.length > 9) {
      return res.status(400).json({ error: 'Cannot have more than 9 tags' });
    }
    const note = await Note.create({ title, content, background_colour, user_id: req.user.user_id });

    if (tag_ids.length > 0) {
      const tagInstances = await Tag.findAll({
        where: {
          tag_id: {
            [Op.in]: tag_ids
          }
        }
      });
      await note.addTags(tagInstances);
    }

    res.status(201).json("Note created successfully");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUserNotes = async (req, res) => {
  try {
    const notes = await Note.findAll({
      where: {
        user_id: req.user.user_id,
        trashed_at: null,
        archived_at: null
      },
      include: [{
        model: Tag,
        attributes: ['tag_id', 'tag_name']
      }],
      attributes: ['note_id', 'title', 'content', 'background_colour'],
      order: [['createdAt', 'DESC']]
    });
    res.status(200).json(notes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getArchivedNotes = async (req, res) => {
  try {
    const notes = await Note.findAll({
      where: {
        user_id: req.user.user_id,
        archived_at: {
          [Op.ne]: null
        },
        trashed_at: null
      },
      include: [{
        model: Tag,
        attributes: ['tag_id', 'tag_name']
      }],
      attributes: ['note_id', 'title', 'content', 'background_colour', 'archived_at'],
      order: [['archived_at', 'DESC']]
    });
    res.status(200).json(notes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getTrashedNotes = async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const notes = await Note.findAll({
      where: {
        user_id: req.user.user_id,
        trashed_at: {
          [Op.gte]: thirtyDaysAgo
        }
      },
      include: [{
        model: Tag,
        attributes: ['tag_id', 'tag_name']
      }],
      attributes: ['note_id', 'title', 'content', 'background_colour', 'trashed_at'],
      order: [['trashed_at', 'DESC']]
    });
    res.status(200).json(notes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.archiveNote = async (req, res) => {
  try {
    const note = await Note.findByPk(req.params.id);
    if (!note || note.user_id !== req.user.user_id) {
      return res.status(404).json({ error: 'Note not found' });
    } else if (note.archived_at !== null) {
      return res.status(400).json({ error: 'Note already archived' });
    }
    note.archived_at = new Date();
    await note.save();
    res.status(201).json("note archived successfully");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.trashNote = async (req, res) => {
  try {
    const note = await Note.findByPk(req.params.id);
    if (!note || note.user_id !== req.user.user_id) {
      return res.status(404).json({ error: 'Note not found' });
    } else if (note.trashed_at !== null) {
      return res.status(400).json({ error: 'Note already deleted' });
    }
    note.trashed_at = new Date();
    await note.save();
    res.status(201).json("note trashed successfully");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.unArchiveNote = async (req, res) => {
  try {
    const note = await Note.findByPk(req.params.id);
    if (!note || note.user_id !== req.user.user_id) {
      return res.status(404).json({ error: 'Note not found' });
    } else if (note.archived_at === null) {
      return res.status(400).json({ error: 'Note already unarchived' });
    }
    note.archived_at = null;
    await note.save();
    res.status(201).json("note unarchived successfully");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.unTrashNote = async (req, res) => {
  try {
    const note = await Note.findByPk(req.params.id);
    if (!note || note.user_id !== req.user.user_id) {
      return res.status(404).json({ error: 'Note not found' });
    } else if (note.trashed_at === null) {
      return res.status(400).json({ error: 'Note already untrashed' });
    }
    note.trashed_at = null;
    await note.save();
    res.status(201).json("note untrashed successfully");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateNote = async (req, res) => {
  try {
    const { title, content, background_colour, tag_ids} = req.body;
    const note = await Note.findByPk(req.params.note_id);

    if (!note || note.user_id !== req.user.user_id) {
      return res.status(404).json({ error: 'Note not found' });
    }

    note.title = title || note.title;
    note.content = content || note.content;
    note.background_colour = background_colour || note.background_colour;
    note.updatedAt = new Date();
    await note.save();

    if (tag_ids.length > 0) {
      const tagInstances = await Tag.findAll({
        where: {
          tag_id: {
            [Op.in]: tag_ids
          }
        }
      });
      await note.setTags(tagInstances);
    }

    res.status(201).json("Note updated successfully");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.searchNotes = async (req, res) => {
  try {
    const { query } = req.query;

    const notes = await Note.findAll({
      where: {
        user_id: req.user.user_id,
        title: {
          [Op.like]: `%${query}%`
        },
        trashed_at: null,
      },
      include: [{
        model: Tag,
        attributes: ['id', 'tag_name']
      }],
      attributes: ['id', 'title', 'content', 'background_colour', 'createdAt', 'archived_at']
    });

    const archivedNotes = notes
      .filter(note => note.archived_at !== null)
      .sort((a, b) => new Date(b.archived_at) - new Date(a.archived_at));

    const unarchivedNotes = notes
      .filter(note => note.archived_at === null)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.status(200).json({
      archived_notes: archivedNotes,
      unarchived_notes: unarchivedNotes
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.createTag = async (req, res) => {
  try {
    const { tag_name } = req.body;
    if (!tag_name) {
      return res.status(400).json({ error: 'Tag name is required' });
    }

    const existingTag = await Tag.findOne({ where: { tag_name } });
    if (existingTag) {
      return res.status(400).json({ error: 'Tag already exists' });
    }


    const tag = await Tag.create({ tag_name });
    res.status(201).json(tag);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};