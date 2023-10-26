import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { Doc, Id } from './_generated/dataModel';

export const createNote = mutation({
  args: {
    title: v.string(),
    parentNote: v.optional(v.id('notes')),
  },
  handler: async (context, args) => {
    const id = await context.auth.getUserIdentity();
    if (!id) throw new Error('Not logged in');

    const userId = id.subject;

    const note = await context.db.insert('notes', {
      title: args.title,
      userId,
      parentNote: args.parentNote,
      isArchived: false,
      isPublished: false,
    });

    return note;
  },
});

// function that gets all child notes
export const getNotes = query({
  args: {
    parentNote: v.optional(v.id('notes')),
  },
  handler: async (context, args) => {
    const id = await context.auth.getUserIdentity();
    if (!id) throw new Error('Not logged in');

    const userId = id.subject;

    const notes = await context.db
      .query('notes')
      .withIndex('by_user_parent', (q) =>
        q.eq('userId', userId).eq('parentNote', args.parentNote)
      )
      .filter((q) => q.eq(q.field('isArchived'), false))
      .order('desc')
      .collect();

    return notes;
  },
});

export const archiveNote = mutation({
  args: { id: v.id('notes') },
  handler: async (context, args) => {
    const id = await context.auth.getUserIdentity();
    if (!id) throw new Error('Not logged in');

    const userId = id.subject;
    const existingNote = await context.db.get(args.id);

    if (!existingNote) throw new Error('Note not found');
    if (existingNote.userId !== userId) throw new Error('Not authorized');

    async function deleteChildNotes(noteId: Id<'notes'>) {
      const children = await context.db
        .query('notes')
        .withIndex('by_user_parent', (q) =>
          q.eq('userId', userId).eq('parentNote', noteId)
        )
        .collect();

      for (const item of children) {
        await context.db.patch(item._id, {
          isArchived: true,
        });
        await deleteChildNotes(item._id);
      }
    }

    const note = await context.db.patch(args.id, {
      isArchived: true,
    });

    deleteChildNotes(args.id);

    return note;
  },
});

export const getArchivedNotes = query({
  handler: async (context) => {
    const id = await context.auth.getUserIdentity();
    if (!id) throw new Error('Not logged in');

    const userId = id.subject;

    const notes = await context.db
      .query('notes')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .filter((q) => q.eq(q.field('isArchived'), true))
      .order('desc')
      .collect();

    return notes;
  },
});

export const restoreNote = mutation({
  args: { id: v.id('notes') },
  handler: async (context, args) => {
    const id = await context.auth.getUserIdentity();
    if (!id) throw new Error('Not logged in');

    const userId = id.subject;

    const existingNote = await context.db.get(args.id);
    if (!existingNote) throw new Error('Note not found');
    if (existingNote.userId !== userId) throw new Error('Not authorized');

    async function restoreChildNotes(noteId: Id<'notes'>) {
      const children = await context.db
        .query('notes')
        .withIndex('by_user_parent', (q) =>
          q.eq('userId', userId).eq('parentNote', noteId)
        )
        .collect();

      for (const item of children) {
        await context.db.patch(item._id, {
          isArchived: false,
        });
        await restoreChildNotes(item._id);
      }
    }

    const options: Partial<Doc<'notes'>> = { isArchived: false };

    if (existingNote.parentNote) {
      const parent = await context.db.get(existingNote.parentNote);

      if (parent?.isArchived) {
        options.parentNote = undefined;
      }
    }
    const note = await context.db.patch(args.id, options);
    restoreChildNotes(args.id);

    return note;
  },
});

export const deleteNote = mutation({
  args: { id: v.id('notes') },
  handler: async (context, args) => {
    const id = await context.auth.getUserIdentity();

    if (!id) throw new Error('Not logged in');

    const userId = id.subject;

    const existingNote = await context.db.get(args.id);
    if (!existingNote) throw new Error('Note not found');
    if (existingNote.userId !== userId) throw new Error('Not authorized');

    const note = await context.db.delete(args.id);

    return note;
  },
});

export const searchNotes = query({
  handler: async (context) => {
    const id = await context.auth.getUserIdentity();
    if (!id) throw new Error('Not logged in');

    const userId = id.subject;

    const notes = await context.db
      .query('notes')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .filter((q) => q.eq(q.field('isArchived'), false))
      .order('desc')
      .collect();

    return notes;
  },
});

export const getNoteById = query({
  args: { noteId: v.id('notes') },
  handler: async (context, args) => {
    const id = await context.auth.getUserIdentity();

    const note = await context.db.get(args.noteId);
    if (!note) throw new Error('Note not found');

    if (note.isPublished && !note.isArchived) {
      return note;
    }

    if (!id) throw new Error('Not logged in');

    const userId = id.subject;
    if (note.userId !== userId) throw new Error('Not authorized');

    return note;
  },
});

export const updateNote = mutation({
  args: {
    id: v.id('notes'),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    coverImage: v.optional(v.string()),
    icon: v.optional(v.string()),
    isPublished: v.optional(v.boolean()),
  },
  handler: async (context, args) => {
    const ID = await context.auth.getUserIdentity();
    if (!ID) throw new Error('Not logged in');

    const userId = ID.subject;

    const { id, ...rest } = args;
    const existingNote = await context.db.get(id);

    if (!existingNote) throw new Error('Note not found');

    if (existingNote.userId !== userId) throw new Error('Not authorized');

    const note = await context.db.patch(id, { ...rest });

    return note;
  },
});

export const removeIcon = mutation({
  args: { id: v.id('notes') },
  handler: async (context, args) => {
    const id = await context.auth.getUserIdentity();
    if (!id) throw new Error('Not logged in');

    const userId = id.subject;

    const existingNote = await context.db.get(args.id);
    if (!existingNote) throw new Error('Note not found');

    if (existingNote.userId !== userId) throw new Error('Not authorized');

    const note = await context.db.patch(args.id, {
      icon: undefined,
    });

    return note;
  },
});

export const removeCoverImage = mutation({
  args: { id: v.id('notes') },
  handler: async (context, args) => {
    const id = await context.auth.getUserIdentity();

    if (!id) throw new Error('Not logged in');

    const userId = id.subject;

    const existingNote = await context.db.get(args.id);
    if (!existingNote) throw new Error('Note not found');

    if (existingNote.userId !== userId) throw new Error('Not authorized');

    const note = await context.db.patch(args.id, {
      coverImage: undefined,
    });

    return note;
  },
});
