interface IconProps {
  size?: number;
  className?: string;
}

const base = (size: number, className?: string) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  className,
});

export function IconNew({ size = 16, className }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="12" y1="18" x2="12" y2="12" />
      <line x1="9" y1="15" x2="15" y2="15" />
    </svg>
  );
}

export function IconOpen({ size = 16, className }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <path d="M6 2h6l4 4v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" />
      <polyline points="12 2 12 6 16 6" />
    </svg>
  );
}

export function IconSave({ size = 16, className }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
      <polyline points="17 21 17 13 7 13 7 21" />
      <polyline points="7 3 7 8 15 8" />
    </svg>
  );
}

export function IconSaveAll({ size = 16, className }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <path d="M5 3h8l4 4v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
      <polyline points="13 3 13 7 17 7" />
      <path d="M9 13h6v6H9z" />
      <line x1="11" y1="16" x2="13" y2="16" />
    </svg>
  );
}

export function IconPrint({ size = 16, className }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <polyline points="6 9 6 2 18 2 18 9" />
      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
      <rect x="6" y="14" width="12" height="8" />
    </svg>
  );
}

export function IconUndo({ size = 16, className }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <polyline points="9 14 4 9 9 4" />
      <path d="M20 20v-7a4 4 0 0 0-4-4H4" />
    </svg>
  );
}

export function IconRedo({ size = 16, className }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <polyline points="15 14 20 9 15 4" />
      <path d="M4 20v-7a4 4 0 0 1 4-4h12" />
    </svg>
  );
}

export function IconCut({ size = 16, className }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <circle cx="6" cy="6" r="3" />
      <circle cx="6" cy="18" r="3" />
      <line x1="20" y1="4" x2="8.12" y2="15.88" />
      <line x1="14.47" y1="14.48" x2="20" y2="20" />
      <line x1="8.12" y1="8.12" x2="12" y2="12" />
    </svg>
  );
}

export function IconCopy({ size = 16, className }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

export function IconPaste({ size = 16, className }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
    </svg>
  );
}

export function IconFind({ size = 16, className }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

export function IconReplace({ size = 16, className }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <polyline points="17 1 21 5 17 9" />
      <path d="M3 11V9a4 4 0 0 1 4-4h14" />
      <polyline points="7 23 3 19 7 15" />
      <path d="M21 13v2a4 4 0 0 1-4 4H3" />
    </svg>
  );
}

export function IconGotoLine({ size = 16, className }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <line x1="4" y1="6" x2="20" y2="6" />
      <line x1="4" y1="12" x2="14" y2="12" />
      <line x1="4" y1="18" x2="18" y2="18" />
      <polyline points="18 14 22 18 18 22" />
    </svg>
  );
}

export function IconZoomIn({ size = 16, className }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
      <line x1="11" y1="8" x2="11" y2="14" />
      <line x1="8" y1="11" x2="14" y2="11" />
    </svg>
  );
}

export function IconZoomOut({ size = 16, className }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
      <line x1="8" y1="11" x2="14" y2="11" />
    </svg>
  );
}

export function IconZoomReset({ size = 16, className }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <polyline points="4 14 10 14 10 4" />
      <polyline points="20 10 14 10 14 20" />
      <line x1="4" y1="20" x2="10" y2="20" />
      <line x1="14" y1="4" x2="20" y2="4" />
    </svg>
  );
}

export function IconWordWrap({ size = 16, className }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="16" y2="12" />
      <polyline points="16 8 20 12 16 16" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

export function IconLineNumbers({ size = 16, className }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <line x1="4" y1="6" x2="8" y2="6" />
      <line x1="4" y1="12" x2="8" y2="12" />
      <line x1="4" y1="18" x2="8" y2="18" />
      <line x1="12" y1="4" x2="12" y2="20" />
      <line x1="15" y1="8" x2="20" y2="8" />
      <line x1="15" y1="12" x2="20" y2="12" />
      <line x1="15" y1="16" x2="20" y2="16" />
    </svg>
  );
}

export function IconCompare({ size = 16, className }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <line x1="12" y1="2" x2="12" y2="22" />
      <polyline points="8 7 4 11 8 15" />
      <line x1="4" y1="11" x2="11" y2="11" />
      <polyline points="16 7 20 11 16 15" />
      <line x1="13" y1="11" x2="20" y2="11" />
    </svg>
  );
}

export function IconCompareClear({ size = 16, className }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  );
}

export function IconSyncScroll({ size = 16, className }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <polyline points="7 4 3 8 7 12" />
      <line x1="3" y1="8" x2="14" y2="8" />
      <polyline points="17 12 21 16 17 20" />
      <line x1="10" y1="16" x2="21" y2="16" />
    </svg>
  );
}

export function IconSettings({ size = 16, className }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}
