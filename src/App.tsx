import React, { useState, useMemo } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  Shield, 
  Globe, 
  DollarSign, 
  LogOut, 
  Menu, 
  X,
  Settings,
  Plus,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  UserPlus,
  Calendar,
  Camera,
  Video,
  Laptop,
  Sprout,
  Trophy,
  Music,
  Heart
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster, toast } from 'sonner';

// --- Types & Constants ---

type UserRole = 'admin' | 'director' | 'manager' | 'staff' | 'security';

interface User {
  id: string;
  name: string;
  role: UserRole;
  portfolio?: string;
  avatar?: string;
}

interface Service {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  staffCount: number;
}

const SERVICES: Service[] = [
  { id: '1', name: 'Internet Cafe', description: 'Public internet access & printing', icon: Laptop, staffCount: 2 },
  { id: '2', name: 'Photography', description: 'Event & portrait photography', icon: Camera, staffCount: 1 },
  { id: '3', name: 'Video Editing', description: 'Professional video production', icon: Video, staffCount: 1 },
  { id: '4', name: 'Business Services', description: 'Business plans & CIPC', icon: FileText, staffCount: 2 },
  { id: '5', name: 'Soup Kitchen', description: 'Community meal program', icon: Heart, staffCount: 4 },
  { id: '6', name: 'Farming', description: 'Local agricultural projects', icon: Sprout, staffCount: 12 },
  { id: '7', name: 'Sports & Culture', description: 'Youth programs & events', icon: Trophy, staffCount: 3 },
];

// --- Components ---

const Card = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`bg-white dark:bg-zinc-900 text-slate-900 dark:text-slate-100 rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm overflow-hidden ${className}`}>
    {children}
  </div>
);

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  onClick, 
  className = "",
  disabled = false,
  type = 'button'
}: { 
  children: React.ReactNode, 
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger',
  size?: 'sm' | 'md' | 'lg',
  onClick?: () => void,
  className?: string,
  disabled?: boolean,
  type?: 'button' | 'submit' | 'reset'
}) => {
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm',
    secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700',
    outline: 'border border-slate-200 bg-transparent hover:bg-slate-50 dark:border-zinc-800 dark:hover:bg-zinc-800',
    ghost: 'hover:bg-slate-100 dark:hover:bg-zinc-800',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  };
  
  const sizes = {
    sm: 'h-8 px-3 text-xs',
    md: 'h-10 px-4 py-2 text-sm',
    lg: 'h-12 px-8 text-lg',
  };

  return (
    <button 
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center rounded-lg font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 active:scale-95 ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  );
};

const Input = ({ ...props }: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input 
    {...props}
    className="flex h-10 w-full rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
  />
);

