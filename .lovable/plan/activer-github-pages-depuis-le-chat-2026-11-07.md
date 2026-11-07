# Activer GitHub Pages depuis le chat

## Étapes
1. Connecter votre compte GitHub (une carte de connexion s'affiche, vous autorisez l'accès). La connexion sert uniquement à cette opération : l'éditeur lui-même n'en aura pas besoin.
2. Retrouver le dépôt synchronisé avec ce projet (je vous demande son nom si plusieurs dépôts correspondent).
3. Activer GitHub Pages avec la source « GitHub Actions ».
4. Lancer la publication « Deploy Standard Notes editor to GitHub Pages » sur `main`, puis attendre qu'elle se termine.
5. Vérifier que l'adresse `…/ext.json` affiche bien le manifeste, puis vous donner l'adresse exacte à coller dans Standard Notes.

## Limites
- Chaque action sur votre compte GitHub vous sera d'abord soumise pour validation.
- Si le dépôt est privé et que votre offre GitHub ne permet pas Pages, je vous l'indiquerai : il faudra rendre le dépôt public.
- Je ne pourrai pas vérifier l'installation dans Standard Notes : c'est à vous de faire ce test.

## Détails techniques
- Connexion en appel ponctuel (`link_to_project: false`) ; aucun code modifié.
- `POST /repos/{owner}/{repo}/pages` avec `{"build_type":"workflow"}` (ou `PUT` si Pages existe déjà).
- `POST /repos/{owner}/{repo}/actions/workflows/deploy.yml/dispatches` avec `{"ref":"main"}`, puis suivi via `GET …/actions/runs`.
