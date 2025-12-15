# vars

Constantes e expressões regulares usadas internamente pelo router.

## Uso

```javascript
import { PATH_VARIABLE } from '@the-memoize-project/router/worker/vars';

const path = '/api/users/:id/posts/:postId';
const matches = path.match(PATH_VARIABLE);

console.log(matches);  // [':id', ':postId']
```

## API

### `PATH_VARIABLE`

Regex para identificar parâmetros de rota (`:param`).

**Tipo**: `RegExp`

**Padrão**: `/:(?<key>\w+)/g`

## Características

- Regex global com named capture group
- Identifica segmentos que começam com `:`
- Captura o nome do parâmetro no grupo `key`
- Usado internamente pelo `urlFor`

## Exemplo

```javascript
import { PATH_VARIABLE } from '@the-memoize-project/router/worker/vars';

const path = '/api/users/:userId/posts/:postId';

// Substituir parâmetros
const url = path.replace(PATH_VARIABLE, (_, key) => {
  const params = { userId: '123', postId: '456' };
  return params[key];
});

console.log(url);  // "/api/users/123/posts/456"
```

## Notas

- Usado internamente pelo sistema de rotas
- Normalmente não precisa ser acessado diretamente
- Útil para manipulação customizada de rotas