const Badge = ({ children, variant = 'default' }: { children: React.ReactNode, variant?: 'default' | 'success' | 'warning' | 'error' }) => {
  const styles = {
    default: 'bg-slate-100 text-slate-700 dark:bg-zinc-800 dark:text-zinc-300',
    success: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    warning: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    error: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors ${styles[variant]}`}>
      {children}
    </span>
  );
};

// --- Pages ---

const LoginPage = ({ onLogin }: { onLogin: (role: UserRole) => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.includes('admin')) onLogin('admin');
    else if (email.includes('director')) onLogin('director');
    else onLogin('staff');
    toast.success('Successfully logged in');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-black p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card className="p-8 border-t-4 border-t-blue-600">
          <div className="flex flex-col items-center mb-8">
            <img 
              src="https://storage.googleapis.com/dala-prod-public-storage/generated-images/1e32409a-e3f0-41fb-8616-f0863413bafc/foundation-logo-9ce97e45-1776330208587.webp" 
              alt="Logo" 
              className="w-24 h-24 mb-4 object-contain"
            />
            <h1 className="text-2xl font-bold text-center text-slate-900 dark:text-white">RASODI FOUNDATION</h1>
            <p className="text-slate-500 text-sm">Digital Management System</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Username or Email</label>
              <Input 
                type="text" 
                placeholder="Enter your username" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Password</label>
              <Input 
                type="password" 
                placeholder="••••••••" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full py-6">Sign In</Button>
            <div className="text-center mt-4 text-xs text-slate-500">
              Credentials: <b>admin@rasodi.org</b> or <b>director@rasodi.org</b>
            </div>
          </form>
        </Card>
        <p className="text-center mt-8 text-xs text-slate-400">
          © 2024 Rasodi Village Community Development Foundation
        </p>
      </motion.div>
    </div>
  );
};

const DashboardHome = () => {
  const stats = [
    { label: 'Total Staff', value: '42', icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Active Jobs', value: '18', icon: Briefcase, color: 'text-orange-600', bg: 'bg-orange-100' },
    { label: 'Services Running', value: '13', icon: Globe, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Monthly Income', value: 'R 24,500', icon: DollarSign, color: 'text-purple-600', bg: 'bg-purple-100' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="p-5 flex flex-col items-center text-center sm:items-start sm:text-left hover:shadow-md transition-shadow">
              <div className={`${stat.bg} ${stat.color} p-2.5 rounded-xl mb-3`}>
                <stat.icon size={22} />
              </div>
              <p className="text-xs text-slate-500 font-semibold tracking-wide uppercase mb-1">{stat.label}</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</h3>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg">Recent Activities</h3>
            <Button variant="outline" size="sm">View All</Button>
          </div>
          <div className="space-y-4">
            {[
              { title: 'New Job Created', person: 'Manager Sarah', time: '2h ago', detail: '"Farming Assistance"' },
              { title: 'Attendance Logged', person: 'Security John', time: '4h ago', detail: 'Morning Shift Check-in' },
              { title: 'Payment Recorded', person: 'Admin Finance', time: '6h ago', detail: 'Internet Cafe Revenue (R 450)' },
              { title: 'New Director Portfolio', person: 'Admin', time: '1d ago', detail: 'Finance Portfolio Assigned' },
            ].map((activity, i) => (
              <div key={i} className="flex gap-4 pb-4 border-b border-slate-100 dark:border-zinc-800 last:border-0 last:pb-0">
                <div className="bg-slate-50 dark:bg-zinc-800 rounded-full w-10 h-10 flex items-center justify-center shrink-0 border border-slate-100 dark:border-zinc-700">
                  <Clock size={16} className="text-slate-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold truncate">{activity.title}</p>
                  <p className="text-xs text-slate-500 mb-1">{activity.detail}</p>
                  <p className="text-[10px] text-slate-400">{activity.person} • {activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg">Foundation Performance</h3>
            <Button variant="outline" size="sm">Report</Button>
          </div>
          <div className="space-y-6">
            {[
              { name: 'Agriculture Projects', progress: 85, color: 'bg-green-600', val: 'R 12k' },
              { name: 'Internet Cafe Services', progress: 62, color: 'bg-blue-600', val: 'R 8.5k' },
              { name: 'Community Soup Kitchen', progress: 95, color: 'bg-orange-600', val: '1.2k meals' },
            ].map((p, i) => (
              <div key={i} className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="font-bold text-slate-700 dark:text-slate-300">{p.name}</span>
                  <span className="text-slate-500 font-medium">{p.val}</span>
                </div>
                <div className="h-2.5 w-full bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${p.progress}%` }}
                    transition={{ duration: 0.8, delay: i * 0.1 }}
                    className={`h-full ${p.color}`} 
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-900/20">
            <p className="text-xs text-blue-700 dark:text-blue-400 font-bold mb-1 italic">Mission Success Tip:</p>
            <p className="text-xs text-blue-600 dark:text-blue-500 leading-relaxed">
              We've reached 85% of our monthly employment goal for Rasodi Village. Great job team!
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

