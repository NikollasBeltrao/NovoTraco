# Mural Criativo

Mural público de publicações com imagens, descrição e autoria, desenvolvido
com React, TypeScript, PHP e MariaDB.

**[Acessar demonstração](https://nikollas-beltrao-projects.duckdns.org:8445/)**

Qualquer pessoa pode visualizar as publicações; para publicar, crie uma conta.
Use somente dados fictícios: a demonstração é pública e compartilhada.

## Funcionalidades

- Feed de publicações com imagens, descrição e autoria.
- Cadastro e autenticação para publicar.
- Até quatro imagens JPEG, PNG, GIF ou WebP por publicação, de até 5 MB cada.
- Limite opcional de publicações pela variável `MURAL_MAX_POSTS`.

## Desenvolvimento

Com Node.js e npm instalados, execute `npm install` e `npm start` para iniciar
o frontend em `http://localhost:3000`. Os comandos `npm test` e
`npm run build` executam os testes e o build de produção.

A API requer PHP com PDO MySQL e um banco compatível. Configure as variáveis
`NOVOTRACO_DB_HOST`, `NOVOTRACO_DB_NAME`, `NOVOTRACO_DB_USER` e
`NOVOTRACO_DB_PASSWORD`, e ajuste o endereço da API no frontend conforme o
ambiente. O esquema inicial não está incluído neste repositório.

No workspace completo de demonstrações, `docker compose up -d --build novotraco`
na pasta principal inicia os serviços locais em `http://localhost:8185`. O
Compose e o SQL inicial estão na pasta principal do workspace, não neste
repositório. O acesso local de exemplo é `demo` / `demo`.

As publicações e contas ficam no banco `novotraco` e as imagens enviadas em
`api/imagens`; preserve ambos juntos ao fazer backup. A inicialização da API
adiciona um índice único aos nomes de usuário e falha caso existam nomes
duplicados em um banco antigo. Senhas antigas são convertidas para hash no
próximo login.
