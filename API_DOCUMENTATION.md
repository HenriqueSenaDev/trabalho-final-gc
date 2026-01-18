# API Backend — Documentação

Objetivo: descrição prática da API para consumo pelos times B/C/D/E.
Sem floreios; foco em formas de dados, filtros, paginação e notas de implementação.

## Base URL
- Desenvolvimento: `http://localhost:5000/api`
- Produção: definido pelo DevOps

## Shapes (Formas dos objetos)

Produto
```json
{
  "id": "string",
  "name": "string",
  "price": 0.0,
  "imageUrl": "string",
  "categoryId": "string",
  "category": { "id": "string", "name": "string" },
  "createdAt": "ISO-8601",
  "updatedAt": "ISO-8601"
}
```

Categoria
```json
{ "id": "string", "name": "string" }
```

Paginação
```json
{
  "page": 1,
  "limit": 10,
  "total": 100,
  "totalPages": 10,
  "hasNextPage": true,
  "hasPreviousPage": false
}
```

## Notas gerais
- Filtros são cumulativos (aplicar vários ao mesmo tempo).
- Ordenação padrão: `createdAt desc`.
- `price` é `Float`; enviar números (não strings).
- `limit` máximo: 100. Valores maiores são reduzidos.
- `page` mínima: 1. Valores menores são normalizados.
- Em 204 No Content não há body.

## Endpoints

### GET /products — listagem com filtros e paginação
Query (opcionais):
- `search`: termo no nome, case-insensitive
- `categoryId`: filtra por categoria
- `minPrice` / `maxPrice`: faixa de preço (float)
- `page`, `limit`: paginação

Resposta:
```json
{
  "data": [Produto],
  "pagination": Paginação
}
```

Notas:
- Filtros combinam entre si.
- Se nenhum filtro for passado, retorna todos paginados.

### GET /products/:id — detalhe
Resposta: `Produto`.
Erros: 404 se não existir.

### POST /products — criação
Body:
```json
{ "name": "string", "price": 0.0, "imageUrl": "string", "categoryId": "string" }
```
Notas:
- `categoryId` deve existir.
- `imageUrl` deve ser uma URL acessível.
Erros: 400 campos faltando; 404 categoria inexistente.

### PUT /products/:id — atualização parcial
Body (qualquer campo dos acima).
Notas: valida existência de produto e, se alterar `categoryId`, valida a categoria.
Resposta: `Produto` atualizado.

### DELETE /products/:id — remoção
Resposta: 204 No Content.

### GET /categories — listagem
Resposta: `Categoria[]`.

### GET /categories/:id — detalhe
Resposta: `Categoria`.

### POST /categories — criação
Body:
```json
{ "name": "string" }
```
Resposta: `Categoria` criada.

## Tratamento de erros
- 400 Bad Request: validação de payload/filtros.
- 404 Not Found: recurso inexistente.
- 500 Internal Server Error: falha inesperada.

Formato:
```json
{ "error": "string" }
```

## Dicas de negócio
- Não aumente `limit` acima de 100 para evitar consultas pesadas.
- Combine filtros para reduzir cardinalidade (ex.: `categoryId` + faixa de preço).
- Padronize `imageUrl` para domínios confiáveis; invalide URLs quebradas.
- Considere paginação estável em integrações (guardar `page`/`limit`).

Última atualização: 2026-01-18
