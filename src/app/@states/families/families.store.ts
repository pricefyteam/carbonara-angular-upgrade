import { __isNullOrUndefined } from "pricefyfrontlib/app/shared/helpers/functions";
import { Injectable } from "@angular/core";
import { ComponentStore } from "@ngrx/component-store";
import { Observable } from "rxjs";
import { __mergeObjects } from "src/app/@core/helpers/functions";
import { FamiliaImagemInterface } from "src/app/@core/interfaces/entities/familia-imagem.interface";
import { FamiliaInterface } from "src/app/@core/interfaces/entities/familia.interface";
import { FamilyInterface } from "src/app/@states/@interfaces/family.interface";

import { ProductFamilyImageInterface } from "./../@interfaces/product-family-image.interface";
import { ProductInterface } from "./../@interfaces/product.interface";
import { ProductsStore } from "./../products/products.store";
import { FamilyMidiaInterface } from "../@interfaces/family.midia.interface";
import { FamiliaMidiaInterface } from "src/app/@core/interfaces/entities/familia-midia.interface";
import { TipoMidiaFamiliaEnum } from "src/app/@core/interfaces/entities/familia-tipo-midia-enum.interface";

@Injectable()
export class FamiliesStore extends ComponentStore<{ families: FamilyInterface[] }> {
    constructor(private productStore: ProductsStore) {
        super({ families: [] });
    }

    readonly families$ = this.select((state) => {
        return state.families;
    });

    byId$(familyId: number): Observable<FamilyInterface> {
        return this.select((state) => {
            return state.families.find((family) => family.id === familyId);
        });
    }

    byCode$(familyCode: string): Observable<FamilyInterface> {
        return this.select((state) => {
            return state.families.find((family) => family.code === familyCode);
        });
    }

    getMidiasFamilyByCode$(familyCode: string, typeMidia: TipoMidiaFamiliaEnum): Observable<FamilyMidiaInterface[]> {
        return this.select((state) => {
            const family = state.families.find((family) => family.code === familyCode);
            if (family) {
                return family.midias.filter((midia) => midia.type === typeMidia);
            }
        });
    }

    readonly setFamily = this.updater((state, families: FamilyInterface[]) => {
        state.families = families;
        return state;
    });

    readonly addFamily = this.updater((state, family: FamilyInterface) => {
        let actualFamily = state.families.find((item) => item.id === family.id);
        if (!actualFamily) {
            state.families.push(family);
        }

        return state;
    });

    readonly addMidiaFamily = this.updater((state, familyMidiaInterface: FamilyMidiaInterface) => {
        const family = state.families.find((item) => item.code === familyMidiaInterface.family.code);
        if (family) {
            const midia = family.midias.find((item) => item.id === familyMidiaInterface.id);

            if (!midia) {
                family.midias.push(familyMidiaInterface);
            }
        }

        return state;
    });

    readonly pushFamily = this.updater((state, families: FamilyInterface[]) => {
        families.forEach((family) => {
            let actualFamily = state.families.find((item) => item.id === family.id);
            if (!actualFamily) {
                state.families.push(family);
            }
        });

        return state;
    });

    readonly updateFamily = this.updater((state, family: FamilyInterface) => {
        let actualFamily = state.families.find((item) => item.id === family.id);
        if (__isNullOrUndefined(actualFamily)) {
            state.families.push(__mergeObjects(actualFamily, family));
        } else {
            state.families[state.families.indexOf(actualFamily)] = __mergeObjects(actualFamily, family);
        }
        return state;
    });

    readonly editFamily = this.updater((state, family: FamilyInterface) => {
        let actualFamily: FamilyInterface = state.families.find((item) => item.id === family.id);
        actualFamily.mainDescription = family.mainDescription;
        actualFamily.secondaryDescription = family.secondaryDescription;

        return state;
    });

    readonly deleteFamily = this.updater((state, familyId: number) => {
        state.families = state.families.filter((family) => family.id !== familyId);

        return state;
    });

