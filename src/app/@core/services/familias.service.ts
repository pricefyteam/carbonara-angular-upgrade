import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

import { ConfigService } from "../../../../pricefyfrontlib/app/core/config/config.service";
import { FamiliaMidiaInterface } from "../interfaces/entities/familia-midia.interface";
import { TipoMidiaFamiliaEnum } from "../interfaces/entities/familia-tipo-midia-enum.interface";
import { FamiliaInterface } from "../interfaces/entities/familia.interface";
import { HttpResponseInterface } from "../interfaces/http-response.interface";
import { FamiliaInputInterface } from "../interfaces/models/familia-input.interface";
import { PesquisaPaginadaOutputInterface } from "../interfaces/models/pesquisa-paginada-output.interface";
import { PesquisarFamiliaInputInterface } from "../interfaces/models/pesquisar-familia-input";
import { RemoverMidiaFamiliaInputInterface } from "../interfaces/models/remover-midia-familia.interface";
import { UploadImagemFamiliaInputInterface } from "../interfaces/models/upload-imagem-familia-input.interface";
import { UploadMidiaFamiliaInputInterface } from "../interfaces/models/upload-midia-familia-input.interface";
import { ProductFamilyImageInterface } from "./../../@states/@interfaces/product-family-image.interface";
import { RemoverImagemFamiliaInputInterface } from "./../interfaces/models/remover-imagem-familia-input.interface";

@Injectable()
export class FamiliasService {
    private readonly uri: string = "familias";

    constructor(private http: HttpClient, private configService: ConfigService) {
        this.uri = `${this.configService.getConfiguration().privateApisUrls.pim}/${this.uri}`;
    }

    getFamilias(
        input: PesquisarFamiliaInputInterface,
        pagina: number = 1,
        quantidadeItensPorPagina: number = environment.maxRegister
    ): Observable<HttpResponseInterface<PesquisaPaginadaOutputInterface<FamiliaInterface>>> {
        let params = new HttpParams();

        params = params.set("texto", input.texto);

        if (input.incluirImagens === true) {
            params = params.set("incluirImagens", input.incluirImagens.toString());
        }

        if (input.incluirProdutos === true) {
            params = params.set("incluirProdutos", input.incluirProdutos.toString());
        }

        if (input.incluirImagensProdutos === true) {
            params = params.set("incluirImagensProdutos", input.incluirImagensProdutos.toString());
        }

        params = params.set("pagina", pagina.toString());
        params = params.set("quantidadeItensPorPagina", quantidadeItensPorPagina.toString());

        return this.http.get<HttpResponseInterface<PesquisaPaginadaOutputInterface<FamiliaInterface>>>(`${this.uri}`, { params });
    }

    public getFamiliaPorCodigo(
        codigo: string,
        incluirImagens?: boolean,
        incluirProdutos?: boolean,
        incluirImagensProdutos?: boolean
    ): Observable<HttpResponseInterface<PesquisaPaginadaOutputInterface<FamiliaInterface>>> {
        let params = new HttpParams();

        if (incluirImagens === true) {
            params = params.set("incluirImagens", incluirImagens.toString());
        }

        if (incluirProdutos === true) {
            params = params.set("incluirProdutos", incluirProdutos.toString());
        }

        if (incluirImagensProdutos === true) {
            params = params.set("incluirImagensProdutos", incluirImagensProdutos.toString());
        }

        return this.http.get<HttpResponseInterface<PesquisaPaginadaOutputInterface<FamiliaInterface>>>(`${this.uri}/codigo:${codigo}`, {
            params: params,
        });
    }

    public getFamiliaPorId(
        id: number,
        incluirImagens?: boolean,
        incluirProdutos?: boolean,
        incluirImagensProdutos?: boolean
    ): Observable<HttpResponseInterface<PesquisaPaginadaOutputInterface<FamiliaInterface>>> {
        let params = new HttpParams();

        if (incluirImagens === true) {
            params = params.set("incluirImagens", incluirImagens.toString());
        }

        if (incluirProdutos === true) {
            params = params.set("incluirProdutos", incluirProdutos.toString());
        }

        if (incluirImagensProdutos === true) {
            params = params.set("incluirImagensProdutos", incluirImagensProdutos.toString());
        }

        return this.http.get<HttpResponseInterface<PesquisaPaginadaOutputInterface<FamiliaInterface>>>(`${this.uri}/${id}`, {
            params: params,
        });
    }

    public criarFamilia(familiaInput: FamiliaInputInterface): Observable<HttpResponseInterface<FamiliaInterface>> {
        return this.http.post<HttpResponseInterface<FamiliaInterface>>(this.uri, familiaInput);
    }

