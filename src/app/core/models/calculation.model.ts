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
