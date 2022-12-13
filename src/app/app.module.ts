import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from "@angular/common/http";
import { APP_INITIALIZER, NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgIdleKeepaliveModule } from "@ng-idle/keepalive";
import { TranslateLoader, TranslateModule, TranslatePipe, TranslateService } from "@ngx-translate/core";
import { ToastrModule } from "ngx-toastr";
import { MenuService } from "pricefyfrontlib/app/core/menu/menu.service";
import { PricefyApplications } from "pricefyfrontlib/app/shared/enum/pricefy-applications.enum";
import { SharedModule } from "pricefyfrontlib/app/shared/shared.module";
import { SystemSeparation } from "pricefyfrontlib/app/shared/utils/system-separation.utils";

import { ConfigService } from "../../pricefyfrontlib/app/core/config/config.service";
import { CoreModule as PricefyCoreModule } from "../../pricefyfrontlib/app/core/core.module";
import { LayoutModule } from "../../pricefyfrontlib/app/layout/layout.module";
import { HttpLoadingInterceptor } from "./@core/http-interceptors/http.loading.interceptor";
import { WebConfigService } from "./@core/services/web-config.service";
import { AppComponent } from "./app.component";
import { ConfigLoader, createTranslateLoader, TranslateInitializer } from "./app.factories";
import { AppRoutingModule } from "./app.routing.module";
import { PagesModule } from "./modules/pages/pages.module";

@NgModule({
    bootstrap: [AppComponent],
    declarations: [AppComponent],
    imports: [
        HttpClientModule,
        BrowserModule,
        BrowserAnimationsModule,
        PricefyCoreModule,
        LayoutModule,
        PagesModule,
        AppRoutingModule,
        SharedModule,
        ToastrModule.forRoot(),
        NgIdleKeepaliveModule.forRoot(),
        TranslateModule.forRoot({
            loader: { provide: TranslateLoader, useFactory: createTranslateLoader, deps: [HttpClient] },
        }),
    ],
    providers: [
        MenuService,
        TranslatePipe,
        ConfigService,
        { provide: HTTP_INTERCEPTORS, useClass: HttpLoadingInterceptor, multi: true },
        { provide: APP_INITIALIZER, useFactory: TranslateInitializer, deps: [TranslateService], multi: true },
        { provide: APP_INITIALIZER, useFactory: ConfigLoader, deps: [ConfigService, MenuService, WebConfigService], multi: true },
    ],
})
export class AppModule {
    constructor(private systemSeparation: SystemSeparation) {
        this.systemSeparation.setCurrentApp(PricefyApplications.Pim);
    }
}
