import { CurrencyPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { CalculationResponse } from '../../core/models/calculation.model';

/** Presentational results grid: Income / Total Costs / Profit-or-Loss per stored calculation. */
@Component({
  selector: 'app-profit-results',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    CurrencyPipe,
    DatePipe,
  ],
  template: `
    <mat-card class="p-3">
      <div class="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
        <h2 class="h5 mb-0">Results</h2>
        <mat-form-field appearance="outline" subscriptSizing="dynamic" class="filter-field">
          <mat-label>Filter by Shipment ID</mat-label>
          <input matInput [formControl]="filter" autocomplete="off" />
        </mat-form-field>
      </div>

      @if (loading()) {
        <div class="d-flex flex-column align-items-center p-4">
          <mat-progress-spinner mode="indeterminate" diameter="40" />
          <p class="text-muted small mt-3 mb-0 text-center">
            The backend runs on a free Render instance — the first request can take up to a minute
            while it wakes up. If it times out, refresh in a minute.
          </p>
        </div>
      } @else {
        <table mat-table [dataSource]="calculations()" class="w-100">
          <ng-container matColumnDef="shipmentReference">
            <th mat-header-cell *matHeaderCellDef>Shipment</th>
            <td mat-cell *matCellDef="let row">{{ row.shipmentReference }}</td>
          </ng-container>

          <ng-container matColumnDef="income">
            <th mat-header-cell *matHeaderCellDef>Income</th>
            <td mat-cell *matCellDef="let row">{{ row.income | currency: 'EUR' }}</td>
          </ng-container>

          <ng-container matColumnDef="totalCosts">
            <th mat-header-cell *matHeaderCellDef>Total Costs</th>
            <td mat-cell *matCellDef="let row">{{ row.totalCosts | currency: 'EUR' }}</td>
          </ng-container>

          <ng-container matColumnDef="profitOrLoss">
            <th mat-header-cell *matHeaderCellDef>Profit or Loss</th>
            <td
              mat-cell
              *matCellDef="let row"
              [class.text-success]="row.profit"
              [class.text-danger]="!row.profit"
            >
              {{ row.profitOrLoss | currency: 'EUR' }}
            </td>
          </ng-container>

          <ng-container matColumnDef="calculatedAt">
            <th mat-header-cell *matHeaderCellDef>Calculated</th>
            <td mat-cell *matCellDef="let row">
              {{ row.calculatedAt | date: 'd MMM y, HH:mm (O)' }}
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="columns"></tr>
          <tr mat-row *matRowDef="let row; columns: columns"></tr>
          <tr class="mat-row" *matNoDataRow>
            <td class="p-3 text-muted" [attr.colspan]="columns.length">No calculations found.</td>
          </tr>
        </table>

        <mat-paginator
          [length]="totalElements()"
          [pageIndex]="pageIndex()"
          [pageSize]="pageSize()"
          [pageSizeOptions]="[5, 10, 25, 50]"
          (page)="pageChange.emit($event)"
        />
      }
    </mat-card>
  `,
  styles: [
    `
      .filter-field {
        width: 240px;
        max-width: 100%;
      }
    `,
  ],
})
export class ProfitResultsComponent {
  readonly calculations = input.required<CalculationResponse[]>();

  /** When true, a spinner is shown instead of the table (the list request is in flight). */
  readonly loading = input<boolean>(false);

  readonly totalElements = input<number>(0);
  readonly pageIndex = input<number>(0);
  readonly pageSize = input<number>(10);

  /** Emitted when the user changes page or page size. */
  readonly pageChange = output<PageEvent>();

  /** Emitted (debounced) with the entered shipment-id filter (empty string clears it). */
  readonly filterChange = output<string>();

  protected readonly filter = new FormControl('', { nonNullable: true });

  protected readonly columns = [
    'shipmentReference',
    'income',
    'totalCosts',
    'profitOrLoss',
    'calculatedAt',
  ];

  constructor() {
    this.filter.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntilDestroyed())
      .subscribe((value) => this.filterChange.emit(value.trim()));
  }
}
