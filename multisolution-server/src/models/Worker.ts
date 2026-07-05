import mongoose, { Schema, Document, Types } from "mongoose";

export interface IWorker extends Document {
  user: Types.ObjectId;
  services: string[];
  experienceYears: number;
  bio: string;
  city: string;
  isAvailable: boolean;
  isVerified: boolean;
  rating: number;
  totalRatings: number;
  createdAt: Date;
  updatedAt: Date;
}

const WorkerSchema = new Schema<IWorker>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    services: {
      type: [String],
      required: true,
      validate: {
        validator: (arr: string[]) => arr.length > 0,
        message: "Select at least one service",
      },
    },
    experienceYears: { type: Number, default: 0, min: 0 },
    bio: { type: String, default: "", maxlength: 500 },
    city: { type: String, required: true, trim: true },
    isAvailable: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    totalRatings: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model<IWorker>("Worker", WorkerSchema);
