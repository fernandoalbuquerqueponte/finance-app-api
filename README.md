# Finance API

Projeto "Finance API" — desenvolvido durante o curso do FullStack Club. API REST para gerenciamento de usuários e transações financeiras.

## Tecnologias principais
- Node.js + Express
- Prisma ORM ([`prisma`](prisma/prisma.js))
- Validação: Zod
- Autenticação: JSON Web Tokens (JWT)
- Hashing/Comparação de senhas: bcrypt
- Testes: Jest + Supertest
- Utilitários: uuid, dayjs, validator, faker

## Padrões e arquitetura
- Estrutura por responsabilidades: controllers -> use-cases -> repositories -> adapters
- Repositórios para persistência: [src/repositories/postgres/index.js](src/repositories/postgres/index.js)
- Casos de uso centralizados: [src/use-cases/index.js](src/use-cases/index.js)
- Controllers expõem a camada HTTP: [src/controllers/index.js](src/controllers/index.js)
- Adapters para integrações externas (tokens, hashing, id): [src/adapters/index.js](src/adapters/index.js)
- App exportado para testes e e2e: [`app`](src/app.cjs)

## Arquivos importantes
- Configuração Prisma: [prisma/prisma.js](prisma/prisma.js)
- Entrypoint: [index.js](index.js) / servidor: [`app`](src/app.cjs)
- Docker Compose: [docker-compose.yml](docker-compose.yml)
- Exemplos de env: [.env.example](.env.example)
- Configuração de testes: [jest.config.js](jest.config.js), [jest.global-setup.js](jest.global-setup.js), [jest.setup-after-env.js](jest.setup-after-env.js)

## Setup rápido
1. Instalar dependências:
    ```sh
    npm install
    ```
2. Copiar variáveis de ambiente e ajustar:
    ```sh
    cp .env.example .env
    # editar .env conforme necessário
    ```
3. Subir serviços necessários (Postgres) e preparar DB:
    ```sh
    docker compose up -d --wait
    npx prisma db push
    ```
   (O script de setup global do Jest também executa esses passos: [jest.global-setup.js](jest.global-setup.js))

4. Rodar a API:
    ```sh
    node index.js
    ```
5. Executar testes:
    ```sh
    npm test
    ```

## Observações
- Validações estão em: [src/schemas/index.js](src/schemas/index.js)
- Rotas principais: [src/routes/index.js](src/routes/index.js)
- Testes e fixtures em: [src/tests](src/tests)

Licença: projeto criado como exercício do FullStack Club.