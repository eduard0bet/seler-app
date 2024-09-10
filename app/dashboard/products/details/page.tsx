'use client'
import imageCompression from 'browser-image-compression';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Product, Category, Subcategory } from "../types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton"
import { ChevronLeft } from "lucide-react";

const ProductDetail = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const { toast } = useToast();
  const router = useRouter();
  const supabase = createClientComponentClient()

  useEffect(() => {
    console.log('id:', id);
    handleProductDetails();
  }, [id]);
  
  const handleProductDetails = async () => {
    if (!id) {
      console.warn("ID is missing in the URL");
      return;
    }
  
    try {
      // Obtener los detalles del producto
      const { data: productData, error: productError } = await supabase
        .from('products')
        .select('*')
        .eq('id', id);
  
      if (productError) {
        console.error("Failed to fetch product data:", productError);
        return;
      }
  
      // Obtener todas las categorías
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*');
  
      if (categoriesError) {
        console.error("Failed to fetch categories data:", categoriesError);
        return;
      }
  
      setCategories(categoriesData);
  
      // Si el producto tiene una categoría, obtener las subcategorías de esa categoría
      if (productData && productData[0].category_id) {
        const { data: subcategoriesData, error: subcategoriesError } = await supabase
          .from('subcategories')
          .select('*')
          .eq('category_id', productData[0].category_id);
  
        if (subcategoriesError) {
          console.error("Failed to fetch subcategories data:", subcategoriesError);
          return;
        }
  
        setSubcategories(subcategoriesData);
        setProduct(productData[0]);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };
  

  const handleGoBack = () => {
    router.push(`/dashboard/products/`);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpdateProduct = async () => {
    try {
      let imageURL;
  
      if (selectedFile) {
        const options = {
          maxSizeMB: 0.2,
          maxWidthOrHeight: 500,
          useWebWorker: true,
          fileType: 'image/webp',
          alwaysKeepResolution: true,
        };
  
        const compressedFile = await imageCompression(selectedFile, options);
        const fileBuffer = await compressedFile.arrayBuffer();
        const detectedMimeType = compressedFile.type;
        const originalFileName = compressedFile.name;
        const uniqueFileName = `${Date.now()}-${originalFileName}`;
        const storagePath = `images/${uniqueFileName}`;

        const { data: uploadResponse, error: uploadError } =
          await supabase.storage
            .from("seler_images")
            .upload(storagePath, fileBuffer, {
              contentType: detectedMimeType,
              cacheControl: "3600",
            });

        if (uploadError) {
          console.error("Image Upload Error:", uploadError);
          throw new Error("Image Upload Error");
        }

        const { data: publicUrlData } = await supabase.storage
          .from("seler_images")
          .getPublicUrl(storagePath);

        if (!publicUrlData.publicUrl) {
          console.error("Failed to fetch public URL for the image");
          throw new Error("Failed to fetch public URL for the image");
        }

        imageURL = publicUrlData.publicUrl;
      }

      const { error: updateError } = await supabase
        .from("products")
        .update({
          name: product!.name,
          details: product!.details !== "" ? product!.details : null,
          product_sku: product!.product_sku,
          price: product!.price,
          old_price: product!.old_price !== "" ? product!.old_price : null,
          tax_percentage:
            product!.tax_percentage !== "" ? product!.tax_percentage : null,
          out_of_stock: product!.out_of_stock,
          active: product!.active,
          category_id: product!.category_id,
          subcategory_id: product!.subcategory_id,
          thumbnail_path: imageURL,
        })
        .eq("id", id);

      if (updateError) {
        console.error("Update failed:", updateError);
        throw new Error("Update failed");
      }

      toast({
        description: "Producto actualizado correctamente",
      });

      handleProductDetails();
    } catch (error) {
      console.error("Update error:", error);
      toast({
        description: `Error: ${error}`,
        variant: "destructive",
      });
    }
  };
  
  const fetchSubcategories = async (category_id: number) => {
    try {
      const { data: subcategoriesData, error: subcategoriesError } = await supabase
        .from('subcategories')
        .select('*')
        .eq('category_id', category_id);
  
      if (subcategoriesError) {
        console.error("Failed to fetch subcategories data:", subcategoriesError);
        return;
      }
  
      setSubcategories(subcategoriesData);
    } catch (error) {
      console.error("Fetch subcategories error:", error);
    }
  };
  

  if (!product) {
    return (
      <div>
        <Card className="dark:text-white dark:bg-[#292B2D] border-0">
          <CardHeader>
            <CardTitle className="flex justify-between">
              <div className="m-0 p-0">Detalles de producto</div>
              <Button onClick={handleGoBack}>
              <ChevronLeft className="h-4 w-4 mr-2"></ChevronLeft> Regresar
            </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
          <div className="grid grid-cols-3 grid-rows-1 gap-4 max-h-fit">
            <div className="">
          <Skeleton className="h-[500px] w-[500px]" />
          <Skeleton className="h-14 w-84 my-4" />
            </div>
            <div>
          <Skeleton className="h-14 w-84 my-4" />
          <Skeleton className="h-14 w-84 my-4" />
          <Skeleton className="h-24 w-84 my-4" />
          <div className="flex pt-0 mt-0">
          <Skeleton className="h-8 w-36 my-0 " />
          <Skeleton className="h-8 w-36 my-0 mx-2" />
          </div>
            </div>
            <div>
          <Skeleton className="h-14 w-84 my-4" />
          <Skeleton className="h-14 w-84 my-4" />
          <Skeleton className="h-14 w-84 my-4" />
          <Skeleton className="h-14 w-84 my-4" />
          <Skeleton className="h-14 w-84 my-4" />
            </div>
          </div>
          <div className="flex gap-4 justify-end mt-4 pt-2">
            

            <div>
              <Skeleton className="h-12 w-32" />
            </div>
          </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <Card className="dark:text-white dark:bg-[#292B2D] border-0">
        <CardHeader>
          <CardTitle className="flex justify-between">
            <div className="m-0 p-0">Detalles de producto</div>
            <Button onClick={handleGoBack}>
              <ChevronLeft className="h-4 w-4 mr-2"></ChevronLeft> Regresar
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid grid-cols-3 grid-rows-1 gap-4 max-h-fit">
              {/* col 1 */}
              <div>
                <div>
                  <Image
                    className="rounded-sm "
                    src={product.thumbnail_path}
                    alt={product.name}
                    width="500"
                    height="500"
                    priority={true}
                  />
                </div>
                <Label htmlFor="image">
                  <span className="text-rose-700">*</span> Imagen
                </Label>

                <div>
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    required
                  />
                </div>
              </div>
              {/* col 2 */}
              <div className="">
                <div className=" my-2">
                  <Label htmlFor="name">
                    <span className="text-rose-700">*</span> Nombre:
                  </Label>
                  <Input
                    className="dark:bg-[#323335] dark:border-0"
                    type="text"
                    id="name"
                    value={product.name}
                    onChange={(e) =>
                      setProduct({ ...product, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div className=" my-2">
                  <Label htmlFor="product_sku">
                    <span className="text-rose-700">*</span> SKU:
                  </Label>
                  <Input
                    className="dark:bg-[#323335] dark:border-0"
                    type="text"
                    id="product_sku"
                    value={product.product_sku}
                    onChange={(e) =>
                      setProduct({ ...product, product_sku: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="my-2">
                  <Label htmlFor="details">Descripción:</Label>
                  <Textarea
                    className="dark:bg-[#323335] dark:border-0"
                    id="details"
                    value={product.details}
                    onChange={(e) =>
                      setProduct({ ...product, details: e.target.value })
                    }
                  />
                </div>

                <div className="flex gap-4">
                  <div className="items-top flex space-x-2 my-2">
                    <input
                      type="checkbox"
                      id="active"
                      checked={product.active}
                      onChange={(e) =>
                        setProduct({ ...product, active: e.target.checked })
                      }
                    />
                    <label
                      htmlFor="active"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Activo
                    </label>
                  </div>
                  <div className="items-top flex space-x-2 my-2">
                    <input
                      type="checkbox"
                      id="out_stock"
                      checked={product.out_of_stock}
                      onChange={(e) =>
                        setProduct({
                          ...product,
                          out_of_stock: e.target.checked,
                        })
                      }
                    />
                    <label
                      htmlFor="out_stock"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Sin stock
                    </label>
                  </div>
                </div>
              </div>
              {/* col 3 */}
              <div className="">
                <div className="my-2">
                  <Label htmlFor="price">
                    <span className="text-rose-700">*</span> Precio final:
                  </Label>
                  <Input
                    className="dark:bg-[#323335] dark:border-0"
                    type="text"
                    id="price"
                    value={product.price}
                    onChange={(e) =>
                      setProduct({ ...product, price: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="my-2">
                  <Label htmlFor="old_price">Precio original:</Label>
                  <Input
                    className="dark:bg-[#323335] dark:border-0"
                    type="text"
                    id="old_price"
                    value={product.old_price}
                    onChange={(e) =>
                      setProduct({ ...product, old_price: e.target.value })
                    }
                  />
                </div>
                <div className="my-2">
                  <Label htmlFor="tax_percentage">Impuesto:</Label>
                  <Input
                    className="dark:bg-[#323335] dark:border-0"
                    type="text"
                    id="tax_percentage"
                    value={product.tax_percentage}
                    onChange={(e) =>
                      setProduct({ ...product, tax_percentage: e.target.value })
                    }
                  />
                </div>
                <div className="my-2">
                  <Label htmlFor="category_id">
                    <span className="text-rose-700">*</span> Categoría:
                  </Label>
                  <select
                    required
                    className="w-full rounded-md border border-input bg-background p-2.5 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-[#323335] dark:border-0"
                    id="category_id"
                    value={product.category_id}
                    onChange={(e) => {
                      const selectedCategoryId = parseInt(e.target.value, 10);
                      setProduct({
                        ...product,
                        category_id: selectedCategoryId,
                      });
                      // Fetch subcategories based on the selected category_id
                      fetchSubcategories(selectedCategoryId);
                    }}
                  >
                    <option value="">
                      Selecciona una categoría
                    </option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="subcategory_id">Subcategoría:</Label>
                  <select
                    required
                    className="w-full rounded-md border border-input bg-background p-2.5 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-[#323335] dark:border-0"
                    id="subcategory_id"
                    value={product.subcategory_id}
                    onChange={(e) =>
                      setProduct({
                        ...product,
                        subcategory_id: parseInt(e.target.value, 10),
                      })
                    }
                  >
                    <option value="">Selecciona una subcategoría</option>
                    {subcategories.map((subcategory) => (
                      <option key={subcategory.id} value={subcategory.id}>
                        {subcategory.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="flex flex-row-reverse">
              <Button
                size="lg"
                type="button"
                className="dark:bg-[#3B3C3F] dark:text-white dark:hover:bg-[#222527]"
                onClick={handleUpdateProduct}
              >
                Actualizar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </>
  );
};

export default ProductDetail;
