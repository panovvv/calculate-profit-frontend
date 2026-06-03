import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../core/auth/auth.service';

/** Collects the API credentials from the user and stores them in memory for the session. */
@Component({
  selector: 'app-login',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  template: `
    <div class="login-page">
      <mat-card class="login-card" appearance="outlined">
        <div class="login-brand">
          <span class="brand">DACHSER</span>
          <span class="subtitle">Intelligent Logistics</span>
        </div>
        <h1 class="login-title">Sign in to continue</h1>
        <p class="login-hint">Use your Calculate Profit API credentials.</p>

        <form [formGroup]="form" (ngSubmit)="submit()">
          <mat-form-field appearance="outline" class="w-100">
            <mat-label>Username</mat-label>
            <input matInput formControlName="username" autocomplete="username" />
            <mat-error>Username is required</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="w-100">
            <mat-label>Password</mat-label>
            <input
              matInput
              type="password"
              formControlName="password"
              autocomplete="current-password"
            />
            <mat-error>Password is required</mat-error>
          </mat-form-field>

          <button mat-flat-button color="primary" type="submit" class="w-100 login-submit">
            Sign in
          </button>
        </form>

        <p class="login-demo">Demo credentials: <code>dachser</code> / <code>dachser</code></p>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .login-page {
        min-height: calc(100vh - 64px);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1.5rem;
        background: #f5f5f5;
      }
      .login-card {
        width: 100%;
        max-width: 400px;
        padding: 2rem;
        border-top: 4px solid #e2001a;
      }
      .login-brand {
        display: flex;
        align-items: baseline;
        gap: 0.5rem;
        margin-bottom: 1.5rem;
      }
      .login-brand .brand {
        font-weight: 700;
        letter-spacing: 0.05em;
        color: #e2001a;
      }
      .login-brand .subtitle {
        font-size: 0.75rem;
        color: #6c757d;
      }
      .login-title {
        font-size: 1.25rem;
        margin: 0 0 0.25rem;
      }
      .login-hint {
        color: #6c757d;
        margin: 0 0 1.5rem;
      }
      .login-submit {
        margin-top: 0.5rem;
      }
      .login-demo {
        margin: 1.25rem 0 0;
        font-size: 0.8rem;
        color: #6c757d;
      }
    `,
  ],
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly form = this.fb.nonNullable.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { username, password } = this.form.getRawValue();
    this.auth.login(username, password);
    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') ?? '/profit';
    void this.router.navigateByUrl(returnUrl);
  }
}
