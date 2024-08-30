import schemas from "./schemas";

const { select, insert } = schemas;

export type Customer = typeof select.customers._type;
export type Pizza = typeof select.pizzas._type;
export type Order = typeof select.orders._type;
export type Topping = typeof select.toppings._type;
export type PizzaTopping = typeof select.pizzaToppings._type;

export type NewCustomer = typeof insert.customers._type;
export type NewPizza = typeof insert.pizzas._type;
export type NewOrder = typeof insert.orders._type;
export type NewTopping = typeof insert.toppings._type;
export type NewPizzaTopping = typeof insert.pizzaToppings._type;

type ChangeInsert<T> = {
  __changed_columns__: string[];
  __op__: "INSERT";
  __after__: number | undefined;
} & T;
type ChangeDelete<T> = {
  __changed_columns__: string[];
  __op__: "DELETE";
  __after__: undefined;
} & T;
type ChangeUpdate<T> = {
  __changed_columns__: string[];
  __op__: "UPDATE";
  __after__: number;
} & T;
type ChangeReset<T> = {
  __op__: "RESET";
} & T;
export type Change<T> =
  | ChangeInsert<T>
  | ChangeDelete<T>
  | ChangeUpdate<T>
  | ChangeReset<T>;
