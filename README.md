# Mural Criativo

Mural público de publicações com imagens, descrição e autoria. A aplicação
usa React, PHP e MariaDB. Este ambiente está configurado para demonstração
local, não para exposição na internet.

Na pasta principal do workspace, execute:

```powershell
docker compose up -d --build novotraco
```

O mural fica em http://localhost:8185. Qualquer pessoa pode visualizar as
publicações; para publicar, crie uma conta ou use o acesso local `demo` /
`demo`. O nome cadastrado identifica o autor e deve ser único. São aceitas
até quatro imagens JPEG, PNG, GIF ou WebP por publicação, de até 5 MB cada.
Quando definida, a variável `MURAL_MAX_POSTS` limita o número total de
publicações; ao atingir o limite, a API informa que o mural está cheio. Sem
essa variável, não há limite de publicações.

As publicações e contas ficam no banco `novotraco` do volume
`amostra-mariadb`. As imagens enviadas ficam em `api/imagens`; preserve
essa pasta junto com o banco ao fazer backup. O serviço da API adiciona um
índice único aos nomes de usuário ao iniciar; caso existam nomes duplicados
em um banco antigo, a inicialização falhará até que sejam resolvidos.
Senhas antigas são convertidas para hash no próximo login.

O SQL `docker/novotraco.sql`, na pasta principal, cria os dados de exemplo
apenas na primeira inicialização do volume. Mudanças nele não sobrescrevem
um banco existente. A API usa as variáveis `NOVOTRACO_DB_HOST`,
`NOVOTRACO_DB_NAME`, `NOVOTRACO_DB_USER` e `NOVOTRACO_DB_PASSWORD`,
configuradas no Compose da pasta principal.
