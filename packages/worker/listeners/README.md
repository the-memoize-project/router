# listeners

Armazena rotas registradas por método HTTP (para Cloudflare Workers).

## Uso

```javascript
import listeners from '@the-memoize-project/router/worker/listeners';

// Visualizar rotas GET registradas
console.log(listeners.GET);

// Visualizar rotas POST registradas
console.log(listeners.POST);
```

## API

### `listeners`

Objeto que contém arrays de rotas organizadas por método HTTP.

**Estrutura**:
```javascript
{
  DELETE: [],
  GET: [],
  POST: [],
  PUT: []
}
```

Cada rota contém:
- `path` - Padrão da rota (ex: "/api/users/:id")
- `page` - Handler da rota
- `name` - Nome da função handler

## Características

- Organizado por método HTTP
- Array de rotas para cada método
- Usado internamente pelo router
- Suporta GET, POST, PUT, DELETE

## Exemplo

```javascript
import router from '@the-memoize-project/router/worker';
import listeners from '@the-memoize-project/router/worker/listeners';

router.get('/api/users/:id', getUser);
router.post('/api/users', createUser);

console.log(listeners.GET);
// [{ path: '/api/users/:id', page: getUser, name: 'getUser' }]

console.log(listeners.POST);
// [{ path: '/api/users', page: createUser, name: 'createUser' }]
```

## Notas

- Usado internamente pelo sistema de rotas
- Normalmente não precisa ser acessado diretamente
- Útil para debug ou introspecção
