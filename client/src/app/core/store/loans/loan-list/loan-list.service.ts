import { delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { HttpClientHeadersService } from '../../../services';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class LoanListService {

  constructor(private httpClient: HttpClient,
              private httpClientHeadersService: HttpClientHeadersService) {
  }

  getLoanList(params?: Object): Observable<any> {
    return this.httpClient.get(
      `${environment.API_ENDPOINT}loans`,
      {params: this.httpClientHeadersService.buildQueryParams(params)})
      .pipe(delay(environment.RESPONSE_DELAY));
  }

  getProfileLoanList(profileId: number) {
    return this.httpClient.get(
      `${environment.API_ENDPOINT}loans/by-profile/${profileId}`)
      .pipe(delay(environment.RESPONSE_DELAY))
  }
}
