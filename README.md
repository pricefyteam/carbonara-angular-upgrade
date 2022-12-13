# carbonara-angular-upgrade

## Baixando e configurando o projeto

-   Clone este repositório e faça checkout na branch `dev`;
-   No diretório do projeto, instale as dependências usando `npm install`;
-   Inicialize o submodulo (pricefyfrontlib) executando o comando `git submodule update --init --recursive`;
-   Segue todos os comandos em ordem:
    -   `git clone git@github.com:pricefyteam/pricefy-pim-ui.git`
    -   `cd pricefy-pim-ui`
    -   `git checkout dev`
    -   `Renomeie o arquivo .npmrc.example para .npmrc`
    -   `Coloque os seus tokens no arquivo npmrc`
    -   `npm install`
    -   ` git submodule add git@github.com:pricefyteam/pricefy-frontlib.git`
    -   `cd pricefyfrontlib`
    -   `git checkout angular-update-henrique && git pull origin angular-update-henrique`
    -   `Adicione a sua pasta src do projeto a ser migrado na raiz do projeto`
    - `Caso você queira utilizar os componentes do novo Design System, siga o passo a passo a seguir: ` [components pricefy] (https://github.com/pricefyteam/pricefy-components-ui)

## Colocando para rodar

-   Execute `ng serve` para executar a versão de desenvolvimento. Depois acesse `http://localhost:4200/`.

## Deploy

-   O deploy é feito através de [GitHub Actions](https://docs.github.com/pt/actions), existe a actions para o deploy em CS (stage) e a actions para o deploy de produção;
-   Action do deploy de CS (stage):
    -   Manda uma compilação do projeto direto para o s3 de CS (stage), fazendo com que a atualização seja automática (quando é feito um merge da `dev` em `stage`): `.github/workflows/pim-ui-ci-cd-stage.yml`.
    -   Manda uma compilação do projeto direto para o S3 de produção. É necessário executar a ação após fazer o merge com a `master`: `.github/workflows/pim-ui-ci-cd-prod.yml`.
-   A atualização de produção também será automatizada em algum momento, mas não será totamente automatizada, a ação de mandar atualizar será humana, para evitar que um merge não intencional na `master` seja enviado para produção.
