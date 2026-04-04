import {blockContentType} from './blockContentType'
import {categoryType} from './categoryType'
import {productType} from './productType'
import {settingsType} from './settingsType'
import {postType} from './postType'
import {authorType} from './authorType'

export const schema = {
  types: [blockContentType, categoryType, productType, settingsType, postType, authorType],
}
