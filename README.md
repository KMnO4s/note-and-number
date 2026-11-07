# Note And Number

Créer un éditeur Standard Notes permettant de réaliser des calculs mathématiques, comme le ferait le logiciel Numi (https://github.com/nikolaeu/numi)

This project was built with [Lovable](https://lovable.dev).

## Installer l'éditeur dans Standard Notes

Le manifeste de l'extension est le fichier [`ext.json`](./ext.json) à la racine de ce dépôt. Il pointe vers l'app publiée sur `https://note-and-number.lovable.app/`.

1. **Publier l'app** depuis Lovable (bouton *Publish*), sinon l'éditeur ne pourra pas se charger.
2. Récupérer l'URL du manifeste, au choix :
   - version servie par l'app : `https://note-and-number.lovable.app/ext.json`
   - version de ce dépôt : sur GitHub, ouvrir `ext.json` → bouton **Raw**, et copier l'URL (`https://raw.githubusercontent.com/<compte>/<depot>/main/ext.json`).
3. Dans Standard Notes : **Préférences → Général → Extensions avancées** (ou **Extensions**) → coller l'URL dans *Install extension* → **Installer**.
4. Ouvrir une note, cliquer sur le sélecteur d'éditeur et choisir **Numi Notes**.

> Si vous hébergez l'app ailleurs (Cloudflare, Vercel, Netlify…), remplacez `url` et `latest_url` dans `ext.json` par votre domaine.

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/edabb3a1-5d33-4f1b-8479-ddef3b9c7a00).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
