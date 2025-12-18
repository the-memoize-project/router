# headers

Extrai e acessa HTTP headers da requisição (para Cloudflare Workers).

## Uso

```javascript
import headers from '@the-memoize-project/router/worker/headers';

// URL: https://api.example.com/api/users
// Headers: Content-Type: application/json, Authorization: Bearer token123

const request = new Request('https://api.example.com/api/users', {
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer token123'
  }
});

headers(request);

console.log(headers['content-type']);  // "application/json"
console.log(headers.authorization);    // "Bearer token123"
```

## API

### `headers(request)`

Extrai todos os HTTP headers da requisição e os disponibiliza como propriedades.

**Parâmetros**:
- `request` - Request do Cloudflare Workers

**Retorna**: `void`

## Características

- Extrai todos os headers HTTP da requisição
- Normaliza as chaves para lowercase (headers HTTP são case-insensitive)
- Usa `Reflect.set` para atribuição
- Os headers ficam disponíveis como propriedades da função
- Compatível com Cloudflare Workers
- Acesso via notação de ponto ou colchetes

## Exemplo

```javascript
import router from '@the-memoize-project/router/worker';
import headers from '@the-memoize-project/router/worker/headers';

router.post('/api/users', createUser);

async function createUser(request, env, ctx) {
  // headers já foi processado pelo handle()
  const contentType = headers['content-type'];
  const authorization = headers.authorization;
  const userAgent = headers['user-agent'];

  // Verificar autenticação
  if (!authorization) {
    return new Response('Unauthorized', { status: 401 });
  }

  return new Response(JSON.stringify({
    contentType,
    userAgent,
    authenticated: true
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}
```

## Headers Comuns

```javascript
// Headers de autenticação
headers.authorization;        // "Bearer token123"
headers['api-key'];          // "abc123xyz"

// Headers de conteúdo
headers['content-type'];     // "application/json"
headers['content-length'];   // "1234"
headers['content-encoding']; // "gzip"

// Headers do cliente
headers['user-agent'];       // "Mozilla/5.0..."
headers.accept;              // "application/json"
headers['accept-language'];  // "pt-BR,pt;q=0.9"

// Headers customizados
headers['x-custom-header'];  // "custom-value"
headers['x-request-id'];     // "req-123-456"
```

## Notas

- Valores são sempre strings
- É chamado automaticamente pelo `handle()`
- Chaves são normalizadas para lowercase
- Suporta acesso via notação de ponto e colchetes
- Para headers com hífen, use colchetes: `headers['content-type']`
