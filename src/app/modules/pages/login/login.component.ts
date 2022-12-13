import { WebConfigService } from "./../../../@core/services/web-config.service";
import { Component, EventEmitter, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";

import { ToastrService } from "ngx-toastr";
import { AuthService } from "../../../../../pricefyfrontlib/app/core/auth/auth.service";
import { LoginModel } from "../../../../../pricefyfrontlib/app/core/auth/models/login-model";
import { IdleService } from "../../../../../pricefyfrontlib/app/core/idle/idle.service";

import { SeoModel } from "../../../../../pricefyfrontlib/app/core/seo/seo.model";
import { SeoService } from "../../../../../pricefyfrontlib/app/core/seo/seo.service";
import { SettingsService } from "../../../../../pricefyfrontlib/app/core/settings/settings.service";
import { GenericFormValidator } from "../../../../../pricefyfrontlib/app/shared/utils/generic-form-validator";

@Component({
    selector: "app-login",
    templateUrl: "./login.component.html",
    styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
    private validationMessages: { [key: string]: { [key: string]: string } };

    formularioLogin: FormGroup;
    carregando = false;
    genericFormValidator: GenericFormValidator;
    loginModel: LoginModel;
    erroSubmit: string = null;
    onInvalidLogin: EventEmitter<string> = new EventEmitter();

    constructor(
        seoService: SeoService,
        public settings: SettingsService,
        private formBuilder: FormBuilder,
        private router: Router,
        private authService: AuthService,
        private toastr: ToastrService,
        private idleService: IdleService,
        private activatedRoute: ActivatedRoute,
        private webConfig: WebConfigService
    ) {
        const seoModel: SeoModel = <SeoModel>{
            title: "Login",
            description: "Login Pricefy",
            keywords: "Login, Pricefy, Cartaz, Digital, Verejo, Venda, Mini, Super, Extra, Hiper, Mercado",
            robots: "Index, Follow",
        };

        seoService.setSeoData(seoModel);
        this.loginModel = new LoginModel();
        this.onInvalidLogin.subscribe((message) => {
            this.toastr.error(message, "Erro na tentativa de login", { closeButton: true });
        });
        authService.onInvalidToken.subscribe((invalidToken) => {
            this.toastr.warning("Desculpe, sua sessão expirou :(", "Sessão Expirada", { closeButton: true });
        });
    }

    ngOnInit() {
        this.montarFormulario();
        this.montarValidacoesFormulario();
        this.genericFormValidator = new GenericFormValidator(this.formularioLogin, this.validationMessages);

        if (this.idleService.timedOut) {
            this.toastr.warning("Desculpe, sua sessão expirou :(", "Sessão Expirada", { closeButton: true });
        }

        if (this.authService.isInvalidToken) {
            this.toastr.warning("Desculpe, sua sessão expirou :(", "Sessão Expirada", { closeButton: true });
        }
    }

    onSubmit() {
        this.toastr.clear();
        this.genericFormValidator.formSubmmited = true;
        this.erroSubmit = null;
        if (this.formularioLogin.valid) {
            this.carregando = true;
            const login = Object.assign({}, this.loginModel, this.formularioLogin.value);
            this.authService.login(login).subscribe(
                (result) => {
                    this.onLoginComplete(result);
                    this.webConfig.loadWebConfig();
                },
                (error) => {
                    this.onLoginError(error);
                }
            );
        } else {
            this.genericFormValidator.verificarValidacoesForm();
            this.carregando = false;
            this.erroSubmit = "";
        }
    }

    private montarFormulario() {
        this.formularioLogin = this.formBuilder.group({
            usuario: [null, [Validators.required]],
            senha: [null, [Validators.required]],
        });
    }

    private montarValidacoesFormulario() {
        this.validationMessages = {
            usuario: {
                required: "É obrigatório informar seu usuário",
            },
            senha: {
                required: "É obrigatório informar sua senha",
            },
        };
    }

    private onLoginComplete(response: any): void {
        this.authService.setSession(response).subscribe(
            (result) => {
                this.onSetSessionComplete(result);
            },
            (error) => {
                this.onSetSessionError(error);
            }
        );
    }

    private onLoginError(error: any): void {
        const errorLogin = error;
        this.carregando = false;
        this.erroSubmit = errorLogin.error.error_description || "Erro Inesperado durante a tentativa de Login";
        this.onInvalidLogin.emit(this.erroSubmit);
    }

    private onSetSessionComplete(response: any): void {
        this.carregando = false;
        if (response.Authenticated) {
            if (this.activatedRoute.snapshot.queryParams.returnUrl) {
                this.router.navigate([this.activatedRoute.snapshot.queryParams.returnUrl]);
            } else {
                this.router.navigate([""]);
            }
        } else {
            this.erroSubmit = response.StatusLogin || "Erro Inesperado durante a tentativa de obter perfil de acesso";
            this.onInvalidLogin.emit(this.erroSubmit);
        }
    }

    private onSetSessionError(error: any): void {
        this.carregando = false;
        this.erroSubmit = error.StatusLogin || "Erro Inesperado durante a tentativa de obter perfil de acesso";
        this.onInvalidLogin.emit(this.erroSubmit);
    }
}
