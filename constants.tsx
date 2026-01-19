
import { Tenant, WorkflowDefinition, WorkflowStatus, InstanceStatus, WorkflowInstance, Vendor, Project, Contract, SOW, ScheduledTask, Service, Location, Asset, ChecklistTemplate, InventoryItem, InventoryUsageRequest, Role, UserGroup, AppUser, MaintenanceRequest } from './types';

export const MOCK_TENANTS: Tenant[] = [
  { id: 't1', name: 'Global Assets Corp', logo: 'https://picsum.photos/40/40?random=1' },
  { id: 't2', name: 'Metro Build Group', logo: 'https://picsum.photos/40/40?random=2' },
];

export const MOCK_ROLES: Role[] = [
  { id: 'role-1', name: 'Super Admin', description: 'Full access to all tenant resources and security settings.', permissions: ['workflow.edit', 'workflow.view', 'workflow.execute', 'inventory.admin', 'rbac.manage', 'tenant.admin', 'request.triage'] },
  { id: 'role-2', name: 'Operations Manager', description: 'Can define workflows and approve high-value SOWs.', permissions: ['workflow.view', 'workflow.execute', 'workflow.edit', 'inventory.view', 'task.view', 'asset.view', 'request.triage'] },
  { id: 'role-3', name: 'Field Technician', description: 'Assigned to execution of tasks and inventory requests.', permissions: ['task.execute', 'task.view', 'inventory.request', 'asset.view', 'workflow.view', 'request.create'] },
  { id: 'role-4', name: 'Vendor Auditor', description: 'External role for verifying project compliance.', permissions: ['asset.view', 'workflow.view', 'task.view'] },
];

export const MOCK_GROUPS: UserGroup[] = [
  { id: 'grp-1', name: 'HVAC Specialists', description: 'Core team for thermal and air quality assets.', memberIds: ['u-1', 'u-3'] },
  { id: 'grp-2', name: 'Facility Auditors', description: 'Responsible for annual safety compliance checks.', memberIds: ['u-2'] },
  { id: 'grp-3', name: 'Electrical Response', description: 'Emergency electrical maintenance unit.', memberIds: ['u-1'] },
];

export const MOCK_USERS: AppUser[] = [
  { id: 'u-1', name: 'Alex Rivera', email: 'alex@wms-pro.com', roleId: 'role-1', groupId: 'grp-1', status: 'ACTIVE', lastLogin: '2024-03-01T10:00:00Z' },
  { id: 'u-2', name: 'Sarah Chen', email: 'sarah@wms-pro.com', roleId: 'role-2', groupId: 'grp-2', status: 'ACTIVE', lastLogin: '2024-03-02T08:30:00Z' },
  { id: 'u-3', name: 'Mike Johnson', email: 'mike@wms-pro.com', roleId: 'role-3', groupId: 'grp-1', status: 'ACTIVE', lastLogin: '2024-03-02T11:45:00Z' },
  { id: 'u-4', name: 'Vendor Portal Test', email: 'test@vendor.com', roleId: 'role-4', status: 'INACTIVE' },
];

export const MOCK_TEAM_MEMBERS = [
  { id: 'tm-1', name: 'Alex Rivera', role: 'Super Admin', department: 'Executive', email: 'alex@wms-pro.com' },
  { id: 'tm-2', name: 'Sarah Chen', role: 'Operations Manager', department: 'Operations', email: 'sarah@wms-pro.com' },
  { id: 'tm-3', name: 'Mike Johnson', role: 'Field Technician', department: 'Field Ops', email: 'mike@wms-pro.com' },
];

export const MOCK_REQUESTS: MaintenanceRequest[] = [
  {
    id: 'req-101',
    tenantId: 't1',
    title: 'Server Room Overheating',
    description: 'Ambient temperature reached 32C. Core switches are at risk. Immediate inspection needed.',
    locationId: 'loc-3',
    assetId: 'ast-2',
    priority: 'URGENT',
    status: 'ASSIGNED',
    reportedBy: 'Alex Admin',
    assignedTo: 'grp-1',
    createdAt: '2024-03-05T08:00:00Z'
  },
  {
    id: 'req-102',
    tenantId: 't1',
    title: 'Broken Light Fixture',
    description: 'Main lobby entrance, third bulb from the left is flickering and partially detached.',
    locationId: 'loc-1',
    priority: 'MEDIUM',
    status: 'SUBMITTED',
    reportedBy: 'John Staff',
    createdAt: '2024-03-05T09:15:00Z'
  },
  {
    id: 'req-103',
    tenantId: 't1',
    title: 'Water Leak in Floor 5',
    description: 'Slow drip from the ceiling near room 504. Potentially from the HVAC condensate line.',
    locationId: 'loc-2',
    priority: 'HIGH',
    status: 'IN_PROGRESS',
    reportedBy: 'Sarah Lead',
    assignedTo: 'u-3',
    workflowInstanceId: 'inst1',
    createdAt: '2024-03-04T16:30:00Z'
  }
];

