import { HistorySnapshot, Layer } from "@/types";
import { restoreSnapshot, snapshotLayers } from "./layerManager";

// max number of history states to keep (for memory management)
const MAX_HISTORY = 50;

export class HistoryManager {
  private stack: HistorySnapshot[] = [];
  private cursor: number = -1;

  // save a snapshot of the current layer state before any change
  push(label: string, layers: Layer[]): void {
    // erase any redo history ahead of the cursor
    this.stack = this.stack.slice(0, this.cursor + 1);

    const snapshot: HistorySnapshot = {
      label,
      layerData: snapshotLayers(layers),
      layerOrder: layers.map((l) => l.id),
    };

    this.stack.push(snapshot);

    // cap at MAX_HISTORY to avoid unbounded memory use; 50
    if (this.stack.length > MAX_HISTORY) {
      this.stack.shift();
    }

    this.cursor = this.stack.length - 1;
  }

  // undo: step back one snapshot and restore it
  undo(layers: Layer[]): boolean {
    if (this.cursor <= 0) return false;

    this.cursor--;
    const snapshot = this.stack[this.cursor];
    restoreSnapshot(layers, snapshot.layerData);
    return true;
  }

  // redo: step forward one snapshot and restore it
  redo(layers: Layer[]): boolean {
    if (this.cursor >= this.stack.length - 1) return false;

    this.cursor++;
    const snapshot = this.stack[this.cursor];
    restoreSnapshot(layers, snapshot.layerData);
    return true;
  }

  // check if history can undo
  canUndo(): boolean {
    return this.cursor > 0;
  }

  // check if history can redo
  canRedo(): boolean {
    return this.cursor < this.stack.length - 1;
  }

  // label of the next undo action (for display in Edit menu)
  undoLabel(): string | null {
    return this.cursor >= 0 ? this.stack[this.cursor].label : null;
  }

  // clear for new document
  clear(): void {
    this.stack = [];
    this.cursor = -1;
  }
}

// singleton - shared accress whole app via import
export const history = new HistoryManager();
