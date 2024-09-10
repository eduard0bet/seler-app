'use client'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, ChevronLeft, Pen, Plus, Save, Trash2, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Category, Subcategory } from "../../types";
import { Skeleton } from "@/components/ui/skeleton";

const CategoryDetail = () => {
  const supabase = createClientComponentClient();
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const router = useRouter();
  const [category, setCategory] = useState<Category | null>(null);
  const [newSubcategory, setNewSubcategory] = useState({ name: "", description: "", category_id: id });
  const [editingSubcategory, setEditingSubcategory] = useState<Subcategory | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isConfirming, setIsConfirming] = useState<Record<string, boolean>>({});


  const fetchData = async () => {
    if (!id) {
      console.warn("ID is missing in the URL");
      return;
    }

    try {
      const { data, error } = await supabase
        .from('categories')
        .select(`
          *,
          subcategories: subcategories!fk_category_id(*)
        `)
        .eq('id', id);
        

        if (error) {
          console.error("Error fetching category:", error);
        } else {
          const categoryData = data[0];
          setCategory(categoryData);
          setName(categoryData.name);
          setDescription(categoryData.description);
        }
      
    } catch (error) {
      console.error("Error fetching category:", error);
    }
  };

  useEffect(() => {
    fetchData();
    setLoading(false);
  }, [id]);

 
  const handleUpdateCategory = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      if (!category) {
        console.error("Category is null");
        throw new Error("Category is null");
      }
  
      const { data: updateResponse, error: updateError } = await supabase
        .from('categories')
        .update({
          name,
          description,
        })
        .eq('id', category.id);
  
      if (updateError) {
        console.error("Failed to update category:", updateError); // Logs the update error
        throw new Error("Failed to update category");
      }

      setCategory({
        ...category,
        name,
        description,
      });
  
      toast({
        description: "Categoría actualizada con éxito",
      });
    } catch (error) {
      console.error("Update category error:", error);
      toast({
        description: "Error al actualizar la categoría",
        variant: "destructive",
      });
    }
  };
  
  
  const handleAddSubcategory = async () => {
    try {
      setLoading(true);
      const { data: insertResponse, error: insertError } = await supabase
        .from('subcategories')
        .insert([newSubcategory]);
  
      if (insertError) {
        throw new Error("Failed to add subcategory");
      }
  
      await fetchData();
  
      setNewSubcategory({
        name: "",
        description: "",
        category_id: id,
      });
  
      toast({
        description: "Subcategoría agregada con éxito",
      });
    setLoading(false);

    } catch (error) {
      console.error("Add subcategory error:", error);
      toast({
        description: "Error al agregar la subcategoría",
        variant: "destructive",
      });
    } finally {
    }
  };

  const handleEditSubcategoryNew = (subcategory: Subcategory) => {
    if (editingSubcategory && editingSubcategory.id === subcategory.id) {
      // Ya estás editando esta subcategoría
      return;
    }
  
    setEditingSubcategory(subcategory);
  };
  
  const handleCancelEdit = () => {
    setEditingSubcategory(null);
  };
  
  const handleUpdateSubcategory = async (updatedSubcategory: Subcategory) => {
    try {
      if (!category) {
        throw new Error("Category is null");
      }
  
      const { data: updateResponse, error: updateError } = await supabase
        .from('subcategories')
        .update({
          name: updatedSubcategory.name,
          description: updatedSubcategory.description,
        })
        .eq('id', updatedSubcategory.id);
  
      if (updateError) {
        throw new Error("Failed to update subcategory");
      }
  
      setEditingSubcategory(null);
  
      toast({
        description: "Subcategoría actualizada con éxito",
      });
  
      // Vuelve a cargar los datos de la categoría, ya que las subcategorías han cambiado.
      fetchData();
    } catch (error) {
      console.error("Update subcategory error:", error);
      toast({
        description: "Error al actualizar la subcategoría",
        variant: "destructive",
      });
    }
  };
  
  const handleDeleteSubcategory = async (subcategoryId: string) => {
    try {
      if (!category) {
        throw new Error("Category is null");
      }
  
      const { error: deleteError } = await supabase
        .from('subcategories')
        .delete()
        .eq('id', subcategoryId);
  
      if (deleteError) {
        throw new Error("Failed to delete subcategory");
      }
  
      toast({
        description: "Subcategoría eliminada con éxito",
      });
  
      fetchData();
    } catch (error) {
      console.error("Delete subcategory error:", error);
      toast({
        description: "Error al eliminar la subcategoría",
        variant: "destructive",
      });
    }
  };

  const handleClick = (subCategoryId: string) => {
    if (isConfirming[subCategoryId]) {
      setIsConfirming((prevState) => ({ ...prevState, [subCategoryId]: false }));
      handleDeleteSubcategory(subCategoryId);
    } else {
      setIsConfirming((prevState) => ({ ...prevState, [subCategoryId]: true }));
      setTimeout(() => {
        setIsConfirming((prevState) => ({ ...prevState, [subCategoryId]: false }));
      }, 3000);
    }
  };

  const handleGoBack = () => {
    router.push(`/dashboard/products/categories/`);
  };
  
  const renderBodyAfterLoad = () => {
    if (loading) {
      return (
        <>
         <div className="grid grid-cols-2 grid-rows-1 gap-4 max-h-fit">
          {/* col 1 */}
          <div className="">
            <Skeleton className="h-12 w-50 my-2" />
            <Skeleton className="h-28 w-50 my-2" />
            <div className="flex justify-end">
          <Skeleton className="h-12 w-24" />
          </div>
          </div>
          {/* col 2 */}
          <div>
          <div className="my-2">
            <div className="flex justify-between gap-x-2 mb-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-16" />
              </div>
            </div>
            <div className="my-2">
              <div className="flex justify-between gap-x-2 mb-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-20" />
              <Skeleton className="h-12 w-20" />
              </div>
              <div className="flex justify-between gap-x-2 mb-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-20" />
              <Skeleton className="h-12 w-20" />
              </div>
              <div className="flex justify-between gap-x-2 mb-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-20" />
              <Skeleton className="h-12 w-20" />
              </div>
            </div>
          </div>
        </div>
        </>
      );
    } else {
      return (
        <>
        <div className="grid grid-cols-2 grid-rows-1 gap-4 max-h-fit">
          {/* col 1 */}
          <div className="">
            <form onSubmit={handleUpdateCategory}>
              <div>
                <Label htmlFor="name">Nombre:</Label>
                <Input
                  className="dark:bg-[#323335] dark:border-0"
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setCategory(prevCategory => ({
                      ...prevCategory!,
                      name: e.target.value || "",
                      id: prevCategory?.id || "",
                    }));
                  }}
                />
              </div>
              <div className="my-2">
                <Label htmlFor="description">Descripción:</Label>

                <Textarea
                  className="dark:bg-[#323335] dark:border-0"
                  id="description"
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    setCategory(prevCategory => ({
                      ...prevCategory!,
                      description: e.target.value || "",
                      id: prevCategory?.id || "",
                    }));
                  }}
                />

              </div>
              <div className="flex justify-end">
              <Button type="submit">Guardar</Button>
              </div>
            </form>
          </div>
          {/* col 2 */}
          <div>  
              <div className="">
                <form onSubmit={handleAddSubcategory}>
                  <div className="flex justify-between gap-x-2">
                    <div className="w-full">
                      <Label htmlFor="addsub">Agregar Subcategoria:</Label>
                      <Input
                          className="dark:bg-[#323335] dark:border-0"
                          type="text"
                          id="addsub"
                          value={newSubcategory.name}
                          onChange={(e) =>
                            setNewSubcategory({
                              ...newSubcategory,
                              name: e.target.value,
                            })
                          }
                          disabled={loading}
                        />
                    </div>
                    <div className="mt-6">
                      <Button
                      className="w-10 h-10"
                        size="sm"
                        onClick={handleAddSubcategory}
                        disabled={loading || !newSubcategory.name}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </form>
              </div>
            <div className="my-2">
              <Label>Subcategorias:</Label>
              {category?.subcategories?.map((subcategory) => (
                <div key={subcategory.id}>
                  {editingSubcategory &&
                  editingSubcategory.id === subcategory.id ? (
                    <form onSubmit={(event) => {
                      event.preventDefault();
                      handleUpdateSubcategory(editingSubcategory);
                    }}>
                      <div className="flex justify-between mb-2">
                        <div className="w-full mr-2">
                          <Input
                            className="dark:bg-[#323335] dark:border-0"
                            type="text"
                            value={editingSubcategory?.name || ""}
                            onChange={(e) =>
                              setEditingSubcategory({
                                ...editingSubcategory,
                                name: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="flex justify-around gap-x-2">
                          <Button type="submit" size="sm">
                            <Save className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            onClick={handleCancelEdit}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </form>
                  ) : (
                    <div className="flex justify-between mb-2">
                      <div className="w-full mr-2">
                        <Input className="dark:bg-[#323335] dark:border-0" value={subcategory.name} disabled />
                      </div>
                      <div className=" flex justify-around gap-x-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditSubcategoryNew(subcategory)}
                        >
                          <Pen className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          className=""
                          variant={
                            isConfirming[subcategory.id] ? "destructive" : "outline"
                          }
                          onClick={() => handleClick(subcategory.id)}
                        >
                          {isConfirming[subcategory.id] ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        </>
      );
    }
  };

  return (
    <Card className="dark:text-white dark:bg-[#292B2D] border-0">
      <CardHeader>
        <CardTitle className="flex justify-between">
          <div className="m-0 p-0">Detalles de categoría</div>
          <Button onClick={handleGoBack}>
            <ChevronLeft className="h-4 w-4 mr-2"></ChevronLeft> Regresar
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
      <div className="space-y-4">{renderBodyAfterLoad()}</div>
      </CardContent>
    </Card>
  );
};

export default CategoryDetail;
