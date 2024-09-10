export interface Order {
  status: any;
  id: any;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  order_date: string;
  total_price: number;
  address: string;
  birth_year: any;
  order_type: number;
  sessionId: string;
  order_items: OrderItem[]; // Add this property to include order items
  totalQuantity: number;
}

export interface OrderData {
  orders: Order[];
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: number;
  tax: number;
  products: Product;
}

export interface Product {
  id: number;
  name: string;
  subcategory_id: number;
  active: boolean;
  out_of_stock: boolean;
  thumbnail_path: string;
  tax_percentage: number;
  price: number;
  old_price: number;
  details_link_title: string | null;
  details_link_class: string | null;
  details_link_target: string | null;
  details_link_link_url: string | null;
  details: string;
  category_id: number;
  image_id: number | null;
  product_sku: string;
  updated_at: string;
}

export interface SelectedProduct {
  productId: number;
  quantity: number;
}

