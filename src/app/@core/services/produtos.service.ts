import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { __isNullOrUndefined } from "pricefyfrontlib/app/shared/helpers/functions";
import { Observable } from "rxjs";
import { ProdutoInterface } from "src/app/@core/interfaces/entities/produto.interface";
import { ConfigService } from "../../../../pricefyfrontlib/app/core/config/config.service";
import { ProdutoMidiaInterface } from "../interfaces/entities/produto-midia.interface";
import { TipoMidiaEnum } from "../interfaces/entities/produto-tipo-midia-enum.interface";
import { HttpResponseInterface } from "../interfaces/http-response.interface";
import { PesquisarProdutoInputInterface } from "../interfaces/models/pesquisar-produto-input.interface";
import { RemoverMidiaProdutoInputInterface } from "../interfaces/models/remover-midia-produto.interface";
import { UploadMidiaProdutoInputInterface } from "../interfaces/models/upload-midia-produto-input.interface";
import { UploadImagemProdutoInputInterface } from "../interfaces/models/upload-imagem-produto-input.interface";
import { ProductFamilyImageInterface } from "./../../@states/@interfaces/product-family-image.interface";
import { EditarProdutoInputInterface } from "./../interfaces/models/editar-produto-input.interface";
import { PesquisaPaginadaOutputInterface } from "./../interfaces/models/pesquisa-paginada-output.interface";
import { RemoverImagemProdutoInputInterface } from "./../interfaces/models/remover-imagem-produto-input.interface";

@Injectable()
export class ProdutosService {
    private readonly uri: string = "produtos";

    constructor(private http: HttpClient, private configService: ConfigService) {
        this.uri = `${this.configService.getConfiguration().privateApisUrls.pim}/${this.uri}`;
    }

    public getProdutos(
        pesquisarProdutoInput: PesquisarProdutoInputInterface,
        pagina: number = 1,
        quantidadeMaximoRegistros: number = 24
    ): Observable<HttpResponseInterface<PesquisaPaginadaOutputInterface<ProdutoInterface>>> {
        let params = new HttpParams();

        params = params.set("texto", pesquisarProdutoInput.texto);

        if (!__isNullOrUndefined(pesquisarProdutoInput.ativos)) {
            params = params.set("ativos", pesquisarProdutoInput.ativos.toString());
        }

        if (pesquisarProdutoInput.incluirImagens === true) {
            params = params.set("incluirImagens", pesquisarProdutoInput.incluirImagens.toString());
        }

        if (pesquisarProdutoInput.incluirFamilias === true) {
            params = params.set("incluirFamilias", pesquisarProdutoInput.incluirFamilias.toString());
        }

        params = params.set("pagina", pagina.toString());
        params = params.set("quantidadeItensPorPagina", quantidadeMaximoRegistros.toString());

        return this.http.get<HttpResponseInterface<PesquisaPaginadaOutputInterface<ProdutoInterface>>>(`${this.uri}`, { params: params });
    }

    public getProdutoByCodigo(
        codigo: string,
        incluirImagens?: boolean,
        incluirFamilia?: boolean,
        incluirEstruturaMercadologica?: boolean,
        incluirGtins?: boolean,
        incluirMidia?: boolean
    ): Observable<HttpResponseInterface<ProdutoInterface>> {
        let params = new HttpParams();

        if (incluirImagens === true) {
            params = params.set("incluirImagens", incluirImagens.toString());
        }

        if (incluirFamilia === true) {
            params = params.set("incluirFamilia", incluirFamilia.toString());
        }

        if (incluirEstruturaMercadologica === true) {
            params = params.set("incluirEstruturaMercadologica", incluirEstruturaMercadologica.toString());
        }

        if (incluirGtins === true) {
            params = params.set("incluirGtins", incluirGtins.toString());
        }

        return this.http.get<HttpResponseInterface<ProdutoInterface>>(`${this.uri}/codigo:${codigo}`, { params: params });
    }

    public getProdutoByGtin(
        gtin: string,
        incluirImagens?: boolean,
        incluirFamilia?: boolean
    ): Observable<HttpResponseInterface<ProdutoInterface>> {
        let params = new HttpParams();

        if (incluirImagens === true) {
            params = params.set("incluirImagens", incluirImagens.toString());
        }

        if (incluirFamilia === true) {
            params = params.set("incluirFamilia", incluirFamilia.toString());
        }
        return this.http.get<HttpResponseInterface<ProdutoInterface>>(`${this.uri}/gtin:${gtin}`, { params: params });
    }

