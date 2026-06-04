import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { finalize } from 'rxjs';
import { CalculationRequest, CalculationResponse } from '../../core/models/calculation.model';
import { ProfitService } from '../../core/services/profit.service';
import { ProfitFormComponent } from './profit-form.component';
import { ProfitResultsComponent } from './profit-results.component';

/**
 * Container for the Calculate Profit page: wires the form to the service and renders the results.
 * Backend errors are surfaced as a dismissible corner notification showing the API's error detail.
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
      />
    </div>
  `,
})
export class ProfitPageComponent implements OnInit {
  private readonly service = inject(ProfitService);
  private readonly snackBar = inject(MatSnackBar);

  readonly calculations = signal<CalculationResponse[]>([]);
  /** A list (GET) request is in flight — show the table spinner. */
  readonly loading = signal(false);
  /** A calculate (POST) request is in flight — disable the Calculate button. */
  readonly submitting = signal(false);

  ngOnInit(): void {
    this.refresh();
  }

  onCalculate(request: CalculationRequest): void {
    this.submitting.set(true);
    this.service
      .calculate(request)
      .pipe(finalize(() => this.submitting.set(false)))
      .subscribe({
        next: () => this.refresh(),
        error: (error: HttpErrorResponse) => this.notifyError(error, 'Calculation failed'),
      });
  }

  private refresh(): void {
    this.loading.set(true);
    this.service
      .list()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (rows) => this.calculations.set(rows),
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
