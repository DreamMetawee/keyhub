// import { NextRequest, NextResponse } from "next/server";
// import pool from "@/app/util/db"; // Adjust the path to your database connection pool
// import nodemailer from "nodemailer";

// export async function POST(req: NextRequest) {
//   // Get the cart items and the user's email from the frontend request
//   const body = await req.json();
//   const { items, userEmail } = body;

//   // Basic validation
//   if (!items || !Array.isArray(items) || items.length === 0 || !userEmail) {
//     return NextResponse.json(
//       { message: "Cart items and user email are required" },
//       { status: 400 }
//     );
//   }

//   const connection = await pool.getConnection();

//   try {
//     // Start a database transaction to ensure all operations succeed or fail together
//     await connection.beginTransaction();

//     // 1. Find the user by their email to get their ID
//     const [users]: any = await connection.query(
//       "SELECT id FROM user WHERE email = ?",
//       [userEmail]
//     );
//     if (users.length === 0) {
//       throw new Error(`User with email ${userEmail} not found.`);
//     }
//     const userId = users[0].id;

//     const purchasedKeys: { title: string; key: string }[] = [];
//     let calculatedTotalAmount = 0;
//     const createdOrderItemIds: number[] = [];

//     // 2. Process each distinct item from the cart
//     for (const item of items) {
//       // Get the game's trusted price and title from the database
//       const [games]: any = await connection.query(
//         "SELECT price, title FROM Game WHERE id = ?",
//         [item.productId]
//       );
//       if (games.length === 0) {
//         throw new Error(`Game with id ${item.productId} not found.`);
//       }
//       const trustedGame = games[0];

//       // Process for the quantity of each item
//       for (let i = 0; i < item.quantity; i++) {
//         // Find an available key and lock the row to prevent race conditions
//         const [keys]: any = await connection.query(
//           "SELECT id, `key` FROM GameKey WHERE gameId = ? AND status = 'Available' LIMIT 1 FOR UPDATE",
//           [item.productId]
//         );

//         if (keys.length === 0) {
//           throw new Error(`Not enough available keys for ${trustedGame.title}`);
//         }
//         const gameKey = keys[0];

//         // Use the trusted price from the database for calculation
//         calculatedTotalAmount += trustedGame.price;

//         // Create an OrderItem record
//         const [orderItemResult]: any = await connection.query(
//           "INSERT INTO OrderItem (quantity, pricePaid, gameId, gameKeyId) VALUES (1, ?, ?, ?)",
//           [trustedGame.price, item.productId, gameKey.id]
//         );
//         createdOrderItemIds.push(orderItemResult.insertId);

//         // Update the key's status to 'Sold'
//         await connection.query(
//           "UPDATE GameKey SET status = 'Sold' WHERE id = ?",
//           [gameKey.id]
//         );

//         // Collect the key details for the confirmation email
//         purchasedKeys.push({ title: trustedGame.title, key: gameKey.key });
//       }
//     }

//     // 3. Create the main Order record with the correct total and userId
//     const [orderResult]: any = await connection.query(
//       "INSERT INTO `Order` (userId, totalAmount, status) VALUES (?, ?, 'Completed')",
//       [userId, calculatedTotalAmount]
//     );
//     const orderId = orderResult.insertId;

//     // 4. Update all newly created OrderItems with the final orderId
//     if (createdOrderItemIds.length > 0) {
//       const placeholders = createdOrderItemIds.map(() => "?").join(",");
//       await connection.query(
//         `UPDATE OrderItem SET orderId = ? WHERE id IN (${placeholders})`,
//         [orderId, ...createdOrderItemIds]
//       );
//     }

//     // If all database operations were successful, commit the transaction
//     await connection.commit();

//     // 5. Send the confirmation email with the collected keys
//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS, // This must be a Gmail "App Password"
//       },
//     });

//     const htmlKeys = purchasedKeys
//       .map((k) => `<li>${k.title}: <strong>${k.key}</strong></li>`)
//       .join("");

//     await transporter.sendMail({
//       from: `"KeyHub" <${process.env.EMAIL_USER}>`,
//       to: userEmail,
//       subject: `Your game keys from KeyHub 🎮 (Order #${orderId})`,
//       html: `
//         <h2>Thank you for your purchase!</h2>
//         <p>Here are your game keys:</p>
//         <ul>${htmlKeys}</ul>
//         <p>You can also view your order history on our website.</p>
//         <p>Enjoy your games!</p>
//       `,
//     });

//     return NextResponse.json({ success: true, orderId });
//   } catch (err: any) {
//     // If any error occurred, roll back all database changes
//     await connection.rollback();
//     console.error("Checkout Error:", err);
//     return NextResponse.json(
//       { message: err.message || "Failed to process order" },
//       { status: 500 }
//     );
//   } finally {
//     // Always release the connection back to the pool
//     connection.release();
//   }
// }
