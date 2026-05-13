import { useState } from "react";
import {
  LayoutDashboard, Package, Truck, Users, FileText, Receipt,
  BarChart3, Settings, Bell, Search, ChevronRight, Plus,
  ArrowUpRight, ArrowDownRight, Clock, CheckCircle2, AlertCircle,
  Circle, TrendingUp, Calendar, MapPin, Phone, Mail, Filter,
  MoreHorizontal, Eye, Edit2, Trash2, Download, X, Menu,
  LogOut, User, Shield, Zap
} from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";

// ─── Design tokens ─────────────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,400&family=DM+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --navy:      #0B1628;
    --navy-mid:  #112240;
    --navy-card: #162A4A;
    --navy-hover:#1D3461;
    --navy-border:#2A4A7A;
    --accent:    #3B82F6;
    --accent-2:  #0EA5E9;
    --accent-glow: rgba(59,130,246,0.18);
    --green:     #10B981;
    --amber:     #F59E0B;
    --red:       #EF4444;
    --purple:    #8B5CF6;
    --text-1:    #F0F6FF;
    --text-2:    #94A3C4;
    --text-3:    #4A6080;
    --font-head: 'Syne', sans-serif;
    --font-body: 'DM Sans', sans-serif;
    --font-mono: 'DM Mono', monospace;
    --radius:    10px;
    --shadow:    0 4px 24px rgba(0,0,0,0.35);
  }

  body { background: var(--navy); color: var(--text-1); font-family: var(--font-body); }
  
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: var(--navy); }
  ::-webkit-scrollbar-thumb { background: var(--navy-border); border-radius: 3px; }

  .app { display: flex; height: 100vh; overflow: hidden; }

  /* ── Sidebar ── */
  .sidebar {
    width: 240px; flex-shrink: 0;
    background: var(--navy-mid);
    border-right: 1px solid rgba(42,74,122,0.5);
    display: flex; flex-direction: column;
    padding: 0;
    overflow-y: auto;
  }
  .sidebar-logo {
    padding: 22px 20px 18px;
    border-bottom: 1px solid rgba(42,74,122,0.4);
  }
  .logo-mark {
    font-family: var(--font-head);
    font-size: 20px; font-weight: 800;
    letter-spacing: -0.5px;
    background: linear-gradient(135deg, var(--accent), var(--accent-2));
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  }
  .logo-sub { font-size: 10px; color: var(--text-3); letter-spacing: 1.5px; text-transform: uppercase; margin-top: 1px; }
  
  .sidebar-section { padding: 16px 12px 4px; }
  .sidebar-label { font-size: 9px; letter-spacing: 2px; text-transform: uppercase; color: var(--text-3); padding: 0 8px; margin-bottom: 4px; }
  
  .nav-item {
    display: flex; align-items: center; gap: 10px;
    padding: 9px 12px; border-radius: 8px;
    cursor: pointer; transition: all 0.15s;
    font-size: 13.5px; color: var(--text-2);
    font-family: var(--font-body); font-weight: 400;
    margin-bottom: 1px; border: none; background: none; width: 100%; text-align: left;
  }
  .nav-item:hover { background: var(--navy-hover); color: var(--text-1); }
  .nav-item.active { background: var(--accent-glow); color: var(--accent); border: 1px solid rgba(59,130,246,0.25); }
  .nav-item.active svg { color: var(--accent); }
  .nav-badge { margin-left: auto; background: var(--accent); color: white; font-size: 10px; font-weight: 600; padding: 1px 6px; border-radius: 99px; font-family: var(--font-mono); }
  
  .sidebar-user {
    margin-top: auto;
    padding: 14px 16px;
    border-top: 1px solid rgba(42,74,122,0.4);
    display: flex; align-items: center; gap: 10px;
  }
  .user-avatar {
    width: 32px; height: 32px; border-radius: 8px;
    background: linear-gradient(135deg, var(--accent), var(--purple));
    display: flex; align-items: center; justify-content: center;
    font-size: 12px; font-weight: 700; color: white;
    flex-shrink: 0;
  }
  .user-name { font-size: 13px; font-weight: 500; color: var(--text-1); }
  .user-role { font-size: 11px; color: var(--text-3); }

  /* ── Main ── */
  .main { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
  
  .topbar {
    display: flex; align-items: center; gap: 14px;
    padding: 14px 28px;
    border-bottom: 1px solid rgba(42,74,122,0.35);
    background: var(--navy-mid);
    flex-shrink: 0;
  }
  .page-title { font-family: var(--font-head); font-size: 19px; font-weight: 700; color: var(--text-1); }
  .breadcrumb { display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--text-3); margin-top: 1px; }
  
  .topbar-right { margin-left: auto; display: flex; align-items: center; gap: 10px; }
  .icon-btn {
    width: 36px; height: 36px; border-radius: 8px;
    background: rgba(42,74,122,0.3); border: 1px solid rgba(42,74,122,0.5);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; color: var(--text-2); transition: all 0.15s;
  }
  .icon-btn:hover { background: var(--navy-hover); color: var(--text-1); }
  .notif-dot { position: relative; }
  .notif-dot::after { content:''; position:absolute; top:6px; right:6px; width:7px; height:7px; border-radius:50%; background:var(--red); border:2px solid var(--navy-mid); }
  
  .search-bar {
    display: flex; align-items: center; gap: 8px;
    background: rgba(11,22,40,0.6); border: 1px solid rgba(42,74,122,0.4);
    border-radius: 8px; padding: 0 12px; height: 36px; width: 220px;
  }
  .search-bar input { background: none; border: none; outline: none; color: var(--text-1); font-size: 13px; font-family: var(--font-body); width: 100%; }
  .search-bar input::placeholder { color: var(--text-3); }

  .content { flex: 1; overflow-y: auto; padding: 24px 28px; }

  /* ── Cards ── */
  .card {
    background: var(--navy-card);
    border: 1px solid rgba(42,74,122,0.4);
    border-radius: var(--radius);
    padding: 20px;
  }
  .card-sm { padding: 16px; }

  .grid-4 { display: grid; grid-template-columns: repeat(4,1fr); gap: 16px; }
  .grid-3 { display: grid; grid-template-columns: repeat(3,1fr); gap: 16px; }
  .grid-2 { display: grid; grid-template-columns: repeat(2,1fr); gap: 16px; }
  .grid-2-1 { display: grid; grid-template-columns: 2fr 1fr; gap: 16px; }
  .grid-3-2 { display: grid; grid-template-columns: 3fr 2fr; gap: 16px; }

  /* ── Stat cards ── */
  .stat-card { position: relative; overflow: hidden; }
  .stat-icon {
    width: 40px; height: 40px; border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 14px;
  }
  .stat-val { font-family: var(--font-head); font-size: 28px; font-weight: 700; color: var(--text-1); line-height: 1; }
  .stat-label { font-size: 12px; color: var(--text-2); margin-top: 4px; }
  .stat-delta { display: flex; align-items: center; gap: 3px; font-size: 12px; margin-top: 8px; font-weight: 500; }
  .delta-up { color: var(--green); }
  .delta-down { color: var(--red); }
  .stat-glow { position: absolute; bottom:-30px; right:-20px; width:100px; height:100px; border-radius:50%; opacity:0.07; }

  /* ── Section headers ── */
  .section-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
  .section-title { font-family: var(--font-head); font-size: 14px; font-weight: 600; color: var(--text-1); }
  .section-action { font-size: 12px; color: var(--accent); cursor: pointer; display: flex; align-items: center; gap: 3px; }

  /* ── Table ── */
  .table-wrap { overflow-x: auto; }
  table { width: 100%; border-collapse: collapse; font-size: 13px; }
  th { text-align: left; padding: 10px 14px; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: var(--text-3); font-weight: 500; border-bottom: 1px solid rgba(42,74,122,0.35); }
  td { padding: 12px 14px; border-bottom: 1px solid rgba(42,74,122,0.2); color: var(--text-2); vertical-align: middle; }
  tr:last-child td { border-bottom: none; }
  tr:hover td { background: rgba(42,74,122,0.12); color: var(--text-1); }
  .td-bold { font-weight: 500; color: var(--text-1); }
  .td-mono { font-family: var(--font-mono); font-size: 12px; }

  /* ── Badges ── */
  .badge { display:inline-flex; align-items:center; gap:5px; font-size:11px; font-weight:500; padding:3px 9px; border-radius:99px; }
  .badge-green  { background:rgba(16,185,129,0.12); color:var(--green); }
  .badge-amber  { background:rgba(245,158,11,0.12); color:var(--amber); }
  .badge-red    { background:rgba(239,68,68,0.12);  color:var(--red); }
  .badge-blue   { background:rgba(59,130,246,0.12); color:var(--accent); }
  .badge-purple { background:rgba(139,92,246,0.12); color:var(--purple); }
  .badge-gray   { background:rgba(74,96,128,0.2);   color:var(--text-2); }
  .badge-dot { width:6px; height:6px; border-radius:50%; background:currentColor; }

  /* ── Buttons ── */
  .btn { display:inline-flex; align-items:center; gap:6px; padding:8px 16px; border-radius:8px; font-size:13px; font-weight:500; cursor:pointer; border:none; transition:all 0.15s; font-family:var(--font-body); }
  .btn-primary { background:var(--accent); color:white; }
  .btn-primary:hover { background:#2563EB; }
  .btn-ghost { background:rgba(42,74,122,0.25); color:var(--text-2); border:1px solid rgba(42,74,122,0.4); }
  .btn-ghost:hover { background:var(--navy-hover); color:var(--text-1); }
  .btn-sm { padding:6px 12px; font-size:12px; }
  .btn-icon { padding:7px; border-radius:7px; }

  /* ── Timeline / status flow ── */
  .status-flow { display:flex; align-items:center; gap:0; }
  .status-step { display:flex; align-items:center; }
  .status-dot { width:10px; height:10px; border-radius:50%; flex-shrink:0; }
  .status-line { width:32px; height:1px; background:rgba(42,74,122,0.4); }
  .status-line.done { background:var(--green); }

  /* ── Priority pill ── */
  .prio-high   { background:rgba(239,68,68,0.1);   color:var(--red);    border:1px solid rgba(239,68,68,0.25); }
  .prio-medium { background:rgba(245,158,11,0.1);  color:var(--amber);  border:1px solid rgba(245,158,11,0.25); }
  .prio-low    { background:rgba(16,185,129,0.1);  color:var(--green);  border:1px solid rgba(16,185,129,0.25); }

  /* ── Input ── */
  .input {
    width:100%; background:rgba(11,22,40,0.6);
    border:1px solid rgba(42,74,122,0.4); border-radius:8px;
    padding:9px 12px; color:var(--text-1); font-size:13px; font-family:var(--font-body);
    outline:none; transition:border 0.15s;
  }
  .input:focus { border-color:var(--accent); }
  .input::placeholder { color:var(--text-3); }
  select.input option { background:var(--navy-card); }

  /* ── Form label ── */
  .form-label { font-size:11px; text-transform:uppercase; letter-spacing:1px; color:var(--text-3); margin-bottom:6px; display:block; }

  /* ── Modal ── */
  .modal-backdrop { position:fixed; inset:0; background:rgba(11,22,40,0.7); backdrop-filter:blur(4px); z-index:100; display:flex; align-items:center; justify-content:center; }
  .modal { background:var(--navy-card); border:1px solid rgba(42,74,122,0.5); border-radius:14px; padding:28px; width:480px; max-width:90vw; box-shadow:0 20px 60px rgba(0,0,0,0.5); }
  .modal-title { font-family:var(--font-head); font-size:17px; font-weight:700; margin-bottom:20px; color:var(--text-1); }

  /* ── Activity ── */
  .activity-item { display:flex; gap:12px; align-items:flex-start; padding:10px 0; border-bottom:1px solid rgba(42,74,122,0.2); }
  .activity-item:last-child { border-bottom:none; }
  .activity-icon { width:30px; height:30px; border-radius:8px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
  .activity-text { font-size:13px; color:var(--text-2); line-height:1.4; }
  .activity-text span { color:var(--text-1); font-weight:500; }
  .activity-time { font-size:11px; color:var(--text-3); font-family:var(--font-mono); margin-top:2px; }

  /* ── Map placeholder ── */
  .map-placeholder {
    background: linear-gradient(135deg, #0B1628 0%, #112240 50%, #0B2040 100%);
    border-radius:8px; height:200px; position:relative; overflow:hidden;
    display:flex; align-items:center; justify-content:center;
  }
  .map-grid { position:absolute; inset:0; opacity:0.08; background-image:linear-gradient(var(--accent) 1px,transparent 1px),linear-gradient(90deg,var(--accent) 1px,transparent 1px); background-size:30px 30px; }
  .map-dot { width:10px; height:10px; border-radius:50%; background:var(--accent); box-shadow:0 0 12px var(--accent); position:absolute; }

  /* ── Progress bar ── */
  .progress-bar { height:4px; background:rgba(42,74,122,0.3); border-radius:2px; overflow:hidden; }
  .progress-fill { height:100%; border-radius:2px; transition:width 0.3s; }

  /* ── Tabs ── */
  .tabs { display:flex; gap:2px; background:rgba(11,22,40,0.5); border-radius:9px; padding:3px; margin-bottom:18px; }
  .tab { padding:7px 16px; border-radius:7px; font-size:13px; cursor:pointer; color:var(--text-2); border:none; background:none; font-family:var(--font-body); transition:all 0.15s; }
  .tab.active { background:var(--navy-card); color:var(--text-1); box-shadow:0 2px 8px rgba(0,0,0,0.3); }

  /* Misc */
  .gap-12 { display:flex; flex-direction:column; gap:12px; }
  .gap-16 { display:flex; flex-direction:column; gap:16px; }
  .row { display:flex; gap:12px; align-items:center; }
  .flex1 { flex:1; }
  .mt-16 { margin-top:16px; }
  .mt-8  { margin-top:8px; }
  .text-sm { font-size:12px; color:var(--text-2); }
  .text-xs { font-size:11px; color:var(--text-3); }
  .text-accent { color:var(--accent); }
  .font-mono { font-family:var(--font-mono); }
`;

// ─── Mock data ──────────────────────────────────────────────────────────────
const JOBS = [
  { id:'JOB-0041', customer:'Tirana Port Authority', pickup:'Durrës Port Terminal', dropoff:'Tirana Industrial Zone', date:'2026-05-14', driver:'Ardit Hoxha', truck:'TR-4421', container:'CNT-009', status:'In Transit', priority:'High' },
  { id:'JOB-0040', customer:'Albvision Logistics',   pickup:'Tirana Warehouse A',   dropoff:'Shkodër Distribution',  date:'2026-05-14', driver:'Gjon Marku',  truck:'TR-2209', container:'CNT-017', status:'Confirmed',  priority:'Medium' },
  { id:'JOB-0039', customer:'Eagle Transport SH.A',  pickup:'Fier Industrial Park', dropoff:'Berat City Depot',      date:'2026-05-13', driver:'Blendi Çela', truck:'TR-1103', container:'CNT-003', status:'Delivered',  priority:'Low' },
  { id:'JOB-0038', customer:'Tirana Port Authority', pickup:'Durrës Customs Zone',  dropoff:'Tirana Cold Storage',   date:'2026-05-13', driver:'Ardit Hoxha', truck:'TR-4421', container:'CNT-022', status:'Invoiced',   priority:'High' },
  { id:'JOB-0037', customer:'BestBuild Materials',   pickup:'Elbasan Factory',      dropoff:'Korçë Depot',           date:'2026-05-12', driver:'Fatmir Kola', truck:'TR-3314', container:'CNT-011', status:'Closed',     priority:'Medium' },
  { id:'JOB-0036', customer:'Albvision Logistics',   pickup:'Tirana Warehouse B',   dropoff:'Vlorë Port',            date:'2026-05-12', driver:'Gjon Marku',  truck:'TR-2209', container:'CNT-008', status:'Draft',      priority:'Low' },
];

const CUSTOMERS = [
  { id:'CST-001', name:'Tirana Port Authority', contact:'Erion Deva',   phone:'+355 42 234 567', email:'erion@tpa.al',       jobs:14, revenue:'€ 42,800', status:'Active' },
  { id:'CST-002', name:'Albvision Logistics',   contact:'Mirela Suli',  phone:'+355 68 123 456', email:'mirela@albvision.al', jobs:9,  revenue:'€ 28,350', status:'Active' },
  { id:'CST-003', name:'Eagle Transport SH.A',  contact:'Sokol Gjoka',  phone:'+355 69 876 543', email:'sokol@eagle.al',     jobs:6,  revenue:'€ 19,200', status:'Active' },
  { id:'CST-004', name:'BestBuild Materials',   contact:'Anxhela Lika', phone:'+355 67 345 678', email:'anxhela@bestbuild.al',jobs:4, revenue:'€ 12,600', status:'Inactive'},
];

const CONTAINERS = [
  { id:'CNT-003', type:'20ft Standard', condition:'Good',    location:'On Truck', truck:'TR-1103', lastInspection:'2026-04-20' },
  { id:'CNT-008', type:'40ft High Cube',condition:'Good',    location:'Available',truck:'—',       lastInspection:'2026-05-01' },
  { id:'CNT-009', type:'20ft Standard', condition:'Good',    location:'On Truck', truck:'TR-4421', lastInspection:'2026-04-15' },
  { id:'CNT-011', type:'20ft Reefer',   condition:'Fair',    location:'Yard',     truck:'—',       lastInspection:'2026-04-28' },
  { id:'CNT-017', type:'40ft Standard', condition:'Good',    location:'Reserved', truck:'TR-2209', lastInspection:'2026-05-05' },
  { id:'CNT-022', type:'20ft Standard', condition:'Damaged', location:'Yard',     truck:'—',       lastInspection:'2026-05-10' },
];

const DRIVERS = [
  { id:'DRV-01', name:'Ardit Hoxha',  phone:'+355 69 111 222', license:'AL-2024-ARH', expiry:'2027-03-14', status:'On Route', truck:'TR-4421', jobs:28 },
  { id:'DRV-02', name:'Gjon Marku',   phone:'+355 68 333 444', license:'AL-2023-GJM', expiry:'2026-11-08', status:'On Route', truck:'TR-2209', jobs:21 },
  { id:'DRV-03', name:'Blendi Çela',  phone:'+355 67 555 666', license:'AL-2025-BLC', expiry:'2028-06-22', status:'Available',truck:'—',       jobs:19 },
  { id:'DRV-04', name:'Fatmir Kola',  phone:'+355 69 777 888', license:'AL-2022-FTK', expiry:'2026-07-30', status:'Available',truck:'—',       jobs:15 },
];

const INVOICES = [
  { id:'INV-2026-041', job:'JOB-0038', customer:'Tirana Port Authority', amount:'€ 3,200', issued:'2026-05-13', due:'2026-05-27', status:'Unpaid' },
  { id:'INV-2026-040', job:'JOB-0037', customer:'BestBuild Materials',   amount:'€ 1,850', issued:'2026-05-12', due:'2026-05-26', status:'Paid' },
  { id:'INV-2026-039', job:'JOB-0035', customer:'Eagle Transport SH.A',  amount:'€ 2,400', issued:'2026-05-10', due:'2026-05-24', status:'Overdue' },
  { id:'INV-2026-038', job:'JOB-0033', customer:'Albvision Logistics',   amount:'€ 1,650', issued:'2026-05-08', due:'2026-05-22', status:'Paid' },
  { id:'INV-2026-037', job:'JOB-0031', customer:'Tirana Port Authority', amount:'€ 4,100', issued:'2026-05-06', due:'2026-05-20', status:'Partially Paid' },
];

const revenueData = [
  { month:'Nov', revenue:28400 },{ month:'Dec', revenue:31200 },{ month:'Jan', revenue:24800 },
  { month:'Feb', revenue:33600 },{ month:'Mar', revenue:38200 },{ month:'Apr', revenue:35800 },{ month:'May', revenue:42500 },
];
const jobsData = [
  { week:'W1', jobs:12 },{ week:'W2', jobs:18 },{ week:'W3', jobs:15 },
  { week:'W4', jobs:22 },{ week:'W5', jobs:19 },{ week:'W6', jobs:26 },
];
const pieData = [
  { name:'Delivered', value:48, color:'#10B981' },
  { name:'In Transit', value:12, color:'#3B82F6' },
  { name:'Confirmed',  value:8,  color:'#F59E0B' },
  { name:'Draft',      value:4,  color:'#4A6080' },
];

// ─── Status badge ────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const map = {
    'Draft':          'badge-gray',
    'Confirmed':      'badge-blue',
    'Assigned':       'badge-blue',
    'In Transit':     'badge-purple',
    'Delivered':      'badge-green',
    'Closed':         'badge-gray',
    'Invoiced':       'badge-green',
    'Cancelled':      'badge-red',
    'Active':         'badge-green',
    'Inactive':       'badge-gray',
    'Available':      'badge-green',
    'On Truck':       'badge-blue',
    'Reserved':       'badge-amber',
    'Yard':           'badge-gray',
    'On Route':       'badge-blue',
    'Paid':           'badge-green',
    'Unpaid':         'badge-amber',
    'Overdue':        'badge-red',
    'Partially Paid': 'badge-purple',
    'Good':           'badge-green',
    'Fair':           'badge-amber',
    'Damaged':        'badge-red',
  };
  return <span className={`badge ${map[status]||'badge-gray'}`}><span className="badge-dot"/>{ status }</span>;
}

function PriorityBadge({ priority }) {
  const map = { High:'prio-high', Medium:'prio-medium', Low:'prio-low' };
  return <span className={`badge ${map[priority]||''}`}>{ priority }</span>;
}

// ─── Dashboard ───────────────────────────────────────────────────────────────
function Dashboard() {
  const stats = [
    { label:'Active Jobs',       val:'72',    delta:'+8 this week',  up:true,  icon:<Package size={18}/>,     color:'#3B82F6', glow:'#3B82F6' },
    { label:'Revenue (May)',     val:'€42.5k', delta:'+18% vs Apr',  up:true,  icon:<TrendingUp size={18}/>,   color:'#10B981', glow:'#10B981' },
    { label:'Drivers on Route',  val:'2 / 4', delta:'2 available',   up:null,  icon:<Truck size={18}/>,        color:'#8B5CF6', glow:'#8B5CF6' },
    { label:'Unpaid Invoices',   val:'€9.1k', delta:'3 overdue',     up:false, icon:<Receipt size={18}/>,      color:'#EF4444', glow:'#EF4444' },
  ];

  const activity = [
    { icon:<CheckCircle2 size={14}/>, bg:'rgba(16,185,129,0.12)', color:'#10B981', text:<>Job <span>JOB-0041</span> marked In Transit by <span>Ardit Hoxha</span></>, time:'2 min ago' },
    { icon:<FileText size={14}/>,     bg:'rgba(59,130,246,0.12)',  color:'#3B82F6', text:<>Invoice <span>INV-2026-041</span> generated for <span>Tirana Port Authority</span></>, time:'14 min ago' },
    { icon:<AlertCircle size={14}/>,  bg:'rgba(245,158,11,0.12)', color:'#F59E0B', text:<>Container <span>CNT-022</span> flagged as <span>Damaged</span> by yard staff</>, time:'1 hr ago' },
    { icon:<Package size={14}/>,      bg:'rgba(139,92,246,0.12)', color:'#8B5CF6', text:<>New job <span>JOB-0042</span> created for <span>Albvision Logistics</span></>, time:'2 hr ago' },
    { icon:<CheckCircle2 size={14}/>, bg:'rgba(16,185,129,0.12)', color:'#10B981', text:<>Job <span>JOB-0039</span> delivered — POD uploaded by <span>Blendi Çela</span></>, time:'3 hr ago' },
  ];

  return (
    <div className="gap-16">
      {/* Stats */}
      <div className="grid-4">
        {stats.map((s,i) => (
          <div key={i} className="card stat-card">
            <div className="stat-icon" style={{background:`rgba(${s.glow==='#3B82F6'?'59,130,246':s.glow==='#10B981'?'16,185,129':s.glow==='#8B5CF6'?'139,92,246':'239,68,68'},0.12)`, color:s.color}}>
              {s.icon}
            </div>
            <div className="stat-val">{s.val}</div>
            <div className="stat-label">{s.label}</div>
            <div className="stat-delta" style={{color:s.up===null?'var(--text-3)':s.up?'var(--green)':'var(--red)'}}>
              {s.up===true?<ArrowUpRight size={13}/>:s.up===false?<ArrowDownRight size={13}/>:null}
              {s.delta}
            </div>
            <div className="stat-glow" style={{background:s.glow}}/>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid-2">
        <div className="card">
          <div className="section-head">
            <div className="section-title">Revenue — Last 7 Months</div>
            <span className="text-xs font-mono" style={{color:'var(--green)'}}>↑ 18.6%</span>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(42,74,122,0.3)" />
              <XAxis dataKey="month" tick={{fontSize:11,fill:'#4A6080'}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fontSize:11,fill:'#4A6080'}} axisLine={false} tickLine={false} tickFormatter={v=>`€${(v/1000).toFixed(0)}k`}/>
              <Tooltip contentStyle={{background:'#162A4A',border:'1px solid rgba(42,74,122,0.5)',borderRadius:8,fontSize:12}} labelStyle={{color:'#94A3C4'}} />
              <Line type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={2} dot={{fill:'#3B82F6',r:3}} activeDot={{r:5}}/>
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="card">
          <div className="section-head">
            <div className="section-title">Jobs by Status</div>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:24}}>
            <ResponsiveContainer width={150} height={150}>
              <PieChart>
                <Pie data={pieData} cx={70} cy={70} innerRadius={45} outerRadius={68} dataKey="value" strokeWidth={0}>
                  {pieData.map((e,i)=><Cell key={i} fill={e.color}/>)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="gap-12" style={{flex:1}}>
              {pieData.map((e,i)=>(
                <div key={i} style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                  <div style={{display:'flex',alignItems:'center',gap:7}}>
                    <span style={{width:8,height:8,borderRadius:'50%',background:e.color,display:'block'}}/>
                    <span className="text-sm">{e.name}</span>
                  </div>
                  <span style={{fontFamily:'var(--font-mono)',fontSize:12,color:'var(--text-1)',fontWeight:500}}>{e.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent jobs + activity */}
      <div className="grid-2-1">
        <div className="card">
          <div className="section-head">
            <div className="section-title">Recent Jobs</div>
            <span className="section-action">View all <ChevronRight size={13}/></span>
          </div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Job ID</th><th>Customer</th><th>Status</th><th>Date</th></tr></thead>
              <tbody>
                {JOBS.slice(0,5).map(j=>(
                  <tr key={j.id}>
                    <td className="td-mono td-bold">{j.id}</td>
                    <td className="td-bold">{j.customer}</td>
                    <td><StatusBadge status={j.status}/></td>
                    <td className="text-xs">{j.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <div className="section-head">
            <div className="section-title">Activity Feed</div>
          </div>
          {activity.map((a,i)=>(
            <div key={i} className="activity-item">
              <div className="activity-icon" style={{background:a.bg,color:a.color}}>{a.icon}</div>
              <div>
                <div className="activity-text">{a.text}</div>
                <div className="activity-time">{a.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Jobs page ───────────────────────────────────────────────────────────────
function Jobs({ onNew }) {
  const [filter, setFilter] = useState('All');
  const statuses = ['All','Draft','Confirmed','In Transit','Delivered','Invoiced'];
  const filtered = filter==='All' ? JOBS : JOBS.filter(j=>j.status===filter);

  return (
    <div className="gap-16">
      <div className="row">
        <div className="tabs" style={{marginBottom:0}}>
          {statuses.map(s=><button key={s} className={`tab${filter===s?' active':''}`} onClick={()=>setFilter(s)}>{s}</button>)}
        </div>
        <div style={{marginLeft:'auto'}}/>
        <button className="btn btn-ghost btn-sm"><Filter size={13}/>Filter</button>
        <button className="btn btn-primary btn-sm" onClick={onNew}><Plus size={13}/>New Job</button>
      </div>

      <div className="card" style={{padding:0}}>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Job ID</th><th>Customer</th><th>Route</th><th>Driver</th><th>Container</th><th>Date</th><th>Priority</th><th>Status</th><th/></tr></thead>
            <tbody>
              {filtered.map(j=>(
                <tr key={j.id}>
                  <td className="td-mono td-bold">{j.id}</td>
                  <td className="td-bold">{j.customer}</td>
                  <td><div style={{fontSize:12}}><div style={{color:'var(--text-1)'}}>{j.pickup}</div><div style={{color:'var(--text-3)'}}>→ {j.dropoff}</div></div></td>
                  <td className="text-sm">{j.driver}</td>
                  <td className="td-mono text-sm">{j.container}</td>
                  <td className="text-xs">{j.date}</td>
                  <td><PriorityBadge priority={j.priority}/></td>
                  <td><StatusBadge status={j.status}/></td>
                  <td><div className="row" style={{gap:4}}>
                    <button className="btn btn-ghost btn-icon btn-sm"><Eye size={12}/></button>
                    <button className="btn btn-ghost btn-icon btn-sm"><Edit2 size={12}/></button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Customers page ──────────────────────────────────────────────────────────
function Customers() {
  return (
    <div className="gap-16">
      <div className="row">
        <div className="search-bar" style={{width:260}}>
          <Search size={14} color="#4A6080"/>
          <input placeholder="Search customers…"/>
        </div>
        <button className="btn btn-primary btn-sm" style={{marginLeft:'auto'}}><Plus size={13}/>Add Customer</button>
      </div>
      <div className="grid-2">
        {CUSTOMERS.map(c=>(
          <div key={c.id} className="card">
            <div className="row" style={{marginBottom:14}}>
              <div style={{width:42,height:42,borderRadius:10,background:'linear-gradient(135deg,#1D3461,#2A4A7A)',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'var(--font-head)',fontWeight:700,fontSize:16,color:'var(--accent)',flexShrink:0}}>
                {c.name[0]}
              </div>
              <div>
                <div style={{fontWeight:600,color:'var(--text-1)',fontSize:14}}>{c.name}</div>
                <div className="text-xs">{c.id}</div>
              </div>
              <div style={{marginLeft:'auto'}}><StatusBadge status={c.status}/></div>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:14}}>
              {[[Mail,c.email],[Phone,c.phone]].map(([Icon,val],i)=>(
                <div key={i} className="row" style={{gap:7,fontSize:12,color:'var(--text-2)'}}>
                  <Icon size={12} color="#4A6080"/>{val}
                </div>
              ))}
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
              {[['Total Jobs',c.jobs],['Revenue',c.revenue]].map(([l,v],i)=>(
                <div key={i} style={{background:'rgba(11,22,40,0.5)',borderRadius:7,padding:'8px 10px'}}>
                  <div className="text-xs">{l}</div>
                  <div style={{fontFamily:'var(--font-head)',fontSize:16,fontWeight:700,color:'var(--text-1)',marginTop:2}}>{v}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Containers page ─────────────────────────────────────────────────────────
function Containers() {
  return (
    <div className="gap-16">
      <div className="row">
        <div className="row" style={{gap:8,flexWrap:'wrap'}}>
          {['All','Available','On Truck','Reserved','Yard'].map(f=>(
            <button key={f} className="btn btn-ghost btn-sm">{f}</button>
          ))}
        </div>
        <button className="btn btn-primary btn-sm" style={{marginLeft:'auto'}}><Plus size={13}/>Add Container</button>
      </div>
      <div className="card" style={{padding:0}}>
        <table>
          <thead><tr><th>ID</th><th>Type</th><th>Condition</th><th>Location</th><th>Truck</th><th>Last Inspection</th><th/></tr></thead>
          <tbody>
            {CONTAINERS.map(c=>(
              <tr key={c.id}>
                <td className="td-mono td-bold">{c.id}</td>
                <td className="td-bold">{c.type}</td>
                <td><StatusBadge status={c.condition}/></td>
                <td><StatusBadge status={c.location}/></td>
                <td className="td-mono text-xs">{c.truck}</td>
                <td className="text-xs">{c.lastInspection}</td>
                <td><div className="row" style={{gap:4}}>
                  <button className="btn btn-ghost btn-icon btn-sm"><Eye size={12}/></button>
                  <button className="btn btn-ghost btn-icon btn-sm"><Edit2 size={12}/></button>
                </div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Drivers page ────────────────────────────────────────────────────────────
function DriversPage() {
  return (
    <div className="gap-16">
      <div className="row">
        <button className="btn btn-primary btn-sm" style={{marginLeft:'auto'}}><Plus size={13}/>Add Driver</button>
      </div>
      <div className="grid-2">
        {DRIVERS.map(d=>(
          <div key={d.id} className="card">
            <div className="row" style={{marginBottom:14}}>
              <div style={{width:44,height:44,borderRadius:10,background:'linear-gradient(135deg,#1B3461,#2563EB)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,fontWeight:700,color:'white',fontFamily:'var(--font-head)',flexShrink:0}}>
                {d.name.split(' ').map(n=>n[0]).join('')}
              </div>
              <div>
                <div style={{fontWeight:600,fontSize:14,color:'var(--text-1)'}}>{d.name}</div>
                <div className="text-xs">{d.id}</div>
              </div>
              <div style={{marginLeft:'auto'}}><StatusBadge status={d.status}/></div>
            </div>
            <div className="gap-12">
              {[['Phone',d.phone],[' License',d.license],['Expiry',d.expiry],['Assigned Truck',d.truck||'—'],['Jobs Completed',d.jobs]].map(([l,v],i)=>(
                <div key={i} className="row" style={{justifyContent:'space-between'}}>
                  <span className="text-xs">{l}</span>
                  <span style={{fontSize:12,color:'var(--text-1)',fontFamily:l==='License'||l==='Assigned Truck'?'var(--font-mono)':'inherit'}}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Invoices page ───────────────────────────────────────────────────────────
function Invoices() {
  const totals = [
    { label:'Total Billed',    val:'€ 13,200', color:'var(--text-1)' },
    { label:'Collected',       val:'€ 5,100',  color:'var(--green)' },
    { label:'Outstanding',     val:'€ 8,100',  color:'var(--amber)' },
    { label:'Overdue',         val:'€ 2,400',  color:'var(--red)' },
  ];
  return (
    <div className="gap-16">
      <div className="grid-4">
        {totals.map((t,i)=>(
          <div key={i} className="card card-sm">
            <div className="text-xs">{t.label}</div>
            <div style={{fontFamily:'var(--font-head)',fontSize:22,fontWeight:700,color:t.color,marginTop:6}}>{t.val}</div>
          </div>
        ))}
      </div>
      <div className="card" style={{padding:0}}>
        <table>
          <thead><tr><th>Invoice</th><th>Job</th><th>Customer</th><th>Amount</th><th>Issued</th><th>Due</th><th>Status</th><th/></tr></thead>
          <tbody>
            {INVOICES.map(inv=>(
              <tr key={inv.id}>
                <td className="td-mono td-bold">{inv.id}</td>
                <td className="td-mono text-sm">{inv.job}</td>
                <td className="td-bold">{inv.customer}</td>
                <td style={{fontFamily:'var(--font-head)',fontWeight:600,color:'var(--text-1)'}}>{inv.amount}</td>
                <td className="text-xs">{inv.issued}</td>
                <td className="text-xs">{inv.due}</td>
                <td><StatusBadge status={inv.status}/></td>
                <td><div className="row" style={{gap:4}}>
                  <button className="btn btn-ghost btn-icon btn-sm"><Download size={12}/></button>
                  <button className="btn btn-ghost btn-icon btn-sm"><Eye size={12}/></button>
                </div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Reports page ────────────────────────────────────────────────────────────
function Reports() {
  return (
    <div className="gap-16">
      <div className="grid-3">
        {[
          { title:'Delivery Report', desc:'Weekly & monthly job counts, on-time rates', icon:<BarChart3 size={20}/>, color:'#3B82F6' },
          { title:'Revenue Report',  desc:'Revenue breakdown per customer',           icon:<TrendingUp size={20}/>,color:'#10B981' },
          { title:'Unpaid Invoices', desc:'Outstanding payments and overdue list',     icon:<Receipt size={20}/>,   color:'#EF4444' },
        ].map((r,i)=>(
          <div key={i} className="card" style={{cursor:'pointer'}}>
            <div style={{width:42,height:42,borderRadius:10,background:`rgba(${r.color==='#3B82F6'?'59,130,246':r.color==='#10B981'?'16,185,129':'239,68,68'},0.12)`,color:r.color,display:'flex',alignItems:'center',justifyContent:'center',marginBottom:14}}>
              {r.icon}
            </div>
            <div style={{fontWeight:600,color:'var(--text-1)',marginBottom:4}}>{r.title}</div>
            <div className="text-xs">{r.desc}</div>
            <button className="btn btn-ghost btn-sm" style={{marginTop:14,width:'100%'}}><Download size={12}/>Export PDF</button>
          </div>
        ))}
      </div>
      <div className="card">
        <div className="section-head">
          <div className="section-title">Jobs per Week (May 2026)</div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={jobsData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(42,74,122,0.3)"/>
            <XAxis dataKey="week" tick={{fontSize:11,fill:'#4A6080'}} axisLine={false} tickLine={false}/>
            <YAxis tick={{fontSize:11,fill:'#4A6080'}} axisLine={false} tickLine={false}/>
            <Tooltip contentStyle={{background:'#162A4A',border:'1px solid rgba(42,74,122,0.5)',borderRadius:8,fontSize:12}} labelStyle={{color:'#94A3C4'}}/>
            <Bar dataKey="jobs" fill="#3B82F6" radius={[4,4,0,0]}/>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ─── New Job modal ───────────────────────────────────────────────────────────
function NewJobModal({ onClose }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e=>e.stopPropagation()}>
        <div className="row" style={{marginBottom:20}}>
          <div className="modal-title" style={{margin:0}}>Create New Job</div>
          <button className="btn btn-ghost btn-icon btn-sm" style={{marginLeft:'auto'}} onClick={onClose}><X size={14}/></button>
        </div>
        <div className="gap-12">
          <div><label className="form-label">Customer</label>
            <select className="input"><option>Tirana Port Authority</option><option>Albvision Logistics</option><option>Eagle Transport SH.A</option></select>
          </div>
          <div className="grid-2" style={{gap:10}}>
            <div><label className="form-label">Pickup Location</label><input className="input" placeholder="e.g. Durrës Port Terminal"/></div>
            <div><label className="form-label">Drop-off Location</label><input className="input" placeholder="e.g. Tirana Warehouse A"/></div>
          </div>
          <div className="grid-2" style={{gap:10}}>
            <div><label className="form-label">Date</label><input className="input" type="date" defaultValue="2026-05-15"/></div>
            <div><label className="form-label">Container Type</label>
              <select className="input"><option>20ft Standard</option><option>40ft Standard</option><option>40ft High Cube</option><option>20ft Reefer</option></select>
            </div>
          </div>
          <div className="grid-2" style={{gap:10}}>
            <div><label className="form-label">Assign Driver</label>
              <select className="input"><option>Blendi Çela</option><option>Fatmir Kola</option></select>
            </div>
            <div><label className="form-label">Assign Truck</label>
              <select className="input"><option>TR-1103</option><option>TR-3314</option></select>
            </div>
          </div>
          <div><label className="form-label">Notes (optional)</label>
            <textarea className="input" rows={3} placeholder="Any special instructions…" style={{resize:'vertical'}}/>
          </div>
        </div>
        <div className="row" style={{marginTop:22,justifyContent:'flex-end',gap:8}}>
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={onClose}><Plus size={13}/>Create Job</button>
        </div>
      </div>
    </div>
  );
}

// ─── Navigation config ───────────────────────────────────────────────────────
const NAV = [
  { key:'dashboard',  label:'Dashboard',   icon:<LayoutDashboard size={16}/> },
  { key:'jobs',       label:'Jobs',        icon:<Package size={16}/>,    badge:'6' },
  { key:'customers',  label:'Customers',   icon:<Users size={16}/> },
  { key:'containers', label:'Containers',  icon:<Package size={16}/> },
  { key:'drivers',    label:'Drivers',     icon:<Truck size={16}/> },
  { key:'invoices',   label:'Invoices',    icon:<Receipt size={16}/>,    badge:'2' },
  { key:'reports',    label:'Reports',     icon:<BarChart3 size={16}/> },
];
const NAV2 = [
  { key:'settings', label:'Settings', icon:<Settings size={16}/> },
];

const PAGE_TITLES = {
  dashboard: 'Dashboard', jobs: 'Jobs', customers: 'Customers',
  containers: 'Containers', drivers: 'Drivers & Trucks',
  invoices: 'Invoices', reports: 'Reports', settings: 'Settings',
};

// ─── App shell ───────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState('dashboard');
  const [showNewJob, setShowNewJob] = useState(false);

  const renderPage = () => {
    switch(page) {
      case 'dashboard':  return <Dashboard/>;
      case 'jobs':       return <Jobs onNew={()=>setShowNewJob(true)}/>;
      case 'customers':  return <Customers/>;
      case 'containers': return <Containers/>;
      case 'drivers':    return <DriversPage/>;
      case 'invoices':   return <Invoices/>;
      case 'reports':    return <Reports/>;
      default:           return <Dashboard/>;
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="app">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-logo">
            <div className="logo-mark">CDMS</div>
            <div className="logo-sub">Container Delivery Mgmt</div>
          </div>

          <div className="sidebar-section">
            <div className="sidebar-label">Main</div>
            {NAV.map(n=>(
              <button key={n.key} className={`nav-item${page===n.key?' active':''}`} onClick={()=>setPage(n.key)}>
                {n.icon}{n.label}
                {n.badge&&<span className="nav-badge">{n.badge}</span>}
              </button>
            ))}
          </div>

          <div className="sidebar-section">
            <div className="sidebar-label">System</div>
            {NAV2.map(n=>(
              <button key={n.key} className={`nav-item${page===n.key?' active':''}`} onClick={()=>setPage(n.key)}>
                {n.icon}{n.label}
              </button>
            ))}
          </div>

          <div className="sidebar-user">
            <div className="user-avatar">AD</div>
            <div>
              <div className="user-name">Admin User</div>
              <div className="user-role">System Administrator</div>
            </div>
          </div>
        </aside>

        {/* Main area */}
        <div className="main">
          <div className="topbar">
            <div>
              <div className="page-title">{PAGE_TITLES[page]}</div>
              <div className="breadcrumb">CDMS <ChevronRight size={11}/> {PAGE_TITLES[page]}</div>
            </div>
            <div className="topbar-right">
              <div className="search-bar">
                <Search size={14} color="#4A6080"/>
                <input placeholder="Search…"/>
              </div>
              <div className="icon-btn notif-dot"><Bell size={15}/></div>
              <div className="icon-btn"><User size={15}/></div>
            </div>
          </div>

          <div className="content">
            {renderPage()}
          </div>
        </div>

        {showNewJob && <NewJobModal onClose={()=>setShowNewJob(false)}/>}
      </div>
    </>
  );
}
