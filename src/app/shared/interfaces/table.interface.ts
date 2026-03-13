export interface TableColumn<T> {
  key: string;
  header: string;
  cell: (row: T) => string | number | boolean | null | undefined;
}

export interface TableAction<T> {
  label: string;
  color?: 'primary' | 'secondary' | 'danger';
  handler: (row: T) => void;
}
