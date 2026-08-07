export interface PgDriverError {
  code?: string;
  detail?: string;
  constraint?: string;
  table?: string;
  column?: string;
}
