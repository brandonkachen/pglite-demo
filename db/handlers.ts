import { match } from "ts-pattern";
import * as models from "./models";
import { Change } from "./types";

export const handlePizzasRowChange = (result: Change<typeof models.pizzas>) => {
  console.log("handlePizzaChange", result);

  match(result)
    .with({ __op__: "INSERT" }, (r) => {
      console.log("added new pizza", r.id);
    })
    .with({ __op__: "UPDATE" }, (r) => {
      console.log("updated pizza", r.id);
    })
    .with({ __op__: "DELETE" }, (r) => {
      console.log("deleted pizza", r.id);
    })
    .otherwise(() => {
      console.log("unknown op", result);
    });
};

export const handleCustomersRowChange = (
  result: Change<typeof models.customers>
) => {
  match(result)
    .with({ __op__: "INSERT" }, (r) => {
      console.log("added new customer", r.id);
    })
    .with({ __op__: "UPDATE" }, (r) => {
      console.log("updated customer", r.id);
    })
    .with({ __op__: "DELETE" }, (r) => {
      console.log("deleted customer", r.id);
    })
    .otherwise(() => {
      console.log("unknown op", result);
    });
};

export const handlePizzaToppingsRowChange = (
  result: Change<typeof models.pizzaToppings>
) => {
  match(result)
    .with({ __op__: "INSERT" }, (r) => {
      console.log("added new pizzaTopping", r.pizza_id);
    })
    .with({ __op__: "UPDATE" }, (r) => {
      console.log("updated pizzaTopping", r.pizza_id);
    })
    .with({ __op__: "DELETE" }, (r) => {
      console.log("deleted pizzaTopping", r.pizza_id);
    })
    .otherwise(() => {
      console.log("unknown op", result);
    });
};
