import mongoose, { Schema, Document, Types } from "mongoose";

export type BookingStatus = "Pending" | "Assigned" | "Completed" | "Cancelled";

export interface IBooking extends Document {
  customer?: Types.ObjectId;
  worker?: Types.ObjectId;
  fullName: string;
  phone: string;
  email: string;
  service: string;
  address: string;
  preferredDate: Date;
  preferredTime: string;
  notes: string;
  status: BookingStatus;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    customer: { type: Schema.Types.ObjectId, ref: "User" },
    worker: { type: Schema.Types.ObjectId, ref: "Worker" },

    fullName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    service: { type: String, required: true },
    address: { type: String, required: true },
    preferredDate: Date,
    preferredTime: String,
    notes: String,

    status: {
      type: String,
      enum: ["Pending", "Assigned", "Completed", "Cancelled"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model<IBooking>("Booking", BookingSchema);
