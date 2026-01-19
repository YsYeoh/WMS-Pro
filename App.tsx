
import React, { useState, createContext, useContext } from 'react';
import { HashRouter, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  GitBranch, 
  Layers, 
  Users, 
  Settings, 
  Bell, 
  Search, 
  Plus, 
  ChevronRight,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  Menu,
  X,
  Sparkles,
  Briefcase,
  Wrench,
  Building,
  ClipboardList,
  Package,
  CalendarCheck,
  ShieldCheck,
  Fingerprint,
  MessageSquare
} from 'lucide-react';
import { Tenant, WorkflowDefinition, WorkflowInstance } from './types';
import { MOCK_TENANTS, MOCK_WORKFLOWS, MOCK_INSTANCES } from './constants';
import Dashboard from './components/Dashboard';
import WorkflowList from './components/WorkflowList';
import WorkflowEditor from './components/WorkflowEditor';
import InstanceDetails from './components/InstanceDetails';
import VendorModule from './components/VendorModule';
import ProjectModule from './components/ProjectModule';
import ProjectDetails from './components/ProjectDetails';
import ServicesModule from './components/ServicesModule';
import AssetModule from './components/AssetModule';
import ChecklistModule from './components/ChecklistModule';
import InventoryModule from './components/InventoryModule';
import TaskModule from './components/TaskModule';
import RBACModule from './components/RBACModule';
import RequestModule from './components/RequestModule';

// Context for Tenant Isolation
interface TenantContextType {
  activeTenant: Tenant;
  setActiveTenant: (tenant: Tenant) => void;
  tenants: Tenant[];
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (!context) throw new Error('useTenant must be used within a TenantProvider');
  return context;
};

const SidebarItem = ({ icon: Icon, label, path, active }: { icon: any, label: string, path: string, active: boolean }) => (
  <Link 
    to={path}
    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
      active 
        ? 'bg-blue-50 text-blue-600 font-medium' 
        : 'text-slate-600 hover:bg-slate-100'
    }`}
  >
    <Icon size={20} />
    <span>{label}</span>
  </Link>
);

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { activeTenant, setActiveTenant, tenants } = useTenant();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform lg:translate-x-0 lg:static ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-blue-600 p-2 rounded-lg text-white">
              <Layers size={24} />
            </div>
            <h1 className="text-xl font-bold tracking-tight">WMS Pro</h1>
          </div>

          <nav className="space-y-1">
            <SidebarItem icon={LayoutDashboard} label="Dashboard" path="/" active={location.pathname === '/'} />
            <SidebarItem icon={MessageSquare} label="Help Desk" path="/requests" active={location.pathname === '/requests'} />
            <SidebarItem icon={CalendarCheck} label="Task Execution" path="/tasks" active={location.pathname === '/tasks'} />
            <SidebarItem icon={Briefcase} label="Projects" path="/projects" active={location.pathname.startsWith('/projects')} />
            <SidebarItem icon={Building} label="Assets & Locations" path="/assets" active={location.pathname === '/assets'} />
            <SidebarItem icon={Package} label="Inventory Stock" path="/inventory" active={location.pathname === '/inventory'} />
            <SidebarItem icon={ClipboardList} label="Checklist SOPs" path="/checklists" active={location.pathname === '/checklists'} />
            <SidebarItem icon={Wrench} label="Services" path="/services" active={location.pathname === '/services'} />
            <SidebarItem icon={GitBranch} label="Workflows" path="/workflows" active={location.pathname.startsWith('/workflows')} />
            <SidebarItem icon={Fingerprint} label="Access Control" path="/rbac" active={location.pathname === '/rbac'} />
            <SidebarItem icon={Users} label="Team & Vendors" path="/team" active={location.pathname === '/team'} />
            <SidebarItem icon={Settings} label="Settings" path="/settings" active={location.pathname === '/settings'} />
          </nav>

          <div className="mt-10 pt-10 border-t border-slate-100">
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Organization
            </label>
            <div className="space-y-2">
              {tenants.map(t => (
                <button
                  key={t.id}
                  onClick={() => setActiveTenant(t)}
                  className={`w-full flex items-center gap-3 p-2 rounded-md transition-all ${
                    activeTenant.id === t.id ? 'bg-slate-100 ring-1 ring-slate-200' : 'hover:bg-slate-50 opacity-60'
                  }`}
                >
                  <img src={t.logo} className="w-8 h-8 rounded bg-slate-200" alt="" />
                  <span className="text-sm font-medium truncate">{t.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 relative">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button className="lg:hidden p-2 text-slate-500" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search processes..." 
                className="pl-10 pr-4 py-2 bg-slate-100 border-transparent focus:bg-white focus:ring-2 focus:ring-blue-500 rounded-lg text-sm w-64 transition-all outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 text-slate-500 hover:bg-slate-50 rounded-full transition-colors">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 border-2 border-white rounded-full"></span>
            </button>
            <div className="h-8 w-px bg-slate-200 mx-2"></div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-slate-700">Alex Admin</p>
                <p className="text-xs text-slate-400">Super User</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                AA
              </div>
            </div>
          </div>
        </header>

        {/* Viewport */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

const App: React.FC = () => {
  const [activeTenant, setActiveTenant] = useState<Tenant>(MOCK_TENANTS[0]);

  return (
    <TenantContext.Provider value={{ activeTenant, setActiveTenant, tenants: MOCK_TENANTS }}>
      <HashRouter>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/requests" element={<RequestModule />} />
            <Route path="/tasks" element={<TaskModule />} />
            <Route path="/projects" element={<ProjectModule />} />
            <Route path="/projects/:id" element={<ProjectDetails />} />
            <Route path="/assets" element={<AssetModule />} />
            <Route path="/inventory" element={<InventoryModule />} />
            <Route path="/checklists" element={<ChecklistModule />} />
            <Route path="/services" element={<ServicesModule />} />
            <Route path="/workflows" element={<WorkflowList />} />
            <Route path="/workflows/new" element={<WorkflowEditor />} />
            <Route path="/workflows/:id" element={<WorkflowEditor />} />
            <Route path="/instance/:id" element={<InstanceDetails />} />
            <Route path="/team" element={<VendorModule />} />
            <Route path="/rbac" element={<RBACModule />} />
            <Route path="*" element={<div className="p-20 text-center text-slate-500">Feature Coming Soon</div>} />
          </Routes>
        </AppLayout>
      </HashRouter>
    </TenantContext.Provider>
  );
};

export default App;
