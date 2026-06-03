import { CurrencyPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { CalculationResponse } from '../../core/models/calculation.model';

/** Presentational results grid: Income / Total Costs / Profit-or-Loss per stored calculation. */
@Component({
  selector: 'app-profit-results',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatCardModule, MatTableModule, CurrencyPipe, DatePipe],
  template: `
    <mat-card class="p-3">
      <h2 class="h5 mb-3">Results</h2>
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
    </mat-card>
  `,
})
export class ProfitResultsComponent {
  readonly calculations = input.required<CalculationResponse[]>();
  protected readonly columns = [
    'shipmentReference',
    'income',
    'totalCosts',
    'profitOrLoss',
    'calculatedAt',
  ];
}
