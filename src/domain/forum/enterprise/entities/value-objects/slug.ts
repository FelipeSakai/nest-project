export class Slug {
  public value: string

  constructor(values: string) {
    this.value = values
  }

  static create(slug: string) {
    return new Slug(slug)
  }
  /**
   * Receives a string and normalizes it to create a slug.
   *
   * Example, "How to create a slug?" would become "how-to-create-a-slug".
   *
   * @param text {string}
   */

  static createFromText(text: string) {
    const slugText = text
      .normalize('NFD')
      .toLocaleLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')

    return new Slug(slugText)
  }
}
