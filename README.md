# Mural Criativo

Projeto de mural de publicações com imagens e descrições, desenvolvido com
React, TypeScript, PHP e MySQL. Permite apresentar conteúdo em um espaço
visual e cadastrar publicações pela interface administrativa.

> Este repositório contém a versão original do projeto. Uma versão de
> demonstração revisada está sendo preparada separadamente e ainda não foi
> incorporada ao código disponível aqui.

## Funcionalidades da versão original

- Exibição de publicações em um carrossel.
- Visualização de detalhes e imagens de cada publicação.
- Tela de login e formulário de cadastro de publicações com imagens.

## Tecnologias

- **Interface:** React, TypeScript e React Router.
- **API:** PHP e PDO.
- **Dados:** MySQL.

## Executando o front-end

Com Node.js e npm instalados:

```bash
npm install
npm start
```

O front-end abre em `http://localhost:3000`. Os comandos `npm test` e
`npm run build` executam, respectivamente, os testes e o build de produção.

## Configuração da API

A versão original espera a API PHP em `http://localhost/novotraco/api/`.
Revise esse endereço em `src/api.ts` e as referências a imagens no front-end
caso utilize outro caminho. A API precisa de PHP com PDO MySQL e de um banco
compatível; o esquema e os dados iniciais não estão incluídos neste
repositório. Configure a conexão em `api/conexao.php` para seu ambiente.

Esta versão é um projeto de demonstração e exige revisão de autenticação,
configuração e segurança antes de ser publicada na internet. Não utilize
dados ou credenciais reais em uma instalação de demonstração.
