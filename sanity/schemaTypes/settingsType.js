import {CogIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const settingsType = defineType({
  name: 'settings',
  title: 'Site Settings',
  type: 'document',
  icon: CogIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Site Title',
      type: 'string',
      initialValue: 'Bilwashree Jewels',
    }),
    defineField({
      name: 'description',
      title: 'Site Description',
      type: 'text',
      description: 'Used for SEO and Footer',
    }),
    defineField({
      name: 'contactPhone',
      title: 'Contact Phone (WhatsApp)',
      type: 'string',
      initialValue: '919986237677',
    }),
    defineField({
      name: 'contactEmail',
      title: 'Contact Email',
      type: 'string',
      initialValue: 'demo@bilwashree.com',
    }),
    defineField({
      name: 'heroTitle',
      title: 'Hero Banner Title',
      type: 'string',
      initialValue: 'Fine Jewellery with Timeless Impact',
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'Hero Banner Subtitle',
      type: 'text',
      initialValue: 'Let the craftsmanship speak first - elegant pieces designed to elevate every celebration.',
    }),
    defineField({
      name: 'testimonials',
      title: 'Customer Testimonials',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {name: 'name', type: 'string', title: 'Customer Name'},
            {name: 'location', type: 'string', title: 'Location'},
            {name: 'initial', type: 'string', title: 'Avatar Initial'},
            {name: 'text', type: 'text', title: 'Testimonial Text'},
            {name: 'stars', type: 'number', title: 'Stars', initialValue: 5},
          ],
        },
      ],
    }),
    defineField({
      name: 'values',
      title: 'Our Values',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {name: 'name', type: 'string', title: 'Value Title'},
            {name: 'icon', type: 'string', title: 'Icon (Emoji)'},
            {name: 'desc', type: 'text', title: 'Description'},
          ],
        },
      ],
    }),
    defineField({
      name: 'processSteps',
      title: 'Our Process Steps',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {name: 'num', type: 'string', title: 'Step Number (e.g. 01)'},
            {name: 'name', type: 'string', title: 'Step Title'},
            {name: 'icon', type: 'string', title: 'Icon'},
            {name: 'desc', type: 'text', title: 'Description'},
          ],
        },
      ],
    }),
    defineField({
      name: 'careInstructions',
      title: 'Jewellery Care Instructions',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {name: 'title', type: 'string', title: 'Instruction Title'},
            {name: 'icon', type: 'string', title: 'Icon'},
            {name: 'desc', type: 'text', title: 'Description'},
          ],
        },
      ],
    }),
  ],
})
