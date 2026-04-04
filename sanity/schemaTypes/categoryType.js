import {TagIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const categoryType = defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  icon: TagIcon,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
    }),
    defineField({
      name: 'icon',
      title: 'Icon (Emoji or SVG path)',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {
        source: 'title',
      },
    }),
    defineField({
      name: 'searchAliases',
      title: 'Search Aliases',
      type: 'array',
      of: [{type: 'string'}],
      description: 'Keywords that will trigger this category in search (e.g., "chain", "dollar", "jhumka")',
    }),
    defineField({
      name: 'description',
      type: 'text',
    }),
  ],
})
