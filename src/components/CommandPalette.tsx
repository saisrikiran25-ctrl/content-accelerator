import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Sparkles,
  FileText,
  Calendar,
  BarChart3,
  Settings,
  Briefcase,
  LayoutDashboard,
  Plus,
  ArrowRight,
  Command,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

interface CommandItem {
  id: string;
  icon: React.ElementType;
  title: string;
  description: string;
  action: () => void;
  category: 'navigation' | 'actions';
  shortcut?: string;
}

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();

  const commands: CommandItem[] = [
    // Actions
    {
      id: 'new-brief',
      icon: Plus,
      title: 'New Content Brief',
      description: 'Create a new AI-powered content brief',
      action: () => navigate('/brief'),
      category: 'actions',
      shortcut: 'N',
    },
    {
      id: 'generate',
      icon: Sparkles,
      title: 'Generate Content',
      description: 'Start AI content generation',
      action: () => navigate('/generate'),
      category: 'actions',
      shortcut: 'G',
    },
    // Navigation
    {
      id: 'dashboard',
      icon: LayoutDashboard,
      title: 'Dashboard',
      description: 'Go to dashboard overview',
      action: () => navigate('/'),
      category: 'navigation',
      shortcut: 'D',
    },
    {
      id: 'library',
      icon: FileText,
      title: 'Content Library',
      description: 'Browse your content collection',
      action: () => navigate('/library'),
      category: 'navigation',
      shortcut: 'L',
    },
    {
      id: 'calendar',
      icon: Calendar,
      title: 'Content Calendar',
      description: 'View scheduling calendar',
      action: () => navigate('/calendar'),
      category: 'navigation',
      shortcut: 'C',
    },
    {
      id: 'analytics',
      icon: BarChart3,
      title: 'Analytics',
      description: 'View performance metrics',
      action: () => navigate('/analytics'),
      category: 'navigation',
    },
    {
      id: 'brand-voice',
      icon: Briefcase,
      title: 'Brand Voice',
      description: 'Train AI on your writing style',
      action: () => navigate('/brand-voice'),
      category: 'navigation',
      shortcut: 'B',
    },
    {
      id: 'settings',
      icon: Settings,
      title: 'Settings',
      description: 'Manage account and preferences',
      action: () => navigate('/settings'),
      category: 'navigation',
    },
  ];

  const filteredCommands = commands.filter(
    cmd =>
      cmd.title.toLowerCase().includes(query.toLowerCase()) ||
      cmd.description.toLowerCase().includes(query.toLowerCase())
  );

  const groupedCommands = {
    actions: filteredCommands.filter(c => c.category === 'actions'),
    navigation: filteredCommands.filter(c => c.category === 'navigation'),
  };

  const flatCommands = [...groupedCommands.actions, ...groupedCommands.navigation];

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Open command palette
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
        setQuery('');
        setSelectedIndex(0);
        return;
      }

      if (!isOpen) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(i => (i + 1) % flatCommands.length);
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(i => (i - 1 + flatCommands.length) % flatCommands.length);
          break;
        case 'Enter':
          e.preventDefault();
          if (flatCommands[selectedIndex]) {
            flatCommands[selectedIndex].action();
            setIsOpen(false);
          }
          break;
        case 'Escape':
          setIsOpen(false);
          break;
      }
    },
    [isOpen, flatCommands, selectedIndex]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="p-0 gap-0 max-w-lg overflow-hidden bg-card border-border">
        {/* Search Input */}
        <div className="flex items-center px-4 border-b border-border">
          <Search className="h-5 w-5 text-muted-foreground mr-3" />
          <Input
            placeholder="Type a command or search..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-14 text-base bg-transparent"
            autoFocus
          />
          <kbd className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-secondary rounded border border-border text-muted-foreground">
            ESC
          </kbd>
        </div>

        {/* Command List */}
        <div className="max-h-[400px] overflow-y-auto p-2">
          {flatCommands.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              No results found for "{query}"
            </div>
          ) : (
            <>
              {groupedCommands.actions.length > 0 && (
                <div className="mb-2">
                  <div className="px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Actions
                  </div>
                  {groupedCommands.actions.map((cmd, idx) => (
                    <CommandItemRow
                      key={cmd.id}
                      command={cmd}
                      isSelected={selectedIndex === idx}
                      onSelect={() => {
                        cmd.action();
                        setIsOpen(false);
                      }}
                      onHover={() => setSelectedIndex(idx)}
                    />
                  ))}
                </div>
              )}

              {groupedCommands.navigation.length > 0 && (
                <div>
                  <div className="px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Navigation
                  </div>
                  {groupedCommands.navigation.map((cmd, idx) => (
                    <CommandItemRow
                      key={cmd.id}
                      command={cmd}
                      isSelected={selectedIndex === groupedCommands.actions.length + idx}
                      onSelect={() => {
                        cmd.action();
                        setIsOpen(false);
                      }}
                      onHover={() => setSelectedIndex(groupedCommands.actions.length + idx)}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-secondary/30">
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-secondary rounded text-[10px]">↑↓</kbd>
              Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-secondary rounded text-[10px]">↵</kbd>
              Select
            </span>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Command className="h-3 w-3" />
            <span>K to open</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function CommandItemRow({
  command,
  isSelected,
  onSelect,
  onHover,
}: {
  command: CommandItem;
  isSelected: boolean;
  onSelect: () => void;
  onHover: () => void;
}) {
  return (
    <motion.button
      onClick={onSelect}
      onMouseEnter={onHover}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left ${
        isSelected ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-secondary'
      }`}
    >
      <div
        className={`w-9 h-9 rounded-lg flex items-center justify-center ${
          isSelected ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'
        }`}
      >
        <command.icon className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm truncate">{command.title}</p>
        <p className="text-xs text-muted-foreground truncate">{command.description}</p>
      </div>
      {command.shortcut && (
        <kbd
          className={`px-2 py-1 text-xs rounded border ${
            isSelected
              ? 'bg-primary/20 border-primary/30 text-primary'
              : 'bg-secondary border-border text-muted-foreground'
          }`}
        >
          {command.shortcut}
        </kbd>
      )}
      {isSelected && <ArrowRight className="h-4 w-4 text-primary" />}
    </motion.button>
  );
}
