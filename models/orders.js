const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema({
  name: String,
  product_id: String,
  product_url: String,
  metafields: {
    redirects: String,
  },
  seller: String,
  seller_name: String,
  price: String,
  list_price: Number,
  discounts_percentage: String,
  discounts_total: String,
  sku: String,
  thumbnail_url: String,
  image_url: String,
  quantity: Number,
  total: Number,
  discount_total: String,
});

const AddressSchema = new mongoose.Schema({
  country: String,
  phone: String, // Frequently queried fields like phone can be indexed
  zip: String,
  full_name: String,
  address: String,
  city: String,
  state: String,
  email: String, // Indexing email for faster lookups
  metafields: {
    alternate_phone_number: String,
  },
});

const PaymentSchema = new mongoose.Schema({
  name: String,
  type: String,
  gateway: String,
  status: String,
  mode: String,
  upi: {
    vpa: String,
    payer_account_type: String,
  },
  txn_id: String, // Index txn_id for quick transaction lookups
  response_description: String,
});

const OrderSchema = new mongoose.Schema(
  {
    data: {
      items: [ItemSchema],
      sub_total: Number,
      total: Number,
      item_count: String,
      status: { type: String, index: true }, // Index status for filtering orders
      financial_status: { type: String, index: true },
      cart_id: String,
      email: { type: String, index: true }, // Index email for fast lookups
      phone: { type: String, index: true }, // Index phone
      user_id: { type: String, index: true }, // Index user_id
      discount_total: Number,
      tracker: { type: [String], default: [] },
      shipping_total: Number,
      shipping_method_name: String,
      currency: {
        name: String,
        conversion_rate: String,
        symbol: String,
      },
      taxes: [String],
      taxes_total: Number,
      billing_address: AddressSchema,
      shipping_address: AddressSchema,
      payment_details: PaymentSchema,
      version: String,
      order_id: { type: String, index: true }, // Index order_id for lookups
      fulfillment_status: { type: String, index: true }, // Index fulfillment status
      notes: [String],
      order_date: { type: Date, index: true }, // Index order_date for sorting/filtering
      txn_id: { type: String, index: true }, // Index txn_id for transaction lookups
    },
    receivedAt: { type: Date, index: true }, // Index receivedAt for sorting/filtering
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

export default OrderSchema;
