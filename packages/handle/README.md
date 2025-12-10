# handle

Processa a navegação executando a rota correspondente.

## Uso

```javascript
import router from '@the-memoize-project/router';

router('/home', homePage)
  .router('/user/:id', userPage);

router.handle(); // Executa a rota correspondente
```

## API

### `handle()`

Encontra a rota correspondente, extrai parâmetros e executa o callback da página.

**Retorna**: `void`

## Fluxo

1. `matching()` - Encontra a rota
2. `args()` - Extrai query params
3. `params(path)` - Extrai path params
4. `page()` - Executa o callback

## Exemplo

```javascript
// URL: /user/123?tab=profile

router.handle();

// Internamente executa:
// 1. matching() → { path: "/user/:id", page: userPage }
// 2. args() → args.tab = "profile"
// 3. params("/user/:id") → params.id = "123"
// 4. userPage()
```
