'use client'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useEffect, useState } from 'react'
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Check, Eye, Trash2 } from 'lucide-react';

export default function ProductList() {
  const [products, setProducts] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [currentPage, setCurrentPage] = useState<number>(1)
  const itemsPerPage = 12;
  const [isConfirming, setIsConfirming] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClientComponentClient()

  useEffect(() => {
    const getProducts = async () => {
      setIsLoading(true);
      const { data } = await supabase
        .from("products")
        .select()
        .order("updated_at", { ascending: false }); // Ordena por updated_at en orden descendente
  
      if (data) {
        setProducts(data);
      }
      setIsLoading(false);
    };
  
    getProducts();
  }, [supabase, setProducts]);
  

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.product_sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const handleProductDelete = async (productId: string) => {
    console.log("Deleting product with ID:", productId);

    const { error } = await supabase
  .from("products")
  .delete()
  .eq("id", productId);

if (error) {
  console.error("Error deleting product:", error);
  toast({
    description: "No se pudo eliminar el producto",
    variant: "destructive",
  });
} else {
  toast({
    description: "Producto eliminado con éxito",
  });
    }

    const { data, error: reloadError } = await supabase
      .from("products")
      .select();
      console.log("recarga")
    if (reloadError) {
      console.error("Error reloading products:", reloadError);
    } else if (data) {
      setProducts(data);
    }
  };
  
  const handleClick = async (productId: string) => {
    setIsConfirming((prevIsConfirming) => {
      if (prevIsConfirming[productId]) {
        handleProductDelete(productId);
        return { ...prevIsConfirming, [productId]: false };
      } else {
        setTimeout(() => {
          setIsConfirming((prevState) => ({ ...prevState, [productId]: false }));
        }, 3000);
        return { ...prevIsConfirming, [productId]: true };
      }
    });
  };
  
  return (
    <>
    {isLoading ? (
     
     <Card className="dark:text-white dark:bg-[#292B2D] border-0">
     <CardHeader>
       <CardTitle className="flex justify-between text-muted-foreground">
         Productos
         <div className="w-6/12">
         <Input
         className="border  dark:text-white dark:placeholder-[#C5C6C7] dark:border-0 dark:focus:border-2 dark:focus:border-[#C5C6C7] "
         type="text"
         placeholder="Buscar productos por nombre o SKU"
         value={searchTerm}
         onChange={(e) => setSearchTerm(e.target.value)}
         disabled
       />
         </div>
         <Button variant="default" className="mr-0 prl-0" disabled>
           <Link href="/dashboard/products/create">Agregar producto</Link>
         </Button>
       </CardTitle>
     </CardHeader>
     <CardContent>

     <div className="space-y-4">
            <div className="flex justify-between gap-x-2">
              {[...Array(8)].map((_, index) => (
                <Skeleton key={index} className="h-14 w-full will-change-auto " />
              ))}
            </div>
            {[...Array(itemsPerPage)].map((_, index) => (
              <Skeleton key={index} className="h-10 w-full" />
            ))}
          </div>
          <div className="flex flex-row-reverse pt-4">
        <div className="space-x-2">
          <Button
            size="sm"
            variant="default"
    
            disabled
          >
            Anterior
          </Button>
          <Button
            size="sm"
            variant="default"
          
            disabled
          >
            Siguiente
          </Button>
        </div>
      </div>
        </CardContent>
        </Card>


    ) : (
    <Card className="dark:text-white dark:bg-[#292B2D] border-0">
    <CardHeader>
      <CardTitle className="flex justify-between">
        Productos
        <div className="w-6/12">
        <Input
        className="border  dark:text-white dark:placeholder-[#C5C6C7] dark:border-0 dark:focus:border-2 dark:focus:border-[#C5C6C7] "
        type="text"
        placeholder="Buscar productos por nombre o SKU"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
        </div>
        <Button variant="default" className="mr-0 prl-0" >
          <Link href="/dashboard/products/create">Agregar producto</Link>
        </Button>
      </CardTitle>
    </CardHeader>
    <CardContent>
    <Table>
    <TableHeader>
              <TableRow>
                <TableHead>SKU</TableHead>
                <TableHead>Imagen</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Activo</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>P. Original</TableHead>
                <TableHead>P. Final</TableHead>
                <TableHead className='flex justify-center'></TableHead>
              </TableRow>
            </TableHeader>
      <TableBody>
      {currentProducts.map((product) => (
          <TableRow key={product.id}>
            <TableCell className="py-2">{product.product_sku}</TableCell>
            <TableCell className="py-2"><Image
                        className="w-10 rounded-sm"
                        src={product.thumbnail_path}
                        alt={product.name}
                        width="500"
                        height="500"
                        priority={true}
                      /></TableCell>
            <TableCell className="py-2">{product.name}</TableCell>
            <TableCell className="py-2">{product.active ? "Si" : "No"}</TableCell>
            <TableCell className="py-2">{product.out_of_stock ? "No" : "Si"}</TableCell>
            <TableCell className="py-2">${product.old_price}</TableCell>
            <TableCell className="py-2">${product.price}</TableCell>
            <TableCell className="py-2">
            <div className="flex justify-center gap-2">
                        <Link
                          className="none"
                          href={`/dashboard/products/details/?id=${product.id}`}
                        >
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          className=""
                          variant={
                            isConfirming[product.id] ? "destructive" : "outline"
                          }
                          onClick={() => handleClick(product.id)}
                        >
                          {isConfirming[product.id] ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
    <div className="flex flex-row-reverse pt-4">
        <div className="space-x-2">
          <Button
            size="sm"
            variant="default"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Anterior
          </Button>
          <Button
            size="sm"
            variant="default"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={indexOfLastProduct >= filteredProducts.length}
          >
            Siguiente
          </Button>
        </div>
      </div>
    </CardContent>
      </Card>
       )}
    </>
  )
}
