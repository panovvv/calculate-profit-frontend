/** Input to a profit calculation, mirroring the backend's request body and the UI form fields. */
export interface CalculationRequest {
  shipmentReference: string;
  income: number;
  cost: number;
  additionalCost: number;
}

/** A stored profit calculation returned by the backend (one row of the results grid). */
export interface CalculationResponse {
  id: number;
  shipmentReference: string;
  income: number;
  totalCosts: number;
  profitOrLoss: number;
  profit: boolean;
  calculatedAt: string;
}

/** Pagination metadata (matches the `page` object of Spring Data's PagedModel). */
export interface PageMeta {
  size: number;
  number: number;
  totalElements: number;
  totalPages: number;
}

/** A page of items (matches Spring Data's PagedModel JSON: `{ content, page }`). */
export interface Page<T> {
  content: T[];
  page: PageMeta;
}
