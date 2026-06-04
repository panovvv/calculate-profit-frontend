import { HttpErrorResponse } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { PageEvent } from '@angular/material/paginator';
import { finalize } from 'rxjs';
import { CalculationRequest, CalculationResponse } from '../../core/models/calculation.model';
import { ProfitService } from '../../core/services/profit.service';
import { ProfitFormComponent } from './profit-form.component';
import { ProfitResultsComponent } from './profit-results.component';

/**
 * Container for the Calculate Profit page: wires the form to the service and renders a paged results
 * grid. Backend errors are surfaced as a dismissible corner notification showing the API's detail.
 */
@Component({
  selector: 'app-profit-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ProfitFormComponent, ProfitResultsComponent, MatSnackBarModule],
  template: `
    <div class="container py-4">
      <app-profit-form (calculate)="onCalculate($event)" [pending]="submitting()" />
      <app-profit-results
        class="d-block mt-4"
        [calculations]="calculations()"
        [loading]="loading()"
        [totalElements]="totalElements()"
        [pageIndex]="pageIndex()"
        [pageSize]="pageSize()"
        (pageChange)="onPageChange($event)"
        (filterChange)="onFilterChange($event)"
      />
    </div>
  `,
})
export class ProfitPageComponent implements OnInit {
  private readonly service = inject(ProfitService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly form = viewChild(ProfitFormComponent);

  readonly calculations = signal<CalculationResponse[]>([]);
  readonly totalElements = signal(0);
  readonly pageIndex = signal(0);
  readonly pageSize = signal(10);
  /** A list (GET) request is in flight — show the table spinner. */
  readonly loading = signal(false);
  /** A calculate (POST) request is in flight — disable the Calculate button. */
  readonly submitting = signal(false);
  /** Active shipment-id filter ('' = no filter). */
  readonly shipmentFilter = signal('');

  ngOnInit(): void {
    this.load(0, this.pageSize());
  }

  onCalculate(request: CalculationRequest): void {
    this.submitting.set(true);
    this.service
      .calculate(request)
      .pipe(finalize(() => this.submitting.set(false)))
      .subscribe({
        next: () => {
          this.form()?.reset();
          this.load(0, this.pageSize()); // jump to the first page to show the new entry
        },
        error: (error: HttpErrorResponse) => this.notifyError(error, 'Calculation failed'),
      });
  }

  onPageChange(event: PageEvent): void {
    this.load(event.pageIndex, event.pageSize);
  }

  onFilterChange(shipmentReference: string): void {
    this.shipmentFilter.set(shipmentReference);
    this.load(0, this.pageSize()); // reset to the first page when the filter changes
  }

  private load(pageIndex: number, pageSize: number): void {
    this.loading.set(true);
    this.service
      .list(pageIndex, pageSize, this.shipmentFilter() || undefined)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (page) => {
          this.calculations.set(page.content);
          this.totalElements.set(page.page.totalElements);
          this.pageIndex.set(page.page.number);
          this.pageSize.set(page.page.size);
        },
        error: (error: HttpErrorResponse) => this.notifyError(error, 'Could not load calculations'),
      });
  }

  /** Shows the backend's error detail (falling back to a generic message) as a dismissible toast. */
  private notifyError(error: HttpErrorResponse, fallback: string): void {
    const detail =
      typeof error.error?.detail === 'string' ? error.error.detail : `${fallback}. Please retry.`;
    this.snackBar.open(detail, '✕', {
      duration: 6000,
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
      panelClass: 'error-snackbar',
    });
  }
}
