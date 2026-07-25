'use client';

import { useEffect, useMemo, useCallback, useState } from 'react';
import { Command } from 'cmdk';
import { motion, AnimatePresence } from 'framer-motion';
import { createCommands } from '@/data/commands';
import type { CommandItem } from '@/types';
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
        requestAnimationFrame(() => cmd.action());
      }
    },
    [commands, onOpenChange],
  );

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[100]"
            style={{
              background: 'color-mix(in srgb, var(--text-1) 24%, transparent)',
              backdropFilter: 'blur(4px)',
            }}
            onClick={() => onOpenChange(false)}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -8 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[101] flex items-start justify-center pt-[18vh]"
            onClick={(e) => {
              if (e.target === e.currentTarget) onOpenChange(false);
            }}
          >
            <Command
              className="w-full max-w-[620px] mx-4 rounded-2xl border border-[var(--hairline)] bg-[var(--sheet)] overflow-hidden"
              style={{ boxShadow: 'var(--shadow-raised)' }}
              shouldFilter={true}
              onKeyDown={(e: React.KeyboardEvent) => {
                if (e.key === 'Escape') onOpenChange(false);
              }}
            >
              <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--hairline)]">
                <Command.Input
                  value={search}
                  onValueChange={setSearch}
                  placeholder="Type a command or search"
                  className="flex-1 bg-transparent text-sm text-[var(--text-1)] placeholder:text-[var(--text-3)] outline-none"
                  autoFocus
                />
                <kbd className="font-mono text-[10px] text-[var(--text-3)] px-1.5 py-0.5 rounded-lg border border-[var(--hairline)]">
                  esc
                </kbd>
              </div>

              <Command.List className="max-h-[320px] overflow-y-auto p-2">
                <Command.Empty className="px-4 py-8 text-center text-xs text-[var(--text-3)]">
                  Nothing found.
                </Command.Empty>

                {Array.from(grouped.entries()).map(([group, items]) => (
                  <Command.Group
                    key={group}
                    heading={group}
                    className="[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:text-[var(--text-3)]"
                  >
                    {items.map((cmd) => (
                      <Command.Item
                        key={cmd.id}
                        value={`${cmd.label} ${cmd.description}`}
                        onSelect={() => handleSelect(cmd.id)}
                        className="flex items-baseline gap-2 px-3 py-2.5 rounded-lg text-sm text-[var(--text-2)] cursor-pointer transition-colors duration-150 data-[selected=true]:bg-[var(--canvas)] data-[selected=true]:text-[var(--text-1)]"
                      >
                        <span>{cmd.label}</span>
                        <span className="text-xs text-[var(--text-3)]">{cmd.description}</span>
                      </Command.Item>
                    ))}
                  </Command.Group>
                ))}
              </Command.List>
            </Command>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
