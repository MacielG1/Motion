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

    const doc = await context.db.insert('notes', {
      title: args.title,
      userId,
      parentNote: args.parentNote,
      isArchived: false,
      isPublished: false,
    });

    return doc;
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

    const docs = await context.db
      .query('notes')
      .withIndex('by_user_parent', (q) =>
        q.eq('userId', userId).eq('parentNote', args.parentNote)
      )
      .filter((q) => q.eq(q.field('isArchived'), false))
      .order('desc')
      .collect();

    return docs;
  },
});

export const archiveNote = mutation({
  args: { id: v.id('notes') },
  handler: async (context, args) => {
    const id = await context.auth.getUserIdentity();
    if (!id) throw new Error('Not logged in');

    const userId = id.subject;
    const existingDoc = await context.db.get(args.id);

    if (!existingDoc) throw new Error('Document not found');
    if (existingDoc.userId !== userId) throw new Error('Not authorized');

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

    const doc = await context.db.patch(args.id, {
      isArchived: true,
    });

    deleteChildNotes(args.id);

    return doc;
  },
});

export const getArchivedNotes = query({
  handler: async (context) => {
    const id = await context.auth.getUserIdentity();
    if (!id) throw new Error('Not logged in');

    const userId = id.subject;

    const docs = await context.db
      .query('notes')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .filter((q) => q.eq(q.field('isArchived'), true))
      .order('desc')
      .collect();

    return docs;
  },
});

export const restoreNote = mutation({
  args: { id: v.id('notes') },
  handler: async (context, args) => {
    const id = await context.auth.getUserIdentity();
    if (!id) throw new Error('Not logged in');

    const userId = id.subject;

    const existingDoc = await context.db.get(args.id);
    if (!existingDoc) throw new Error('Note not found');
    if (existingDoc.userId !== userId) throw new Error('Not authorized');

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

    if (existingDoc.parentNote) {
      const parent = await context.db.get(existingDoc.parentNote);

      if (parent?.isArchived) {
        options.parentNote = undefined;
      }
    }
    const doc = await context.db.patch(args.id, options);
    restoreChildNotes(args.id);

    return doc;
  },
});

export const deleteNote = mutation({
  args: { id: v.id('notes') },
  handler: async (context, args) => {
    const id = await context.auth.getUserIdentity();

    if (!id) throw new Error('Not logged in');

    const userId = id.subject;

    const existingDoc = await context.db.get(args.id);
    if (!existingDoc) throw new Error('Note not found');
    if (existingDoc.userId !== userId) throw new Error('Not authorized');

    const doc = await context.db.delete(args.id);

    return doc;
  },
});

export const searchNotes = query({
  handler: async (context) => {
    const id = await context.auth.getUserIdentity();
    if (!id) throw new Error('Not logged in');

    const userId = id.subject;

    const docs = await context.db
      .query('notes')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .filter((q) => q.eq(q.field('isArchived'), false))
      .order('desc')
      .collect();

    return docs;
  },
});

export const getNoteById = query({
  args: { noteId: v.id('notes') },
  handler: async (context, args) => {
    const id = await context.auth.getUserIdentity();

    const doc = await context.db.get(args.noteId);
    if (!doc) throw new Error('Note not found');

    if (doc.isPublished && !doc.isArchived) {
      return doc;
    }

    if (!id) throw new Error('Not logged in');

    const userId = id.subject;
    if (doc.userId !== userId) throw new Error('Not authorized');

    return doc;
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
    const existingDoc = await context.db.get(id);

    if (!existingDoc) throw new Error('Note not found');

    if (existingDoc.userId !== userId) throw new Error('Not authorized');

    const doc = await context.db.patch(id, { ...rest });

    return doc;
  },
});

export const removeIcon = mutation({
  args: { id: v.id('notes') },
  handler: async (context, args) => {
    const id = await context.auth.getUserIdentity();
    if (!id) throw new Error('Not logged in');

    const userId = id.subject;

    const existingDoc = await context.db.get(args.id);
    if (!existingDoc) throw new Error('Note not found');

    if (existingDoc.userId !== userId) throw new Error('Not authorized');

    const doc = await context.db.patch(args.id, {
      icon: undefined,
    });

    return doc;
  },
});

export const removeCoverImage = mutation({
  args: { id: v.id('notes') },
  handler: async (context, args) => {
    const id = await context.auth.getUserIdentity();

    if (!id) throw new Error('Not logged in');

    const userId = id.subject;

    const existingDoc = await context.db.get(args.id);
    if (!existingDoc) throw new Error('Note not found');

    if (existingDoc.userId !== userId) throw new Error('Not authorized');

    const doc = await context.db.patch(args.id, {
      coverImage: undefined,
    });

    return doc;
  },
});
