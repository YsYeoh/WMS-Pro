
import mongoose, { Schema, Document } from 'mongoose';

// --- DEFINITION ---
const WorkflowDefinitionSchema = new Schema({
  tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true, index: true },
  name: { type: String, required: true },
  description: { type: String },
  status: { type: String, enum: ['DRAFT', 'ACTIVE', 'ARCHIVED'], default: 'DRAFT' },
  states: [{
    id: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String },
    isInitial: { type: Boolean, default: false },
    isFinal: { type: Boolean, default: false },
    slaHours: { type: Number },
    checklistTemplateId: { type: String }
  }],
  transitions: [{
    id: { type: String, required: true },
    name: { type: String, required: true },
    fromStateId: { type: String, required: true },
    toStateId: { type: String, required: true }
  }]
}, { timestamps: true });

// --- INSTANCE ---
const WorkflowInstanceSchema = new Schema({
  workflowId: { type: Schema.Types.ObjectId, ref: 'WorkflowDefinition', required: true, index: true },
  tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true },
  title: { type: String, required: true },
  currentStateId: { type: String, required: true },
  status: { type: String, enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'], default: 'PENDING' },
  assignedTo: { type: String },
  priority: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH'], default: 'MEDIUM' },
  data: { type: Map, of: Schema.Types.Mixed, default: {} }
}, { timestamps: true });

export const WorkflowDefinition = mongoose.model('WorkflowDefinition', WorkflowDefinitionSchema);
export const WorkflowInstance = mongoose.model('WorkflowInstance', WorkflowInstanceSchema);
