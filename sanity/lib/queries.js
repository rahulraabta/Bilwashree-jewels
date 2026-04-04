import { groq } from 'next-sanity'

export const getAllProductsQuery = groq`*[_type == "product"]{
  _id,
  name,
  slug,
  price,
  category,
  material,
  "images": images[].asset->url,
  imageURL,
  inStock
}`

export const getProductBySlugQuery = groq`*[_type == "product" && slug.current == $slug][0]{
  _id,
  name,
  slug,
  price,
  category,
  material,
  "images": images[].asset->url,
  imageURL,
  inStock
}`

export const getAllCategoriesQuery = groq`*[_type == "category"]{
  _id,
  title,
  "slug": slug.current,
  description
}`
