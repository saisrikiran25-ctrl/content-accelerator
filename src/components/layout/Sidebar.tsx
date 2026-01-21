import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Zap,
  LayoutDashboard,
  FileText,
  Calendar,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  Sparkles,
  Briefcase,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
  { icon: Sparkles, label: 'Create Content', href: '/brief' },
  { icon: FileText, label: 'Content Library', href: '/library' },
  { icon: Calendar, label: 'Calendar', href: '/calendar' },
  { icon: BarChart3, label: 'Analytics', href: '/analytics' },
  { icon: Briefcase, label: 'Brand Voice', href: '/brand-voice' },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { signOut, user } = useAuth();

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 72 : 240 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="h-screen bg-card border-r border-border flex flex-col fixed left-0 top-0 z-40"
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-border">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
            <Zap className="h-5 w-5 text-primary-foreground" />
          </div>
          <motion.span
            initial={false}
            animate={{ opacity: collapsed ? 0 : 1, width: collapsed ? 0 : 'auto' }}
            className="font-semibold text-foreground whitespace-nowrap overflow-hidden"
          >
            ContentAccelerator
          </motion.span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
        >
          <motion.div
            initial={false}
            animate={{ rotate: collapsed ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronLeft className="h-4 w-4" />
          </motion.div>
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href;
          
          const linkContent = (
            <NavLink
              to={item.href}
              className={cn(
                'flex items-center gap-3 px-3 h-10 rounded-lg transition-all duration-200',
                'hover:bg-secondary/80',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <item.icon className={cn('h-5 w-5 flex-shrink-0', isActive && 'text-primary')} />
              <motion.span
                initial={false}
                animate={{ opacity: collapsed ? 0 : 1, width: collapsed ? 0 : 'auto' }}
                className="text-sm font-medium whitespace-nowrap overflow-hidden"
              >
                {item.label}
              </motion.span>
              {isActive && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute left-0 w-0.5 h-6 bg-primary rounded-r"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </NavLink>
          );

          if (collapsed) {
            return (
              <Tooltip key={item.href} delayDuration={0}>
                <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                <TooltipContent side="right" className="font-medium">
                  {item.label}
                </TooltipContent>
              </Tooltip>
            );
          }

          return <div key={item.href} className="relative">{linkContent}</div>;
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-border space-y-1">
        {collapsed ? (
          <>
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <NavLink
                  to="/settings"
                  className="flex items-center justify-center h-10 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors"
                >
                  <Settings className="h-5 w-5" />
                </NavLink>
              </TooltipTrigger>
              <TooltipContent side="right">Settings</TooltipContent>
            </Tooltip>
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <button
                  onClick={() => signOut()}
                  className="w-full flex items-center justify-center h-10 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">Sign out</TooltipContent>
            </Tooltip>
          </>
        ) : (
          <>
            <NavLink
              to="/settings"
              className="flex items-center gap-3 px-3 h-10 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors"
            >
              <Settings className="h-5 w-5" />
              <span className="text-sm font-medium">Settings</span>
            </NavLink>
            <button
              onClick={() => signOut()}
              className="w-full flex items-center gap-3 px-3 h-10 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span className="text-sm font-medium">Sign out</span>
            </button>
          </>
        )}
      </div>
    </motion.aside>
  );
}
