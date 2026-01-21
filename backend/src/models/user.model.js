import mongoosse from "mongoose";

const addressSchema = new mongoosse.Schema({
  label: {
    type: String,
    required: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  street: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  zipcode: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  isDefault: {
    type: Boolean,
    default: false,
  },
});

const userSchema = new mongoosse.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    imageURL: {
      type: String,
      default: "",
    },
    clerkId: {
      type: String,
      required: true,
      unique: true,
    },
    address: [addressSchema],
    //wishlist will be array of product IDs(list of products they liked) such as 1,2,3. If nothing selected it will be empty
    //wishlist: [
    //  {
    //    type: mongoosse.Schema.Types.ObjectId,
    //   ref: "product",
    //},
    //],
  },
  { timestamps: true } //so that we willl get the created_at and updated_at columns automatically
);

export const User = mongoosse.model("User", userSchema);
