import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactFlow, { 
  Background, 
  Controls, 
  Panel, 
  useNodesState, 
  useEdgesState, 
  addEdge,
  Connection,
  Edge,
  Node,
  Handle,
  Position,
  MarkerType
} from 'reactflow';
import { 
  ArrowLeft, 
  Save, 
  Plus, 
  Trash2, 
  Sparkles, 
  Settings2,
  AlertCircle,
  CheckCircle2,
  GitCommit,
  MousePointer2,
  Clock,
  Users,
  ClipboardCheck,
  Paperclip,
  MessageSquareText,
  Workflow,
  ShieldAlert
} from 'lucide-react';
import { WorkflowDefinition, WorkflowState, WorkflowTransition, WorkflowStatus } from '../types';
import { MOCK_WORKFLOWS, MOCK_CHECKLISTS } from '../constants';
import { generateWorkflowStructure } from '../geminiService';

// Mock Roles for selection
const AVAILABLE_ROLES = ['Admin', 'Manager', 'Technician', 'Vendor', 'Approver', 'Finance'];

// --- Custom Node Component ---
const StateNode = ({ data, selected }: { data: any, selected: boolean }) => {
  return (
    <div className={`min-w-[200px] bg-white border-2 rounded-xl shadow-sm transition-all duration-200 overflow-hidden ${
      selected 
        ? 'border-blue-600 ring-4 ring-blue-100/50 shadow-lg scale-[1.02]' 
        : 'border-slate-200 hover:border-slate-300'
    }`}>
      <Handle type="target" position={Position.Top} className="!bg-blue-400" />
      <div className={`p-3 border-b flex items-center justify-between gap-2 transition-colors duration-200 ${
        selected ? 'bg-blue-50 border-blue-100' : 'bg-slate-50/50 border-slate-100'
      }`}>
        <div className="flex items-center gap-2 overflow-hidden">
          <GitCommit size={14} className={`${selected ? 'text-blue-700' : 'text-blue-600'} shrink-0`} />
          <span className={`font-bold text-xs truncate ${selected ? 'text-blue-900' : 'text-slate-700'}`}>{data.name}</span>
        </div>
        <div className="flex gap-1 shrink-0">
          {data.isInitial && <span className="px-1 py-0.5 bg-indigo-100 text-indigo-700 text-[8px] font-black rounded uppercase tracking-tighter">Start</span>}
          {data.isFinal && <span className="px-1 py-0.5 bg-emerald-100 text-emerald-700 text-[8px] font-black rounded uppercase tracking-tighter">End</span>}
        </div>
      </div>
      <div className="p-3">
        <p className="text-[10px] text-slate-500 leading-tight mb-2 italic">
          {data.description || 'No description...'}
        </p>
        
        {/* Indicators for configured features */}
        {/* Fix: Wrapped Lucide icons in spans with title prop as icons themselves do not accept title in their React props */}
        <div className="flex flex-wrap gap-1.5 mt-2">
          {data.slaHours > 0 && <span title={`SLA: ${data.slaHours}h`}><Clock size={12} className="text-amber-500" /></span>}
          {data.allowedRoles?.length > 0 && <span title="Roles assigned"><Users size={12} className="text-indigo-500" /></span>}
          {data.checklistTemplateId && <span title="Checklist SOP attached"><ClipboardCheck size={12} className="text-emerald-500" /></span>}
          {data.attachmentRequired && <span title="Attachment required"><Paperclip size={12} className="text-blue-500" /></span>}
          {data.remarkRequired && <span title="Remark required"><MessageSquareText size={12} className="text-slate-400" /></span>}
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-blue-400" />
    </div>
  );
};

const nodeTypes = {
  workflowState: StateNode,
};

