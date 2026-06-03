import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CalculationRequest, CalculationResponse } from '../models/calculation.model';

/** Talks to the backend's Calculate Profit endpoints. */
@Injectable({ providedIn: 'root' })
export class ProfitService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/profit/calculations`;

  /** Calculates and stores the profit/loss for a shipment. */
  calculate(request: CalculationRequest): Observable<CalculationResponse> {
    return this.http.post<CalculationResponse>(this.baseUrl, request);
  }

  /** Lists stored calculations, optionally filtered by shipment reference. */
  list(shipmentReference?: string): Observable<CalculationResponse[]> {
    let params = new HttpParams();
    if (shipmentReference) {
      params = params.set('shipment', shipmentReference);
    }
    return this.http.get<CalculationResponse[]>(this.baseUrl, { params });
  }
}
