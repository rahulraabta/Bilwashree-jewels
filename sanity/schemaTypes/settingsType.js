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
      initialValue: '919999999999',
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
  ],
})
