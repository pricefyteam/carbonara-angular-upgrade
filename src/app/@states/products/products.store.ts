import { TipoMidiaEnum } from "./../../@core/interfaces/entities/produto-tipo-midia-enum.interface";
import { Injectable } from "@angular/core";
import { ComponentStore } from "@ngrx/component-store";
import { Observable } from "rxjs";
import { __mergeObjects } from "src/app/@core/helpers/functions";
import { ProdutoMidiaInterface } from "src/app/@core/interfaces/entities/produto-midia.interface";
import { ProdutoOuFamiliaOutputInterface } from "src/app/@core/interfaces/entities/produto-ou-familia-output.interface";

import { ProductInterface } from "../@interfaces/product.interface";
import { ProductMidiaInterface } from "../@interfaces/product.midia.interface";
import { DepartamentoInterface } from "./../../@core/interfaces/entities/departamento.interface";
import { ProdutoGtinInterface } from "./../../@core/interfaces/entities/produto-gtin.interface";
import { ProdutoImagemInterface } from "./../../@core/interfaces/entities/produto-imagem.interface";
import { ProdutoInterface } from "./../../@core/interfaces/entities/produto.interface";
import { DepartmentInterface } from "./../@interfaces/department.interface";
import { ProductFamilyImageInterface } from "./../@interfaces/product-family-image.interface";
import { ProductGtinInterface } from "./../@interfaces/product-gtin.interface";

@Injectable()
export class ProductsStore extends ComponentStore<{ products: ProductInterface[] }> {
    constructor() {
        super({ products: [] });
    }

    byGtin$(gtin: string): Observable<ProductInterface> {
        return this.select((state) => {
            return state.products.find((product) => product.gtin === gtin);
        });
    }

    byCode$(code: string): Observable<ProductInterface> {
        return this.select((state) => {
            return state.products.find((product) => product.code === code);
        });
    }

    readonly products$ = this.select((state) => {
        return state.products;
    });

    readonly setProducts = this.updater((state, products: ProductInterface[]) => {
        state.products = products;
        return state;
    });

    getMidiasByCode$(productCode: string, typeMidia: TipoMidiaEnum): Observable<ProductMidiaInterface[]> {
        return this.select((state) => {
            const product = state.products.find((product) => product.code === productCode);
            if (product) {
                return product.midias.filter((midia) => midia.type === typeMidia);
            }
        });
    }

    readonly addMidia = this.updater((state, productMidiaInterface: ProductMidiaInterface) => {
        const product = state.products.find((item) => item.code === productMidiaInterface.product.code);
        if (product) {
            const midia = product.midias.find((item) => item.id === productMidiaInterface.id);
            if (!midia) {
                product.midias.push(productMidiaInterface);
            }
        }
        return state;
    });

    readonly pushMidia = this.updater((state, productMidiaInterface: ProductMidiaInterface) => {
        const product = state.products.find((item) => item.code === productMidiaInterface.product.code);
        if (product) {
            product.midias.map((midia) => (midia.main = false));
            const midia = product.midias.find((item) => item.id === productMidiaInterface.id);

            if (!midia) {
                product.midias.push(productMidiaInterface);
            }
        }
        return state;
    });

    readonly addProduct = this.updater((state, productInterface: ProductInterface) => {
        const product = state.products.find((item) => item.gtin === productInterface.gtin);

        if (!product) {
            state.products.push(productInterface);
        }

        return state;
    });

    readonly deleteMidia = this.updater((state, productMidiaInterface: ProductMidiaInterface) => {
        const product = state.products.find((item) => item.code === productMidiaInterface.product.code);
        if (product) {
            product.midias = product.midias.filter((item) => item.id !== productMidiaInterface.id);
        }
        return state;
    });

    readonly pushProducts = this.updater((state, products: ProductInterface[]) => {
        products.forEach((product) => {
            let actualProduct = state.products.find((item) => item.id === product.id);
            if (!actualProduct) {
                state.products.push(product);
            }
        });

        return state;
    });

    readonly updateProduct = this.updater((state, product: ProductInterface) => {
        let actualProduct: ProductInterface = state.products.find((item) => item.id === product.id);
        state.products[state.products.indexOf(actualProduct)] = __mergeObjects(product, actualProduct);
        return state;
    });

    readonly editProduct = this.updater((state, product: ProductInterface) => {
        let actualProduct: ProductInterface = state.products.find((item) => item.id === product.id);
        actualProduct.mainDescription = product.mainDescription;
        actualProduct.secondaryDescription = product.secondaryDescription;
        actualProduct.descriptionLabel = product.descriptionLabel;
        actualProduct.midias = product.midias;
        actualProduct.presentation = product.presentation;
        actualProduct.additionalInformation = product.additionalInformation;
        actualProduct.active = product.active;

        return state;
    });

    readonly addImageProduct = this.updater((state, payload: { productId: number; image: ProductFamilyImageInterface }) => {
        let product = state.products.find((item) => item.id === payload.productId);

        let actualMainImage = product.images.find((image) => image.main === true);
        if (actualMainImage) {
            actualMainImage.main = false;
        }

        product.images.push(payload.image);
        product.urlThumbnailMain = payload.image.urlThumbnail;

        return state;
    });

