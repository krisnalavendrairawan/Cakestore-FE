export interface Product {
  id: number;
  name: string;
  image: string;
  description: string;
  category_id: number;
  category?: Category;
  discount: number;
  price: number;
  stock: number;
  slug: string;
}


export interface Category {
  id: number;
  name: string;
  slug: string;
}

