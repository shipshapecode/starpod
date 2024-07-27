import { defineDb, defineTable, column } from 'astro:db';

const Episode = defineTable({
  columns: {
    episodeSlug: column.text({ primaryKey: true })
  }
});

const HostOrGuest = defineTable({
  columns: {
    episodeSlug: column.text({
      references: () => Episode.columns.episodeSlug
    }),
    isHost: column.boolean(),
    personId: column.text({ references: () => Person.columns.id })
  }
});

const Person = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    img: column.text({ optional: true }),
    name: column.text()
  }
});

export default defineDb({
  tables: { Episode, HostOrGuest, Person }
});
