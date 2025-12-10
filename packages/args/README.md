# args

Extrai query parameters da URL e os disponibiliza como propriedades.

## Uso

```javascript
import args from '@the-memoize-project/router/args';

// URL: http://localhost?page=1&sort=desc

args(); // Extrai os parâmetros

console.log(args.page); // "1"
console.log(args.sort); // "desc"
```

## API

### `args()`

Extrai os query parameters da `location.search` e os atribui como propriedades da própria função.

**Retorna**: `void`

## Características

- Usa `URLSearchParams` para parsing
- Usa `Reflect.set` para atribuição
- Sobrescreve valores anteriores a cada chamada
- Os parâmetros ficam disponíveis como propriedades da função

## Exemplo

```javascript
// URL: http://localhost/products?category=electronics&minPrice=100

import args from '@the-memoize-project/router/args';

args();

console.log(args.category);  // "electronics"
console.log(args.minPrice);  // "100"
```

## Implementação

```javascript
const args = () => {
  const search = new URLSearchParams(location.search);
  Array.from(search.entries()).forEach(([key, value]) =>
    Reflect.set(args, key, value),
  );
};
```

## Notas

- Os valores são sempre strings
- Chame `args()` toda vez que a URL mudar
- É chamado automaticamente pelo `handle()`
