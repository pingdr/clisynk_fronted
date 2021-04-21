export interface Tag {
  _id: string;
  description: string;
  name: string;
  tagCategoryId: TagCategoryId;
  tagId: number;
}

interface TagCategoryId {
  _id: string;
  name: string;
}