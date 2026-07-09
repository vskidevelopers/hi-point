// src/types/index.ts

export type CategoryType = "product" | "service"
export type FulfillmentType = "pickup" | "delivery"
export type OrderPaymentStatus = "pending" | "paid"
export type OrderStatus =
  | "pending_payment"
  | "processing"
  | "ready_for_collection"
  | "out_for_delivery"
  | "completed"
  | "cancelled"
export type TicketStatus =
  | "pending_assessment"
  | "awaiting_consultation_fee"
  | "awaiting_repair_quote"
  | "repair_in_progress"
  | "ready_for_collection"
  | "completed"
  | "cancelled"

export interface Category {
  id: string
  name: string
  slug: string
  type: CategoryType
  created_at: string
}

export interface Product {
  id: string
  category_id: string | null
  name: string
  slug: string
  description: string | null
  base_price: number
  image_url: string | null
  is_inquiry_only: boolean
  created_at: string
}

export interface Order {
  id: string
  order_number: string
  customer_name: string
  customer_phone: string
  customer_email: string | null
  fulfillment_type: FulfillmentType
  delivery_location: string | null
  subtotal: number
  delivery_fee: number | null
  total_amount: number
  mpesa_transaction_code: string | null
  payment_status: OrderPaymentStatus
  order_status: OrderStatus
  created_at: string
  updated_at: string
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string | null
  product_name: string
  quantity: number
  unit_price: number
}

export interface ServiceTicket {
  id: string
  ticket_number: string
  customer_name: string
  customer_phone: string
  customer_email: string | null
  device_brand: string
  device_model: string
  issue_description: string
  consultation_fee: number | null
  repair_quote: number | null
  status: TicketStatus
  created_at: string
  updated_at: string
}

export interface TicketUpdate {
  id: string
  ticket_id: string
  old_status: TicketStatus | null
  new_status: TicketStatus
  admin_notes: string | null
  created_at: string
}
