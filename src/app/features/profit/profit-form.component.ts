import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CalculationRequest } from '../../core/models/calculation.model';

/** Presentational form for entering a shipment's income and costs; emits a {@link CalculationRequest}. */
@Component({
  selector: 'app-profit-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  template: `
    <mat-card class="p-3">
      <h2 class="h5 mb-3">Calculate Profit</h2>
      <form [formGroup]="form" (ngSubmit)="submit()" class="row g-3 align-items-start">
        <mat-form-field class="col-12 col-md-3">
          <mat-label>Shipment ID</mat-label>
          <input matInput formControlName="shipmentReference" />
          <mat-error>Shipment ID is required</mat-error>
        </mat-form-field>

        <mat-form-field class="col-12 col-md-3">
          <mat-label>Income</mat-label>
          <input matInput type="number" step="0.01" formControlName="income" />
          <mat-error>Enter an amount of 0 or more</mat-error>
        </mat-form-field>

        <mat-form-field class="col-6 col-md-2">
          <mat-label>Cost</mat-label>
          <input matInput type="number" step="0.01" formControlName="cost" />
          <mat-error>Enter an amount of 0 or more</mat-error>
        </mat-form-field>

        <mat-form-field class="col-6 col-md-2">
          <mat-label>Additional Cost</mat-label>
          <input matInput type="number" step="0.01" formControlName="additionalCost" />
          <mat-error>Must be 0 or more</mat-error>
        </mat-form-field>

        <div class="col-12 col-md-2 d-flex">
          <button mat-flat-button color="primary" type="submit" [disabled]="pending()">
            @if (pending()) {
              <span class="d-inline-flex align-items-center gap-2">
                <mat-progress-spinner mode="indeterminate" diameter="18" />
                Calculating…
              </span>
            } @else {
              Calculate
            }
          </button>
        </div>
      </form>
    </mat-card>
  `,
})
export class ProfitFormComponent {
  private readonly fb = inject(FormBuilder);

  /** When true, the Calculate button is disabled and shows a spinner (a request is in flight). */
  readonly pending = input<boolean>(false);

  /** Emitted with the entered values when the form is submitted and valid. */
  readonly calculate = output<CalculationRequest>();

  readonly form = this.fb.nonNullable.group({
    shipmentReference: ['', Validators.required],
    income: [0, [Validators.required, Validators.min(0)]],
    cost: [0, [Validators.required, Validators.min(0)]],
    additionalCost: [0, [Validators.min(0)]],
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.calculate.emit(this.form.getRawValue());
  }
}
