
import mongoose, { Schema, Document } from 'mongoose';

// --- PROJECT ---
const ProjectSchema = new Schema({
  tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true, index: true },
  name: { type: String, required: true },
  description: { type: String },
  budget: { type: Number, required: true },
  status: { type: String, enum: ['ACTIVE', 'ON_HOLD', 'COMPLETED'], default: 'ACTIVE' },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  locationIds: [{ type: Schema.Types.ObjectId, ref: 'Location' }]
}, { timestamps: true });

// --- CONTRACT ---
const ContractSchema = new Schema({
  projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true, index: true },
  vendorId: { type: Schema.Types.ObjectId, ref: 'Vendor' }, // Null if In-House
  sorSetId: { type: Schema.Types.ObjectId }, // References the _id of an element in Vendor.sorSets
  title: { type: String, required: true },
  description: { type: String },
  value: { type: Number, required: true },
  status: { type: String, enum: ['SIGNED', 'NEGOTIATING', 'TERMINATED'], default: 'NEGOTIATING' },
  vendorMode: { type: String, enum: ['IN_HOUSE', 'OUTSOURCE'], required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true }
}, { timestamps: true });

// --- STATEMENT OF WORK (SOW) ---
const SOWSchema = new Schema({
  contractId: { type: Schema.Types.ObjectId, ref: 'Contract', required: true, index: true },
  title: { type: String, required: true },
  description: { type: String },
  workflowDefinitionId: { type: Schema.Types.ObjectId, ref: 'WorkflowDefinition' },
  serviceId: { type: String, required: true },
  estimatedHours: { type: Number },
  actualCost: { type: Number, default: 0 },
  locationIds: [{ type: Schema.Types.ObjectId, ref: 'Location' }],
  assetIds: [{ type: Schema.Types.ObjectId, ref: 'Asset' }],
  defaultFrequency: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date }
}, { timestamps: true });

// --- SCHEDULED TASK ---
const TaskSchema = new Schema({
  sowId: { type: Schema.Types.ObjectId, ref: 'SOW', required: true, index: true },
  title: { type: String, required: true },
  description: { type: String },
  status: { type: String, enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'OVERDUE'], default: 'PENDING' },
  priority: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'], default: 'MEDIUM' },
  locationId: { type: Schema.Types.ObjectId, ref: 'Location', required: true },
  assetId: { type: Schema.Types.ObjectId, ref: 'Asset' },
  assignedToIds: [{ type: String }], // References User or Group IDs
  scheduledAt: { type: Date, required: true },
  completedAt: { type: Date },
  workflowInstanceId: { type: Schema.Types.ObjectId, ref: 'WorkflowInstance' },
  frequencyConfig: { type: Map, of: Schema.Types.Mixed }
}, { timestamps: true });

export const Project = mongoose.model('Project', ProjectSchema);
export const Contract = mongoose.model('Contract', ContractSchema);
export const SOW = mongoose.model('SOW', SOWSchema);
export const Task = mongoose.model('Task', TaskSchema);
