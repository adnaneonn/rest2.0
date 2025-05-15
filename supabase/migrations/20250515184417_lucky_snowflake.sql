/*
  # Initial Schema Setup for Restaurant Loyalty System

  1. New Tables
    - `customers`
      - `id` (uuid, primary key)
      - `name` (text)
      - `phone` (text, unique)
      - `email` (text, optional)
      - `birthdate` (date, optional)
      - `points` (integer)
      - `visits` (integer)
      - `last_visit` (timestamptz)
      - `registered_at` (timestamptz)
      - `user_id` (uuid, references auth.users)

    - `rewards`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `points_required` (integer)
      - `category` (text)
      - `image_url` (text)
      - `is_active` (boolean)
      - `is_birthday_reward` (boolean)

    - `transactions`
      - `id` (uuid, primary key)
      - `customer_id` (uuid, references customers)
      - `receipt_number` (text)
      - `amount` (decimal)
      - `points` (integer)
      - `type` (text)
      - `reward_id` (uuid, references rewards, optional)
      - `reward_name` (text, optional)
      - `date` (date)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Add policies for restaurant owners
*/

-- Create enum for transaction types
CREATE TYPE transaction_type AS ENUM ('earn', 'redeem', 'birthday');

-- Create enum for reward categories
CREATE TYPE reward_category AS ENUM ('food', 'drink', 'dessert', 'other');

-- Create customers table
CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users,
  name text NOT NULL,
  phone text UNIQUE NOT NULL,
  email text,
  birthdate date,
  points integer DEFAULT 0,
  visits integer DEFAULT 0,
  last_visit timestamptz,
  registered_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create rewards table
CREATE TABLE IF NOT EXISTS rewards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  points_required integer NOT NULL,
  category reward_category NOT NULL,
  image_url text,
  is_active boolean DEFAULT true,
  is_birthday_reward boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES customers ON DELETE CASCADE,
  receipt_number text NOT NULL,
  amount decimal(10,2) NOT NULL,
  points integer NOT NULL,
  type transaction_type NOT NULL,
  reward_id uuid REFERENCES rewards ON DELETE SET NULL,
  reward_name text,
  date date NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Policies for customers table
CREATE POLICY "Customers can view their own data"
  ON customers
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Restaurant owners can view all customers"
  ON customers
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.role = 'owner'
    )
  );

-- Policies for rewards table
CREATE POLICY "Anyone can view active rewards"
  ON rewards
  FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Restaurant owners can manage rewards"
  ON rewards
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.role = 'owner'
    )
  );

-- Policies for transactions table
CREATE POLICY "Customers can view their own transactions"
  ON transactions
  FOR SELECT
  TO authenticated
  USING (customer_id IN (
    SELECT id FROM customers WHERE user_id = auth.uid()
  ));

CREATE POLICY "Restaurant owners can view all transactions"
  ON transactions
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.role = 'owner'
    )
  );

-- Create function to update customer points
CREATE OR REPLACE FUNCTION update_customer_points()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.type = 'earn' THEN
    UPDATE customers
    SET 
      points = points + NEW.points,
      visits = visits + 1,
      last_visit = NEW.created_at
    WHERE id = NEW.customer_id;
  ELSIF NEW.type IN ('redeem', 'birthday') THEN
    UPDATE customers
    SET points = points - ABS(NEW.points)
    WHERE id = NEW.customer_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updating points
CREATE TRIGGER update_points_after_transaction
  AFTER INSERT ON transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_customer_points();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updating timestamps
CREATE TRIGGER update_customers_updated_at
  BEFORE UPDATE ON customers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_rewards_updated_at
  BEFORE UPDATE ON rewards
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();