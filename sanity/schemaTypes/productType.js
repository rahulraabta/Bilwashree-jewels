import {defineField, defineType} from 'sanity'

export const productType = defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'price',
      title: 'Price',
      type: 'number',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          {title: 'Necklace', value: 'necklaces'},
          {title: 'Haram', value: 'harams'},
          {title: 'Earrings', value: 'earrings'},
          {title: 'Pendant / Dollar', value: 'pendants'},
          {title: 'Bangles', value: 'bangles'},
          {title: 'Jadau Kundan', value: 'jadau-kundan'},
          {title: 'Combo Set', value: 'combo-sets'},
          {title: 'Other', value: 'other'},
        ],
      },
    }),
    defineField({
      name: 'material',
      title: 'Material',
      type: 'string',
    }),
    defineField({
      name: 'occasion',
      title: 'Vibe / Occasion',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        list: [
          {title: 'Daily Glow', value: 'daily'},
          {title: 'Evening Spark', value: 'party'},
          {title: 'Festive Aura', value: 'festive'},
          {title: 'Bridal Drama', value: 'bridal'},
          {title: 'Work Chic', value: 'office'},
        ],
      },
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [{type: 'image'}],
    }),
    defineField({
      name: 'imageURL',
      title: 'Image URL (For Migration)',
      type: 'string',
    }),
    defineField({
      name: 'inStock',
      title: 'In Stock',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      initialValue: false,
    }),
  ],
})
