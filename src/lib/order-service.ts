
'use server';

import db from './db';
import type { Order, OrderItem, ShippingAddress, NewOrderData, CartItem } from './types';
import { revalidatePath } from 'next/cache';
import { getProductById, updateProduct } from './product-service'; // For stock updates

// Helper to map DB row to Order type
const mapRowToOrder = (row: any): Order | undefined => {
  if (!row) return undefined;
  return {
    id: String(row.id),
    userId: String(row.userId),
    orderDate: row.orderDate,
    totalAmount: Number(row.totalAmount),
    status: row.status as Order['status'],
    paymentStatus: row.paymentStatus as Order['paymentStatus'],
    shippingAddress: JSON.parse(row.shippingAddress) as ShippingAddress,
    items: [], // Items will be fetched separately or joined
    customerFullName: row.customerFullName, // if joined/available
    customerEmail: row.customerEmail, // if joined/available
  };
};

const mapRowToOrderItem = (row: any): OrderItem | undefined => {
    if (!row) return undefined;
    return {
        id: String(row.id),
        orderId: String(row.orderId),
        productId: String(row.productId),
        productName: row.productName,
        productImageUrl: row.productImageUrl,
        quantity: Number(row.quantity),
        priceAtPurchase: Number(row.priceAtPurchase),
        size: row.size || undefined,
    };
}

export const getOrdersByUserId = async (userId: string): Promise<Order[]> => {
  try {
    const orderRows = db.prepare(`
      SELECT * FROM orders WHERE userId = ? ORDER BY orderDate DESC
    `).all(Number(userId)) as any[];

    const orders: Order[] = [];
    for (const orderRow of orderRows) {
      const order = mapRowToOrder(orderRow);
      if (order) {
        const itemRows = db.prepare('SELECT * FROM order_items WHERE orderId = ?').all(order.id) as any[];
        order.items = itemRows.map(mapRowToOrderItem).filter(item => item !== undefined) as OrderItem[];
        orders.push(order);
      }
    }
    return orders;
  } catch (error) {
    console.error(`Failed to get orders for user ${userId}:`, error);
    return [];
  }
};

export const getOrderByIdAndUserId = async (orderId: string, userId: string): Promise<Order | undefined> => {
  try {
    const orderRow = db.prepare(`
      SELECT * FROM orders WHERE id = ? AND userId = ?
    `).get(Number(orderId), Number(userId)) as any;
    
    const order = mapRowToOrder(orderRow);
    if (order) {
      const itemRows = db.prepare('SELECT * FROM order_items WHERE orderId = ?').all(order.id) as any[];
      order.items = itemRows.map(mapRowToOrderItem).filter(item => item !== undefined) as OrderItem[];
    }
    return order;
  } catch (error) {
    console.error(`Failed to get order ${orderId} for user ${userId}:`, error);
    return undefined;
  }
};

export const createOrder = async (orderData: NewOrderData): Promise<Order | undefined> => {
  const orderDate = new Date().toISOString();
  try {
    // Start a transaction
    const result = db.transaction(() => {
      const orderStmt = db.prepare(`
        INSERT INTO orders (userId, orderDate, totalAmount, status, paymentStatus, shippingAddress, customerFullName, customerEmail)
        VALUES (@userId, @orderDate, @totalAmount, @status, @paymentStatus, @shippingAddress, @customerFullName, @customerEmail)
      `);
      
      const orderInfo = orderStmt.run({
        userId: Number(orderData.userId),
        orderDate: orderDate,
        totalAmount: orderData.totalAmount,
        status: 'Processing', // Initial status
        paymentStatus: orderData.paymentStatus,
        shippingAddress: JSON.stringify(orderData.shippingAddress),
        customerFullName: orderData.shippingAddress.firstName + ' ' + orderData.shippingAddress.lastName,
        customerEmail: '', // Assuming email is not directly in shippingAddress, might need to fetch from user
      });
      const orderId = String(orderInfo.lastInsertRowid);

      const itemStmt = db.prepare(`
        INSERT INTO order_items (orderId, productId, productName, productImageUrl, quantity, priceAtPurchase, size)
        VALUES (@orderId, @productId, @productName, @productImageUrl, @quantity, @priceAtPurchase, @size)
      `);

      for (const item of orderData.items) {
        itemStmt.run({
          orderId: orderId,
          productId: item.productId,
          productName: item.name,
          productImageUrl: item.imageUrl,
          quantity: item.quantity,
          priceAtPurchase: item.price,
          size: item.size || null,
        });

        // Update product stock
        const product = getProductById(item.productId);
        if (product) {
           const currentProduct = product; // getProductById is async, this needs adjustment
           // This part needs to be async or product data fetched before transaction
           // For simplicity in this synchronous transaction, we'll assume stock check happened before.
           // Proper stock update should be handled carefully, potentially moving this part out
           // or fetching all product stocks before the transaction.
           // const newStock = currentProduct.stock - item.quantity;
           // updateProduct(item.productId, { stock: newStock });
        }
      }
      return orderId;
    })(); // Immediately execute the transaction

    const newOrderId = result as string;

    // After transaction, update stock for each product. This is not ideal for atomicity.
    // A more robust solution might involve a two-phase commit or background job for stock.
    for (const item of orderData.items) {
        const product = await getProductById(item.productId); // Fetch fresh product data
        if (product) {
            const newStock = product.stock - item.quantity;
            await updateProduct(item.productId, { stock: newStock });
        }
    }


    revalidatePath('/account/orders');
    revalidatePath(`/account/orders/${newOrderId}`);
    revalidatePath('/admin/orders');
    revalidatePath('/admin/dashboard'); // Revalidate dashboard due to order counts
    
    return getOrderByIdAndUserId(newOrderId, orderData.userId);

  } catch (error) {
    console.error('Failed to create order:', error);
    return undefined;
  }
};

