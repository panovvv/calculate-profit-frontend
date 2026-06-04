import { CurrencyPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { CalculationResponse } from '../../core/models/calculation.model';

/** Presentational results grid: Income / Total Costs / Profit-or-Loss per stored calculation. */
@Component({
  selector: 'app-profit-results',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    CurrencyPipe,
    DatePipe,
  ],
  template: `
    <mat-card class="p-3">
      <h2 class="h5 mb-3">Results</h2>

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
            <td class="p-3 text-muted" [attr.colspan]="columns.length">No calculations yet.</td>
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

  protected readonly columns = [
    'shipmentReference',
    'income',
    'totalCosts',
    'profitOrLoss',
    'calculatedAt',
  ];
}
