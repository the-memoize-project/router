# body

Extrai e parseia o corpo JSON de requests POST/PUT (para Cloudflare Workers).

## Uso

```javascript
import body from '@the-memoize-project/router/worker/body';

export default {
  async fetch(request, env, ctx) {
    await body(request);

    console.log(body.name);  // Acessa propriedades do JSON
    console.log(body.email);

    return new Response('OK');
  }
}
```

## API

### `body(request)`

Parseia o corpo do request se for POST/PUT com Content-Type application/json.

**Parâmetros**:
- `request` - Request do Cloudflare Workers

**Retorna**: `Promise<void>`

## Características

- Apenas processa requests POST/PUT
- Verifica Content-Type: application/json
- Usa `Object.assign` para atribuir propriedades
- Assíncrono (usa `await request.json()`)
- Compatível com Cloudflare Workers

## Exemplo

```javascript
import body from '@the-memoize-project/router/worker/body';

// POST /api/users
// Content-Type: application/json
// { "name": "João", "email": "joao@example.com" }

export default {
  async fetch(request, env, ctx) {
    await body(request);

    console.log(body.name);   // "João"
    console.log(body.email);  // "joao@example.com"

    return new Response(JSON.stringify({ success: true }));
  }
}
```

## Notas

- Apenas funciona com Content-Type: application/json
- É chamado automaticamente pelo `handle()`
- Suporta apenas POST e PUT
