
import mongoose, { Schema, Document } from 'mongoose';

// --- LOCATION ---
const LocationSchema = new Schema({
  tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true, index: true },
  parentId: { type: Schema.Types.ObjectId, ref: 'Location' },
  name: { type: String, required: true },
  brickClass: { 
    type: String, 
    enum: ['Building', 'Floor', 'Room', 'Zone', 'HVAC_Zone', 'Outdoor_Area'],
    required: true 
  },
  address: { type: String },
  tags: [String]
}, { timestamps: true });

// --- ASSET ---
const AssetSchema = new Schema({
  tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true, index: true },
  locationId: { type: Schema.Types.ObjectId, ref: 'Location', required: true },
  name: { type: String, required: true },
  brickClass: { 
    type: String, 
    enum: ['AHU', 'VAV', 'Boiler', 'Chiller', 'Lighting_System', 'Pump', 'Fan', 'Elevator', 'Security_System'],
    required: true 
  },
  status: { type: String, enum: ['OPERATIONAL', 'DEGRADED', 'DOWN'], default: 'OPERATIONAL' },
  installationDate: { type: Date },
  expectedLifespanYears: { type: Number },
  relationships: [{
    relType: { type: String, enum: ['isPartOf', 'feeds', 'isLocationOf', 'hasPoint'] },
    targetId: { type: Schema.Types.ObjectId, required: true }
  }]
}, { timestamps: true });

export const Location = mongoose.model('Location', LocationSchema);
export const Asset = mongoose.model('Asset', AssetSchema);
