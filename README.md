# adopets-app-node
Backend

API desenvolvido com Node.js. 

Foram utilizadas algumas bibliotecas para auxiliar, dentre elas:

express: Manipulação de rotas.
JWT: Autenticação de sessão.
class-validador: Validação de dados.
typescript: Aproveitamento do sistemas de tipos.
mongoose: O banco de dados que optei foi o mongoDB consequentemente a utilização do mongoose para o mapeamento de objetos do mongo.
winston: Para o logging da API.
uuid: Geração de UUID.
crypto: Para criptografia de senhas.

Foi seguido um padrão MVC no desenvolvimento desta API, sendo a estrutura de pastas divididas em:

    src
      controllers: Onde se encontra os controladoes das rotas.
      middlewares: Arquivos de middlewares
      models: Arquivos contendo as definições de interface do negócio.
      utils: Arquivos utils
