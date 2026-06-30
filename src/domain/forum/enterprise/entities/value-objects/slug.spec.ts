import { expect, test } from 'vitest'
import { Slug } from './slug'

test('it should be able to create a slug', () => {
  const slug = Slug.createFromText('How to create a slug?')
  expect(slug.value).toBe('how-to-create-a-slug')
})
