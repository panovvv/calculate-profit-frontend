import { Injectable, computed, signal } from '@angular/core';

interface Credentials {
  username: string;
  password: string;
}

const STORAGE_KEY = 'calculate-profit.credentials';

/**
 * Holds the user-entered API credentials, persisted in `sessionStorage` so a page refresh doesn't log
 * the user out (cleared when the tab closes). The interceptor uses {@link basicToken} to authenticate
 * requests; a guard redirects to login when not authenticated.
 *
 * <p>Note: HTTP Basic credentials are reversible, so this is a demo-grade trade-off — a production app
 * would use a token / HttpOnly-cookie flow that never stores the password client-side.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly credentials = signal<Credentials | null>(readFromSession());

  readonly isAuthenticated = computed(() => this.credentials() !== null);
  readonly username = computed(() => this.credentials()?.username ?? null);

  login(username: string, password: string): void {
    const credentials = { username, password };
    this.credentials.set(credentials);
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(credentials));
  }

  logout(): void {
    this.credentials.set(null);
    sessionStorage.removeItem(STORAGE_KEY);
  }

  /** Base64 `username:password` for the HTTP Basic header, or null when not logged in. */
  basicToken(): string | null {
    const c = this.credentials();
    return c ? btoa(`${c.username}:${c.password}`) : null;
  }
}

function readFromSession(): Credentials | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Credentials) : null;
  } catch {
    return null;
  }
}
