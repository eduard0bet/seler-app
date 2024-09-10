'use client'
import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import OrderComponent from "./products/page";
import { Button } from "@/components/ui/button";

export default function CreateCustomerComponent() {
  const supabase = createClientComponentClient();

  const [newCustomer, setNewCustomer] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    year: "",
  });

  const [customerId, setCustomerId] = useState(null); // Define customerId

  const handleCreateCustomer = async () => {
    try {
      const newCustomerData = {
        customer_name: newCustomer.name,
        customer_phone: newCustomer.phone,
        customer_email: newCustomer.email,
        address: newCustomer.address,
        birth_year: newCustomer.year,
      };

      const { error } = await supabase
        .from("customers")
        .insert([newCustomerData]);

      if (error) {
        throw error;
      }

      setNewCustomer({
        name: "",
        phone: "",
        email: "",
        address: "",
        year: "",
      });

      // Ahora deberías obtener la lista actualizada de clientes y actualizar el estado correspondiente
      const { data, error: fetchError } = await supabase
        .from("customers")
        .select();
      if (fetchError) {
        throw fetchError;
      }

      toast({
        description: "Cliente creado con éxito",
      });
    } catch (error) {
      console.error("Error al crear el cliente:", error);
      toast({
        description: "Error al crear el cliente",
        variant: "destructive",
      });
    }
  };

  // In the ProductsOrderComponent
  const handleSaveOrder = async () => {
    const newOrderData = {
      customer_id: customerId, // Use customerId here
      order_type: 0, // Set the order type to 0 for pickup
      status: 0, // Set the status to 0
      // Include other order details here
    };

    const { data, error } = await supabase
      .from("orders")
      .insert([newOrderData]);

    if (!error) {
      // Handle the success case here
    } else {
      // Handle the error case here
    }
  };

  return (
    <>
      <Card className="">
        <CardHeader>
          <CardTitle>Crear Pedido</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateCustomer}>
            <div className="grid grid-cols-3 grid-rows-1 gap-4">
              <div>
                <Label htmlFor="name">Nombre Cliente:</Label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  value={newCustomer.name}
                  onChange={(e) =>
                    setNewCustomer({
                      ...newCustomer,
                      name: e.target.value,
                    })
                  }
                />

                <Label htmlFor="phone">Telefono:</Label>
                <Input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={newCustomer.phone}
                  onChange={(e) =>
                    setNewCustomer({
                      ...newCustomer,
                      phone: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="email">Email:</Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  value={newCustomer.email}
                  onChange={(e) =>
                    setNewCustomer({
                      ...newCustomer,
                      email: e.target.value,
                    })
                  }
                />
                <Label htmlFor="year">Año de Nacimiento:</Label>
                <Input
                  type="number"
                  id="year"
                  name="year"
                  value={newCustomer.year}
                  onChange={(e) =>
                    setNewCustomer({
                      ...newCustomer,
                      year: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label>Tipo de Servicio</Label>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="0">Recogida</SelectItem>
                      <SelectItem value="1">Delivery</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <Label htmlFor="address">Direccion:</Label>
                <Input
                  id="address"
                  name="address"
                  value={newCustomer.address}
                  onChange={(e) =>
                    setNewCustomer({
                      ...newCustomer,
                      address: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <Card className="my-4">
        <CardHeader>
          <CardTitle>Gestion de Productos</CardTitle>
        </CardHeader>
        <CardContent>
          <OrderComponent customerId={customerId} />
        </CardContent>
        <CardFooter className="flex flex-row-reverse">
        <Button onClick={handleSaveOrder}>Save Order</Button>
        </CardFooter>
      </Card>
    </>
  );
}

