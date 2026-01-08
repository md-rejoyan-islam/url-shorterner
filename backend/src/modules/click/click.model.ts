import mongoose, { Model, Schema } from "mongoose";
import { IClick, IClickModel } from "./click.type";

type ClickModel = Model<IClick, object> & IClickModel;

const clickSchema = new Schema<IClick, ClickModel>(
  {
    url: {
      type: Schema.Types.ObjectId,
      ref: "Url",
      required: true,
      index: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
    location: {
      country: { type: String, default: null },
      city: { type: String, default: null },
      latitude: { type: Number, default: null },
      longitude: { type: Number, default: null },
    },
    device: {
      type: {
        type: String,
        enum: ["mobile", "desktop", "tablet"],
        default: "desktop",
      },
      os: { type: String, default: null },
      browser: { type: String, default: null },
    },
    ipAddress: {
      type: String,
      default: null,
    },
    referrer: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for efficient queries
clickSchema.index({ url: 1, timestamp: -1 });
clickSchema.index({ user: 1, timestamp: -1 });
clickSchema.index({ "location.country": 1 });
clickSchema.index({ "device.type": 1 });

// Static method: Find clicks by URL
clickSchema.statics.findByUrl = async function (
  urlId: string
): Promise<IClick[]> {
  return this.find({ url: urlId }).sort({ timestamp: -1 });
};

// Static method: Count clicks by URL
clickSchema.statics.countByUrl = async function (
  urlId: string
): Promise<number> {
  return this.countDocuments({ url: urlId });
};

const Click = mongoose.model<IClick, ClickModel>("Click", clickSchema);

export default Click;