export const MOCK_INVENTORY: InventoryItem[] = [
  { id: 'inv-1', sku: 'HVAC-FLT-20', name: 'HEPA Air Filter (Large)', category: 'HVAC', quantity: 45, minStockLevel: 10, unitCost: 85, unit: 'pcs' },
  { id: 'inv-2', sku: 'LIT-LED-12W', name: 'Smart LED Bulb 12W', category: 'Electrical', quantity: 120, minStockLevel: 30, unitCost: 12, unit: 'pcs' },
  { id: 'inv-3', sku: 'CMP-VAL-34', name: 'Pressure Release Valve 3/4"', category: 'Plumbing', quantity: 8, minStockLevel: 15, unitCost: 210, unit: 'pcs' },
  { id: 'inv-4', sku: 'CAB-CAT6-1K', name: 'CAT6 Ethernet Cable (1000ft)', category: 'IT', quantity: 4, minStockLevel: 2, unitCost: 180, unit: 'roll' },
];

export const MOCK_INVENTORY_REQUESTS: InventoryUsageRequest[] = [
  { id: 'req-1', instanceId: 'inst1', itemId: 'inv-1', quantity: 2, requestedBy: 'Tech Alpha', status: 'CONSUMED', requestedAt: '2023-10-15T10:00:00Z' },
];

export const MOCK_CHECKLISTS: ChecklistTemplate[] = [
  {
    id: 'ck-1',
    name: 'Standard AC Inspection',
    description: 'Quarterly checks for central HVAC units.',
    tasks: [
      { id: 't-1', text: 'Clean air filters', required: true, type: 'BINARY' },
      { id: 't-2', text: 'Check refrigerant pressure', required: true, type: 'NUMBER' },
      { id: 't-3', text: 'Drain pan inspection', required: true, type: 'BINARY' },
      { id: 't-4', text: 'Ambient temp reading', required: false, type: 'NUMBER' },
    ]
  },
  {
    id: 'ck-2',
    name: 'Electrical Safety Audit',
    description: 'Mandatory annual safety wiring verification.',
    tasks: [
      { id: 't-5', text: 'Verify grounding continuity', required: true, type: 'BINARY' },
      { id: 't-6', text: 'Visual casing check', required: true, type: 'BINARY' },
      { id: 't-7', text: 'Thermal imaging notes', required: false, type: 'TEXT' },
    ]
  }
];

export const MOCK_LOCATIONS: Location[] = [
  { id: 'loc-1', name: 'East Tower', type: 'BUILDING', address: '123 Business Way, Downtown' },
  { id: 'loc-2', name: 'Floor 5', type: 'FLOOR', parentId: 'loc-1' },
  { id: 'loc-3', name: 'Server Room A', type: 'ROOM', parentId: 'loc-2' },
  { id: 'loc-4', name: 'West Wing', type: 'BUILDING', address: '456 Industry St' },
];

export const MOCK_ASSETS: Asset[] = [
  { id: 'ast-1', locationId: 'loc-2', name: 'Carrier Central AC Unit', category: 'HVAC', status: 'OPERATIONAL', installationDate: '2018-05-15', expectedLifespanYears: 15, lastMaintenanceDate: '2023-08-10' },
  { id: 'ast-2', locationId: 'loc-3', name: 'Cisco Core Switch', category: 'IT', status: 'DEGRADED', installationDate: '2021-02-20', expectedLifespanYears: 5, lastMaintenanceDate: '2023-12-01' },
  { id: 'ast-3', locationId: 'loc-1', name: 'Main Elevator A', category: 'Lifts', status: 'DOWN', installationDate: '2010-11-30', expectedLifespanYears: 25, lastMaintenanceDate: '2023-01-15' },
];

export const MOCK_SERVICES: Service[] = [
  {
    id: 'srv-1',
    name: 'Electrical Works',
    description: 'General electrical maintenance and installation.',
    subServices: [
      { id: 'sub-1', serviceId: 'srv-1', name: 'Lighting Repair', description: 'Fixing indoor/outdoor lights', baseUnit: 'Per Light' },
      { id: 'sub-2', serviceId: 'srv-1', name: 'Wiring Inspection', description: 'Safety wiring checks', baseUnit: 'Per Hour' },
    ]
  },
  {
    id: 'srv-2',
    name: 'Plumbing Services',
    description: 'Water and sanitation systems.',
    subServices: [
      { id: 'sub-3', serviceId: 'srv-2', name: 'Leak Detection', description: 'Finding hidden water leaks', baseUnit: 'Fixed' },
      { id: 'sub-4', serviceId: 'srv-2', name: 'Pipe Replacement', description: 'Installing new pipes', baseUnit: 'Per Meter' },
    ]
  }
];