    readonly deleteMidiaFamily = this.updater((state, familyMidiaInterface: FamilyMidiaInterface) => {
        const family = state.families.find((item) => item.code === familyMidiaInterface.family.code);
        if (family) {
            family.midias = family.midias.filter((item) => item.id !== familyMidiaInterface.id);
        }
        return state;
    });

    readonly addImageFamily = this.updater((state, payload: { familyId: number; image: ProductFamilyImageInterface }) => {
        let family = state.families.find((item) => item.id === payload.familyId);

        let actualMainImage = family.images.find((image) => image.main === true);
        if (actualMainImage) {
            actualMainImage.main = false;
        }

        family.images.push(payload.image);
        family.urlThumbnailMain = payload.image.urlThumbnail;

        return state;
    });

    readonly deleteImageFamily = this.updater((state, payload: { familyId: number; image: ProductFamilyImageInterface }) => {
        const family = state.families.find((item) => item.id === payload.familyId);
        const images: ProductFamilyImageInterface[] = family.images.filter((item) => item.id !== payload.image.id);
        family.images = images;

        if (payload.image.main) {
            family.urlThumbnailMain = "";
        }

        return state;
    });

    readonly updateMainImageFamily = this.updater((state, payload: { familyId: number; image: ProductFamilyImageInterface }) => {
        let family = state.families.find((item) => item.id === payload.familyId);

        let actualMainImage = family.images.find((image) => image.main === true);
        if (actualMainImage) {
            actualMainImage.main = false;
        }

        let newMainImage = family.images.find((image) => image.id === payload.image.id);
        newMainImage.main = true;
        family.urlThumbnailMain = newMainImage.urlThumbnail;

        return state;
    });

    readonly updateMainMidiaFamily = this.updater((state, payload: { familyCode: string; midia: FamiliaMidiaInterface }) => {
        let family = state.families.find((item) => item.code === payload.familyCode);
        let actualMainImage = family.midias.find((image) => image.main === true);
        if (actualMainImage) {
            actualMainImage.main = false;
        }

        let newMainImage = family.midias.find((image) => image.id === payload.midia.id);
        newMainImage.main = true;

        return state;
    });

    readonly updateProducts = this.updater((state, payload: { familyId: number; products: ProductInterface[] }) => {
        let family = state.families.find((item) => item.id === payload.familyId);
        family.products = payload.products;

        return state;
    });

    public transformFamilyInterfaceUsingFamiliaInterface(familia: FamiliaInterface): FamilyInterface {
        const productsInterface: ProductInterface[] = [];
        familia.produtos.forEach((produto) => {
            productsInterface.push(this.productStore.transformProductInterfaceUsingProdutoInterface(produto));
        });

        const imageInterface: ProductFamilyImageInterface[] = [];
        let mainImage: string = "";
        familia.imagens.forEach((imagem) => {
            if (imagem.principal) {
                mainImage = imagem.urlThumbnail;
            }
            imageInterface.push(this.transformFamilyImageInterfaceUsingProductFamilyImageInterface(imagem));
        });

        return {
            id: familia.id,
            code: familia.codigo,
            mainDescription: familia.descricaoPrincipal,
            secondaryDescription: familia.descricaoSecundaria,
            urlThumbnailMain: mainImage,
            midias: [],
            images: imageInterface,
            products: productsInterface,
        };
    }

    public transformFamilyImageInterfaceUsingProductFamilyImageInterface(imagem: FamiliaImagemInterface): ProductFamilyImageInterface {
        return {
            id: imagem.id,
            familyId: imagem.familiaId,
            url: imagem.url,
            urlThumbnail: imagem.urlThumbnail,
            main: imagem.principal,
        };
    }

    public transformMidiaInterfaceUsingFamilyMidiaInterface(midia: FamiliaMidiaInterface): FamilyMidiaInterface {
        return {
            id: midia.id,
            familyId: midia.familiaId,
            family: {
                code: midia.familia.codigo,
                id: midia.familia.id,
                monolitoId: midia.familia.monolitoId,
            },
            type: midia.tipo,
            url: midia.url,
            urlThumbnail: midia.urlThumbnail,
            main: midia.principal,
            midiaId: midia.midiaId,
        };
    }
}
