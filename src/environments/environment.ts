// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    production: true,
    configFile: "assets/config/config.prod.json",

    /**
     * Configuração do envio de arquivos via upload:
     *
     * maxSizeFile é o tamanho individual que o arquivo pode ter - 1 GB.
     * maxFileUpload é a quantidade máxima enviada por vez.
     *
     * Com as configurações abaixo é possível enviar 10 arquivos
     * por vez, e cada um deles pode ter até 1GB (somando 10GB)
     */
    maxSizeFile: 1 * 1024 * 1024 * 1024,
    maxFileUpload: 2,

    /*
        Quantidade de registros que serão exibidos na tela de lista banco de imagens e famílias.
        O número 24 foi selecionado, pois para telas grandes serão exibidos 6 colunas e para telas menos 4 e por isso 24, que é multiplo tanto de 6 quanto 4
    */
    maxRegister: 24,

    // Código não utilizado no PIM, mas foi necessário inseri-lo aqui por causa do erro que gerava no pricefyfrontlib.
    // O pedido para inserção desse código foi feito pelo Zap que criou um serviço que utliza o google analytics
    googleAnalytics: {
        enabled: false,
        code: "UA-120818259-2",
    },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