const WorkflowEditor: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  
  const [workflow, setWorkflow] = useState<Partial<WorkflowDefinition>>({
    name: '',
    description: '',
    status: WorkflowStatus.DRAFT,
    states: [],
    transitions: []
  });

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Validation Metrics
  const initialCount = nodes.filter(n => n.data.isInitial).length;
  const finalCount = nodes.filter(n => n.data.isFinal).length;
  const isValid = initialCount === 1 && finalCount >= 1;

  // Load existing workflow
  useEffect(() => {
    if (id) {
      const existing = MOCK_WORKFLOWS.find(w => w.id === id);
      if (existing) {
        setWorkflow(existing);
        const initialNodes: Node[] = existing.states.map((s, idx) => ({
          id: s.id,
          type: 'workflowState',
          position: { x: 250, y: idx * 200 },
          data: { ...s }
        }));
        setNodes(initialNodes);

        const initialEdges: Edge[] = existing.transitions.map(t => ({
          id: t.id,
          source: t.fromStateId,
          target: t.toStateId,
          label: t.name,
          animated: true,
          markerEnd: { type: MarkerType.ArrowClosed, color: '#3b82f6' },
          style: { stroke: '#3b82f6' },
          data: { ...t }
        }));
        setEdges(initialEdges);
      }
    }
  }, [id, setNodes, setEdges]);

  // Sync flow back to workflow object
  useEffect(() => {
    const states: WorkflowState[] = nodes.map(n => ({
      id: n.id,
      name: n.data.name,
      description: n.data.description,
      isInitial: n.data.isInitial,
      isFinal: n.data.isFinal,
      allowedRoles: n.data.allowedRoles || [],
      slaHours: n.data.slaHours,
      remarkRequired: n.data.remarkRequired,
      checklistTemplateId: n.data.checklistTemplateId,
      attachmentRequired: n.data.attachmentRequired
    }));

    const transitions: WorkflowTransition[] = edges.map(e => ({
      id: e.id,
      name: (e.label as string) || 'Transition',
      fromStateId: e.source,
      toStateId: e.target,
      requiredRoles: e.data?.requiredRoles || [],
      conditions: e.data?.conditions || [],
      remarkRequiredOnAction: e.data?.remarkRequiredOnAction
    }));

    setWorkflow(prev => ({ ...prev, states, transitions }));
  }, [nodes, edges]);

  const onConnect = useCallback((params: Connection) => {
    const newEdge = {
      ...params,
      id: `tr-${Date.now()}`,
      label: 'New Transition',
      animated: true,
      markerEnd: { type: MarkerType.ArrowClosed, color: '#3b82f6' },
      style: { stroke: '#3b82f6' },
      data: { requiredRoles: [], conditions: [], remarkRequiredOnAction: false }
    };
    setEdges((eds) => addEdge(newEdge, eds));
  }, [setEdges]);

  const handleAiGenerate = async () => {
    if (!aiPrompt.trim()) return;
    setLoading(true);
    try {
      const result = await generateWorkflowStructure(aiPrompt);
      const newNodes: Node[] = result.states.map((s: any, idx: number) => ({
        id: s.id,
        type: 'workflowState',
        position: { x: 100 + (idx % 2) * 250, y: 100 + Math.floor(idx / 2) * 200 },
        data: { ...s, allowedRoles: [], slaHours: 24 }
      }));
      const newEdges: Edge[] = result.transitions.map((t: any) => ({
        id: t.id,
        source: t.fromStateId,
        target: t.toStateId,
        label: t.name,
        animated: true,
        markerEnd: { type: MarkerType.ArrowClosed, color: '#3b82f6' },
        style: { stroke: '#3b82f6' },
        data: { requiredRoles: [], conditions: [], remarkRequiredOnAction: false }
      }));
      setNodes(newNodes);
      setEdges(newEdges);
      setWorkflow(prev => ({ ...prev, name: result.name, description: result.description }));
    } catch (error) {
      console.error("AI Generation failed", error);
    } finally {
      setLoading(false);
    }
  };

  const addState = () => {
    const id = `s-${Date.now()}`;
    const newNode: Node = {
      id,
      type: 'workflowState',
      position: { x: 300, y: 300 },
      data: { name: 'New State', description: 'Describe this state', isInitial: false, isFinal: false, allowedRoles: [], slaHours: 0 }
    };
    setNodes((nds) => nds.concat(newNode));
  };

  const updateSelectedNodeData = (field: string, value: any) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.selected) {
          return { ...node, data: { ...node.data, [field]: value } };
        }
        return node;
      })
    );
  };

  const updateSelectedEdgeData = (field: string, value: any) => {
    setEdges((eds) =>
      eds.map((edge) => {
        if (edge.selected) {
          if (field === 'label') {
            return { ...edge, label: value };
          }
          return { ...edge, data: { ...edge.data, [field]: value } };
        }
        return edge;
      })
    );
  };

  const selectedNode = nodes.find(n => n.selected);
  const selectedEdge = edges.find(e => e.selected);

  return (
    <div className="flex flex-col h-full -m-4 md:-m-8">
      {/* Header Bar */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/workflows')} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
            <ArrowLeft size={20} />
          </button>
          <div className="overflow-hidden">
            <h2 className="text-lg font-bold text-slate-900 truncate">{workflow.name || 'Untitled Workflow'}</h2>
            <p className="text-xs text-slate-500 truncate">{workflow.description || 'Visual workflow designer'}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50">
            Cancel
          </button>
          <button 
            disabled={!isValid}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-semibold shadow-sm transition-all ${
              isValid 
                ? 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-blue-200' 
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Save size={16} />
            Save Workflow
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* React Flow Canvas */}
        <div className="flex-1 bg-slate-50 relative group">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            fitView
            className="workflow-canvas"
          >
            <Background color="#cbd5e1" gap={20} variant="dots" />
            <Controls />
            <Panel position="top-left" className="bg-white/90 backdrop-blur p-2 rounded-lg border border-slate-200 shadow-sm flex items-center gap-2">
              <button 
                onClick={addState}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-md text-xs font-bold hover:bg-blue-700 transition-colors"
              >
                <Plus size={14} />
                New State
              </button>
              <div className="w-px h-4 bg-slate-200 mx-1"></div>
              <span className="text-[10px] text-slate-500 flex items-center gap-1 pr-2">
                <MousePointer2 size={10} />
                Select node or connect dots
              </span>
            </Panel>

            {/* Validation Banner */}
            {!isValid && nodes.length > 0 && (
              <Panel position="top-center" className="mt-4">
                <div className="flex items-center gap-3 px-4 py-2 bg-red-50 border border-red-200 text-red-700 rounded-full shadow-lg animate-in slide-in-from-top duration-300">
                  <ShieldAlert size={16} className="animate-pulse" />
                  <span className="text-xs font-bold">
                    {initialCount === 0 ? 'Missing Start Node' : initialCount > 1 ? `Too many Start Nodes (${initialCount}/1)` : ''}
                    {initialCount !== 1 && finalCount === 0 ? ' & ' : ''}
                    {finalCount === 0 ? 'Missing at least one End Node' : ''}
                  </span>
                </div>
              </Panel>
            )}
          </ReactFlow>
        </div>

        {/* Property Panel / Sidebar */}
        <aside className="w-[380px] border-l border-slate-200 bg-white overflow-y-auto hidden md:block">
          <div className="p-6 space-y-8">
            {/* AI Generator Section */}
            {!selectedNode && !selectedEdge && (
              <section className="bg-gradient-to-br from-indigo-600 to-blue-700 p-5 rounded-2xl text-white shadow-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles size={18} className="text-amber-300" />
                  <h3 className="font-bold text-sm uppercase tracking-wider">AI Architect</h3>
                </div>
                <p className="text-[11px] text-indigo-100 mb-4">Briefly describe the business logic and Gemini will draft the entire structure.</p>
                <textarea 
                  rows={3}
                  value={aiPrompt}
                  onChange={e => setAiPrompt(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-xl p-3 text-xs placeholder:text-white/30 outline-none focus:ring-2 focus:ring-amber-400 transition-all mb-3 text-white"
                  placeholder="e.g. A three-step approval process for IT procurement with vendor bidding and manager sign-off..."
                />
                <button 
                  onClick={handleAiGenerate}
                  disabled={loading || !aiPrompt.trim()}
                  className={`w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                    loading ? 'bg-white/20 text-white/50' : 'bg-amber-400 text-indigo-900 hover:bg-amber-300 active:scale-95'
                  }`}
                >
                  {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <><Sparkles size={14} /> Draft Workflow</>}
                </button>
              </section>
            )}

            {/* State Properties Editor */}
            {selectedNode && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-200">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                      <GitCommit size={18} />
                    </div>
                    <h3 className="font-bold text-slate-900">State Config</h3>
                  </div>
                  <button 
                    onClick={() => setNodes(nds => nds.filter(n => !n.selected))}
                    className="text-slate-300 hover:text-red-500 p-1.5 rounded transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* General */}
                  <div className="space-y-4">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 block pb-1">Basic Identity</label>
                    <input 
                      type="text"
                      value={selectedNode.data.name}
                      onChange={e => updateSelectedNodeData('name', e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="State Name"
                    />
                    <textarea 
                      rows={2}
                      value={selectedNode.data.description}
                      onChange={e => updateSelectedNodeData('description', e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="Description of the state..."
                    />
                    <div className="flex gap-2">
                      <button 
                        onClick={() => updateSelectedNodeData('isInitial', !selectedNode.data.isInitial)}
                        className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${
                          selectedNode.data.isInitial ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-slate-200 text-slate-400 hover:border-indigo-200'
                        }`}
                      >
                        ENTRY POINT
                      </button>
                      <button 
                        onClick={() => updateSelectedNodeData('isFinal', !selectedNode.data.isFinal)}
                        className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${
                          selectedNode.data.isFinal ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-white border-slate-200 text-slate-400 hover:border-emerald-200'
                        }`}
                      >
                        FINAL POINT
                      </button>
                    </div>
                  </div>

                  {/* Assignments & SLA */}
                  <div className="space-y-4">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 block pb-1">Assignments & Time</label>
                    <div>
                      <label className="block text-[11px] text-slate-500 mb-1.5 font-medium">Allowed Roles</label>
                      <div className="flex flex-wrap gap-1.5">
                        {AVAILABLE_ROLES.map(role => {
                          const isSelected = selectedNode.data.allowedRoles?.includes(role);
                          return (
                            <button
                              key={role}
                              onClick={() => {
                                const current = selectedNode.data.allowedRoles || [];
                                const next = isSelected ? current.filter((r: any) => r !== role) : [...current, role];
                                updateSelectedNodeData('allowedRoles', next);
                              }}
                              className={`px-2 py-1 rounded-md text-[10px] font-bold transition-all border ${
                                isSelected ? 'bg-indigo-50 border-indigo-300 text-indigo-700' : 'bg-slate-50 border-slate-200 text-slate-400 hover:border-slate-300'
                              }`}
                            >
                              {role}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-500 mb-1.5 font-medium">SLA (Hours)</label>
                      <div className="flex items-center gap-3">
                        <Clock size={16} className="text-slate-400" />
                        <input 
                          type="number"
                          value={selectedNode.data.slaHours || 0}
                          onChange={e => updateSelectedNodeData('slaHours', parseInt(e.target.value) || 0)}
                          className="w-20 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                        <span className="text-xs text-slate-400 font-medium">Max time in state</span>
                      </div>
                    </div>
                  </div>

                  {/* Requirements */}
                  <div className="space-y-4">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 block pb-1">Task Requirements</label>
                    <div className="space-y-3">
                      <label className="flex items-center justify-between p-3 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                        <div className="flex items-center gap-3">
                          <MessageSquareText size={18} className="text-slate-400" />
                          <span className="text-xs font-semibold text-slate-700">Remark Required</span>
                        </div>
                        <input 
                          type="checkbox" 
                          checked={selectedNode.data.remarkRequired || false} 
                          onChange={e => updateSelectedNodeData('remarkRequired', e.target.checked)}
                          className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                      </label>

                      <label className="flex items-center justify-between p-3 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                        <div className="flex items-center gap-3">
                          <Paperclip size={18} className="text-slate-400" />
                          <span className="text-xs font-semibold text-slate-700">Attachment Required</span>
                        </div>
                        <input 
                          type="checkbox" 
                          checked={selectedNode.data.attachmentRequired || false} 
                          onChange={e => updateSelectedNodeData('attachmentRequired', e.target.checked)}
                          className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                      </label>

                      <div>
                        <div className="flex items-center gap-3 mb-2 ml-1">
                          <ClipboardCheck size={18} className="text-slate-400" />
                          <span className="text-xs font-semibold text-slate-700">Checklist SOP Template</span>
                        </div>
                        <select
                          value={selectedNode.data.checklistTemplateId || ''}
                          onChange={e => updateSelectedNodeData('checklistTemplateId', e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                          <option value="">No Checklist Enforcement</option>
                          {MOCK_CHECKLISTS.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Transition Properties Editor */}
            {selectedEdge && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-200">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                      <Workflow size={18} />
                    </div>
                    <h3 className="font-bold text-slate-900">Transition Config</h3>
                  </div>
                  <button 
                    onClick={() => setEdges(eds => eds.filter(e => !e.selected))}
                    className="text-slate-300 hover:text-red-500 p-1.5 rounded transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="space-y-4">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 block pb-1">Action Name</label>
                    <input 
                      type="text"
                      value={selectedEdge.label as string || ''}
                      onChange={e => updateSelectedEdgeData('label', e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="e.g. Approve, Reject, Resubmit..."
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 block pb-1">Permission</label>
                    <label className="block text-[11px] text-slate-500 font-medium">Required Roles to Action</label>
                    <div className="flex flex-wrap gap-1.5">
                      {AVAILABLE_ROLES.map(role => {
                        const isSelected = selectedEdge.data?.requiredRoles?.includes(role);
                        return (
                          <button
                            key={role}
                            onClick={() => {
                              const current = selectedEdge.data?.requiredRoles || [];
                              const next = isSelected ? current.filter((r: any) => r !== role) : [...current, role];
                              updateSelectedEdgeData('requiredRoles', next);
                            }}
                            className={`px-2 py-1 rounded-md text-[10px] font-bold transition-all border ${
                              isSelected ? 'bg-amber-50 border-amber-300 text-amber-700' : 'bg-slate-50 border-slate-200 text-slate-400'
                            }`}
                          >
                            {role}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 block pb-1">Logic</label>
                    <label className="flex items-center justify-between p-3 bg-slate-50 rounded-xl cursor-pointer">
                      <div className="flex items-center gap-3">
                        <MessageSquareText size={18} className="text-slate-400" />
                        <span className="text-xs font-semibold text-slate-700">Remark required on action</span>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={selectedEdge.data?.remarkRequiredOnAction || false} 
                        onChange={e => updateSelectedEdgeData('remarkRequiredOnAction', e.target.checked)}
                        className="w-4 h-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                      />
                    </label>
                    <div className="p-3 bg-amber-50 rounded-xl border border-amber-100">
                      <p className="text-[10px] text-amber-700 leading-relaxed font-medium">
                        Useful for "Reject" primitives to ensure vendors or users provide a reason for the negative transition.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {!selectedNode && !selectedEdge && (
              <div className="text-center py-12 px-6">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-200 border-2 border-dashed border-slate-200">
                  <Settings2 size={32} />
                </div>
                <h4 className="text-slate-900 font-bold mb-1">Canvas Selector</h4>
                <p className="text-xs text-slate-400 font-medium leading-relaxed">Select a state node or transition line to configure detailed business rules, SLAs, and requirements.</p>
              </div>
            )}

            {/* Validation Checklist (Sidebar Version) */}
            <section className="pt-6 border-t border-slate-100">
              <h3 className="font-bold text-slate-900 text-xs mb-4">Integrity Check</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-[11px]">
                  {nodes.length > 0 ? <CheckCircle2 size={14} className="text-emerald-500" /> : <AlertCircle size={14} className="text-slate-300" />}
                  <span className={nodes.length > 0 ? 'text-slate-600' : 'text-slate-400'}>At least one state</span>
                </div>
                <div className="flex items-center gap-2 text-[11px]">
                  {initialCount === 1 ? (
                    <CheckCircle2 size={14} className="text-emerald-500" />
                  ) : (
                    <AlertCircle size={14} className={initialCount === 0 ? 'text-amber-500' : 'text-red-500'} />
                  )}
                  <span className={initialCount === 1 ? 'text-slate-600' : 'text-amber-600 font-bold'}>
                    Exactly one Start node ({initialCount}/1)
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[11px]">
                  {finalCount >= 1 ? <CheckCircle2 size={14} className="text-emerald-500" /> : <AlertCircle size={14} className="text-amber-500" />}
                  <span className={finalCount >= 1 ? 'text-slate-600' : 'text-amber-600 font-bold'}>At least one End node</span>
                </div>
              </div>
            </section>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default WorkflowEditor;