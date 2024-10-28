export type ContextBlockType = {
  show?: boolean;
  selectable?: boolean;
  datasets?: Dataset[];
  canNotAddContext?: boolean;
  onAddContext?: () => void;
  onInsert?: () => void;
  onDelete?: () => void;
};

export type Dataset = {
  id: string;
  name: string;
  type: string;
};
