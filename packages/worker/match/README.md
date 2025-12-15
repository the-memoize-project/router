# match

Encontra a rota correspondente ao request (para Cloudflare Workers).

## Uso

```javascript
import match from '@the-memoize-project/router/worker/match';

const request = new Request('https://api.example.com/api/users/123');
const { page, path } = match(request);

console.log(path);  // "/api/users/:id"
console.log(page);  // função handler
```

## API

### `match(request)`

Encontra a rota que corresponde ao pathname e método HTTP do request.

**Parâmetros**:
- `request` - Request do Cloudflare Workers

**Retorna**: `{ page?, path? }`
- `page` - Handler da rota (se encontrado)
- `path` - Padrão da rota (se encontrado)

## Características

- Usa regex para matching de rotas
- Converte `:param` em padrões regex `([a-z0-9-_]+)`
- Case insensitive
- Retorna objeto vazio `{}` se não encontrar
- Compatível com Cloudflare Workers

## Exemplo

```javascript
import router from '@the-memoize-project/router/worker';
import match from '@the-memoize-project/router/worker/match';

router.get('/api/users/:id', getUser);

const request = new Request('https://api.example.com/api/users/123', {
  method: 'GET'
});

const { page, path } = match(request);

console.log(path);  // "/api/users/:id"
console.log(page === getUser);  // true
```

## Notas

- Retorna `{}` se nenhuma rota corresponder
- Usado internamente pelo `handle()`
- Suporta parâmetros dinâmicos `:param`
