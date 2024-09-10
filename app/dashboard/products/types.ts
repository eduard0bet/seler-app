export interface Product {
  isConfirmDialogOpen: boolean | undefined;
  id: string;
  sku: string;
  product_sku: string;
  name: string;
  active: boolean;
  out_of_stock: boolean;
  thumbnail_path: string;
  tax_percentage: string;
  image: File | null;
  price: string;
  old_price: string;
  details_link: {
    title: string | null;
    class: string | null;
    target: string | null;
    link_url: string | null;
  };
  details: string;
  options: any[];
  category_id: number;
  subcategory_id: number;
}

export interface Subcategory {
name: string;
id: string;
products: Product[];
description: string;
}

export interface Category {
name: string;
id: string;
description: string;
subcategoryCount: string;
categories: Subcategory[];
subcategories: Subcategory[];
}

export interface Data {
categories: Category[];
}
