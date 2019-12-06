
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const slug = require("slug");

const articleSchema = new Schema(
  {
    slug: {
      type: String
    },
    title: {
      type: String,
      require: true
    },
    description: {
      type: String
    },
    body: {
      type: String
    },
    category: {
      type: String,
      enum: ["food", "travel", "motivation", "programming"],
      required: true
    },
    claps: {
      type: Number,
      default: 0
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);

articleSchema.pre("save", function(next) {
  if (this.title && this.isModified("title")) {
    let slugged = slug(this.title, { lower: true });
    this.slug = slugged;
    next();
  } else {
    next();
  }
});


module.exports = mongoose.model('Article',articleSchema);
