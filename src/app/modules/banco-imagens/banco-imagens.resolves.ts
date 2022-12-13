import { Injectable } from "@angular/core";
import { Resolve } from "@angular/router";

import { ProvidersEffects } from "./../../@states/providers/providers.effects";

@Injectable()
export class ProvidersResolver implements Resolve<void> {
    constructor(private providersEffects: ProvidersEffects) {}

    resolve(): void {
        this.providersEffects.getProviders({ component: this });
    }
}
