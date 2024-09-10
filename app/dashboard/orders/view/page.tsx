"use client";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";

export default function ClientComponent() {
    const [customerId, setCustomerId] = useState("");
    const [customer, setCustomer] = useState<any>(null);
    // const [order, setOrder] = useState<any[]>([]);
    const [items, setOrderItems] = useState<any[]>([]);
  
    const supabase = createClientComponentClient();
  
    const handleCustomerIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setCustomerId(event.target.value);
    };
  
    const fetchCustomerData = async () => {
        try {
          const { data: customerData } = await supabase
            .from("customers")
            .select()
            .eq("id", customerId);
          if (customerData && customerData.length > 0) {
            const selectedCustomer = customerData[0];
            const { data: orderData } = await supabase
              .from("orders")
              .select("id, sub_total, tax, total, status, order_date")
              .eq("customer_id", selectedCustomer.id);
            if (orderData) {
              const orderIds = orderData.map((order) => order.id);
              const { data: orderItemsData } = await supabase
                .from("order_items")
                .select(
                  `
                  *,
                  products (
                    product_sku,
                    name,
                    price,
                    tax_percentage
                  )
                  `
                )
                .in("order_id", orderIds);
              if (orderItemsData) {
                // Organizar los datos como se requiere en la estructura del JSON
                const customerWithOrders = {
                  ...selectedCustomer,
                  order: orderData.map((order) => {
                    const orderItems = orderItemsData.filter(
                      (item) => item.order_id === order.id
                    );
                    return { ...order, items: orderItems };
                  }),
                };
                setCustomer(customerWithOrders);
              }
            } else {
              setCustomer(selectedCustomer); // Sin órdenes
            }
          } else {
            setCustomer(null);
            setOrderItems([]);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
      
  
    useEffect(() => {
      if (customerId) {
        fetchCustomerData();
      }
    }, [customerId]);

  return (
    <div>
      <label htmlFor="customerId">Customer ID:</label>
      <input
        type="text"
        id="customerId"
        value={customerId}
        onChange={handleCustomerIdChange}
      />
      <button onClick={fetchCustomerData}>Fetch Data</button>
      <pre>
        {JSON.stringify(customer, null, 2)}
        {JSON.stringify(items, null, 4)}
      </pre>
    </div>
  );
}