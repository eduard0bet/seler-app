"use client";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader,  TableRow, } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Order, OrderData } from "./types";
import { Check, Eye, Trash2 } from "lucide-react";

function OrderList() {
  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(12);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [isConfirming, setIsConfirming] = useState<Record<string, boolean>>({});
  const supabase = createClientComponentClient()

  const filteredOrders = orders.filter(
    (order) =>
      order.id.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_phone.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastOrder = currentPage * itemsPerPage;
  const indexOfFirstOrder = indexOfLastOrder - itemsPerPage;
  const currentOrders = filteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleString('es-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }

  function handleClick(orderId: number) {
    if (isConfirming[orderId]) {
      setIsConfirming((prevState) => ({ ...prevState, [orderId]: false }));
      handleOrderDelete(orderId); // Convert orderId to string
    } else {
      setIsConfirming((prevState) => ({ ...prevState, [orderId]: true }));
      setTimeout(() => {
        setIsConfirming((prevState) => ({ ...prevState, [orderId]: false }));
      }, 3000);
    }
  }

  function getStatusName(status: any) {
    switch (status) {
      case 0:
        return "Creado";
      case 1:
        return <p className="text-blue-300">Confirmado</p>;
      case 2:
        return <p className="text-yellow-300">Enviado</p>;
      case 3:
        return <p className="text-purple-300">Entregado</p>;
      case 4:
        return <p className="text-green-300">Completado</p>;
      case 5:
        return <p className="text-red-300">Cancelado</p>;
      default:
        return "Error";
    }
  }

  useEffect(() => {
    const getOrders = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("orders")
        .select()
        .order("order_date", { ascending: false });
  
      if (data) {
        setOrders(data);
      }
      setLoading(false);
    };

    getOrders();
  }, []);

  const handleGetAllOrders = async () => {
    try {
      const requestOptions = {
        method: "GET",
      };

      const response = await fetch(`${baseURL}/api/orders/all`, requestOptions);

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data: OrderData = await response.json();
      setOrders(data.orders);
      setLoading(false);
    } catch (error) {
      console.error("Fetch error:", error);
      toast({
        description: "Error en la carga de pedidos.",
        variant: "destructive",
      });
    }
  };

  const handleOrderDelete = async (orderId: number) => {
    try {
      const response = await fetch(
        `${baseURL}/api/orders/deleteOrder/${orderId.toString()}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete order");
      }

      setOrders(orders.filter((order) => order.id !== orderId));

      toast({
        description: "Pedido eliminado con éxito",
      });
    } catch (error) {
      console.error("Delete order error:", error);
      toast({
        description: "Error al eliminar el pedido",
        variant: "destructive",
      });
    }
  };

  const renderOrderList = () => {
    if (loading) {
      return (
        <>
          <div className="space-y-2">
            <div className="flex justify-between gap-x-2">
              {[...Array(8)].map((_, index) => (
                <Skeleton key={index} className="h-14 w-32" />
              ))}
            </div>
            {[...Array(12)].map((_, index) => (
              <Skeleton key={index} className="h-11 w-full" />
            ))}
          </div>
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
                disabled={indexOfLastOrder >= filteredOrders.length}
              >
                Siguiente
              </Button>
            </div>
          </div>
        </>
      );
    } else {
      return (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>N. Pedido</TableHead>
                <TableHead>Creado</TableHead>
                <TableHead>Sesion</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="py-2">{order.id}</TableCell>
                  <TableCell className="py-2">{formatDate(order.order_date)}</TableCell>
                  <TableCell className="py-2">{order.sessionId}</TableCell>
                  <TableCell className="py-2">
                    {order.order_type === 0 ? "Recogida" : "Delivery"}
                  </TableCell>
                  <TableCell className="py-2">{order.customer_name}</TableCell>
                  <TableCell className="py-2">{order.customer_phone}</TableCell>
                  <TableCell className="py-2">{getStatusName(order?.status)}</TableCell>
                  <TableCell className="py-2">${order.total_price}</TableCell>
                  <TableCell className="py-2">
                    <div className="flex justify-center gap-2">
                      <Link
                        className="none"
                        href={`/dashboard/orders/details/?id=${order.id}`}
                      >
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      {/* <Button
                        size="sm"
                        className=""
                        variant={
                          isConfirming[order.id] ? "destructive" : "outline"
                        }
                        onClick={() => handleClick(order.id)}
                      >
                        {isConfirming[order.id] ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button> */}
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
                disabled={indexOfLastOrder >= filteredOrders.length}
              >
                Siguiente
              </Button>
            </div>
          </div>
        </>
      );
    }
  };

  return (
    <>
      <Card className="dark:text-white dark:bg-[#292B2D] border-0">
        <CardHeader>
          <CardTitle className="flex justify-between">
            Pedidos
            <div className="w-6/12">
              <Input
                className="border  dark:text-white dark:placeholder-[#C5C6C7] dark:border-0 dark:focus:border-2 dark:focus:border-[#C5C6C7] "
                type="text"
                placeholder="Buscar pedidos por N. Pedido, Cliente o Teléfono"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                disabled={loading}
              />
            </div>
            <div>
            <Link href='/dashboard/orders/create'>
              <Button>
                Create Order
              </Button>
              </Link>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>{renderOrderList()}</CardContent>
      </Card>
    </>
  );
}

export default OrderList;
