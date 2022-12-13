export interface HttpResponseInterface<T> {
    responseCode: HttpResponseCodes;
    responseMessage: string;
    numeroExcucao?: number;
    content: T;
}

export enum HttpResponseCodes {
    // Transação efetuada com sucesso
    OK = "000",

    // O Projeto tem tarefas não concluídas no estágio atual
    _070 = "070",

    // O próximo Estágio desejado já foi concluído
    _071 = "071",

    // Os aprovadores informados já estão cadastrados nesta tarefa
    _049 = "049",

    // Nenhum registro foi encontrado
    _100 = "100",

    // Erro na busca textual (serviço de FTS)
    _666 = "666",
}