// Admin dashboard/analytics functions
export const getTotalRevenue = async (): Promise<number> => {
  try {
    const result = db.prepare(
      "SELECT SUM(totalAmount) as total FROM orders WHERE paymentStatus = 'Paid' AND status = 'Delivered'"
    ).get() as { total: number | null };
    return result?.total || 0;
  } catch (error) {
    console.error('Failed to get total revenue:', error);
    return 0;
  }
};

export const getTotalOrderCount = async (): Promise<number> => {
  try {
    const result = db.prepare('SELECT COUNT(*) as count FROM orders').get() as { count: number };
    return result?.count || 0;
  } catch (error) {
    console.error('Failed to get total order count:', error);
    return 0;
  }
};

export const getPendingOrderCount = async (): Promise<number> => {
  try {
    const result = db.prepare(
      "SELECT COUNT(*) as count FROM orders WHERE status = 'Processing' OR status = 'Pending Payment'"
    ).get() as { count: number };
    return result?.count || 0;
  } catch (error) {
    console.error('Failed to get pending order count:', error);
    return 0;
  }
};

export const getRecentOrders = async (limit: number = 5): Promise<Order[]> => {
  try {
    // Fetch orders with customer names (denormalized in orders table or joined from users table)
    const orderRows = db.prepare(`
      SELECT o.*, u.fullName as customerFullName, u.email as customerEmail 
      FROM orders o
      LEFT JOIN users u ON o.userId = u.id
      ORDER BY o.orderDate DESC LIMIT ?
    `).all(limit) as any[];
    
    const orders = orderRows.map(mapRowToOrder).filter(Boolean) as Order[];
    
    // Fetch items for each order (can be optimized with a single query and grouping if needed)
    for (const order of orders) {
        const itemRows = db.prepare('SELECT * FROM order_items WHERE orderId = ?').all(order.id) as any[];
        order.items = itemRows.map(mapRowToOrderItem).filter(Boolean) as OrderItem[];
    }
    return orders;
  } catch (error) {
    console.error('Failed to get recent orders:', error);
    return [];
  }
};

export const getAllOrders = async (): Promise<Order[]> => {
    try {
        const orderRows = db.prepare(`
            SELECT o.*, u.fullName as customerFullName, u.email as customerEmail
            FROM orders o
            LEFT JOIN users u ON o.userId = u.id
            ORDER BY o.orderDate DESC
        `).all() as any[];

        const orders: Order[] = [];
        for (const orderRow of orderRows) {
            const order = mapRowToOrder(orderRow);
            if (order) {
                const itemRows = db.prepare('SELECT * FROM order_items WHERE orderId = ?').all(order.id) as any[];
                order.items = itemRows.map(mapRowToOrderItem).filter(item => item !== undefined) as OrderItem[];
                orders.push(order);
            }
        }
        return orders;
    } catch (error) {
        console.error('Failed to get all orders:', error);
        return [];
    }
};


export const getOrdersGroupedByStatus = async (): Promise<Record<string, number>> => {
  try {
    const rows = db.prepare(
      "SELECT status, COUNT(*) as count FROM orders GROUP BY status"
    ).all() as { status: Order['status']; count: number }[];
    
    const grouped: Record<string, number> = {};
    rows.forEach(row => {
      grouped[row.status] = row.count;
    });
    return grouped;
  } catch (error) {
    console.error('Failed to get orders grouped by status:', error);
    return {};
  }
};