    public adicionarImagem(
        produtoId: number,
        imagemProduto: UploadImagemProdutoInputInterface
    ): Observable<HttpResponseInterface<ProdutoInterface>> {
        const formData = new FormData();
        formData.append("produtoId", imagemProduto.produtoId.toString());
        formData.append("principal", imagemProduto.principal.toString());
        formData.append("arquivo", imagemProduto.arquivo);
        return this.http.post<HttpResponseInterface<ProdutoInterface>>(`${this.uri}/${produtoId}/imagens/upload`, formData);
    }

    public setImagemPrincipal(productId: number, imagem: ProductFamilyImageInterface) {
        return this.http.put(`${this.uri}/${productId}/imagens/${imagem.id}/principal`, imagem);
    }

    public removeImagem(produtoId: number, input: RemoverImagemProdutoInputInterface) {
        return this.http.post(`${this.uri}/${produtoId}/imagens/remover`, input);
    }

    public editarInformacoesAdicionais(produto: EditarProdutoInputInterface) {
        return this.http.put<HttpResponseInterface<ProdutoInterface>>(`${this.uri}/${produto.id}/informacoes-adicionais`, produto);
    }

    public inativarProduto(produtoId: number): Observable<HttpResponseInterface<ProdutoInterface>> {
        return this.http.post<HttpResponseInterface<ProdutoInterface>>(`${this.uri}/${produtoId}/inativar`, {});
    }

    public ativarProduto(produtoId: number): Observable<HttpResponseInterface<ProdutoInterface>> {
        return this.http.post<HttpResponseInterface<ProdutoInterface>>(`${this.uri}/${produtoId}/ativar`, {});
    }

    public editarProduto(produtoId: number, produto: EditarProdutoInputInterface): Observable<HttpResponseInterface<ProdutoInterface>> {
        return this.http.put<HttpResponseInterface<ProdutoInterface>>(`${this.uri}/${produtoId}`, produto);
    }

    //------ Banner --------

    public adicionarBanner(
        produtoCodigo: string,
        bannerProduto?: UploadMidiaProdutoInputInterface
    ): Observable<HttpResponseInterface<ProdutoInterface>> {
        let tipo = TipoMidiaEnum.Banner;
        const formData = new FormData();
        formData.append("arquivo", bannerProduto.arquivo);
        formData.append("tipo", tipo.toString());
        return this.http.post<HttpResponseInterface<ProdutoInterface>>(`${this.uri}/codigo:${produtoCodigo}/midias/upload`, formData);
    }

    public setBannerPrincipal(productCode: string, midiaId: number, banner?: ProdutoMidiaInterface) {
        return this.http.put(`${this.uri}/codigo:${productCode}/midias/${midiaId}/principal`, banner);
    }

    // ---------  Video  -------------

    public adicionarVideo(
        produtoCodigo: string,
        videoProduto?: UploadMidiaProdutoInputInterface
    ): Observable<HttpResponseInterface<ProdutoInterface>> {
        let tipo = TipoMidiaEnum.Video;
        const formData = new FormData();
        formData.append("arquivo", videoProduto.arquivo);
        formData.append("tipo", tipo.toString());
        return this.http.post<HttpResponseInterface<ProdutoInterface>>(`${this.uri}/codigo:${produtoCodigo}/midias/upload`, formData);
    }

    // ---------  Midia  -------------

    public getMidia(produtoCodigo: string, tipoMidia: TipoMidiaEnum): Observable<HttpResponseInterface<ProdutoInterface>> {
        let params = new HttpParams();
        let tipo = tipoMidia;

        if (tipo) {
            params = params.set("tipo", tipo.toString());
        }
        return this.http.get<HttpResponseInterface<ProdutoInterface>>(`${this.uri}/codigo:${produtoCodigo}/midias`, { params: params });
    }

    public removeMidia(produtoCodigo: string, input: RemoverMidiaProdutoInputInterface) {
        return this.http.post(`${this.uri}/codigo:${produtoCodigo}/midias/remover`, input);
    }
}
