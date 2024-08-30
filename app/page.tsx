"use client";

import { useCustomers } from "@/db/hooks/useCustomers";
import { useExpensivePizzas } from "@/db/hooks/useExpensivePizzas";
import { useToppings } from "@/db/hooks/useToppings";

export default function Home() {
  const { addCustomer, customers } = useCustomers();
  const { addPizza, pizzas } = useExpensivePizzas();
  const { addTopping, toppings } = useToppings();

  const handleAddCustomer = () => {
    const name = `Customer ${Math.floor(Math.random() * 1000)}`;
    const email = `customer${Math.floor(Math.random() * 1000)}@example.com`;
    const phone = `+1${Math.floor(Math.random() * 10000000000)
      .toString()
      .padStart(10, "0")}`;
    addCustomer({ name, email, phone });
  };

  const handleAddPizza = () => {
    const name = `Pizza ${Math.floor(Math.random() * 100)}`;
    const price = Math.floor(Math.random() * 20) + 10;
    addPizza({ name, price });
  };

  const handleAddTopping = () => {
    const name = `Topping ${Math.floor(Math.random() * 50)}`;
    const price = Math.floor(Math.random() * 5) + 1;
    const vegetarian = Math.random() < 0.5;
    addTopping({ name, price, vegetarian });
  };

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
        Pizzeria Management
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 text-blue-600">
            Customers
          </h2>
          <button
            onClick={handleAddCustomer}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out mb-4"
          >
            Add Random Customer
          </button>
          <ul className="space-y-4 max-h-[60vh] overflow-y-auto">
            {customers.map((customer) => (
              <li
                key={customer.id}
                className="bg-gray-50 shadow-md rounded-lg p-4 mb-4 hover:shadow-lg transition duration-300"
              >
                <p className="font-bold text-lg">{customer.name}</p>
                <p className="text-gray-600">{customer.email}</p>
                <p className="text-gray-600">{customer.phone}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 text-red-600">
            Pizzas (only prices &gt; $20 visible)
          </h2>
          <button
            onClick={handleAddPizza}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out mb-4"
          >
            Add Random Pizza
          </button>
          <ul className="space-y-4 max-h-[60vh] overflow-y-auto">
            {pizzas.map((pizza) => (
              <li
                key={pizza.id}
                className="bg-gray-50 shadow-md rounded-lg p-4 mb-4 hover:shadow-lg transition duration-300"
              >
                <p className="font-bold text-lg">{pizza.name}</p>
                <p className="text-gray-600">${pizza.price}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 text-green-600">
            Toppings
          </h2>
          <button
            onClick={handleAddTopping}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out mb-4"
          >
            Add Random Topping
          </button>
          <ul className="space-y-4 max-h-[60vh] overflow-y-auto">
            {toppings.map((topping) => (
              <li
                key={topping.id}
                className="bg-gray-50 shadow-md rounded-lg p-4 mb-4 hover:shadow-lg transition duration-300"
              >
                <p className="font-bold text-lg">{topping.name}</p>
                <p className="text-gray-600">${topping.price}</p>
                <p className="text-gray-600">
                  {topping.vegetarian ? "Vegetarian" : "Non-vegetarian"}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
