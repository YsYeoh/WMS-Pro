
export enum WorkflowStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  ARCHIVED = 'ARCHIVED'
}

export enum InstanceStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export interface Tenant {
  id: string;
  name: string;
  logo?: string;
}

// --- RBAC System ---

export type Permission = 
  | 'workflow.view' | 'workflow.edit' | 'workflow.execute'
  | 'inventory.view' | 'inventory.request' | 'inventory.admin'
  | 'task.view' | 'task.execute'
  | 'asset.view' | 'asset.edit'
  | 'tenant.admin' | 'rbac.manage'
  | 'request.create' | 'request.triage';

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
}

export interface UserGroup {
  id: string;
  name: string;
  description: string;
  memberIds: string[];
}

export interface AppUser {
  id: string;
  name: string;
  email: string;
  roleId: string;
  groupId?: string;
  status: 'ACTIVE' | 'INACTIVE';
  lastLogin?: string;
}

// --- Help Desk / Requests ---

export type RequestStatus = 'SUBMITTED' | 'ASSIGNED' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
export type RequestPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface MaintenanceRequest {
  id: string;
  tenantId: string;
  title: string;
  description: string;
  locationId: string;
  assetId?: string;
  priority: RequestPriority;
  status: RequestStatus;
  reportedBy: string;
  assignedTo?: string; // User or Group ID
  workflowInstanceId?: string; // Linked engine instance
  createdAt: string;
}

// --- Workflow & Operations ---

export interface WorkflowState {
  id: string;
  name: string;
  description: string;
  isInitial?: boolean;
  isFinal?: boolean;
  allowedRoles?: string[];
  slaHours?: number;
  remarkRequired?: boolean;
  checklistTemplateId?: string;
  attachmentRequired?: boolean;
}

export interface WorkflowTransition {
  id: string;
  name: string;
  fromStateId: string;
  toStateId: string;
  requiredRoles?: string[];
  conditions?: string[];
  actions?: string[];
  remarkRequiredOnAction?: boolean;
}

export interface WorkflowDefinition {
  id: string;
  tenantId: string;
  name: string;
  description: string;
  status: WorkflowStatus;
  states: WorkflowState[];
  transitions: WorkflowTransition[];
  createdAt: string;
}

export interface WorkflowInstance {
  id: string;
  workflowId: string;
  tenantId: string;
  title: string;
  currentStateId: string;
  status: InstanceStatus;
  createdBy: string;
  assignedTo?: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  createdAt: string;
  updatedAt: string;
  data: Record<string, any>;
}

export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  quantity: number;
  minStockLevel: number;
  unitCost: number;
  unit: string;
}

export interface InventoryUsageRequest {
  id: string;
  instanceId: string;
  itemId: string;
  quantity: number;
  requestedBy: string;
  status: 'PENDING' | 'APPROVED' | 'DISPATCHED' | 'CONSUMED';
  requestedAt: string;
}

export interface ChecklistTask {
  id: string;
  text: string;
  description?: string;
  required: boolean;
  type: 'BINARY' | 'TEXT' | 'NUMBER';
}

export interface ChecklistTemplate {
  id: string;
  name: string;
  description: string;
  tasks: ChecklistTask[];
}

export interface SubService {
  id: string;
  serviceId: string;
  name: string;
  description: string;
  baseUnit: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  subServices: SubService[];
}

export interface ScheduleOfRate {
  id: string;
  vendorId: string;
  subServiceId: string;
  serviceId: string;
  rate: number;
  unit: string;
  effectiveDate: string;
}

export interface Vendor {
  id: string;
  name: string;
  contactName: string;
  email: string;
  rating: number;
  scheduleOfRates: ScheduleOfRate[];
}

export interface Project {
  id: string;
  name: string;
  status: 'ACTIVE' | 'ON_HOLD' | 'COMPLETED';
  startDate: string;
  budget: number;
  description: string;
}

export interface Contract {
  id: string;
  projectId: string;
  vendorId: string;
  title: string;
  value: number;
  status: 'SIGNED' | 'NEGOTIATING' | 'TERMINATED';
}

export interface Location {
  id: string;
  name: string;
  type: 'BUILDING' | 'FLOOR' | 'ROOM';
  parentId?: string;
  address?: string;
}

export interface Asset {
  id: string;
  locationId: string;
  name: string;
  category: string;
  status: 'OPERATIONAL' | 'DEGRADED' | 'DOWN';
  installationDate: string;
  expectedLifespanYears: number;
  lastMaintenanceDate?: string;
}

export interface SOW {
  id: string;
  contractId: string;
  title: string;
  description: string;
  workflowDefinitionId: string; 
  workflowInstanceId?: string; 
  estimatedHours: number;
  startDate: string;
  endDate: string;
  locationId: string;
  assetId?: string;
  subServiceId: string;
  vendorId: string;
  actualCost?: number;
}

export interface ScheduledTask {
  id: string;
  sowId: string;
  title: string;
  scheduledAt: string;
  assignedTo: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'OVERDUE';
  recurrence?: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'ANNUALLY' | 'ADHOC';
  workflowInstanceId?: string;
}
