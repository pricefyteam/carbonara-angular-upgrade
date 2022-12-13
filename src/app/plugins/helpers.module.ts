import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { ProgressBarModule } from 'angular-progress-bar';
import { CookieService } from 'ngx-cookie-service';
import { IMaskModule } from 'angular-imask';
import { CurrencyMaskModule } from 'ng2-currency-mask';
@NgModule({
  exports: [
    ReactiveFormsModule,
    NgxDropzoneModule,
    ProgressBarModule,
    FormsModule,
    IMaskModule,
    CurrencyMaskModule,
  ],
  providers: [CookieService],
})
export class HelpersModules {}
