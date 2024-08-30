CREATE TABLE IF NOT EXISTS "customers" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "customers_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "orders" (
	"id" serial PRIMARY KEY NOT NULL,
	"customer_id" integer NOT NULL,
	"pizza_id" integer NOT NULL,
	"quantity" integer NOT NULL,
	"total_price" numeric(10, 2) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "pizza_toppings" (
	"pizza_id" integer NOT NULL,
	"topping_id" integer NOT NULL,
	CONSTRAINT "pizza_toppings_pizza_id_topping_id_pk" PRIMARY KEY("pizza_id","topping_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "pizzas" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"price" numeric(10, 2) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "toppings" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"vegetarian" boolean DEFAULT false NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	CONSTRAINT "toppings_name_unique" UNIQUE("name")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orders" ADD CONSTRAINT "orders_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orders" ADD CONSTRAINT "orders_pizza_id_pizzas_id_fk" FOREIGN KEY ("pizza_id") REFERENCES "public"."pizzas"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pizza_toppings" ADD CONSTRAINT "pizza_toppings_pizza_id_pizzas_id_fk" FOREIGN KEY ("pizza_id") REFERENCES "public"."pizzas"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pizza_toppings" ADD CONSTRAINT "pizza_toppings_topping_id_toppings_id_fk" FOREIGN KEY ("topping_id") REFERENCES "public"."toppings"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
