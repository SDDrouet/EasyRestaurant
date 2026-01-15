import { Component, input, output, signal, OnInit, OnDestroy, effect } from '@angular/core';
import { SHARED_UI_MODULES } from '@shared/ui-modules';
import { TableLazyLoadEvent } from 'primeng/table';
import { Subject, debounceTime, takeUntil } from 'rxjs';

export interface TableColumn<T> {
  field: keyof T | string;
  header: string;
  sortable?: boolean;
  filterable?: boolean;
  width?: string;
  type?: 'text' | 'badge' | 'custom';
  customTemplate?: (row: T) => string;
  badgeConfig?: {
    getValue: (row: T) => boolean | string;
    trueValue?: { label: string; class: string; icon?: string };
    falseValue?: { label: string; class: string; icon?: string };
  };
}

export interface TableAction<T> {
  icon: string;
  tooltip: string;
  color: 'blue' | 'amber' | 'red' | 'green';
  onClick: (row: T) => void;
  condition?: (row: T) => boolean;
  alternativeAction?: {
    icon: string;
    tooltip: string;
    color: 'blue' | 'amber' | 'red' | 'green';
    onClick: (row: T) => void;
  };
}

export interface TableConfig<T> {
  columns: TableColumn<T>[];
  actions?: TableAction<T>[];
  pageable?: boolean;
  pageSize?: number;
  pageSizeOptions?: number[];
  emptyMessage?: string;
  emptyIcon?: string;
}

export interface TableLazyLoadParams {
  page: number;
  size: number;
  sort?: string;
  direction?: 'ASC' | 'DESC';
  filters?: Record<string, string>;
}

@Component({
  selector: 'app-data-table',
  imports: [...SHARED_UI_MODULES],
  templateUrl: './data-table.html',
})
export class DataTable<T> implements OnInit, OnDestroy {
  // Inputs
  data = input.required<T[]>();
  config = input.required<TableConfig<T>>();
  totalRecords = input<number>(0);
  loading = input<boolean>(false);

  // Outputs
  lazyLoad = output<TableLazyLoadParams>();

  // Internal state
  filters = signal<Record<string, string>>({});
  private searchSubject = new Subject<void>();
  private destroy$ = new Subject<void>();

  currentPage = signal<number>(0);
  pageSize = signal<number>(10);
  sortField = signal<string>('');
  sortOrder = signal<'ASC' | 'DESC'>('ASC');

  ngOnInit(): void {
    // Configurar pageSize inicial desde config
    const cfg = this.config();
    if (cfg.pageSize) {
      this.pageSize.set(cfg.pageSize);
    }

    // Configurar debounce para filtros (500ms)
    this.searchSubject
      .pipe(debounceTime(500), takeUntil(this.destroy$))
      .subscribe(() => {
        this.applyFilters();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onLazyLoad(event: TableLazyLoadEvent): void {
    if (event.first !== undefined && event.rows !== undefined && event.rows !== null) {
      this.currentPage.set(event.first / event.rows);
      this.pageSize.set(event.rows);
    }

    if (event.sortField) {
      this.sortField.set(event.sortField as string);
      this.sortOrder.set(event.sortOrder === 1 ? 'ASC' : 'DESC');
    }

    this.emitLazyLoad();
  }

  onFilterChange(): void {
    this.searchSubject.next();
  }

  applyFilters(): void {
    this.currentPage.set(0);
    this.emitLazyLoad();
  }

  private emitLazyLoad(): void {
    const params: TableLazyLoadParams = {
      page: this.currentPage(),
      size: this.pageSize(),
      sort: this.sortField(),
      direction: this.sortOrder(),
      filters: this.filters(),
    };

    this.lazyLoad.emit(params);
  }

  updateFilter(field: string, value: string): void {
    this.filters.update((filters) => ({
      ...filters,
      [field]: value,
    }));
    this.onFilterChange();
  }

  getFilterValue(field: string): string {
    return this.filters()[field] || '';
  }

  getCellValue(row: T, column: TableColumn<T>): any {
    return (row as any)[column.field];
  }

  getFieldAsString(field: keyof T | string): string {
    return String(field);
  }

  getBadgeClass(column: TableColumn<T>, row: T): string {
    if (!column.badgeConfig) return '';
    const value = column.badgeConfig.getValue(row);
    return value
      ? column.badgeConfig.trueValue?.class || ''
      : column.badgeConfig.falseValue?.class || '';
  }

  getBadgeLabel(column: TableColumn<T>, row: T): string {
    if (!column.badgeConfig) return '';
    const value = column.badgeConfig.getValue(row);
    return value
      ? column.badgeConfig.trueValue?.label || ''
      : column.badgeConfig.falseValue?.label || '';
  }

  getBadgeIcon(column: TableColumn<T>, row: T): string | undefined {
    if (!column.badgeConfig) return undefined;
    const value = column.badgeConfig.getValue(row);
    return value
      ? column.badgeConfig.trueValue?.icon
      : column.badgeConfig.falseValue?.icon;
  }

  getButtonClass(color: string): string {
    const colorMap: Record<string, string> = {
      blue: 'text-blue-600 hover:bg-blue-50',
      amber: 'text-amber-600 hover:bg-amber-50',
      red: 'text-red-600 hover:bg-red-50',
      green: 'text-green-600 hover:bg-green-50',
    };
    return colorMap[color] || colorMap['blue'];
  }

  shouldShowAction(action: TableAction<T>, row: T): boolean {
    if (action.condition) {
      return action.condition(row);
    }
    return true;
  }

  getActionToShow(action: TableAction<T>, row: T): TableAction<T> | TableAction<T>['alternativeAction'] {
    if (action.condition && !action.condition(row) && action.alternativeAction) {
      return action.alternativeAction;
    }
    return action;
  }

  executeAction(action: TableAction<T>, row: T): void {
    const actionToExecute = this.getActionToShow(action, row);
    if (actionToExecute && 'onClick' in actionToExecute) {
      actionToExecute.onClick(row);
    }
  }
}
