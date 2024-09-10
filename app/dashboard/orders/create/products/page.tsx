"use client";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table";
import {  Select, SelectContent,  SelectGroup, SelectItem,  SelectTrigger, SelectValue, SelectLabel } from "@/components/ui/select";

export default function ProductsOrderComponent({ customerId }: { customerId: any }) {
  const [products, setProducts] = useState<any[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [orderDetails, setOrderDetails] = useState<OrderItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [searchTerm, setSearchTerm] = useState<string>("")
  const filteredProducts = products.filter((product) =>
  product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  interface OrderItem {
    product_id: string;
    quantity: number;
    name: string;
    product_sku: string;
    price: number;
    tax_percentage: number;
    thumbnail_path: string;
  }
  const supabase = createClientComponentClient();

  useEffect(() => {
    const getProducts = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("id, name, price, tax_percentage, product_sku, thumbnail_path");
      if (data) {
        setProducts(data);
      }
    };

    getProducts();
  }, [supabase]);

  const fetchProductDetails = async () => {
    if (selectedProduct) {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", selectedProduct);
      if (data && data.length > 0) {
        const productDetails = data[0];
        const orderItem = {
          product_id: productDetails.id,
          name: productDetails.name,
          product_sku: productDetails.product_sku,
          price: productDetails.price,
          tax_percentage: productDetails.tax_percentage,
          quantity,
          thumbnail_path: productDetails.thumbnail_path,
        };
  
        // console.log("Fetched product details:", orderItem);
  
        setOrderDetails([...orderDetails, orderItem]);
        setSelectedProduct("");
        setQuantity(1);
      }
    }
  };
  
  const handleAddToOrder = () => {
    fetchProductDetails();
  };



  const calculateTotalPrice = (orderItem: OrderItem) => {
    const itemPrice = orderItem.price;
    const taxPercentage = orderItem.tax_percentage;
    const quantity = orderItem.quantity;
    const taxAmount = (itemPrice * taxPercentage) / 100;
    const totalPrice = (itemPrice + taxAmount) * quantity;
    return totalPrice;
  };
  
  const calculateTotalOrderPrice = () => {
    let totalOrderPrice = 0;
    for (const orderItem of orderDetails) {
      const itemTotal = calculateTotalPrice(orderItem);
      totalOrderPrice += itemTotal;
    }
    return totalOrderPrice.toFixed(2);
  };

  const calculateTotalQuantity = () => {
    let totalQuantity = 0;
    for (const orderItem of orderDetails) {
      totalQuantity += orderItem.quantity;
    }
    return totalQuantity;
  };

  const calculateSumPrice = () => {
    let totalPrice = 0;
    for (const orderItem of orderDetails) {
      totalPrice += orderItem.price * orderItem.quantity;
    }
    return totalPrice;
  };

  const calculateTotalTax = () => {
    let totalTax = 0;
    for (const orderItem of orderDetails) {
      const itemPrice = orderItem.price;
      const taxPercentage = orderItem.tax_percentage;
      const quantity = orderItem.quantity;
      const taxAmount = (itemPrice * taxPercentage * quantity) / 100;
      totalTax += taxAmount;
    }
    return totalTax;
  };
  
  return (
    <div className="">
      <div className="flex gap-2">
        <div className="w-2/3">
        <Select value={selectedProduct} onValueChange={(value) => setSelectedProduct(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Elige un producto" />
            </SelectTrigger>
            <SelectContent>
            <Input
          type="text"
          placeholder="Buscar productos"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
              <ScrollArea className="h-72">
                <SelectGroup>
                {filteredProducts.map((product) => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.name} | ${product.price}
                  </SelectItem>
                ))}
                </SelectGroup>
              </ScrollArea>
            </SelectContent>
          </Select>
        </div>
        <div className="w-1/4">
          <Input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
          />
        </div>
        <div className="w-1/6">
          <Button onClick={handleAddToOrder} className="w-full">
            Agregar
          </Button>
        </div>
      </div>
      <div className="my-4">
        <Table>
          <TableHeader>
            <TableRow className="light:bg-gray-100">
              <TableHead>ID</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Imagen</TableHead>
              <TableHead>Nombre Producto</TableHead>
              <TableHead className="text-right">Precio</TableHead>
              <TableHead className="text-right">Impuesto</TableHead>
              <TableHead className="text-right">Cantidad</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orderDetails.map((orderItem, index) => (
              <TableRow key={index}>
                <TableCell className="py-1">{orderItem.product_id}</TableCell>
                <TableCell className="py-1">{orderItem.product_sku}</TableCell>
                <TableCell className="py-1"><Image
                        className="w-8 rounded-sm"
                        src={orderItem.thumbnail_path}
                        alt={orderItem.name}
                        width="500"
                        height="500"
                        priority={true}
                      /></TableCell>
                <TableCell className="py-1">{orderItem.name}</TableCell>
                <TableCell className="text-right py-1">${orderItem.price}</TableCell>
                <TableCell className="text-right py-1">{orderItem.tax_percentage}%</TableCell>
                <TableCell className="text-right py-1">{orderItem.quantity}</TableCell>
                <TableCell className="text-right py-1">${calculateTotalPrice(orderItem).toFixed(2)}  </TableCell>
              </TableRow>
            ))}
            <TableRow className="light:bg-gray-100 ">
              <TableCell className=""></TableCell>
              <TableCell className=""></TableCell>
              <TableCell className=""></TableCell>
              <TableCell className=""></TableCell>
              <TableCell className="text-xl font-bold text-right py-2">${calculateSumPrice().toFixed(2)}</TableCell>
              <TableCell className="text-xl font-bold text-right py-2">${calculateTotalTax().toFixed(2)}</TableCell>
              <TableCell className="text-xl font-bold text-right py-2">{calculateTotalQuantity()}</TableCell>
              <TableCell className="text-xl font-bold text-right py-2">${calculateTotalOrderPrice()}</TableCell>

            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
