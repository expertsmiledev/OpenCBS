import { catchError, delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';

import { environment } from '../../../../../environments/environment';

import { of as observableOf } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class LoanProductUpdateService {

  constructor(private httpClient: HttpClient) {
  }

  updateLoanProduct(loanProduct, id) {

    return this.httpClient.put(
      `${environment.API_ENDPOINT}loan-products/${id}`,
      JSON.stringify(loanProduct))
      .pipe(delay(environment.RESPONSE_DELAY),
        catchError((err: HttpErrorResponse) => {
          const errObj = {
            error: true,
            message: err.error.message
          };
          return observableOf(errObj);
        }));
  }
}
