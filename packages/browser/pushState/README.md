# pushState

Intercepta `history.pushState` para disparar navegação automática.

## Uso

```javascript
import '@the-memoize-project/router/pushState';

// Agora pushState dispara o router automaticamente
history.pushState(null, '', '/user/123');
// → router.handle() é executado
```

## Funcionamento

Usa `Proxy` para interceptar `history.pushState`:

```javascript
history.pushState = new Proxy(history.pushState, {
  apply(original, context, args) {
    original.apply(context, args);
    window.dispatchEvent(new CustomEvent("pushstate"));
  },
});

window.addEventListener("pushstate", router.handle);
```

## Características

- Metaprogramação com Proxy
- Dispara evento customizado `pushstate`
- Executa `router.handle()` automaticamente
- Não quebra funcionalidade original

## Notas

- Importar uma vez no início da aplicação
- Funciona automaticamente em toda navegação programática
