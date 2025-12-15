# fallback

Rota executada quando nenhuma outra corresponde.

## Uso

```javascript
import fallback from '@the-memoize-project/router/fallback';

// Configura o fallback
fallback(() => {
  console.log('404 - Página não encontrada');
});
```

## API

### `fallback(page)`

Define o callback a ser executado quando nenhuma rota corresponder.

**Parâmetros**:
- `page` (function): Callback para 404/not found

## Características

- Executa quando `matching()` não encontra rota
- Tem acesso aos `args` (query params)
- Atualiza `fallback.path` com pathname atual

## Exemplo

```javascript
import fallback from '@the-memoize-project/router/fallback';

fallback(() => {
  document.body.innerHTML = '<h1>404 - Not Found</h1>';
});

// Navegação para /unknown
// → fallback é executado
```
