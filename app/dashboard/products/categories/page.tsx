'use client'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useEffect, useState } from 'react'
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Check, Eye, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function ClientComponent() {
  const [categories, setCategories] = useState<any[]>([]);
  const [subcategoryCounts, setSubcategoryCounts] = useState<Record<string, number>>({});
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [newCategory, setNewCategory] = useState({ name: "", description: "" });
  const [isOpen, setIsOpen] = useState(false);
  const itemsPerPage = 5;
  const [isConfirming, setIsConfirming] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClientComponentClient();

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastCategory = currentPage * itemsPerPage;
  const indexOfFirstCategory = indexOfLastCategory - itemsPerPage;
  const currentCategories = filteredCategories.slice(
    indexOfFirstCategory,
    indexOfLastCategory
  );

  useEffect(() => {
    const getCategories = async () => {
      setIsLoading(true);
      const { data } = await supabase.from("categories").select("*");

      if (data) {
        setCategories(data);
        const categoryIds = data.map((category) => category.id);
        const subcategoryCounts = await getSubCategoryCounts(categoryIds);
        setSubcategoryCounts(subcategoryCounts);
      }

      setIsLoading(false);
    };

    const getSubCategoryCounts = async (categoryIds: string[]) => {
      try {
        const requests = categoryIds.map((categoryId) =>
          supabase
            .from("subcategories")
            .select("count", { count: "exact" })
            .eq("category_id", categoryId)
            .single()
        );

        const responses = await Promise.all(requests);

        const subcategoryCounts: Record<string, number> = {};
        responses.forEach((response, index) => {
          const categoryId = categoryIds[index];
          subcategoryCounts[categoryId] = response.error
            ? 0
            : response.count || 0;
        });

        return subcategoryCounts;
      } catch (error) {
        console.error("Error al obtener los conteos de subcategorías", error);
        return {};
      }
    };

    getCategories();
  }, [supabase, setCategories, setSubcategoryCounts]);

  const handleClick = (categoryId: string) => {
    if (isConfirming[categoryId]) {
      setIsConfirming((prevState) => ({ ...prevState, [categoryId]: false }));
      handleDeleteCategory(categoryId);
    } else {
      setIsConfirming((prevState) => ({ ...prevState, [categoryId]: true }));
      setTimeout(() => {
        setIsConfirming((prevState) => ({ ...prevState, [categoryId]: false }));
      }, 3000);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    console.log("Deleting category with ID:", categoryId);
  
    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("id", categoryId);
    toast({
      description: "Categoria eliminada con éxito",
    });
    if (error) {
      console.error("Error deleting product:", error);
      toast({
        description: "No se pudo eliminar la categoria",
        variant: "destructive",
      });
    }
        // Recargar los productos después de la eliminación, incluso si hubo un error
        const { data, error: reloadError } = await supabase
        .from("categories")
        .select();
      if (reloadError) {
        console.error("Error reloading categories:", reloadError);
      } else if (data) {
        setCategories(data);
      }
  };

  const handleCreateCategory = async () => {
    try {
      const newCategoryData = {
        name: newCategory.name,
        description: newCategory.description
      };
      
      const { error } = await supabase
        .from('categories')
        .insert([newCategoryData]);
  
      if (error) {
        throw error;
      }
  
        setNewCategory({
          name: "",
          description: "",
        });
        setIsOpen(false);
    
        const { data, error: fetchError } = await supabase.from('categories').select();
        if (fetchError) {
          throw fetchError;
        }
        setCategories(data);

        toast({
          description: "Categoría creada con éxito",
        });
      } catch (error) {
        console.error("Error al crear la categoría:", error);
        toast({
          description: "Error al crear la categoría",
          variant: "destructive",
        });
      }
  };

  return (
      <>
      {isLoading ? (
            <Card>
              <CardHeader>
              <CardTitle className="flex justify-between">
                Categorías
                <div className="w-6/12">
                  <Input
                    className="border  dark:text-white dark:placeholder-[#C5C6C7] dark:border-0 dark:focus:border-2 dark:focus:border-[#C5C6C7] "
                    type="text"
                    placeholder="Buscar categorías por nombre"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                
              </CardTitle>
            </CardHeader>
            <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between gap-x-2">
                {[...Array(5)].map((_, index) => (
                  <Skeleton key={index} className="h-14 w-full will-change-auto" />
                ))}
              </div>
              {[...Array(5)].map((_, index) => (
                <Skeleton key={index} className="h-14 w-full" />
              ))}
            </div>
            <div className="flex flex-row-reverse">
              <div className="space-x-2">
                <Button
                  size="sm"
                disabled
                >
                  Anterior
                </Button>
                <Button
                  size="sm"
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
              <CardHeader className="">
                  <CardTitle className="flex justify-between">
                    Categorías
                    <div className="w-6/12">
                      <Input
                        className="border  dark:text-white dark:placeholder-[#C5C6C7] dark:border-0 dark:focus:border-2 dark:focus:border-[#C5C6C7] "
                        type="text"
                        placeholder="Buscar categorías por nombre"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                    <Dialog open={isOpen} onOpenChange={setIsOpen}> 
                      <DialogTrigger asChild>
                        <Button
                          className="mr-0 prl-0"
                          disabled={isLoading}
                          onClick={() => setIsOpen(true)}
                        >
                          Agregar categoría
                        </Button>
                      </DialogTrigger>
                      <DialogContent className='dark:bg-[#212325]'>
                        <DialogHeader>
                          <DialogTitle>Crear categoria</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 ">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name">
                              <span className="text-rose-700">*</span> Nombre
                            </Label>
                            <Input
                              id="name"
                              className="col-span-3"
                              value={newCategory.name}
                              onChange={(e) =>
                                setNewCategory({
                                  ...newCategory,
                                  name: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="description">Descripción</Label>
                            <Textarea
                              id="description"
                              className="col-span-3"
                              value={newCategory.description}
                              onChange={(e) =>
                                setNewCategory({
                                  ...newCategory,
                                  description: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div className="flex justify-end">
                            <Button className="w-36" onClick={handleCreateCategory}>
                              Guardar
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </CardTitle>
                </CardHeader>
            <CardContent>
            <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Descripción</TableHead>
                      <TableHead>Count</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                  {currentCategories.map((category) => (
                      <TableRow key={category.id}>
                        <TableCell>{category.id}</TableCell>
                        <TableCell className="font-medium">{category.name}</TableCell>
                        <TableCell>{category.description}</TableCell>
                        <TableCell>{subcategoryCounts[category.id]}</TableCell>
                        
                        <TableCell>
                          <div className="flex justify-end gap-2">
                            <Link
                              href={`/dashboard/products/categories/details/?id=${category.id}`}
                            >
                              <Button size="sm"
                                variant="outline"
                                >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button
                                size="sm"
                                className=""
                                variant={
                                  isConfirming[category.id] ? "destructive" : "outline"
                                }
                                onClick={() => handleClick(category.id)}
                              >
                                {isConfirming[category.id] ? (
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
                  disabled={indexOfLastCategory >= filteredCategories.length}
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
   