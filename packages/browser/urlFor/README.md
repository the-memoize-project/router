# urlFor

Gera URLs para rotas nomeadas.

## Uso

```javascript
import urlFor from '@the-memoize-project/router/urlFor';

const url = urlFor('user', { id: 123 });
// → "http://localhost/user/123"
```

## API

### `urlFor(name, params)`

Gera URL completa para uma rota pelo nome.

**Parâmetros**:
- `name` (string): Nome da rota (page.name)
- `params` (object): Parâmetros para substituir na rota

**Retorna**: `string` - URL completa

## Exemplo

```javascript
// Rota registrada:
// router('/user/:id', function userPage() {})

urlFor('userPage', { id: 123 });
// → "http://localhost/user/123"

urlFor('unknown', {});
// → "#"
```
