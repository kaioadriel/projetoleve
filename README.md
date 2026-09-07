# Projeto Leve

Pacote estático pronto para publicação em GitHub Pages ou outro host HTTPS.

## Arquivos

- `index.html`: aplicação completa.
- `manifest.json`: manifesto PWA.
- `service-worker.js`: cache e modo offline.
- `icons/`: ícones do PWA.
- `firestore.rules`: Firestore bloqueado na versão atual, pois os registros continuam locais.
- `firebase-storage.rules`: Storage bloqueado na versão atual, pois as fotos continuam no IndexedDB local.

## Firebase Authentication

A autenticação Firebase está ativa no `index.html`, usando o projeto `projetoleve-58fec`.

Antes de publicar em um domínio novo, adicione o domínio em:

Firebase Console > Authentication > Settings > Authorized domains.

Para login com Google, mantenha também o provedor Google ativado em Authentication > Sign-in method.

## GitHub Pages

Os caminhos de manifesto, service worker e ícones são relativos, portanto funcionam tanto na raiz quanto em um repositório publicado em subpasta.

## Banco atual

A autenticação é Firebase, mas os registros continuam salvos localmente por usuário no navegador e as fotos no IndexedDB. Firestore e Firebase Storage ficam bloqueados pelas regras incluídas neste pacote.

## Versão V33

Mantém as melhorias da V32 e adiciona Água Corporal em duas unidades no lançamento de peso: percentual (%) e quilogramas (kg). O preenchimento é bidirecional: ao informar uma unidade, a outra é calculada automaticamente a partir do peso do registro. Os cards e detalhes também exibem as duas unidades.
