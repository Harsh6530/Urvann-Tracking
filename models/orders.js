const mongoose = require('mongoose');

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
  phone: String,
  zip: String,
  full_name: String,
  address: String,
  city: String,
  state: String,
  email: String,
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
  txn_id: String,
  response_description: String,
});

const OrderSchema = new mongoose.Schema({
  data: {
    items: [ItemSchema],
    sub_total: Number,
    total: Number,
    item_count: String,
    status: String,
    financial_status: String,
    cart_id: String,
    email: String,
    phone: String,
    user_id: String,
    discount_total: Number,
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
    order_id: String,
    fulfillment_status: String,
    notes: [String],
    order_date: Date,
  },
  receivedAt: Date,
}, { timestamps: true });

// const Order =  mongoose.models.Order || mongoose.model('Order', OrderSchema);
// module.exports = Order;

export default OrderSchema;