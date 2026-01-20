import { Inngest } from "inngest";
import { connectDB } from "./db.js";
import { User } from "../models/user.model.js";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "ecommerce-app" });

syncUser = inngest.createFunction(
  { id: "sync-user" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    await connectDB();
    const { id, email_addressess, first_name, last_name, image_url } =
      event.data;

    const new_user = {
      email: email_addressess[0]?.email,
      name: `${first_name || ""} ${last_name || ""}` || "User",
      imageURL: image_url,
      clerkId: id,
      address: [],
      wishlist: [],
    };

    await User.create(new_user);
  }
);

deleteUserFromDB = inngest.createFunction(
  { id: "delete-user" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    await connectDB();
    const { id } = event.data;

    await User.deleteOne({ clerkId: id });
  }
);

// Create an empty array where we'll export future Inngest functions
export const functions = [syncUser, deleteUserFromDB];