const PersonnelManagement = ({ type }: { type: 'directors' | 'workers' | 'security' }) => {
  const title = type === 'directors' ? 'Directors Board' : type === 'workers' ? 'Workforce Registry' : 'Security Team';
  const roles = type === 'directors' ? ['Finance', 'Operations', 'Agriculture', 'Youth'] : ['Farming', 'Admin', 'Media', 'Cleaning'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{title}</h2>
          <p className="text-sm text-slate-500">Manage {type} registration and portfolio assignments</p>
        </div>
        <Button className="w-full sm:w-auto px-6">
          <Plus size={18} className="mr-2" /> Add {type.slice(0, -1)}
        </Button>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <Button variant="primary" size="sm" className="whitespace-nowrap">All Members</Button>
        {roles.map(r => <Button key={r} variant="secondary" size="sm" className="whitespace-nowrap">{r}</Button>)}
        <Button variant="outline" size="sm" className="whitespace-nowrap">Inactive</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((_, i) => (
          <Card key={i} className="p-5 group hover:border-blue-500/50 transition-all">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-zinc-800 overflow-hidden shrink-0 border border-slate-200 dark:border-zinc-700">
                <img 
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${type}${i * 123}`} 
                  alt="Avatar" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-slate-900 dark:text-white truncate">Member {i + 1} Rasodi</h4>
                <p className="text-[10px] text-slate-400 mb-2 font-mono uppercase">ID: 920{i}15 5{i}82 08{i}</p>
                <div className="flex flex-wrap gap-1.5">
                  <Badge variant="default">{roles[i % roles.length]}</Badge>
                  <Badge variant="success">Active</Badge>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0"><Settings size={14} /></Button>
            </div>
            <div className="mt-5 pt-4 border-t border-slate-100 dark:border-zinc-800 flex justify-between items-center text-xs">
              <div className="flex flex-col">
                <span className="text-slate-400 font-medium">Contact</span>
                <span className="text-slate-700 dark:text-slate-300 font-bold">+27 72 045 000{i}</span>
              </div>
              <Button variant="ghost" size="sm" className="h-8 text-blue-600 font-bold">Manage Portfolio</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

const ServicesModule = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Community Services</h2>
          <p className="text-sm text-slate-500">Monitor activity and book services for village members</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <Input className="pl-10" placeholder="Search services..." />
          </div>
          <Button className="shrink-0"><Plus size={18} /></Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {SERVICES.map((s) => (
          <Card key={s.id} className="p-5 hover:shadow-lg transition-all border-slate-200 dark:border-zinc-800 group relative">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-900/10 text-blue-600 border border-blue-100 dark:border-blue-900/20 group-hover:bg-blue-600 group-hover:text-white transition-all">
                <s.icon size={26} />
              </div>
              <Badge variant={s.staffCount > 2 ? 'success' : 'default'}>{s.staffCount} Staff</Badge>
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white mb-1">{s.name}</h3>
            <p className="text-xs text-slate-500 mb-4 line-clamp-2 leading-relaxed">{s.description}</p>
            <div className="pt-4 border-t border-slate-100 dark:border-zinc-800 flex justify-between items-center">
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">Operational</span>
              <Button variant="ghost" size="sm" className="h-7 text-xs font-bold">Book Now</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

const FinancialsModule = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg">Transaction History</h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">Export CSV</Button>
              </div>
            </div>
            <div className="space-y-3">
              {[
                { type: 'income', cat: 'Donation', amount: 'R 15,000', title: 'District Municipality Grant', date: 'Oct 24' },
                { type: 'expense', cat: 'Wages', amount: 'R 8,400', title: 'Worker Stipends (Week 4)', date: 'Oct 22' },
                { type: 'income', cat: 'Services', amount: 'R 1,250', title: 'Weekly Internet Cafe Totals', date: 'Oct 21' },
                { type: 'expense', cat: 'Supplies', amount: 'R 3,500', title: 'Agricultural Seed Purchase', date: 'Oct 20' },
                { type: 'income', cat: 'Services', amount: 'R 650', title: 'Company Registrations (CIPC)', date: 'Oct 19' },
              ].map((t, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-slate-50 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`p-2.5 rounded-xl ${t.type === 'income' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                      {t.type === 'income' ? <ArrowUpRight size={20} /> : <ArrowDownRight size={20} />}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">{t.title}</p>
                      <p className="text-[10px] text-slate-500 font-medium uppercase tracking-tight">{t.cat} • {t.date}</p>
                    </div>
                  </div>
                  <p className={`font-bold text-sm ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                    {t.type === 'income' ? '+' : '-'}{t.amount}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card className="p-6 bg-slate-900 text-white relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-xs opacity-70 font-medium uppercase tracking-widest mb-1">Total Assets</p>
              <h2 className="text-3xl font-bold mb-8">R 184,520.45</h2>
              <div className="grid grid-cols-2 gap-6 pt-6 border-t border-white/10">
                <div>
                  <p className="text-[10px] opacity-60 uppercase mb-1">Inc. (Oct)</p>
                  <p className="text-sm font-bold text-green-400">+ R 24,100</p>
                </div>
                <div>
                  <p className="text-[10px] opacity-60 uppercase mb-1">Exp. (Oct)</p>
                  <p className="text-sm font-bold text-red-400">- R 12,850</p>
                </div>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 blur-3xl rounded-full -mr-16 -mt-16" />
          </Card>

          <div className="grid grid-cols-1 gap-3">
            <Button className="w-full py-7 font-bold text-base shadow-lg shadow-blue-500/20">
              <Plus size={20} className="mr-2" /> Record Income
            </Button>
            <Button variant="secondary" className="w-full py-7 font-bold text-base">
              <ArrowDownRight size={20} className="mr-2" /> Log Expense
            </Button>
          </div>

          <Card className="p-5 border-dashed border-2">
            <h4 className="text-sm font-bold mb-3 flex items-center gap-2">
              <FileText size={16} className="text-slate-400" />
              Quick Reports
            </h4>
            <div className="grid grid-cols-1 gap-2">
              <button className="text-left text-xs p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors border border-transparent hover:border-slate-200">
                Quarterly Impact Report.pdf
              </button>
              <button className="text-left text-xs p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors border border-transparent hover:border-slate-200">
                Employment Growth (2024).xlsx
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

// --- Main Shell ---

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin', 'director', 'manager', 'staff', 'security'] },
    { id: 'directors', label: 'Directors', icon: Users, roles: ['admin', 'director'] },
    { id: 'workers', label: 'Workforce', icon: Briefcase, roles: ['admin', 'director', 'manager'] },
    { id: 'security', label: 'Security', icon: Shield, roles: ['admin', 'security', 'manager'] },
    { id: 'services', label: 'Services', icon: Globe, roles: ['admin', 'director', 'manager', 'staff'] },
    { id: 'financials', label: 'Financials', icon: DollarSign, roles: ['admin', 'director'] },
  ];

  const visibleMenuItems = useMemo(() => {
    if (!user) return [];
    return menuItems.filter(item => item.roles.includes(user.role));
  }, [user]);

  if (!user) {
    return (
      <div className="font-sans antialiased text-slate-900 bg-slate-50 dark:bg-black">
        <LoginPage onLogin={(role) => setUser({ id: '1', name: role.toUpperCase(), role })} />
        <Toaster position="top-center" richColors />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black font-sans antialiased">
      <Toaster position="top-center" richColors />
      
      {/* Mobile Header */}
      <header className="lg:hidden bg-white dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800 p-4 sticky top-0 z-40 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-3">
          <img 
            src="https://storage.googleapis.com/dala-prod-public-storage/generated-images/1e32409a-e3f0-41fb-8616-f0863413bafc/foundation-logo-9ce97e45-1776330208587.webp" 
            alt="Logo" 
            className="w-8 h-8 object-contain"
          />
          <h1 className="font-bold text-slate-900 dark:text-white text-sm truncate max-w-[180px]">RASODI FOUNDATION</h1>
        </div>
        <Button variant="ghost" size="sm" onClick={() => setIsSidebarOpen(true)}>
          <Menu size={22} className="text-slate-600 dark:text-slate-400" />
        </Button>
      </header>

      {/* Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`
        fixed top-0 bottom-0 left-0 w-72 bg-white dark:bg-zinc-950 border-r border-slate-200 dark:border-zinc-800 z-50 transition-transform duration-300 lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          <div className="p-8 border-b border-slate-100 dark:border-zinc-900 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center p-1.5 shadow-lg shadow-blue-500/20">
                <img 
                  src="https://storage.googleapis.com/dala-prod-public-storage/generated-images/1e32409a-e3f0-41fb-8616-f0863413bafc/foundation-logo-9ce97e45-1776330208587.webp" 
                  alt="Logo" 
                  className="w-full h-full object-contain brightness-0 invert"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-black text-slate-900 dark:text-white tracking-tight leading-none">RASODI</span>
                <span className="text-[10px] text-slate-400 font-bold tracking-widest mt-1">FOUNDATION</span>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="lg:hidden text-slate-400" onClick={() => setIsSidebarOpen(false)}>
              <X size={20} />
            </Button>
          </div>

          <nav className="flex-1 overflow-y-auto p-6 space-y-1.5">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 px-4">Menu</p>
            {visibleMenuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsSidebarOpen(false);
                }}
                className={`
                  w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm font-bold transition-all
                  ${activeTab === item.id 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                    : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-zinc-900 hover:text-slate-900 dark:hover:text-white'}
                `}
              >
                <item.icon size={20} className={activeTab === item.id ? 'text-white' : 'text-slate-400'} />
                {item.label}
              </button>
            ))}
          </nav>

          <div className="p-6 border-t border-slate-100 dark:border-zinc-900">
            <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-zinc-900 rounded-2xl mb-4 border border-slate-100 dark:border-zinc-800">
              <div className="w-11 h-11 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-black border-2 border-white dark:border-zinc-800 shadow-sm">
                {user.name.charAt(0)}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{user.name}</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{user.role}</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              className="w-full text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 hover:border-red-200 dark:hover:border-red-900 transition-all font-bold"
              onClick={() => setUser(null)}
            >
              <LogOut size={18} className="mr-2" /> Sign Out
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-72 p-6 md:p-10 min-h-screen">
        <div className="max-w-6xl mx-auto">
          <div className="mb-10 lg:flex items-center justify-between hidden">
            <div>
              <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                {menuItems.find(i => i.id === activeTab)?.label}
              </h1>
              <p className="text-slate-500 font-medium">Welcome back to the Foundation portal.</p>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2 text-sm font-bold bg-white dark:bg-zinc-900 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm">
                <Calendar size={16} className="text-blue-600" />
                {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </div>
              <Button variant="secondary" size="sm" className="w-11 h-11 p-0 rounded-xl">
                <Search size={18} />
              </Button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              {activeTab === 'dashboard' && <DashboardHome />}
              {activeTab === 'directors' && <PersonnelManagement type="directors" />}
              {activeTab === 'workers' && <PersonnelManagement type="workers" />}
              {activeTab === 'security' && <PersonnelManagement type="security" />}
              {activeTab === 'services' && <ServicesModule />}
              {activeTab === 'financials' && <FinancialsModule />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}