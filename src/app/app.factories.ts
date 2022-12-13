import { HttpClient } from "@angular/common/http";
import { TranslateService } from "@ngx-translate/core";
import { __isNullOrUndefined } from "pricefyfrontlib/app/shared/helpers/functions";

import { ConfigService } from "../../pricefyfrontlib/app/core/config/config.service";
import { MenuService } from "../../pricefyfrontlib/app/core/menu/menu.service";
import { environment } from "../environments/environment";
import { WebConfigService } from "./@core/services/web-config.service";
import { TranslatorHttpLoaderConcat } from "../../pricefyfrontlib/app/core/translator/translator-http-loader-concat";

// https://github.com/ocombe/ng2-translate/issues/218
export function createTranslateLoader(http: HttpClient) {
    // o parametro na url é para eliminar a possibilidade de cache
    return new TranslatorHttpLoaderConcat(http, "./assets/i18n/", `.json?v=${new Date().getTime()}`);
}

export function ConfigLoader(configService: ConfigService, menuService: MenuService, webConfig: WebConfigService) {
    return async () => {
        // primeiro carrega as configurações - o parametro na url é para eliminar a possibilidade de cache
        await configService.load(`${environment.configFile}?v=${new Date().getTime()}`);

        // agora é carregado as configurações de webConfig, que são configurações necessárias para o front de campanhas
        // e são dependentes das configurações de configService assim como o menu
        await webConfig.loadWebConfig();
    };
}

export function TranslateInitializer(translate: TranslateService) {
    return async () => {
        let userLang = localStorage["locale"];

        if (__isNullOrUndefined(userLang)) {
            console.warn(
                'Não foi possível ler o idioma de: `localStorage["locale"]`, capturado a informação das configurações do navegador!'
            );
            userLang = (navigator["language"] || navigator["userLanguage"] || "pt-br").toLowerCase();
        }

        translate.setDefaultLang(userLang);
        await translate.use(userLang).toPromise();
    };
}
