"use client";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { EASE } from "@/lib/motion";

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  options: SelectOption[] | string[];
  value: string;
  onChange: (value: string) => void;
  /** Shown in the trigger when nothing is picked; also the label of the "clear" row. */
  placeholder?: string;
  /** Adds a first row that resets the value to "". */
  clearable?: boolean;
  id?: string;
  /** Renders a hidden input so native form submission still sees the value. */
  name?: string;
  invalid?: boolean;
  disabled?: boolean;
  className?: string;
}

const normalize = (options: SelectOption[] | string[]): SelectOption[] =>
  options.map((o) => (typeof o === "string" ? { value: o, label: o } : o));

export default function Select({
  options,
  value,
  onChange,
  placeholder = "Select…",
  clearable = false,
  id,
  name,
  invalid = false,
  disabled = false,
  className,
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [dropUp, setDropUp] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const typeahead = useRef({ query: "", at: 0 });

  const autoId = useId();
  const triggerId = id ?? `select-${autoId}`;
  const listId = `${triggerId}-listbox`;

  const items = useMemo(() => {
    const list = normalize(options);
    return clearable ? [{ value: "", label: placeholder }, ...list] : list;
  }, [options, clearable, placeholder]);

  const selectedIndex = items.findIndex((o) => o.value === value);
  const selected = selectedIndex >= 0 ? items[selectedIndex] : undefined;

  const openMenu = () => {
    if (disabled) return;
    const rect = triggerRef.current?.getBoundingClientRect();
    if (rect) {
      const spaceBelow = window.innerHeight - rect.bottom;
      setDropUp(spaceBelow < 260 && rect.top > spaceBelow);
    }
    setActive(selectedIndex >= 0 ? selectedIndex : 0);
    setOpen(true);
  };

  const close = () => {
    setOpen(false);
    triggerRef.current?.focus();
  };

  const commit = (index: number) => {
    const option = items[index];
    if (!option) return;
    onChange(option.value);
    close();
  };

  /* Close on outside pointer / window resize */
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onResize = () => setOpen(false);
    document.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("resize", onResize);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  /* Keep the highlighted row in view */
  useEffect(() => {
    if (!open) return;
    listRef.current
      ?.querySelector<HTMLLIElement>(`[data-index="${active}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [open, active]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    if (!open) {
      if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) {
        e.preventDefault();
        openMenu();
      }
      return;
    }

    switch (e.key) {
      case "Escape":
        e.preventDefault();
        close();
        break;
      case "Tab":
        setOpen(false);
        break;
      case "ArrowDown":
        e.preventDefault();
        setActive((i) => (i + 1) % items.length);
        break;
      case "ArrowUp":
        e.preventDefault();
        setActive((i) => (i - 1 + items.length) % items.length);
        break;
      case "Home":
        e.preventDefault();
        setActive(0);
        break;
      case "End":
        e.preventDefault();
        setActive(items.length - 1);
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        commit(active);
        break;
      default: {
        if (e.key.length !== 1 || e.metaKey || e.ctrlKey || e.altKey) return;
        // Typeahead - reset the buffer after a second of no typing.
        const now = performance.now();
        const t = typeahead.current;
        t.query = now - t.at > 1000 ? e.key : t.query + e.key;
        t.at = now;
        const match = items.findIndex((o) =>
          o.label.toLowerCase().startsWith(t.query.toLowerCase())
        );
        if (match >= 0) setActive(match);
      }
    }
  };

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      {name && <input type="hidden" name={name} value={value} />}

      <button
        ref={triggerRef}
        id={triggerId}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-activedescendant={open ? `${listId}-${active}` : undefined}
        aria-invalid={invalid || undefined}
        disabled={disabled}
        onClick={() => (open ? setOpen(false) : openMenu())}
        onKeyDown={onKeyDown}
        className={cn(
          "flex w-full cursor-pointer items-center justify-between gap-3 rounded-xl border border-line bg-raised px-4 py-3 text-left text-sm transition-colors",
          "focus:outline-none focus-visible:border-brass",
          open ? "border-brass" : "hover:border-brass/50",
          selected?.value ? "text-text" : "text-muted/70",
          invalid && "border-danger",
          disabled && "cursor-not-allowed opacity-50"
        )}
      >
        <span className="truncate">{selected?.value ? selected.label : placeholder}</span>
        <ChevronDown
          size={16}
          aria-hidden
          className={cn(
            "shrink-0 text-muted transition-transform duration-200",
            open && "rotate-180 text-brass"
          )}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            ref={listRef}
            id={listId}
            role="listbox"
            aria-labelledby={triggerId}
            tabIndex={-1}
            initial={{ opacity: 0, scale: 0.97, y: dropUp ? 6 : -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: dropUp ? 6 : -6, transition: { duration: 0.12 } }}
            transition={{ duration: 0.18, ease: EASE }}
            style={{ transformOrigin: dropUp ? "bottom center" : "top center" }}
            className={cn(
              "absolute z-50 max-h-60 w-full overflow-y-auto overscroll-contain rounded-xl border border-line bg-surface p-1.5 shadow-lux",
              "[&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-line [&::-webkit-scrollbar-track]:bg-transparent",
              dropUp ? "bottom-full mb-2" : "top-full mt-2"
            )}
          >
            {items.map((option, i) => {
              const isSelected = option.value === value;
              const isActive = i === active;
              return (
                <li
                  key={option.value || "__empty"}
                  id={`${listId}-${i}`}
                  role="option"
                  aria-selected={isSelected}
                  data-index={i}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => commit(i)}
                  className={cn(
                    "flex cursor-pointer items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-sm transition-colors",
                    isActive ? "bg-brass/12 text-brass-text" : "text-text",
                    !option.value && "text-muted"
                  )}
                >
                  <span className="truncate">{option.label}</span>
                  {isSelected && option.value && (
                    <Check size={14} aria-hidden className="shrink-0 text-brass" />
                  )}
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
