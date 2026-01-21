
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

export type FrequencyType = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'HALF_YEARLY' | 'ANNUALLY' | 'ADHOC';

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

// --- Brick Schema & Operations ---

export type BrickLocationClass = 'Building' | 'Floor' | 'Room' | 'Zone' | 'HVAC_Zone' | 'Outdoor_Area';
export type BrickEquipmentClass = 'AHU' | 'VAV' | 'Boiler' | 'Chiller' | 'Lighting_System' | 'Pump' | 'Fan' | 'Elevator' | 'Security_System';

export interface BrickRelationship {
  type: 'isPartOf' | 'feeds' | 'isLocationOf' | 'hasPoint';
  targetId: string;
}

export interface Location {
  id: string;
  name: string;
  brickClass: BrickLocationClass;
  parentId?: string;
  address?: string;
  tags?: string[];
}

export interface Asset {
  id: string;
  locationId: string; // The primary spatial location
  name: string;
  brickClass: BrickEquipmentClass;
  status: 'OPERATIONAL' | 'DEGRADED' | 'DOWN';
  installationDate: string;
  expectedLifespanYears: number;
  lastMaintenanceDate?: string;
  relationships: BrickRelationship[]; // Brick graph edges
  category: string; // Keep for legacy UI grouping
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

export interface Project {
  id: string;
  name: string;
  status: 'ACTIVE' | 'ON_HOLD' | 'COMPLETED';
  startDate: string;
  endDate?: string;
  budget: number;
  description: string;
  serviceIds: string[];
  locationIds: string[]; // Site selection
}

export interface Contract {
  id: string;
  projectId: string;
  vendorId?: string; // Null if In-house
  sorSetId?: string; // Reference to one active SOR set from the vendor
  title: string;
  description: string;
  value: number;
  status: 'SIGNED' | 'NEGOTIATING' | 'TERMINATED';
  startDate: string;
  endDate: string;
  serviceIds: string[]; // Subset of project services
  vendorMode: 'IN_HOUSE' | 'OUTSOURCE';
  eligibleVendorIds: string[];
}

export interface SOW {
  id: string;
  contractId: string;
  title: string;
  description: string;
  workflowDefinitionId: string; 
  estimatedHours: number;
  startDate: string;
  endDate: string;
  locationIds: string[];
  assetIds: string[];
  serviceId: string; // One service from parent contract list
  vendorId: string;
  allowedFrequencies: FrequencyType[];
  defaultFrequency: FrequencyType;
  actualCost?: number;
}

export interface ScheduledTask {
  id: string;
  sowId: string;
  title: string;
  description?: string;
  checklistId?: string;
  priority?: RequestPriority;
  startTime?: string;
  endTime?: string;
  scheduledAt?: string;
  assignedToIds?: string[]; // User or Group IDs
  assignedTo?: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'OVERDUE';
  locationId: string;
  assetId?: string;
  frequency?: FrequencyType;
  recurrence?: FrequencyType | string;
  frequencyConfig?: Record<string, any>;
  workflowInstanceId?: string;
}

export interface ScheduleOfRate {
  id: string;
  serviceId: string;
  subServiceId: string;
  rate: number;
  unit: string;
}

export interface SORSet {
  id: string;
  name: string;
  description?: string;
  effectiveDate: string;
  expiryDate?: string;
  rates: ScheduleOfRate[];
}

export interface Vendor {
  id: string;
  name: string;
  contactName: string;
  email: string;
  rating: number;
  sorSets: SORSet[];
}
