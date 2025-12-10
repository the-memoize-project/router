# popState

Escuta o evento `popstate` do navegador para navegação com botões voltar/avançar.

## Uso

```javascript
import '@the-memoize-project/router/popState';

// Agora botões voltar/avançar disparam o router
// User clica "voltar"
// → router.handle() é executado
```

## Funcionamento

```javascript
window.addEventListener("popstate", router.handle);
```

## Características

- Escuta evento nativo `popstate`
- Executado quando usuário usa botões do navegador
- Executado quando `history.back()` ou `history.forward()` é chamado

## Notas

- Importar uma vez no início da aplicação
- Funciona automaticamente para navegação do navegador
