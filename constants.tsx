import { Tenant, WorkflowDefinition, WorkflowStatus, InstanceStatus, WorkflowInstance, Vendor, Project, Contract, SOW, ScheduledTask, Service, Location, Asset, ChecklistTemplate, InventoryItem, InventoryUsageRequest, Role, UserGroup, AppUser, MaintenanceRequest, BrickLocationClass, BrickEquipmentClass } from './types';

export const BRICK_LOCATIONS: BrickLocationClass[] = ['Building', 'Floor', 'Room', 'Zone', 'HVAC_Zone', 'Outdoor_Area'];
export const BRICK_EQUIPMENT: BrickEquipmentClass[] = ['AHU', 'VAV', 'Boiler', 'Chiller', 'Lighting_System', 'Pump', 'Fan', 'Elevator', 'Security_System'];

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

export const MOCK_SERVICES: Service[] = [
  {
    id: 'srv-1',
    name: 'Electrical Infrastructure',
    description: 'Power distribution, lighting, and safety systems.',
    subServices: [
      { id: 'sub-1', serviceId: 'srv-1', name: 'Fixture Replacement (LED)', description: 'Full unit replacement of luminaires.', baseUnit: 'Per Fitting' },
      { id: 'sub-2', serviceId: 'srv-1', name: 'Distribution Board Audit', description: 'Annual thermal scan and load balancing.', baseUnit: 'Per Board' },
      { id: 'sub-11', serviceId: 'srv-1', name: 'Emergency Light Test', description: 'Monthly battery discharge verification.', baseUnit: 'Per Site' },
      { id: 'sub-12', serviceId: 'srv-1', name: 'Earthing System Verification', description: 'Soil resistivity and continuity test.', baseUnit: 'Per Point' },
    ]
  },
  {
    id: 'srv-2',
    name: 'Mechanical & HVAC',
    description: 'Climate control, air filtration, and central heating.',
    subServices: Array.from({ length: 45 }).map((_, i) => ({
      id: `sub-mch-${i}`,
      serviceId: 'srv-2',
      name: `HVAC Procedure Code ${100 + i}`,
      description: `Technical maintenance routine for industrial climate control systems level ${i}.`,
      baseUnit: i % 2 === 0 ? 'Per Hour' : 'Fixed Rate'
    }))
  },
  {
    id: 'srv-3',
    name: 'Hydraulic & Plumbing',
    description: 'Potable water, sanitation, and storm drainage.',
    subServices: [
      { id: 'sub-3', serviceId: 'srv-3', name: 'Potable Water Sampling', description: 'Legionella and quality verification.', baseUnit: 'Per Sample' },
      { id: 'sub-4', serviceId: 'srv-3', name: 'Backflow Preventer Test', description: 'Statutory compliance verification.', baseUnit: 'Per Device' },
    ]
  },
  {
    id: 'srv-4',
    name: 'Vertical Transportation',
    description: 'Escalators, elevators, and moving walkways.',
    subServices: [
      { id: 'sub-21', serviceId: 'srv-4', name: 'Quarterly Lift Audit', description: 'Standard safety and performance check.', baseUnit: 'Per Car' },
      { id: 'sub-22', serviceId: 'srv-4', name: 'Governor Calibration', description: 'Annual mechanical speed control tuning.', baseUnit: 'Per Car' },
    ]
  }
];

export const MOCK_REQUESTS: MaintenanceRequest[] = [
  { id: 'req-101', tenantId: 't1', title: 'Server Room Overheating', description: 'Ambient reached 32C.', locationId: 'loc-3', assetId: 'ast-2', priority: 'URGENT', status: 'ASSIGNED', reportedBy: 'Alex Admin', createdAt: '2024-03-05T08:00:00Z' },
];

export const MOCK_INVENTORY: InventoryItem[] = [
  { id: 'inv-1', sku: 'HVAC-FLT-20', name: 'HEPA Air Filter (Large)', category: 'HVAC', quantity: 45, minStockLevel: 10, unitCost: 85, unit: 'pcs' },
];

export const MOCK_INVENTORY_REQUESTS: InventoryUsageRequest[] = [
  { id: 'req-1', instanceId: 'inst1', itemId: 'inv-1', quantity: 2, requestedBy: 'Tech Alpha', status: 'CONSUMED', requestedAt: '2023-10-15T10:00:00Z' },
];

