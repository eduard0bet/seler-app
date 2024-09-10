'use client'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from "next/image";
import { Order } from "../types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table";

const OrderDetail = () => {
  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const [order, setOrder] = useState<Order | null>(null);
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const router = useRouter();
  const [buttonState, setButtonState] = useState("default");
  const supabase = createClientComponentClient()
  const [loading, setLoading] = useState<boolean>(true);


  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleString('es-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
  }

  function getStatusName(status: any) {
    switch (status) {
      case 0:
        return "Creado";
      case 1:
        return "Confirmado";
      case 2:
        return "Enviado";
      case 3:
        return "Entregado";
      case 4:
        return "Completado";
      case 5:
        return "Cancelado";
      default:
        return "Estado desconocido";
    }
  }
  

  useEffect(() => {
    const getOrderDetail = async () => {
      const { data: orderData, error } = await supabase
        .from("orders")
        .select("*")
        .eq("id", id);
    
      if (error) {
        console.error("Error fetching order data:", error.message);
        return;
      }
    
      if (orderData && orderData.length > 0) {
        const order = orderData[0];
    
        // Fetch associated items and product details
        const { data: itemsData, error: itemsError } = await supabase
          .from("order_items")
          .select(
            `
            *,
            products (
              id,
              name,
              price,
              tax_percentage
            )
            `
          )
          .eq("order_id", order.id);
    
        if (itemsError) {
          console.error("Error fetching order items:", itemsError.message);
          return;
        }
    
        if (itemsData) {
          let totalPrice = 0;
    
          order.items = itemsData.map((item) => {
            const subtotal = item.products.price * item.quantity;
            const totalTax = (subtotal * item.products.tax_percentage) / 100;
            const total = subtotal + totalTax;
            console.log(total)
    
            totalPrice += total; // Accumulate the total price
    
            return {
              ...item,
              subtotal,
              totalTax,
              total,
            };
          });
    
          order.totalPrice = totalPrice; // Assign the total price to order
          console.log(totalPrice)
        }
        setOrder(order);
      }
    };
  
    getOrderDetail();
  }, [id, order]);

  const handleGoBack = () => {
    router.push('/dashboard/orders');
  }

  const handleOrderDetails = async () => {
    if (!id) {
      console.warn("ID is missing in the URL");
      return;
    }

    try {
      const orderResponse = await fetch(`${baseURL}/api/orders/getOrder/${id}`);
      if (!orderResponse.ok) {
        console.error("Failed to fetch order data");
        return;
      }

      const orderData = await orderResponse.json();
      const order = orderData.order[0];
      setOrder(order); // Set the order state using the useState hook
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  const handleUpdateOrder = async () => {
    setButtonState("guardando");
    try {
      const orderData = {
        sessionId: order!.sessionId,
        customer_name: order!.customer_name,
        customer_phone: order!.customer_phone,
        customer_email: order!.customer_email,
        address: order!.address,
        birth_year: order!.birth_year,
        order_type: order!.order_type,
        items: order!.order_items.map((item) => ({
          productId: item.product_id,
          quantity: item.quantity,
        })),
        status: order!.status,
      };
  
      // Verify customer age
      const currentYear = new Date().getFullYear();
      const age = currentYear - orderData.birth_year;
      if (age < 18) {
        toast({
          description: "El cliente debe ser mayor de edad +18",
          variant: "destructive",
        });
        setButtonState("actualizado");
        return; // Stop further processing
      }
  
      const response = await fetch(
        `${baseURL}/api/orders/handleOrder/${order!.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderData),
        }
      );
  
      if (!response.ok) {
        const statusCode = response.status;
  
        switch (statusCode) {
          case 401:
            toast({
              description: "No se puede modificar una orden completada",
              variant: "destructive",
            });
            setButtonState("actualizado");
            break;
          case 402:
            toast({
              description: "No se puede modificar una orden cancelada",
              variant: "destructive",
            });
            setButtonState("actualizado");
            break;
          default:
            console.error("Update failed:", response.statusText);
            throw new Error("Update failed");
        }
      } else {
        toast({
          description: "Orden actualizada correctamente",
        });
  
        // Change button state to "updated"
        setButtonState("actualizado");
  
        // Call handleOrderDetails after the order update is complete
        handleOrderDetails();
      }
    } catch (error) {
      console.error("Update error:", error);
      toast({
        description: `Error: ${error}`,
        variant: "destructive",
      });
    }
  };
  
  if (!order) {
    return (
      <div>
        <Card className="mb-2">
          <CardHeader className='py-4'>
            <CardTitle className="flex justify-between align-middle p-0">
              <Skeleton className='w-80 h-10 p-0'></Skeleton>
              <Skeleton className='w-80 h-10 p-0'></Skeleton>
              <Skeleton className='w-80 h-10 p-0'></Skeleton>
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="mb-2">
          <CardContent className="pt-6">
            <div className="grid grid-cols-3 grid-rows-1 gap-4 max-h-fit">
              {/* col 1 */}
              <div className="">
                <Skeleton className='w-full h-16'></Skeleton>
                <Skeleton className='w-full h-16 mt-4'></Skeleton>
                <Skeleton className='w-full h-16 mt-4'></Skeleton>
              </div>
              {/* col 2 */}
              <div className="">
                <Skeleton className='w-full h-16'></Skeleton>
                <Skeleton className='w-full h-16 mt-4'></Skeleton>
                <Skeleton className='w-full h-16 mt-4'></Skeleton>
              </div>
              {/* col 3 */}
              <div className="">
                <Skeleton className='w-full h-16'></Skeleton>
                <Skeleton className='w-full h-16 mt-4'></Skeleton>
                <Skeleton className='w-full h-16 mt-4'></Skeleton>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="mb-2">
          <CardContent className="pt-6 h-72 pb-0 mb-0">
            <div className='flex justify-between '>
            <Skeleton className='w-24 h-12 mr-2'></Skeleton>
            <Skeleton className='w-24 h-12 mx-2'></Skeleton>
            <Skeleton className='w-24 h-12 mx-2'></Skeleton>
            <Skeleton className='w-24 h-12 mx-2'></Skeleton>
            <Skeleton className='w-24 h-12 mx-2'></Skeleton>
            <Skeleton className='w-24 h-12 mx-2'></Skeleton>
            <Skeleton className='w-24 h-12 mx-2'></Skeleton>
            <Skeleton className='w-24 h-12 mx-2'></Skeleton>
            <Skeleton className='w-24 h-12 ml-2'></Skeleton>

            </div>
            <div>
            <Skeleton className='w-full h-10 mt-2'></Skeleton>
            <Skeleton className='w-full h-10 mt-2'></Skeleton>
            <Skeleton className='w-full h-10 mt-2'></Skeleton>
            <Skeleton className='w-full h-10 mt-2'></Skeleton>

            </div>

          </CardContent>
          <CardFooter className='flex justify-end pt-0 mt-0'>
          <Skeleton className='w-24 h-10 mt-0'></Skeleton>
          
          </CardFooter>
        </Card>

        <Card>
          <CardContent className="py-6">
            <div className="flex justify-between">
                <Button onClick={handleGoBack}>
                <ChevronLeft className="h-4 w-4 mr-2"></ChevronLeft> Regresar
              </Button>
              <Button
                  type="button"
                  form="orderForm"
                  disabled
                  className={buttonState === "default" ? "dark:bg-[#3B3C3F] dark:text-white dark:hover:bg-[#222527]" : "dark:bg-[#3B3C3F] dark:text-white dark:hover:bg-[#222527] disabled"}
                 
                >
                  {buttonState === "guardando" ? "Actualizando..." : "Actualizar"}
                </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  } return (
    <>
      <Card className="mb-2">
        <CardHeader>
          <CardTitle className="flex justify-between align-middle">
            <div className="m-0 p-0">Detalles Pedido #{order?.id}</div>
            <div> {getStatusName(order?.status)} </div>
            <div className=" flex justify-around ">
              <div className="px-4">Productos: {order?.totalQuantity}</div>
              <div>Total</div>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>
      <form id="orderForm">
        <Card className="mb-2">
          <CardContent className="pt-6">
            <div className="grid grid-cols-3 grid-rows-1 gap-4 max-h-fit">
              {/* col 1 */}
              <div>
              <div className="">
                  <Label htmlFor="order_status">
                    <span className="text-rose-700">*</span> Estado del Pedido:
                  </Label>
                  <select
                    required
                    className="w-full rounded-md border border-input bg-background p-2.5 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-[#323335] dark:border-0"
                    id="order_status"
                    value={order.status}
                    onChange={(e) => {
                      const selectedStatus = parseInt(e.target.value, 10);
                      setOrder({
                        ...order,
                        status: selectedStatus,
                      });
                    }}
                  >
                    <option value="">Selecciona un estado</option>
                    <option value="0">Creado</option>
                    <option value="1">Confirmado</option>
                    <option value="2">Enviado</option>
                    <option value="3">Entregado</option>
                    <option value="4">Completado</option>
                    <option value="5">Cancelado</option>
                  </select>
                </div>

                <div className=" my-2">
                  <Label htmlFor="name">
                    <span className="text-rose-700">*</span> Nombre cliente:
                  </Label>
                  <Input
                    className="dark:bg-[#323335] dark:border-0"
                    type="text"
                    id="name"
                    value={order?.customer_name}
                    onChange={(e) =>
                      setOrder({ ...order, customer_name: e.target.value })
                    }
                    required
                  />
                </div>
                <div className=" my-2">
                  <Label htmlFor="name">
                    <span className="text-rose-700">*</span> Direccion:
                  </Label>
                  <Input
                    className="dark:bg-[#323335] dark:border-0"
                    type="text"
                    id="name"
                    value={order?.address}
                    onChange={(e) =>
                      setOrder({ ...order, address: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              {/* col 2 */}
              <div className="">
                <div className="">
                  <Label htmlFor="name">Creado:</Label>
                  <Input
                    className="dark:bg-[#323335] dark:border-0"
                    type="text"
                    id="name"
                    value={formatDate(order.order_date)}
                    onChange={(e) =>
                      setOrder({ ...order, order_date: e.target.value })
                    }
                    readOnly
                    disabled
                  />
                </div>
                <div className=" my-2">
                  <Label htmlFor="name">
                    <span className="text-rose-700">*</span> Email:
                  </Label>
                  <Input
                    className="dark:bg-[#323335] dark:border-0"
                    type="text"
                    id="name"
                    value={order?.customer_email}
                    onChange={(e) =>
                      setOrder({ ...order, customer_email: e.target.value })
                    }
                    required
                  />
                </div>
                <div className=" my-2">
                  <Label htmlFor="name">
                    <span className="text-rose-700">*</span> Año de Nacimiento:
                  </Label>
                  <Input
                    className="dark:bg-[#323335] dark:border-0"
                    type="text"
                    id="name"
                    value={order?.birth_year}
                    onChange={(e) =>
                      setOrder({ ...order, birth_year: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              {/* col 3 */}
              <div className="">
                <div className="">
                  <Label htmlFor="name">SesionID:</Label>
                  <Input
                    className="dark:bg-[#323335] dark:border-0"
                    type="text"
                    id="name"
                    value={order.sessionId}
                    onChange={(e) =>
                      setOrder({ ...order, sessionId: e.target.value })
                    }
                    readOnly
                    disabled
                  />
                </div>
                <div className=" my-2">
                  <Label htmlFor="name">
                    <span className="text-rose-700">*</span> Telefono:
                  </Label>
                  <Input
                    className="dark:bg-[#323335] dark:border-0"
                    type="text"
                    id="name"
                    value={order?.customer_phone}
                    onChange={(e) =>
                      setOrder({ ...order, customer_phone: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="my-2">
                  <Label htmlFor="delivery_type">
                    <span className="text-rose-700">*</span> Tipo de Servicio:
                  </Label>
                  <select
                    required
                    className="w-full rounded-md border border-input bg-background p-2.5 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-[#323335] dark:border-0"
                    id="delivery_type"
                    value={order.order_type}
                    onChange={(e) => {
                      const selectedDeliveryType = parseInt(e.target.value, 10);
                      setOrder({
                        ...order,
                        order_type: selectedDeliveryType,
                      });
                    }}
                  >
                    <option value="">Select Delivery Type</option>
                    <option value="0">Pickup</option>
                    <option value="1">Delivery</option>
                  </select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>

        <Card className="mb-2">
          <CardContent className="pt-6 h-72 pb-0 mb-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-bold">ID</TableHead>
                  <TableHead className="font-bold">SKU</TableHead>
                  <TableHead className="font-bold">Imagen</TableHead>
                  <TableHead className="font-bold">Nombre</TableHead>
                  <TableHead className="font-bold">Precio U.</TableHead>
                  <TableHead className="font-bold">Qty</TableHead>
                  <TableHead className="font-bold">Impuesto %</TableHead>
                  <TableHead className="font-bold">Impuesto</TableHead>
                  <TableHead className="font-bold">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
              {order && order.order_items && order.order_items.map((orderItem) => {
                      const product = orderItem.products;
                      return (
                        <TableRow key={orderItem.id}>
                      <TableCell className="py-2">{product.id}</TableCell>
                      <TableCell className="py-2">
                        {product.product_sku}
                      </TableCell>
                      <TableCell className="py-2">
                        <Image
                          className="w-10 rounded-sm"
                          src={product.thumbnail_path}
                          alt={product.name}
                          width="500"
                          height="500"
                          priority={true}
                        />
                      </TableCell>
                      <TableCell className="py-2">{product.name}</TableCell>
                      <TableCell className="py-2">${product.price}</TableCell>
                      <TableCell className="py-2">
                        {orderItem.quantity}
                      </TableCell>
                      <TableCell className="py-2">
                        {product.tax_percentage}%
                      </TableCell>
                      <TableCell className="py-2">${orderItem.tax}</TableCell>
                      <TableCell className="py-2">${orderItem.price}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter className='flex justify-end pt-0 mt-0'>
          <div>
          
           
            </div>
          </CardFooter>
        </Card>

        <Card>
          <CardContent className="py-6">
            <div className="flex justify-between">
                <Button onClick={handleGoBack}>
                <ChevronLeft className="h-4 w-4 mr-2"></ChevronLeft> Regresar
              </Button>
              <Button
                  type="button"
                  form="orderForm"
                  className={buttonState === "default" ? "dark:bg-[#3B3C3F] dark:text-white dark:hover:bg-[#222527]" : "dark:bg-[#3B3C3F] dark:text-white dark:hover:bg-[#222527] disabled"}
                  onClick={handleUpdateOrder}
                >
                  {buttonState === "guardando" ? "Actualizando..." : "Actualizar"}
                </Button>
            </div>
          </CardContent>
        </Card>
    </>
  );
};

export default OrderDetail;
