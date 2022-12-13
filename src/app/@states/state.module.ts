import { NgModule } from "@angular/core";

import { FamiliesEffects } from "./families/families.effects";
import { FamiliesStore } from "./families/families.store";
import { ImagesEffects } from "./images/images.effects";
import { ImagesStore } from "./images/images.store";
import { ProductsEffects } from "./products/products.effects";
import { ProductsStore } from "./products/products.store";
import { ProvidersEffects } from "./providers/providers.effects";
import { ProvidersStore } from "./providers/providers.store";

const FAMILIES = [FamiliesEffects, FamiliesStore];

const BANK_IMAGES = [ProvidersEffects, ProvidersStore, ImagesStore, ImagesEffects, ProductsStore, ProductsEffects];

const PRODUCTS = [ProductsEffects, ProductsStore];

@NgModule({
    providers: [...FAMILIES, ...PRODUCTS, ...BANK_IMAGES],
})
export class StateModule {}
