# Calculate Profit — Frontend

[![Frontend CI](https://github.com/panovvv/calculate-profit-frontend/actions/workflows/frontend-ci.yml/badge.svg)](https://github.com/panovvv/calculate-profit-frontend/actions/workflows/frontend-ci.yml)

Angular UI for the DACHSER "Calculate Profit" use case: enter a shipment's income and costs, calculate
the profit/loss against the [backend](https://github.com/panovvv/calculate-profit-backend), and see the
stored results (Income / Total Costs / Profit-or-Loss). Standalone components, organised by concern:

- **core/models** — `CalculationRequest`, `ProfitCalculation` (the API contract).
- **core/services** — `ProfitService`: typed `HttpClient` calls (`calculate`, `list`).
- **core/interceptors** — `authInterceptor`: adds the HTTP Basic header the backend requires.
- **features/profit** — `profit-form` (reactive form), `profit-results` (Material table), and the
  `profit-page` container that wires them to the service and shows errors via a snackbar.

## Implementation notes:

- **Angular 20 (LTS)** + Angular Material + Bootstrap 5.3.3. The brief pins 17.1.0; this uses the
  current LTS line (consistent with the backend's "latest LTS" choice).
- **No CORS in dev**: `proxy.conf.json` proxies `/api` → `http://localhost:8080`, so the browser only
  talks to the dev server. In the container, nginx does the same proxy.
- **Auth**: the backend protects `/api/**` with HTTP Basic; `authInterceptor` attaches credentials from
  `src/environments/environment.ts` (`dachser`/`dachser`). This is a **demo convenience** — a real app
  would use a login/token flow rather than shipping credentials.
- No automated tests (optional in the brief; skipped).

## 1) Running locally

### Prerequisites

- Node 22 (e.g. `nvm use 22`) and npm
- The backend running on `:8080` (`cd ../calculate-profit-backend && mvn spring-boot:run`)

### Via npm

```shell
npm ci
npm start          # ng serve with the API proxy
```

Open http://localhost:4200, enter a shipment (e.g. `0001`, income 1000, cost 200) and Calculate — the
result appears in the grid (Profit 800). If the backend is down, an error snackbar appears.

### Via Docker

```shell
docker build -f deployment/Dockerfile -t calculate-profit-frontend:local .
docker run --rm -p 8080:80 --add-host host.docker.internal:host-gateway calculate-profit-frontend:local
```

nginx serves the bundle and proxies `/api` to the backend (target configurable in `deployment/nginx.conf`).

## 2) Build & deploy

```shell
npm run build      # outputs to dist/calculate-profit-frontend/browser
```

The multi-stage [`deployment/Dockerfile`](deployment/Dockerfile) builds the bundle and serves it with
nginx. CI builds the image on every push (push is a no-op placeholder until a registry is configured).

## 3) Contributing

### Formatting & linting

```shell
npm run format        # Prettier (write)
npm run format:check  # Prettier (verify) — run by CI
npm run lint          # ESLint (angular-eslint)
```

CI (`.github/workflows/frontend-ci.yml`) runs format-check, lint and build on every push/PR.
