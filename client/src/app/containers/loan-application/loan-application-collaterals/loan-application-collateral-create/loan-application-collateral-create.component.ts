import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { environment } from '../../../../../environments/environment';
import { LoanAppCollateralFormComponent } from '../../shared/components';
import {
  ILoanAppState,
  ILoanAppCollateralCreate,
  ILoanAppCollateral,
  ILoanAppFormState
} from '../../../../core/store';
import * as fromRoot from '../../../../core/core.reducer';
import * as fromStore from '../../../../core/store';
import { Subscription } from 'rxjs';

const SVG_DATA = {collection: 'custom', class: 'custom41', name: 'custom41'};

@Component({
  selector: 'cbs-loan-app-collateral-new',
  templateUrl: 'loan-application-collateral-create.component.html',
  styleUrls: ['loan-application-collateral-create.component.scss']
})

export class LoanAppCreateCollateralComponent implements OnInit, OnDestroy {
  @ViewChild(LoanAppCollateralFormComponent, {static: false}) public formComponent: LoanAppCollateralFormComponent;
  public loanAppId: number;
  public breadcrumbLinks = [];
  public svgData = SVG_DATA;

  private createSub: Subscription;

  constructor(private createCollateralStore$: Store<ILoanAppCollateralCreate>,
              private loanApplicationStore$: Store<ILoanAppState>,
              private loanAppCollateralStore$: Store<ILoanAppCollateral>,
              private router: Router,
              private store$: Store<fromRoot.State>,
              private toastrService: ToastrService,
              private translate: TranslateService,
              private loanAppFormStore$: Store<ILoanAppFormState>) {
    this.createSub = this.store$.pipe(select(fromRoot.getLoanAppCreateCollateralState))
      .subscribe((state: ILoanAppCollateralCreate) => {
        if ( state.loaded && state.success ) {
          const newCollateralId = state.response['id'];
          this.resetCollateralState();
          this.redirectToInfo(this.loanAppId, newCollateralId);
          this.translate.get('CREATE_SUCCESS').subscribe((res: string) => {
            this.toastrService.success(res, '', environment.SUCCESS_TOAST_CONFIG);
          });
        } else if ( state.loaded && !state.success && state.error ) {
          this.translate.get('CREATE_ERROR').subscribe((res: string) => {
            this.toastrService.error('', res, environment.ERROR_TOAST_CONFIG);
          });
        }
      });
  }

  redirectToInfo(loanAppId, newCollateralId) {
    this.router.navigate(['/loan-applications', loanAppId, 'collateral', newCollateralId]);
  }

  ngOnInit() {
    this.loanAppFormStore$.dispatch(new fromStore.SetState('collaterals'));
    this.store$.pipe(select(fromRoot.getLoanApplicationState))
      .subscribe((state: ILoanAppState) => {
        if ( state.success && state.loaded && state.loanApplication ) {
          this.loanAppId = state.loanApplication['id'];
          const loanProfile = state.loanApplication['profile'];
          const profileType = loanProfile['type'] === 'PERSON' ? 'people' : 'companies';
          this.breadcrumbLinks = [
            {
              name: loanProfile['name'],
              link: `/profiles/${profileType}/${loanProfile['id']}/info`
            },
            {
              name: 'LOAN_APPLICATIONS',
              link: '/loan-applications'
            },
            {
              name: state.loanApplication['code'],
              link: ''
            },
            {
              name: 'COLLATERALS',
              link: `/loan-applications/${this.loanAppId}/collateral`
            },
            {
              name: 'ADD',
              link: ''
            }
          ];
        }
      });
  }

  submit() {
    if ( this.formComponent.collateralForm.valid ) {
      const data = this.formComponent.collateralForm.value,
        customFields = [...this.formComponent.customFields];

      const newCollateralData = {
        name: data.name,
        amount: data.amount,
        typeOfCollateralId: data.typeOfCollateralId,
        fieldValues: []
      };

      data.fieldValues.map((field: Object) => {
        customFields.map(item => {
          if ( field.hasOwnProperty(item.name) ) {
            newCollateralData.fieldValues.push({
              fieldId: item.id,
              value: field[item.name]
            });
          }
        });
      });

      this.createCollateralStore$.dispatch(
        new fromStore.CreateCollateral({loanAppId: this.loanAppId, data: newCollateralData}));
    }
  }

  ngOnDestroy() {
    this.createSub.unsubscribe();
    this.resetState();
  }

  resetState() {
    this.createCollateralStore$.dispatch(new fromStore.CreateCollateralReset());
  }

  resetCollateralState() {
    this.loanAppCollateralStore$.dispatch(new fromStore.ResetCollateral());
  }
}
