// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure = (S) =>
  S.list()
    .title('Store Management')
    .items([
      // Singleton: Site Settings
      S.listItem()
        .title('Global Site Settings')
        .id('settings')
        .child(
          S.document()
            .schemaType('settings')
            .documentId('settings')
        ),
      S.divider(),

      // Core Shop Content
      S.documentTypeListItem('product').title('Jewellery Products'),
      S.documentTypeListItem('category').title('Product Categories'),

      S.divider(),

      // Other Content (Defaults if needed)
      ...S.documentTypeListItems().filter(
        (item) => item.getId() && !['product', 'category', 'settings', 'post', 'author', 'blockContent'].includes(item.getId()),
      ),
    ])
