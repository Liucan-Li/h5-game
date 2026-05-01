export interface Game {
  id: string
  slug: string
  title: string
  description: string
  url: string
  thumbnail: string
  category: string
  tags: string[]
  featured: boolean
  width: number
  height: number
  createdAt: string
}

export interface Category {
  id: string
  slug: string
  name: string
  icon: string
  description: string
}
