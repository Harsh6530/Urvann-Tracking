const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema({
  name: String,
  sku: { type: String, required: true, unique: true, index: true }, // Add indexing for faster lookups
  image_url: String,
});

// Export the schema
export default photoSchema;
