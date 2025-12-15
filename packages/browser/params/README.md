# params

Extrai parâmetros de rota dinâmica (como `:id`, `:slug`) da URL.

## Uso

```javascript
import params from '@the-memoize-project/router/params';

// URL: http://localhost/user/123/profile
// Rota: /user/:id/:section

params("/user/:id/:section");

console.log(params.id);      // "123"
console.log(params.section); // "profile"
```

## API

### `params(path)`

Extrai parâmetros dinâmicos da rota comparando o `path` com `location.pathname`.

**Parâmetros**:
- `path` (string): Template da rota com parâmetros (ex: `/user/:id/:section`)

**Retorna**: `void`

## Características

- Identifica parâmetros com prefixo `:` (ex: `:id`)
- Mapeia valores da URL atual
- Limpa parâmetros anteriores a cada chamada
- Usa `Reflect.set` para atribuição

## Exemplo

```javascript
// Rota: /products/:category/:id

import params from '@the-memoize-project/router/params';

// URL: /products/electronics/12345
params("/products/:category/:id");

console.log(params.category); // "electronics"
console.log(params.id);       // "12345"
```

## Implementação

```javascript
const params = (path) => {
  const keys = path?.split("/");
  const values = location.pathname.split("/");
  Object.keys(params).forEach((key) => delete params[key]);
  keys?.forEach(
    (key, i) => /^:/.test(key) && Reflect.set(params, key.slice(1), values[i]),
  );
};
```

## Notas

- Os valores são sempre strings
- Parâmetros são case-insensitive
- É chamado automaticamente pelo `handle()`
