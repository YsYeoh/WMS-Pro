
import mongoose, { Schema, Document } from 'mongoose';

const RateSchema = new Schema({
  serviceId: { type: String, required: true },
  subServiceId: { type: String, required: true },
  rate: { type: Number, required: true },
  unit: { type: String, required: true }
});

const SORSetSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  effectiveDate: { type: Date, required: true },
  expiryDate: { type: Date },
  rates: [RateSchema]
});

export interface IVendor extends Document {
  tenantId: mongoose.Types.ObjectId;
  name: string;
  contactName: string;
  email: string;
  phone?: string;
  rating: number;
  status: 'ACTIVE' | 'NEGOTIATING' | 'INACTIVE';
  sorSets: any[]; // Array of SORSet subdocuments
}

const VendorSchema: Schema = new Schema({
  tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true, index: true },
  name: { type: String, required: true },
  contactName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  rating: { type: Number, default: 0 },
  status: { type: String, enum: ['ACTIVE', 'NEGOTIATING', 'INACTIVE'], default: 'NEGOTIATING' },
  sorSets: [SORSetSchema]
}, { timestamps: true });

export default mongoose.model<IVendor>('Vendor', VendorSchema);
