# handle

Processa requests e executa o handler correspondente (para Cloudflare Workers).

## Uso

```javascript
import router from '@the-memoize-project/router/worker';

router.get('/api/users/:id', getUser);

export default {
  async fetch(request, env, ctx) {
    return await router.handle(request, env, ctx) ?? new Response('Not Found', { status: 404 });
  }
}

async function getUser(request, env, ctx) {
  return new Response(JSON.stringify({ id: params.id }));
}
```

## API

### `handle(request, env, ctx)`

Processa o request, extrai parâmetros e executa o handler correspondente.

**Parâmetros**:
- `request` - Request do Cloudflare Workers
- `env` - Environment bindings
- `ctx` - Execution context

**Retorna**: `Promise<Response | undefined>`

## Características

- Faz matching de rotas automaticamente
- Extrai body (para POST/PUT com JSON)
- Extrai query parameters (args)
- Extrai parâmetros de rota (params)
- Passa `request`, `env`, `ctx` para o handler
- Compatível com Cloudflare Workers

## Exemplo

```javascript
import router from '@the-memoize-project/router/worker';
import { args, params, body } from '@the-memoize-project/router/worker';

router.get('/api/users/:id', getUser);
router.post('/api/users', createUser);

async function getUser(request, env, ctx) {
  // params.id está disponível
  return new Response(JSON.stringify({ id: params.id }));
}

async function createUser(request, env, ctx) {
  // body.name, body.email estão disponíveis
  return new Response(JSON.stringify({ name: body.name }));
}

export default {
  async fetch(request, env, ctx) {
    return await router.handle(request, env, ctx) ?? new Response('Not Found', { status: 404 });
  }
}
```

## Notas

- Retorna `undefined` se nenhuma rota corresponder
- Extrai automaticamente args, body e params
- É async/await compatível
