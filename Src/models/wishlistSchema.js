const mongoose = require('mongoose');

const wishlistSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Assuming you have a User model
        required: true,
      },
      products: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product', // Assuming you have a Product model
          required: true,
        },
      ]
})

module.exports = mongoose.model("Wishlist",wishlistSchema);