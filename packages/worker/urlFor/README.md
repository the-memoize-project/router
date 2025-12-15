# urlFor

Gera URLs a partir de nomes de rotas (para Cloudflare Workers).

## Uso

```javascript
import router from '@the-memoize-project/router/worker';
import urlFor from '@the-memoize-project/router/worker/urlFor';

router.get('/api/users/:id', getUser);

const url = urlFor(getUser, { id: '123' }, 'https://api.example.com');
console.log(url);  // "https://api.example.com/api/users/123"
```

## API

### `urlFor(page, params, host)`

Gera uma URL baseada no nome da função handler.

**Parâmetros**:
- `page` - Função handler da rota
- `params` - Objeto com valores para substituir `:param`
- `host` - URL base (opcional, padrão: "")

**Retorna**: `string` - URL completa

## Características

- Encontra rota pelo nome da função
- Substitui `:param` por valores do objeto params
- Permite especificar host customizado
- Retorna "#" se rota não encontrada
- Compatível com Cloudflare Workers

## Exemplo

```javascript
import router from '@the-memoize-project/router/worker';
import urlFor from '@the-memoize-project/router/worker/urlFor';

async function getUser(request, env, ctx) {
  return new Response('User');
}

async function getUserPost(request, env, ctx) {
  return new Response('Post');
}

router.get('/api/users/:id', getUser);
router.get('/api/users/:userId/posts/:postId', getUserPost);

// Gerar URLs
const userUrl = urlFor(getUser, { id: '123' }, 'https://api.example.com');
console.log(userUrl);  // "https://api.example.com/api/users/123"

const postUrl = urlFor(getUserPost,
  { userId: '123', postId: '456' },
  'https://api.example.com'
);
console.log(postUrl);  // "https://api.example.com/api/users/123/posts/456"
```

## Notas

- Apenas funciona com rotas GET
- A função handler deve ter um nome
- Retorna "#" se a rota não for encontrada
- O host é opcional (padrão: string vazia)
