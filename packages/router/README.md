# router

Função principal para registro de rotas.

## Uso

```javascript
import router from '@the-memoize-project/router';

router('/home', homePage)
  .router('/user/:id', userPage)
  .router('/about', aboutPage);
```

## API

### `router(path, page)`

Registra uma nova rota no sistema.

**Parâmetros**:
- `path` (string): Template da rota (ex: `/user/:id`)
- `page` (function): Callback executado quando a rota corresponder

**Retorna**: `router` (para method chaining)

### `router.handle()`

Processa a navegação atual.

### `router.fallback(page)`

Define callback para rotas não encontradas.

## Características

- Method chaining
- Registra rotas no array `listeners`
- Disponibiliza `handle` e `fallback` como métodos

## Exemplo

```javascript
import router from '@the-memoize-project/router';

// Registra rotas com chaining
router('/home', () => console.log('Home'))
  .router('/about', () => console.log('About'))
  .fallback(() => console.log('404'));

// Executa navegação
router.handle();
```

## Implementação

```javascript
function router(path, page) {
  listeners.push({ path, page });
  return router;
}

Object.assign(router, {
  handle,
  fallback,
});
```
