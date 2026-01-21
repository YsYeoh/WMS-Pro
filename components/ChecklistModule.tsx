
import React, { useState, useRef } from 'react';
import { MOCK_CHECKLISTS } from '../constants';
import { ChecklistTemplate, ChecklistTask } from '../types';
import { 
  ClipboardList, 
  Plus, 
  Trash2, 
  X, 
  CheckCircle2, 
  MessageSquare, 
  Hash, 
  CheckSquare, 
  ChevronRight,
  ShieldCheck,
  AlertCircle,
  Download,
  UploadCloud,
  FileJson
} from 'lucide-react';

const ChecklistModule: React.FC = () => {
  const [templates, setTemplates] = useState<ChecklistTemplate[]>(MOCK_CHECKLISTS);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  
  const [templateForm, setTemplateForm] = useState({ name: '', description: '' });
  const [taskForm, setTaskForm] = useState({ text: '', type: 'BINARY' as const, required: true });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedTemplate = templates.find(t => t.id === selectedTemplateId);

  const handleExport = () => {
    const dataStr = JSON.stringify(templates, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const fileName = `WMS_SOP_Standards_${new Date().toISOString().split('T')[0]}.json`;
    
    const link = document.createElement('a');
    link.setAttribute('href', dataUri);
    link.setAttribute('download', fileName);
    link.click();
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        if (Array.isArray(json)) {
          setTemplates([...json, ...templates]);
          setIsImportModalOpen(false);
        } else {
           throw new Error();
        }
      } catch (err) {
        alert("Corrupted SOP Data. Ensure the file contains a valid array of Checklist Templates.");
      }
    };
    reader.readAsText(file);
  };

  const handleCreateTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    const newTemplate: ChecklistTemplate = {
      id: `ck-${Date.now()}`,
      name: templateForm.name,
      description: templateForm.description,
      tasks: []
    };
    setTemplates([...templates, newTemplate]);
    setIsModalOpen(false);
    setTemplateForm({ name: '', description: '' });
    setSelectedTemplateId(newTemplate.id);
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTemplateId) return;

    const newTask: ChecklistTask = {
      id: `t-${Date.now()}`,
      text: taskForm.text,
      type: taskForm.type,
      required: taskForm.required
    };

    setTemplates(templates.map(t => {
      if (t.id === selectedTemplateId) {
        return { ...t, tasks: [...t.tasks, newTask] };
      }
      return t;
    }));

    setTaskForm({ text: '', type: 'BINARY', required: true });
  };

  const removeTask = (taskId: string) => {
    setTemplates(templates.map(t => {
      if (t.id === selectedTemplateId) {
        return { ...t, tasks: t.tasks.filter(tk => tk.id !== taskId) };
      }
      return t;
    }));
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">SOP Standards</h2>
          <p className="text-slate-500 font-medium">Standardize inspection checklists and operational verification.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="flex bg-white border border-slate-200 rounded-2xl p-1 shadow-sm">
             <button onClick={handleExport} className="p-3 text-slate-500 hover:text-blue-600 hover:bg-slate-50 rounded-xl transition-all" title="Export SOPs">
               <Download size={20} />
             </button>
             <div className="w-px bg-slate-100 mx-1 self-stretch"></div>
             <button onClick={() => setIsImportModalOpen(true)} className="p-3 text-slate-500 hover:text-blue-600 hover:bg-slate-50 rounded-xl transition-all" title="Import SOPs">
               <UploadCloud size={20} />
             </button>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-black text-sm shadow-xl hover:bg-slate-800 transition-all flex items-center gap-2 uppercase tracking-widest"
          >
            <Plus size={18} />
            Create SOP Template
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-3">
          {templates.map(template => (
            <div 
              key={template.id}
              onClick={() => setSelectedTemplateId(template.id)}
              className={`p-5 rounded-3xl border-2 cursor-pointer transition-all group ${
                selectedTemplateId === template.id ? 'border-blue-600 bg-blue-50/50' : 'border-slate-100 bg-white hover:border-slate-200 shadow-sm'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${selectedTemplateId === template.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-slate-50 text-slate-400 group-hover:bg-slate-100'}`}>
                  <ClipboardList size={20} />
                </div>
                <div className="flex-1 overflow-hidden">
                  <h3 className="text-sm font-black text-slate-900 truncate">{template.name}</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{template.tasks.length} Check-items</p>
                </div>
                <ChevronRight size={16} className={`transition-transform ${selectedTemplateId === template.id ? 'text-blue-600 translate-x-1' : 'text-slate-300'}`} />
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-3">
          {selectedTemplate ? (
            <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm p-10 animate-in slide-in-from-right-8 duration-500 min-h-[600px] flex flex-col">
              <div className="flex justify-between items-start mb-10">
                <div>
                   <div className="flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase tracking-widest mb-4">
                     <ShieldCheck size={12} /> Compliance SOP
                   </div>
                   <h3 className="text-4xl font-black text-slate-900 tracking-tighter uppercase mb-2">{selectedTemplate.name}</h3>
                   <p className="text-slate-500 font-medium text-lg">{selectedTemplate.description}</p>
                </div>
              </div>

              <div className="flex-1 space-y-8">
                <div className="space-y-4">
                   <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-3">Line Items</h4>
                   <div className="grid grid-cols-1 gap-4">
                      {selectedTemplate.tasks.map((task, idx) => (
                        <div key={task.id} className="group p-6 bg-slate-50/50 border border-slate-100 rounded-3xl flex items-center justify-between hover:bg-white hover:border-blue-200 hover:shadow-xl hover:shadow-slate-100 transition-all animate-in slide-in-from-bottom-2">
                           <div className="flex items-center gap-6">
                              <span className="text-xs font-black text-slate-300 w-4">0{idx + 1}</span>
                              <div className={`p-3 rounded-xl ${
                                task.type === 'BINARY' ? 'bg-emerald-50 text-emerald-600' :
                                task.type === 'NUMBER' ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-600'
                              }`}>
                                {task.type === 'BINARY' && <CheckSquare size={20} />}
                                {task.type === 'NUMBER' && <Hash size={20} />}
                                {task.type === 'TEXT' && <MessageSquare size={20} />}
                              </div>
                              <div>
                                <p className="text-sm font-black text-slate-900">{task.text}</p>
                                <div className="flex gap-3 mt-1">
                                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{task.type}</span>
                                  {task.required && <span className="text-[9px] font-black text-red-400 uppercase tracking-widest flex items-center gap-1"><AlertCircle size={10} /> Required</span>}
                                </div>
                              </div>
                           </div>
                           <button 
                             onClick={() => removeTask(task.id)}
                             className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all opacity-0 group-hover:opacity-100"
                           >
                             <Trash2 size={18} />
                           </button>
                        </div>
                      ))}
                   </div>
                </div>

                <div className="pt-10 border-t border-slate-100">
                   <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Append Item</h4>
                   <form onSubmit={handleAddTask} className="flex gap-4 items-end">
                      <div className="flex-1 space-y-2">
                         <label className="text-[8px] font-black text-slate-400 uppercase">Requirement</label>
                         <input required value={taskForm.text} onChange={e => setTaskForm({...taskForm, text: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-xs font-bold outline-none focus:ring-4 focus:ring-blue-100" placeholder="e.g. Verify pressure levels" />
                      </div>
                      <div className="w-48 space-y-2">
                         <label className="text-[8px] font-black text-slate-400 uppercase">Type</label>
                         <select value={taskForm.type} onChange={e => setTaskForm({...taskForm, type: e.target.value as any})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-xs font-bold">
                            <option value="BINARY">Binary</option>
                            <option value="NUMBER">Numeric</option>
                            <option value="TEXT">Text</option>
                         </select>
                      </div>
                      <button type="submit" className="p-4 bg-blue-600 text-white rounded-2xl shadow-xl hover:bg-blue-700 transition-all">
                        <Plus />
                      </button>
                   </form>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2.5rem] p-20 text-center flex flex-col items-center justify-center min-h-[600px]">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-xl shadow-slate-200 mb-8 animate-bounce">
                 <ClipboardList size={48} className="text-slate-200" />
              </div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase mb-2">Checklist Standard Library</h3>
              <p className="text-slate-400 text-sm font-bold max-w-sm leading-relaxed">Select a template to manage operational checks or utilize the bulk intake tools.</p>
            </div>
          )}
        </div>
      </div>

      {/* Import Modal */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
           <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
             <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
               <div>
                  <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">SOP Interchange</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Bulk Intake Standard</p>
               </div>
               <button onClick={() => setIsImportModalOpen(false)} className="p-3 hover:bg-slate-100 rounded-2xl transition-all"><X /></button>
             </div>
             <div className="p-12 space-y-8 text-center">
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-4 border-dashed border-slate-100 rounded-[2rem] p-12 hover:border-blue-200 hover:bg-blue-50/50 transition-all cursor-pointer group"
                >
                   <FileJson size={48} className="mx-auto text-slate-200 group-hover:text-blue-500 mb-4 transition-colors" />
                   <p className="text-sm font-black text-slate-900 mb-1">Upload SOP Package</p>
                   <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">JSON files only</p>
                   <input type="file" ref={fileInputRef} className="hidden" accept=".json" onChange={handleImport} />
                </div>
                <div className="p-6 bg-indigo-50 rounded-2xl border border-indigo-100 flex items-start gap-4 text-left">
                   <AlertCircle size={20} className="text-indigo-500 shrink-0" />
                   <p className="text-[10px] text-indigo-700 font-bold leading-relaxed uppercase">Important: Imported SOPs will be added to your library. It is recommended to perform a data backup before execution.</p>
                </div>
             </div>
           </div>
        </div>
      )}

      {/* Create Template Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl animate-in zoom-in-95 duration-300">
             <div className="p-10 border-b border-slate-50 flex justify-between items-center">
               <h3 className="text-2xl font-black text-slate-900">New SOP Standard</h3>
               <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-all"><X /></button>
             </div>
             <form onSubmit={handleCreateTemplate} className="p-10 space-y-6">
               <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Template Name</label>
                 <input required value={templateForm.name} onChange={e => setTemplateForm({...templateForm, name: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold" placeholder="e.g. Boiler Safety Path" />
               </div>
               <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Description</label>
                 <textarea required value={templateForm.description} onChange={e => setTemplateForm({...templateForm, description: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold h-32" placeholder="Describe the purpose..." />
               </div>
               <button type="submit" className="w-full bg-slate-900 text-white py-5 rounded-3xl font-black uppercase tracking-widest shadow-xl">Register Template</button>
             </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default ChecklistModule;