    readonly updateMainImageProduct = this.updater((state, payload: { productId: number; image: ProductFamilyImageInterface }) => {
        let product = state.products.find((item) => item.id === payload.productId);

        let actualMainImage = product.images.find((image) => image.main === true);
        if (actualMainImage) {
            actualMainImage.main = false;
        }

        let newMainImage = product.images.find((image) => image.id === payload.image.id);
        newMainImage.main = true;
        product.urlThumbnailMain = newMainImage.urlThumbnail;

        return state;
    });

    readonly updateMainMidiaProduct = this.updater((state, payload: { productCode: string; midia: ProdutoMidiaInterface }) => {
        let product = state.products.find((item) => item.code === payload.productCode);
        let actualMainImage = product.midias.find((image) => image.main === true);
        if (actualMainImage) {
            actualMainImage.main = false;
        }

        let newMainImage = product.midias.find((image) => image.id === payload.midia.id);
        newMainImage.main = true;

        return state;
    });

    readonly deleteImageProducts = this.updater((state, payload: { productId: number; image: ProductFamilyImageInterface }) => {
        const product = state.products.find((item) => item.id === payload.productId);
        const images: ProductFamilyImageInterface[] = product.images.filter((item) => item.id !== payload.image.id);
        product.images = images;

        if (payload.image.main) {
            product.urlThumbnailMain = "";
        }

        return state;
    });

    public transformProductInterfaceUsingProdutoOuFamiliaOutputInterface(produto: ProdutoOuFamiliaOutputInterface): ProductInterface {
        return {
            id: produto.id,
            gtin: produto.gtin,
            mainDescription: produto.descricaoPrincipal,
            secondaryDescription: produto.descricaoSecundaria,
            code: produto.codigo,
            codeProvider: produto.codigoProvedor,
            urlThumbnailMain: produto.urlThumbnailPrincipal || "",
            type: produto.tipo,
        };
    }

    public transformProductInterfaceUsingProdutoInterface(product: ProdutoInterface): ProductInterface {
        const images: ProductFamilyImageInterface[] = [];
        let mainImage: string = "";
        product.imagens.forEach((imagem) => {
            if (imagem.principal) {
                mainImage = imagem.urlThumbnail;
            }
            images.push(this.transformProductFamilyImageInterfaceInterfaceUsingProdutoImagemInterface(imagem));
        });

        const departments: DepartmentInterface[] = [];
        product.estruturaMercadologica.forEach((departamento) =>
            departments.push(this.transformDepartmentInterfaceUsingDepartamentoInterface(departamento))
        );

        const informacoesAdicionais = product.informacoesAdicionais;

        const gtins: ProductGtinInterface[] = [];
        if (product["gtins"]) {
            product.gtins.forEach((gtin) => gtins.push(this.transformProductGtinsInterfaceUsingProdutoGtinsInterface(gtin)));
        }
        return {
            id: product.id,
            code: product.codigo,
            mainDescription: product.descricaoPrincipal,
            secondaryDescription: product.descricaoSecundaria,
            descriptionLabel: product.descricaoEtiqueta,
            presentation: product.apresentacao,
            marketingStructure: departments,
            productGtins: gtins,
            midias: [],
            urlThumbnailMain: mainImage,
            gtin: product.gtin,
            additionalInformation: informacoesAdicionais,
            images: images,
            active: product.ativo,
        };
    }

    public transformProductFamilyImageInterfaceInterfaceUsingProdutoImagemInterface(
        imagem: ProdutoImagemInterface
    ): ProductFamilyImageInterface {
        return {
            id: imagem.id,
            main: imagem.principal,
            productId: imagem.produtoId,
            url: imagem.url,
            urlThumbnail: imagem.urlThumbnail,
        };
    }

    public transformDepartmentInterfaceUsingDepartamentoInterface(estruturaMercadologica: DepartamentoInterface): DepartmentInterface {
        return {
            id: estruturaMercadologica.id,
            code: estruturaMercadologica.codigo,
            name: estruturaMercadologica.nome,
            departmentFatherId: estruturaMercadologica.departamentoPaiId,
        };
    }

    public transformProductGtinsInterfaceUsingProdutoGtinsInterface(produtoGtin: ProdutoGtinInterface): ProductGtinInterface {
        return {
            id: produtoGtin.id,
            gtin: produtoGtin.gtin,
            productId: produtoGtin.produtoId,
            main: produtoGtin.principal,
            active: produtoGtin.ativo,
        };
    }

    public transformMidiaInterfaceUsingProductMidiaInterface(midia: ProdutoMidiaInterface): ProductMidiaInterface {
        return {
            id: midia.id,
            productId: midia.produtoId,
            product: {
                code: midia.produto.codigo,
                id: midia.produto.id,
                monolitoId: midia.produto.monolitoId,
            },
            type: midia.tipo,
            url: midia.url,
            urlThumbnail: midia.urlThumbnail,
            main: midia.principal,
            midiaId: midia.midiaId,
        };
    }
}
