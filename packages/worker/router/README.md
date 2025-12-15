# router

Router principal para Cloudflare Workers com suporte a rotas HTTP.

## Uso

```javascript
import router from '@the-memoize-project/router/worker';

router.get('/api/users', listUsers);
router.get('/api/users/:id', getUser);
router.post('/api/users', createUser);
router.put('/api/users/:id', updateUser);
router.delete('/api/users/:id', deleteUser);

export default {
  async fetch(request, env, ctx) {
    return await router.handle(request, env, ctx) ?? new Response('Not Found', { status: 404 });
  }
}
```

## API

### `router.get(path, handler)`
### `router.post(path, handler)`
### `router.put(path, handler)`
### `router.delete(path, handler)`

Registra uma rota para o método HTTP especificado.

**Parâmetros**:
- `path` - Padrão da rota (ex: "/api/users/:id")
- `handler` - Função async que recebe (request, env, ctx)

### `router.handle(request, env, ctx)`

Processa o request e executa o handler correspondente.

**Parâmetros**:
- `request` - Request do Cloudflare Workers
- `env` - Environment bindings
- `ctx` - Execution context

**Retorna**: `Promise<Response | undefined>`

## Características

- Suporta GET, POST, PUT, DELETE
- Parâmetros dinâmicos (:param)
- Extração automática de args, body, params
- Implementado com Proxy
- Compatível com Cloudflare Workers

## Exemplo Completo

```javascript
import router from '@the-memoize-project/router/worker';
import { args, params, body } from '@the-memoize-project/router/worker';

// GET /api/users?page=1&limit=10
router.get('/api/users', async (request, env, ctx) => {
  const page = args.page || '1';
  const limit = args.limit || '10';

  return new Response(JSON.stringify({
    page,
    limit,
    users: []
  }));
});

// GET /api/users/123
router.get('/api/users/:id', async (request, env, ctx) => {
  const userId = params.id;

  return new Response(JSON.stringify({
    id: userId,
    name: 'João'
  }));
});

// POST /api/users
router.post('/api/users', async (request, env, ctx) => {
  const { name, email } = body;

  return new Response(JSON.stringify({
    id: '123',
    name,
    email
  }), {
    status: 201
  });
});

export default {
  async fetch(request, env, ctx) {
    const response = await router.handle(request, env, ctx);
    return response ?? new Response('Not Found', { status: 404 });
  }
}
```

## Notas

- Handlers devem retornar Response
- Use `args`, `params`, `body` para acessar dados
- `handle()` retorna undefined se rota não encontrada
