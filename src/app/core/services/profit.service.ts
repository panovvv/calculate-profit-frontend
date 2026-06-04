import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CalculationRequest, CalculationResponse, Page } from '../models/calculation.model';

/** Talks to the backend's Calculate Profit endpoints. */
@Injectable({ providedIn: 'root' })
export class ProfitService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/profit/calculations`;

  /** Calculates and stores the profit/loss for a shipment. */
  calculate(request: CalculationRequest): Observable<CalculationResponse> {
    return this.http.post<CalculationResponse>(this.baseUrl, request);
  }

  /** Returns a page of stored calculations, optionally filtered by shipment reference. */
  list(
    pageIndex = 0,
    pageSize = 10,
    shipmentReference?: string,
  ): Observable<Page<CalculationResponse>> {
    let params = new HttpParams().set('page', pageIndex).set('size', pageSize);
    if (shipmentReference) {
      params = params.set('shipment', shipmentReference);
    }
    return this.http.get<Page<CalculationResponse>>(this.baseUrl, { params });
  }
}
