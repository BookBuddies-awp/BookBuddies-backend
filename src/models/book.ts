export default class Book {
  constructor(
    public id: string,
    public title: string,
    public authors: string[],
    public publishedDate: string,
    public description: string,
    public categories: string[],
    public pageCount: number,
    public coverImage: string,
    public ratings: number
  ) {}
}
