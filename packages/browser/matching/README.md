# matching

Encontra a rota que corresponde ao pathname atual.

## Uso

```javascript
import matching from '@the-memoize-project/router/matching';

const route = matching();
console.log(route.path); // "/user/:id"
console.log(route.page); // function userPage() {}
```

## API

### `matching()`

Busca nos listeners a rota que corresponde ao `location.pathname` atual.

**Retorna**: `{ path: string, page: function } | fallback`

## Características

- Usa regex para matching de rotas dinâmicas
- Suporta parâmetros com `:param`
- Case-insensitive por padrão
- Retorna fallback se nenhuma rota corresponder

## Exemplo

```javascript
// Rotas registradas:
// /home
// /user/:id
// /products/:category/:id

// URL: /user/123
const route = matching();
// → { path: "/user/:id", page: userPage }

// URL: /unknown
const route = matching();
// → fallback
```
