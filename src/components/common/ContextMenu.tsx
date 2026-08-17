import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";

interface ContextMenuProps {
  x: number;
  y: number;
  items: ContextMenuItem[];
  onClose: () => void;
}

export interface ContextMenuItem {
  label: string;
  icon?: string;
  shortcut?: string;
  onClick: () => void;
  disabled?: boolean;
  divider?: boolean;
}

export function ContextMenu({ x, y, items, onClose }: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ left: x, top: y });

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  useLayoutEffect(() => {
    if (menuRef.current) {
      const rect = menuRef.current.getBoundingClientRect();
      const left = Math.min(x, window.innerWidth - rect.width - 8);
      const top = Math.min(y, window.innerHeight - rect.height - 8);
      setPos({ left: Math.max(8, left), top: Math.max(8, top) });
    }
  }, [x, y]);

  return (
    <div
      ref={menuRef}
      className="context-menu"
      style={{ left: pos.left, top: pos.top }}
    >
      {items.map((item, idx) =>
        item.divider ? (
          <div key={idx} className="menu-divider" />
        ) : (
          <button
            key={idx}
            className={`menu-item ${item.disabled ? "disabled" : ""}`}
            disabled={item.disabled}
            onClick={() => {
              item.onClick();
              onClose();
            }}
          >
            {item.icon && <span className="menu-icon">{item.icon}</span>}
            <span className="menu-label">{item.label}</span>
            {item.shortcut && <span className="menu-shortcut">{item.shortcut}</span>}
          </button>
        )
      )}
    </div>
  );
}
