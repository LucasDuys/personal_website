'use client';

import { useEffect, useMemo, useCallback, useState } from 'react';
import { Command } from 'cmdk';
import { motion, AnimatePresence } from 'framer-motion';
import { createCommands, type CommandItem } from '@/data/commands';
import { useLenis } from '@/hooks/useLenis';

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const { scrollTo } = useLenis();
  const [search, setSearch] = useState('');

  const commands = useMemo(() => createCommands(scrollTo), [scrollTo]);

  const grouped = useMemo(() => {
    const map = new Map<string, CommandItem[]>();
    for (const cmd of commands) {
      const list = map.get(cmd.group) ?? [];
      list.push(cmd);
      map.set(cmd.group, list);
    }
    return map;
  }, [commands]);

  // Keyboard shortcuts: Cmd/Ctrl+K to toggle, Esc to close
  // (Esc has to be a global listener -- the <Command> onKeyDown only fires
  // when focus is inside the palette, which it isn't after a click outside.)
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onOpenChange(!open);
      } else if (e.key === 'Escape' && open) {
        e.preventDefault();
        onOpenChange(false);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onOpenChange]);

  const handleSelect = useCallback(
    (id: string) => {
      const cmd = commands.find((c) => c.id === id);
      if (cmd) {
        onOpenChange(false);
        // Small delay so the palette closes before action fires
        requestAnimationFrame(() => cmd.action());
      }
    },
    [commands, onOpenChange],
  );

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[100] bg-black/60"
            style={{ backdropFilter: 'blur(4px)' }}
            onClick={() => onOpenChange(false)}
          />

          {/* Modal -- click on the empty area around the palette closes it */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[101] flex items-start justify-center pt-[20vh]"
            onClick={(e) => {
              if (e.target === e.currentTarget) onOpenChange(false);
            }}
          >
            <Command
              className="w-full max-w-[640px] mx-4 rounded-xl border border-[var(--border)] overflow-hidden"
              style={{ background: 'rgba(14,14,20,0.95)' }}
              shouldFilter={true}
              onKeyDown={(e: React.KeyboardEvent) => {
                if (e.key === 'Escape') {
                  onOpenChange(false);
                }
              }}
            >
              {/* Input */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--border)]">
                <span className="text-[var(--accent-green)] font-mono text-sm font-semibold select-none">
                  &gt;
                </span>
                <Command.Input
                  value={search}
                  onValueChange={setSearch}
                  placeholder="Type a command..."
                  className="flex-1 bg-transparent font-mono text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none"
                  autoFocus
                />
              </div>

              {/* Results */}
              <Command.List className="max-h-[300px] overflow-y-auto p-2">
                <Command.Empty className="px-4 py-8 text-center font-mono text-xs text-[var(--text-muted)]">
                  No results found.
                </Command.Empty>

                {Array.from(grouped.entries()).map(([group, items]) => (
                  <Command.Group
                    key={group}
                    heading={group}
                    className="[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-widest [&_[cmdk-group-heading]]:text-[var(--text-muted)]"
                  >
                    {items.map((cmd) => (
                      <Command.Item
                        key={cmd.id}
                        value={`${cmd.label} ${cmd.description}`}
                        onSelect={() => handleSelect(cmd.id)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg font-mono text-sm text-[var(--text-secondary)] cursor-pointer transition-colors data-[selected=true]:bg-[var(--surface-2)] data-[selected=true]:text-[var(--text-primary)]"
                      >
                        <span className="text-base w-5 text-center flex-shrink-0">{cmd.icon}</span>
                        <div className="flex-1 min-w-0">
                          <span className="text-sm">{cmd.label}</span>
                          <span className="ml-2 text-xs text-[var(--text-muted)]">{cmd.description}</span>
                        </div>
                        {cmd.shortcut && (
                          <kbd className="ml-auto text-[10px] text-[var(--text-muted)] px-1.5 py-0.5 rounded border border-[var(--border)] bg-[var(--surface-1)]">
                            {cmd.shortcut}
                          </kbd>
                        )}
                      </Command.Item>
                    ))}
                  </Command.Group>
                ))}
              </Command.List>

              {/* Footer */}
              <div className="flex items-center gap-4 px-4 py-2.5 border-t border-[var(--border)]">
                <span className="font-mono text-[10px] text-[var(--text-muted)]">
                  <kbd className="px-1 py-0.5 rounded border border-[var(--border)] bg-[var(--surface-1)] mr-1">&uarr;&darr;</kbd>
                  navigate
                </span>
                <span className="font-mono text-[10px] text-[var(--text-muted)]">
                  <kbd className="px-1 py-0.5 rounded border border-[var(--border)] bg-[var(--surface-1)] mr-1">&crarr;</kbd>
                  select
                </span>
                <span className="font-mono text-[10px] text-[var(--text-muted)]">
                  <kbd className="px-1 py-0.5 rounded border border-[var(--border)] bg-[var(--surface-1)] mr-1">esc</kbd>
                  close
                </span>
              </div>
            </Command>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
