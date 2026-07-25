import { SKILL_GROUPS } from '@/data/skills';
import { RiseGroup, RiseItem } from '@/components/ui/Motion';
import { SkillConstellation } from '@/components/canvas/SkillConstellation';

export function Skills() {
  return (
    <section id="skills" className="border-y border-[var(--hairline)] bg-[var(--sheet-2)]">
      <RiseGroup className="max-w-6xl mx-auto px-5 md:px-10 py-28 md:py-32">
          <RiseItem>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-[var(--text-1)]">
            What I work with
          </h2>
          </RiseItem>

        {/* Desktop: the constellation */}
        <RiseItem className="hidden md:block mt-12">
          <SkillConstellation />
        </RiseItem>

        {/* Mobile: grouped list */}
        <div className="md:hidden mt-12 grid grid-cols-2 gap-x-8 gap-y-12">
          {SKILL_GROUPS.map((group) => (
            <RiseItem key={group.label}>
              <h3 className="text-sm font-medium text-[var(--text-1)]">{group.label}</h3>
              <ul className="mt-4 space-y-2.5">
                {group.items.map((item) => (
                  <li key={item} className="text-sm text-[var(--text-2)]">
                    {item}
                  </li>
                ))}
              </ul>
            </RiseItem>
          ))}
        </div>
      </RiseGroup>
    </section>
  );
}
