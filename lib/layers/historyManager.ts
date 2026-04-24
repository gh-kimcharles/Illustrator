import { HistorySnapshot, Layer } from "@/types";
import { restoreSnapshot, snapshotLayers } from "./layerManager";

const MAX_HISTORY = 50;

export class HistoryManager {
  private stack: HistorySnapshot[] = [];
  private cursor: number = -1;

  // Save a snapshot of the current layer state before any change
  push(label: string, layers: Layer[]): void {
    // Erase any redo history ahead of the cursor
    this.stack = this.stack.slice(0, this.cursor + 1);

    const snapshot: HistorySnapshot = {
      label,
      layerData: snapshotLayers(layers),
      layerOrder: layers.map((l) => l.id),
    };

    this.stack.push(snapshot);

    // Cap at MAX_HISTORY to avoid unbounded memory use
    if (this.stack.length > MAX_HISTORY) {
      this.stack.shift();
    }

    this.cursor = this.stack.length - 1;
  }

  // Undo: step back one snapshot and restore it
  undo(layers: Layer[]): boolean {
    if (this.cursor < 0) return false;
    const snapshot = this.stack[this.cursor];
    restoreSnapshot(layers, snapshot.layerData);
    this.cursor--;
    return true;
  }

  // Redo: step forward one snapshot and restor it
  redo(layers: Layer[]): boolean {
    if (this.cursor >= this.stack.length - 1) return false;
    this.cursor++;
    const snapshot = this.stack[this.cursor];
    restoreSnapshot(layers, snapshot.layerData);
    return true;
  }

  canUndo(): boolean {
    return this.cursor >= 0;
  }

  canRedo(): boolean {
    return this.cursor < this.stack.length - 1;
  }

  // Label of the next undo action (for display in Edit menu)
  undoLabel(): string | null {
    return this.cursor >= 0 ? this.stack[this.cursor].label : null;
  }

  clear(): void {
    this.stack = [];
    this.cursor = -1;
  }
}

// Singleton - shared accress whole app via import
export const history = new HistoryManager();