export const MOCK_WORKFLOWS: WorkflowDefinition[] = [
  {
    id: 'w1',
    tenantId: 't1',
    name: 'Facility Maintenance Request',
    description: 'Standard procedure for reporting and fixing asset issues.',
    status: WorkflowStatus.ACTIVE,
    states: [
      { id: 's1', name: 'New Request', description: 'Request submitted', isInitial: true },
      { id: 's2', name: 'Inspection', description: 'Technician evaluating', checklistTemplateId: 'ck-1' },
      { id: 's3', name: 'Approval Required', description: 'Waiting for manager' },
      { id: 's4', name: 'In Repair', description: 'Work in progress' },
      { id: 's5', name: 'Completed', description: 'Work verified', isFinal: true },
    ],
    transitions: [
      { id: 'tr1', name: 'Begin Inspection', fromStateId: 's1', toStateId: 's2' },
      { id: 'tr2', name: 'Request Quote Approval', fromStateId: 's2', toStateId: 's3' },
      { id: 'tr3', name: 'Approve Work', fromStateId: 's3', toStateId: 's4' },
      { id: 'tr4', name: 'Finish Repair', fromStateId: 's4', toStateId: 's5' },
    ],
    createdAt: '2023-10-01T10:00:00Z',
  }
];

export const MOCK_INSTANCES: WorkflowInstance[] = [
  {
    id: 'inst1',
    workflowId: 'w1',
    tenantId: 't1',
    title: 'AC Unit Repair - Floor 5',
    currentStateId: 's2',
    status: InstanceStatus.IN_PROGRESS,
    createdBy: 'John Doe',
    assignedTo: 'Tech Team Alpha',
    priority: 'HIGH',
    createdAt: '2023-10-15T08:30:00Z',
    updatedAt: '2023-10-15T09:15:00Z',
    data: { assetId: 'ast-1', floor: 5, building: 'East Tower' }
  }
];

export const MOCK_VENDORS: Vendor[] = [
  {
    id: 'v1',
    name: 'Precision Plumbing Inc.',
    contactName: 'James Water',
    email: 'james@precision.com',
    rating: 4.8,
    scheduleOfRates: [
      { id: 'sor-1', vendorId: 'v1', serviceId: 'srv-2', subServiceId: 'sub-3', rate: 150, unit: 'Fixed', effectiveDate: '2023-01-01' },
      { id: 'sor-2', vendorId: 'v1', serviceId: 'srv-2', subServiceId: 'sub-4', rate: 45, unit: 'Per Meter', effectiveDate: '2023-01-01' },
    ]
  },
  {
    id: 'v2',
    name: 'VoltStream Electrical',
    contactName: 'Sarah Spark',
    email: 'sarah@voltstream.net',
    rating: 4.5,
    scheduleOfRates: [
      { id: 'sor-3', vendorId: 'v2', serviceId: 'srv-1', subServiceId: 'sub-1', rate: 85, unit: 'Per Light', effectiveDate: '2023-01-01' },
      { id: 'sor-4', vendorId: 'v2', serviceId: 'srv-1', subServiceId: 'sub-2', rate: 120, unit: 'Per Hour', effectiveDate: '2023-01-01' },
    ]
  }
];

export const MOCK_PROJECTS: Project[] = [
  {
    id: 'p1',
    name: 'Tower B Renovation',
    status: 'ACTIVE',
    startDate: '2023-01-10',
    budget: 500000,
    description: 'Complete overhaul of the Tower B main lobby and first 5 floors.'
  }
];

export const MOCK_CONTRACTS: Contract[] = [
  {
    id: 'c1',
    projectId: 'p1',
    vendorId: 'v2',
    title: 'Electrical System Overhaul',
    value: 120000,
    status: 'SIGNED'
  }
];

export const MOCK_SOWS: SOW[] = [
  {
    id: 'sow1',
    contractId: 'c1',
    title: 'Floor 1 Lighting Installation',
    description: 'Replacing all incandescent fixtures with smart LEDs.',
    workflowDefinitionId: 'w1',
    estimatedHours: 40,
    startDate: '2023-11-01',
    endDate: '2023-11-15',
    locationId: 'loc-2',
    assetId: 'ast-1',
    subServiceId: 'sub-1',
    vendorId: 'v2',
    actualCost: 3400
  }
];

export const MOCK_TASKS: ScheduledTask[] = [
  { id: 'tsk1', sowId: 'sow1', title: 'Circuit Inspection', scheduledAt: '2023-11-02 09:00', assignedTo: 'James Water', status: 'COMPLETED', recurrence: 'ADHOC' },
  { id: 'tsk2', sowId: 'sow1', title: 'Fixture Unboxing', scheduledAt: '2023-11-03 10:00', assignedTo: 'VoltStream Team', status: 'COMPLETED', recurrence: 'ADHOC' },
  { id: 'tsk3', sowId: 'sow1', title: 'Monthly HVAC Filter Check', scheduledAt: '2024-03-01 08:00', assignedTo: 'VoltStream Team', status: 'IN_PROGRESS', recurrence: 'MONTHLY', workflowInstanceId: 'inst1' },
  { id: 'tsk4', sowId: 'sow1', title: 'Quarterly Fire Alarm Test', scheduledAt: '2024-03-10 14:00', assignedTo: 'Sarah Spark', status: 'PENDING', recurrence: 'QUARTERLY' },
  { id: 'tsk5', sowId: 'sow1', title: 'Daily Site Patrol', scheduledAt: '2024-03-05 07:00', assignedTo: 'Alex Rivera', status: 'OVERDUE', recurrence: 'DAILY' },
];
