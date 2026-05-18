# Create Orders MySQL Table

## Goal
Add an `orders` table and an `order_items` table to the database to persist checkout data.

## Files to Touch
- `mediflow-backend/mediflowdb.sql`

## Steps

1. Open `mediflow-backend/mediflowdb.sql`

2. Add the following table definitions after the `users` table section (before the final `SET` statements):

```sql
--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
CREATE TABLE `orders` (
  `order_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `total_amount` decimal(15,2) NOT NULL,
  `status` enum('Pending','Completed','Cancelled') DEFAULT 'Pending',
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`order_id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
CREATE TABLE `order_items` (
  `order_item_id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `equipment_id` int NOT NULL,
  `quantity` int NOT NULL,
  `price_at_purchase` decimal(15,2) NOT NULL,
  PRIMARY KEY (`order_item_id`),
  FOREIGN KEY (`order_id`) REFERENCES `orders`(`order_id`) ON DELETE CASCADE,
  FOREIGN KEY (`equipment_id`) REFERENCES `equipment`(`equipment_id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
```

3. Import the updated SQL file into MySQL:
```sh
mysql -u root -p < mediflow-backend/mediflowdb.sql
```
(Note: This will drop and recreate existing tables. If you have data you want to keep, use `ALTER TABLE` or manually add the new tables instead.)

## Verification
- Run `mysql -u root -p -e "USE mediflowdb; SHOW TABLES;"` — should show `orders` and `order_items`
- Run `mysql -u root -p -e "USE mediflowdb; DESCRIBE orders;"` — should show the columns
- Run `mysql -u root -p -e "USE mediflowdb; DESCRIBE order_items;"` — should show the columns