    public editarFamilia(familiaId: number, familiaInput: FamiliaInputInterface): Observable<HttpResponseInterface<FamiliaInterface>> {
        return this.http.put<HttpResponseInterface<FamiliaInterface>>(`${this.uri}/${familiaId}/descricoes`, familiaInput);
    }

    public removerFamilia(familiaId: number): Observable<HttpResponseInterface<FamiliaInterface>> {
        return this.http.delete<HttpResponseInterface<FamiliaInterface>>(`${this.uri}/${familiaId}`);
    }

    public adicionarProdutos(familiaId: number, produtosIds: number[]): Observable<HttpResponseInterface<FamiliaInterface>> {
        //remove possíveis duplicidades
        produtosIds = Array.from(new Set(produtosIds));

        return this.http.post<HttpResponseInterface<FamiliaInterface>>(`${this.uri}/${familiaId}/produtos/adicionar`, {
            familiaId: familiaId,
            produtos: produtosIds,
        });
    }

    public removerProdutos(familiaId: number, produtosIds: number[]): Observable<HttpResponseInterface<FamiliaInterface>> {
        //remove possíveis duplicidades
        produtosIds = Array.from(new Set(produtosIds));

        return this.http.post<HttpResponseInterface<FamiliaInterface>>(`${this.uri}/${familiaId}/produtos/remover`, {
            familiaId: familiaId,
            produtos: produtosIds,
        });
    }

    public adicionarImagem(
        familiaId: number,
        imagemProduto: UploadImagemFamiliaInputInterface
    ): Observable<HttpResponseInterface<FamiliaInterface>> {
        const formData = new FormData();
        formData.append("familiaId", imagemProduto.familiaId.toString());
        formData.append("principal", imagemProduto.principal.toString());
        formData.append("arquivo", imagemProduto.arquivo);
        return this.http.post<HttpResponseInterface<FamiliaInterface>>(`${this.uri}/${familiaId}/imagens/upload`, formData);
    }

    public removeImagem(familiaId: number, input: RemoverImagemFamiliaInputInterface) {
        return this.http.post(`${this.uri}/${familiaId}/imagens/remover`, input);
    }

    public setImagemPrincipal(imagem: ProductFamilyImageInterface) {
        return this.http.put(`${this.uri}/${imagem.familyId}/imagens/${imagem.id}/principal`, imagem);
    }

    //------ Banner --------

    public adicionarBanner(
        familiaCodigo: string,
        bannerFamilia?: UploadMidiaFamiliaInputInterface
    ): Observable<HttpResponseInterface<FamiliaInterface>> {
        let tipo = TipoMidiaFamiliaEnum.Banner;
        const formData = new FormData();
        formData.append("arquivo", bannerFamilia.arquivo);
        formData.append("tipo", tipo.toString());
        return this.http.post<HttpResponseInterface<FamiliaInterface>>(`${this.uri}/codigo:${familiaCodigo}/midias/upload`, formData);
    }

    public setBannerFamiliaPrincipal(familyCode: string, midiaId: number, banner?: FamiliaMidiaInterface) {
        return this.http.put(`${this.uri}/codigo:${familyCode}/midias/${midiaId}/principal`, banner);
    }

    // ---------  Video  -------------

    public adicionarVideo(
        familiaCodigo: string,
        videoFamilia?: UploadMidiaFamiliaInputInterface
    ): Observable<HttpResponseInterface<FamiliaInterface>> {
        let tipo = TipoMidiaFamiliaEnum.Video;
        const formData = new FormData();
        formData.append("arquivo", videoFamilia.arquivo);
        formData.append("tipo", tipo.toString());
        return this.http.post<HttpResponseInterface<FamiliaInterface>>(`${this.uri}/codigo:${familiaCodigo}/midias/upload`, formData);
    }

    // ---------  Midia  -------------

    public getMidia(familiaCodigo: string, tipoMidia: TipoMidiaFamiliaEnum): Observable<HttpResponseInterface<FamiliaInterface>> {
        let params = new HttpParams();
        let tipo = tipoMidia;

        if (tipo) {
            params = params.set("tipo", tipo.toString());
        }
        return this.http.get<HttpResponseInterface<FamiliaInterface>>(`${this.uri}/codigo:${familiaCodigo}/midias`, { params: params });
    }

    public removeMidia(familiaCodigo: string, input: RemoverMidiaFamiliaInputInterface) {
        return this.http.post(`${this.uri}/codigo:${familiaCodigo}/midias/remover`, input);
    }
}
