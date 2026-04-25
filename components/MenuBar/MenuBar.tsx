"use client";

import { useEffect, useRef, useState } from "react";
import { useEditorStore } from "@/store/useEditorStore";

interface MenuItem {
  label: string;
  shortcut?: string;
  action?: () => void;
  disabled?: boolean;
  separator?: boolean;
}

interface MenuDef {
  label: string;
  items: MenuItem[];
}

interface MenuBarProps {
  onNewDocument: () => void;
  onOpenFile: () => void;
  onExportPNG: () => void;

  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
}

const MenuBar = ({
  onNewDocument,
  onOpenFile,
  onExportPNG,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
}: MenuBarProps) => {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const { zoomIn, zoomOut, zoomFit, zoom100, toggleRulers, addLayer } =
    useEditorStore();

  const menus: MenuDef[] = [
    {
      label: "File",
      items: [
        { label: "New…", shortcut: "Ctrl+N", action: onNewDocument },
        { label: "Open…", shortcut: "Ctrl+O", action: onOpenFile },
        { separator: true, label: "" },
        { label: "Save", shortcut: "Ctrl+S", disabled: true },
        {
          label: "Export as PNG",
          shortcut: "Ctrl+Shift+E",
          action: onExportPNG,
        },
        { separator: true, label: "" },
        { label: "Close", shortcut: "Ctrl+W", disabled: true },
      ],
    },
    {
      label: "Edit",
      items: [
        {
          label: "Undo",
          shortcut: "Ctrl+Z",
          action: onUndo,
          // disabled when nothing to undo
          disabled: !canUndo,
        },
        {
          label: "Redo",
          shortcut: "Ctrl+Y",
          action: onRedo,
          disabled: !canRedo,
        },
        { separator: true, label: "" },
        { label: "Cut", shortcut: "Ctrl+X", disabled: true },
        { label: "Copy", shortcut: "Ctrl+C", disabled: true },
        { label: "Paste", shortcut: "Ctrl+V", disabled: true },
        { separator: true, label: "" },
        { label: "Fill…", shortcut: "Shift+F5", disabled: true },
      ],
    },
    {
      label: "Image",
      items: [
        { label: "Image Size…", disabled: true },
        { label: "Canvas Size…", disabled: true },
        { separator: true, label: "" },
        { label: "Rotate Canvas ▶", disabled: true },
        { label: "Flip Canvas Horizontal", disabled: true },
        { label: "Flip Canvas Vertical", disabled: true },
      ],
    },
    {
      label: "Layer",
      items: [
        {
          label: "New Layer",
          shortcut: "Ctrl+Shift+N",
          action: () => addLayer(),
        },
        { label: "Duplicate Layer", disabled: true },
        { label: "Delete Layer", disabled: true },
        { separator: true, label: "" },
        { label: "Merge Down", shortcut: "Ctrl+E", disabled: true },
        { label: "Flatten Image", disabled: true },
      ],
    },
    {
      label: "View",
      items: [
        { label: "Zoom In", shortcut: "Ctrl++", action: zoomIn },
        { label: "Zoom Out", shortcut: "Ctrl+-", action: zoomOut },
        { label: "Fit on Screen", shortcut: "Ctrl+0", action: zoomFit },
        { label: "100%", shortcut: "Ctrl+1", action: zoom100 },
        { separator: true, label: "" },
        { label: "Rulers", shortcut: "Ctrl+R", action: toggleRulers },
      ],
    },
  ];

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    }

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div
      ref={ref}
      className="flex items-center h-7 bg-editor-menubar border-b border-editor-border select-none z-50 flex-shrink-0"
    >
      {/* Logo */}
      <div className="w-9 h-full flex items-center justify-center bg-[oklch(0.10_0.05_240)] text-editor-accent text-[11px] font-bold tracking-wide flex-shrink-0">
        Ill
      </div>

      {menus.map((menu) => (
        <div key={menu.label} className="relative">
          <button
            className={`editor-menu-item ${openMenu === menu.label ? "editor-menu-item-open" : ""}`}
            onMouseDown={() =>
              setOpenMenu(openMenu === menu.label ? null : menu.label)
            }
            onMouseEnter={() => openMenu && setOpenMenu(menu.label)}
          >
            {menu.label}
          </button>

          {openMenu === menu.label && (
            <div className="absolute top-full left-0 min-w-[200px] bg-editor-panel-header border border-editor-border shadow-2xl z-[200]">
              {menu.items.map((item, i) =>
                item.separator ? (
                  <div key={i} className="h-px bg-editor-border-light my-0.5" />
                ) : (
                  <button
                    key={i}
                    disabled={item.disabled}
                    className={`w-full flex justify-between items-center gap-6 px-4 py-1.5 text-[12px] text-left transition-colors ${
                      item.disabled
                        ? "text-editor-text-disabled cursor-default"
                        : "text-editor-text hover:bg-editor-accent hover:text-white"
                    }`}
                    onClick={() => {
                      if (!item.disabled && item.action) {
                        item.action();
                        setOpenMenu(null);
                      }
                    }}
                  >
                    <span>{item.label}</span>
                    {item.shortcut && (
                      <span className="text-[11px] opacity-60">
                        {item.shortcut}
                      </span>
                    )}
                  </button>
                ),
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default MenuBar;
