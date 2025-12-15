# params

Extrai parâmetros de rota dinâmicos (para Cloudflare Workers).

## Uso

```javascript
import params from '@the-memoize-project/router/worker/params';

// Rota: /api/users/:id
// URL: https://api.example.com/api/users/123

const request = new Request('https://api.example.com/api/users/123');
params(request, '/api/users/:id');

console.log(params.id);  // "123"
```

## API

### `params(request, path)`

Extrai parâmetros dinâmicos da URL baseado no padrão da rota.

**Parâmetros**:
- `request` - Request do Cloudflare Workers
- `path` - Padrão da rota com `:param`

**Retorna**: `void`

## Características

- Identifica segmentos que começam com `:`
- Extrai valores correspondentes do pathname
- Usa `Reflect.set` para atribuição
- Os parâmetros ficam disponíveis como propriedades da função
- Compatível com Cloudflare Workers

## Exemplo

```javascript
import router from '@the-memoize-project/router/worker';
import params from '@the-memoize-project/router/worker/params';

router.get('/api/users/:id/posts/:postId', getUserPost);

async function getUserPost(request, env, ctx) {
  // params já foi processado pelo handle()
  console.log(params.id);      // "123"
  console.log(params.postId);  // "456"

  return new Response(JSON.stringify({
    userId: params.id,
    postId: params.postId
  }));
}
```

## Notas

- Valores são sempre strings
- É chamado automaticamente pelo `handle()`
- Suporta múltiplos parâmetros na mesma rota
