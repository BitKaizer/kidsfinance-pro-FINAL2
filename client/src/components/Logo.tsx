/**
 * KidsFinance PRO Logo Component
 * Styled text logo matching the brand design:
 * - "Kids" in bright blue (#3B82F6)
 * - "Finance" in dark navy (#1E293B)
 * - "PRO" in purple with gradient border box
 * - Small teal dot accent on the "i" in Kids
 */

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  light?: boolean; // Use light colors for dark backgrounds
}

export default function Logo({ size = 'md', light = false }: LogoProps) {
  const sizes = {
    sm: { text: 'text-xl', pro: 'text-xs px-1.5 py-0.5', gap: 'gap-1' },
    md: { text: 'text-3xl', pro: 'text-sm px-2 py-1', gap: 'gap-1.5' },
    lg: { text: 'text-5xl', pro: 'text-lg px-3 py-1.5', gap: 'gap-2' },
  };

  const s = sizes[size];

  return (
    <div className={`flex items-center justify-center ${s.gap} select-none`}>
      <span className={`${s.text} font-black tracking-tight`}>
        <span className={light ? 'text-blue-300' : 'text-blue-500'} style={{ position: 'relative' }}>
          K
          <span className="relative">
            i
            <span
              className="absolute bg-teal-400 rounded-full"
              style={{
                width: size === 'lg' ? '8px' : size === 'md' ? '6px' : '4px',
                height: size === 'lg' ? '8px' : size === 'md' ? '6px' : '4px',
                top: size === 'lg' ? '-2px' : '-1px',
                left: '50%',
                transform: 'translateX(-50%)',
              }}
            />
          </span>
          ds
        </span>
        <span className={light ? 'text-white' : 'text-slate-800'}>Finance</span>
      </span>
      <span
        className={`${s.pro} font-extrabold rounded-lg border-2`}
        style={{
          background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(168,85,247,0.1))',
          borderImage: 'linear-gradient(135deg, #3B82F6, #8B5CF6) 1',
          borderImageSlice: 1,
          color: light ? '#C4B5FD' : '#7C3AED',
        }}
      >
        PRO
      </span>
    </div>
  );
}
