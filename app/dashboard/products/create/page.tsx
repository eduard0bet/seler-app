// Importa los módulos necesarios y los estilos
'use client'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import imageCompression from 'browser-image-compression';
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Category, Subcategory } from "../../products/types";
import { Label } from "@/components/ui/label";
import { ChevronLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";

function ProductCreate() {
  const supabase = createClientComponentClient()
  const { toast } = useToast();

  const [product, setProduct] = useState({
    id: "",
    name: "",
    details: "",
    product_sku: "",
    price: "",
    old_price: "",
    category_id: "",
    subcategory_id: "",
    out_of_stock: false,
    tax_percentage: "",
    active: true,
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*');
  
      if (error) {
        console.error("Error fetching categories:", error);
      } else {
        setCategories(data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCategoryId = e.target.value;
    setProduct({
      ...product,
      category_id: selectedCategoryId,
    });

    // Lógica para obtener subcategorías basadas en la categoría seleccionada
    const fetchSubcategories = async (categoryId: string) => {
      try {
        const { data, error } = await supabase
          .from('subcategories')
          .select('*')
          .eq('category_id', categoryId);
    
        if (error) {
          console.error("Error fetching subcategories:", error);
        } else {
          setSubcategories(data);
        }
      } catch (error) {
        console.error("Error fetching subcategories:", error);
      }
    };

    // Llama a la función para obtener subcategorías
    fetchSubcategories(selectedCategoryId);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleCreateProduct = async () => {
    try {
      let imageURL;
  
      if (selectedFile) {
        const options = {
          maxSizeMB: 0.2,
          maxWidthOrHeight: 500,
          useWebWorker: true,
          fileType: 'image/webp',
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
  
      const { data: insertResponse, error: insertError } = await supabase
        .from('products')
        .insert([
          {
            name: product.name,
            details: product.details !== "" ? product.details : null,
            product_sku: product.product_sku,
            price: product.price,
            old_price: product.old_price !== "" ? product.old_price : null,
            tax_percentage:
              product.tax_percentage !== "" ? product.tax_percentage : null,
            out_of_stock: product.out_of_stock,
            active: product.active,
            category_id: product.category_id,
            subcategory_id: product.subcategory_id,
            thumbnail_path: imageURL,
          },
        ]);
  
      if (insertError) {
        console.error("Insert failed:", insertError);
        throw new Error("Insert failed");
      }
  
      toast({
        description: "Producto creado correctamente",
      });
  
      // router.push(`/dashboard/products/details?id=${insertResponse[0].id}`);
      router.push(`/dashboard/products`);
    } catch (error) {
      console.error("Insert error:", error);
      toast({
        description: `Error: ${error}`,
        variant: "destructive",
      });
    }
  };
  
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const isChecked = (e.target as HTMLInputElement).checked;
      setProduct({
        ...product,
        [name]: isChecked,
      });
    } else {
      setProduct({
        ...product,
        [name]: value,
      });
    }
  };

  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <>
      <Card className="dark:text-white dark:bg-[#292B2D] border-0">
        <CardHeader>
          <CardTitle className="flex justify-between dark:text-[#C5C6C7]">
            <div className="m-0 p-0">Crear producto</div>
            <Button onClick={handleGoBack}>
              <ChevronLeft className="h-4 w-4 mr-2"></ChevronLeft> Regresar
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 grid-rows-1 gap-4 max-h-fit">
            <div className="">
              <Skeleton className="h-[500px] w-[500px] my-4" />
              <div>
                <Label htmlFor="image"><span className="text-rose-700">*</span> Imagen</Label>
                <Input
                  type="file"
                  id="image"
                  name="image"
                  onChange={(e) => handleFileChange(e)}
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="name"><span className="text-rose-700">*</span> Nombre de producto</Label>
              <Input
                type="text"
                name="name"
                id="name"
                value={product.name}
                onChange={handleInputChange}
                placeholder="Nombre del producto"
                required
              />

              <Label htmlFor="product_sku"><span className="text-rose-700">*</span> SKU</Label>
              <Input
                type="text"
                name="product_sku"
                id="product_sku"
                value={product.product_sku}
                onChange={handleInputChange}
                placeholder="SKU"
                required
              />

              <Label htmlFor="details">Descripción de producto</Label>
              <Textarea
                id="details"
                name="details"
                value={product.details}
                onChange={handleInputChange}
                placeholder="Descripción del producto"
              />
              <div className="flex gap-4">
                <div className="items-top flex space-x-2 my-2">
                  <input
                    type="checkbox"
                    id="active"
                    checked={product.active}
                    onChange={handleInputChange}
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
                    onChange={handleInputChange}
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
            <div>
              <Label htmlFor="price"><span className="text-rose-700">*</span> Precio final</Label>
              <Input
                id="price"
                name="price"
                value={product.price}
                onChange={handleInputChange}
                placeholder="0.00"
                required
              />

              <Label htmlFor="old_price">Precio original</Label>
              <Input
                id="old_price"
                name="old_price"
                value={product.old_price}
                onChange={handleInputChange}
                placeholder="0.00"
              />

              <Label htmlFor="tax_percentage">Impuesto</Label>
              <Input
                id="tax_percentage"
                name="tax_percentage"
                value={product.tax_percentage}
                onChange={handleInputChange}
                placeholder="0"
              />

              <div>
                <Label htmlFor="category_id"><span className="text-rose-700">*</span> Categoría:</Label>
                <select
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-[#323335] dark:border-0"
                  id="category_id"
                  name="category_id"
                  value={product.category_id}
                  onChange={handleCategoryChange}
                  required
                >
                  <option value="">Selecciona una categoría</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="subcategory_id"><span className="text-rose-700">*</span> Subcategoría:</Label>
                <select
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-[#323335] dark:border-0"
                  id="subcategory_id"
                  name="subcategory_id"
                  value={product.subcategory_id}
                  required
                  onChange={(e) => {
                    const selectedSubcategoryId = e.target.value;
                    setProduct({
                      ...product,
                      subcategory_id: selectedSubcategoryId,
                    });
                  }}
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
          <div className="flex gap-4 justify-end mt-4 pt-2">
            <div>
              <Button onClick={handleCreateProduct}>Crear Producto</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

export default ProductCreate;