export const MOCK_CHECKLISTS: ChecklistTemplate[] = [
  { id: 'ck-1', name: 'Standard AC Inspection', description: 'Quarterly checks.', tasks: [{ id: 't-1', text: 'Clean air filters', required: true, type: 'BINARY' }] },
];

export const MOCK_LOCATIONS: Location[] = [
  { id: 'loc-1', name: 'East Tower', brickClass: 'Building', address: '123 Business Way, Downtown' },
  { id: 'loc-2', name: 'Floor 5', brickClass: 'Floor', parentId: 'loc-1' },
  { id: 'loc-3', name: 'Server Room A', brickClass: 'Room', parentId: 'loc-2' },
];

export const MOCK_ASSETS: Asset[] = [
  { id: 'ast-1', locationId: 'loc-2', name: 'Carrier Central AC Unit', brickClass: 'AHU', status: 'OPERATIONAL', installationDate: '2018-05-15', expectedLifespanYears: 15, category: 'HVAC', relationships: [] },
];

export const MOCK_WORKFLOWS: WorkflowDefinition[] = [
  { id: 'w1', tenantId: 't1', name: 'Maintenance Request', description: 'Standard fix procedure.', status: WorkflowStatus.ACTIVE, states: [{ id: 's1', name: 'New', description: 'Submitted', isInitial: true }, { id: 's5', name: 'Completed', description: 'Verified', isFinal: true }], transitions: [{ id: 'tr1', name: 'Start', fromStateId: 's1', toStateId: 's5' }], createdAt: '2023-10-01T10:00:00Z' }
];

export const MOCK_INSTANCES: WorkflowInstance[] = [
  { id: 'inst1', workflowId: 'w1', tenantId: 't1', title: 'AC Repair', currentStateId: 's1', status: InstanceStatus.IN_PROGRESS, createdBy: 'John Doe', priority: 'HIGH', createdAt: '2023-10-15T08:30:00Z', updatedAt: '2023-10-15T09:15:00Z', data: { assetId: 'ast-1' } }
];

export const MOCK_VENDORS: Vendor[] = [
  { id: 'v1', name: 'Precision Plumbing Inc.', contactName: 'James Water', email: 'james@precision.com', rating: 4.8, sorSets: [] }
];

export const MOCK_PROJECTS: Project[] = [
  { id: 'p1', name: 'Tower B Renovation', status: 'ACTIVE', startDate: '2023-01-10', budget: 500000, description: 'Complete overhaul.', serviceIds: ['srv-1', 'srv-2'], locationIds: ['loc-1', 'loc-2'] }
];

export const MOCK_CONTRACTS: Contract[] = [
  { id: 'c1', projectId: 'p1', title: 'Electrical Overhaul', description: 'Remediation.', value: 120000, status: 'SIGNED', startDate: '2023-05-01', endDate: '2024-12-31', serviceIds: ['srv-1'], vendorMode: 'OUTSOURCE', eligibleVendorIds: ['v2'] }
];

export const MOCK_SOWS: SOW[] = [
  { id: 'sow1', contractId: 'c1', title: 'Lighting Install', description: 'Replacement.', workflowDefinitionId: 'w1', estimatedHours: 40, startDate: '2023-11-01', endDate: '2023-11-15', locationIds: ['loc-1', 'loc-2'], assetIds: ['ast-1'], serviceId: 'srv-1', vendorId: 'v2', allowedFrequencies: ['ADHOC'], defaultFrequency: 'ADHOC', actualCost: 3400 }
];

export const MOCK_TASKS: ScheduledTask[] = [
  { id: 'tsk1', sowId: 'sow1', title: 'Circuit Inspection', scheduledAt: '2023-11-02 09:00', assignedTo: 'James Water', status: 'COMPLETED', recurrence: 'ADHOC', locationId: 'loc-1' }
];

// Fix: Exported MOCK_TEAM_MEMBERS which was missing and required by VendorModule.tsx
export const MOCK_TEAM_MEMBERS = [
  { id: 'tm-1', name: 'James Wilson', role: 'Chief Engineer', department: 'Operations', email: 'james.wilson@wms-pro.com' },
  { id: 'tm-2', name: 'Elena Rodriguez', role: 'Safety Auditor', department: 'Compliance', email: 'elena.r@wms-pro.com' },
  { id: 'tm-3', name: 'David Park', role: 'Inventory Manager', department: 'Logistics', email: 'd.park@wms-pro.com' }
];