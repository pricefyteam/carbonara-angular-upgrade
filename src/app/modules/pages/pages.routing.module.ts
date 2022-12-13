import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AccessDeniedComponent } from "./access-denied/access-denied.component";
import { Error404Component } from "./error404/error404.component";
import { Error500Component } from "./error500/error500.component";
import { LockComponent } from "./lock/lock.component";
import { LoginComponent } from "./login/login.component";
import { MaintenanceComponent } from "./maintenance/maintenance.component";
import { NotFoundComponent } from "./not-found/not-found.component";
import { RecoverComponent } from "./recover/recover.component";
import { RegisterComponent } from "./register/register.component";

const routes: Routes = [
    { path: "Security/Login", component: LoginComponent },
    { path: "register", component: RegisterComponent },
    { path: "recover", component: RecoverComponent },
    { path: "lock", component: LockComponent },
    { path: "maintenance", component: MaintenanceComponent },
    { path: "404", component: Error404Component },
    { path: "500", component: Error500Component },
    { path: "notfound", component: NotFoundComponent },
    { path: "accessdenied", component: AccessDeniedComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class PagesRoutingModule {}
