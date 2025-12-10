# listeners

Array que armazena as rotas registradas.

## Uso

```javascript
import listeners from '@the-memoize-project/router/listeners';

listeners.push({ path: "/home", page: homePage });
console.log(listeners.length); // 1
```

## API

Array simples que contém objetos com:
- `path` (string): Template da rota
- `page` (function): Callback a ser executado

## Estrutura

```javascript
[
  { path: "/home", page: homePage },
  { path: "/user/:id", page: userPage },
  { path: "/about", page: aboutPage }
]
```

## Notas

- É um array JavaScript padrão
- Usado por `router()` para registrar rotas
- Usado por `matching()` para encontrar rotas
- Usado por `urlFor()` para gerar URLs
