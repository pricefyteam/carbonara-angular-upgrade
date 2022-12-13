import { CoreModule } from "src/app/@core/core.module";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { AccessDeniedComponent } from "./access-denied/access-denied.component";
import { Error404Component } from "./error404/error404.component";
import { Error500Component } from "./error500/error500.component";
import { HomeComponent } from "./home/home.component";
import { LockComponent } from "./lock/lock.component";
import { LoginComponent } from "./login/login.component";
import { MaintenanceComponent } from "./maintenance/maintenance.component";
import { NotFoundComponent } from "./not-found/not-found.component";
import { PagesRoutingModule } from "./pages.routing.module";
import { RecoverComponent } from "./recover/recover.component";
import { RegisterComponent } from "./register/register.component";

@NgModule({
    imports: [CommonModule, FormsModule, ReactiveFormsModule, PagesRoutingModule, CoreModule],
    declarations: [
        LoginComponent,
        NotFoundComponent,
        AccessDeniedComponent,
        RegisterComponent,
        RecoverComponent,
        LockComponent,
        MaintenanceComponent,
        Error404Component,
        Error500Component,
        HomeComponent,
    ],
})
export class PagesModule {}
