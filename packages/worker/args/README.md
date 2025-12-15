# args

Extrai query parameters da URL e os disponibiliza como propriedades (para Cloudflare Workers).

## Uso

```javascript
import args from '@the-memoize-project/router/worker/args';

// URL: https://api.example.com/users?page=1&sort=desc

const request = new Request('https://api.example.com/users?page=1&sort=desc');
args(request);

console.log(args.page); // "1"
console.log(args.sort); // "desc"
```

## API

### `args(request)`

Extrai os query parameters da URL do request e os atribui como propriedades da própria função.

**Parâmetros**:
- `request` - Request do Cloudflare Workers

**Retorna**: `void`

## Características

- Usa `URL` e `URLSearchParams` para parsing
- Usa `Reflect.set` para atribuição
- Os parâmetros ficam disponíveis como propriedades da função
- Compatível com Cloudflare Workers

## Exemplo

```javascript
import args from '@the-memoize-project/router/worker/args';

export default {
  async fetch(request, env, ctx) {
    args(request);

    console.log(args.category);  // valor de ?category=...
    console.log(args.minPrice);  // valor de ?minPrice=...

    return new Response('OK');
  }
}
```

## Notas

- Os valores são sempre strings
- Compatível com a API de Request do Cloudflare Workers
- É chamado automaticamente pelo `handle()`
