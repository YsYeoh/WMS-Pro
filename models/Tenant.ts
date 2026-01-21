
import mongoose, { Schema, Document } from 'mongoose';

export interface ITenant extends Document {
  name: string;
  logo?: string;
  settings: {
    currency: string;
    timezone: string;
    brandingColor: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const TenantSchema: Schema = new Schema({
  name: { type: String, required: true, trim: true },
  logo: { type: String },
  settings: {
    currency: { type: String, default: 'USD' },
    timezone: { type: String, default: 'UTC' },
    brandingColor: { type: String, default: '#2563eb' }
  }
}, { timestamps: true });

export default mongoose.model<ITenant>('Tenant', TenantSchema);
