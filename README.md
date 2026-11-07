# Note And Number

Créer un éditeur Standard Notes permettant de réaliser des calculs mathématiques, comme le ferait le logiciel Numi (https://github.com/nikolaeu/numi)

This project was built with [Lovable](https://lovable.dev).

## Installer l'éditeur dans Standard Notes

La distribution suit le modèle de [Chrono Notes Plus](https://github.com/KMnO4s/chrono-notes-plus) : application sur **GitHub Pages**, manifeste public `ext.json` et publication automatique avec **GitHub Actions**. Aucune publication sur Lovable n’est nécessaire.

### 1. Activer GitHub Pages

1. Dans votre dépôt GitHub, ouvrez **Settings → Pages**.
2. Sous **Build and deployment → Source**, choisissez **GitHub Actions**.
3. Dans **Actions**, choisissez **Deploy Standard Notes editor to GitHub Pages**, puis **Run workflow** sur `main`. Chaque changement sur `main` relance aussi la publication.
4. Attendez que `build` et `deploy` soient verts. L’adresse publiée apparaît dans **Settings → Pages** et dans le résultat de la publication.

Si les workflows sont désactivés, activez-les dans **Settings → Actions → General**. Pour un dépôt privé, la disponibilité de Pages dépend de votre offre GitHub ; l’éditeur doit être accessible publiquement pour Standard Notes.

### 2. Importer l’extension

Pour une page publiée à `https://votrecompte.github.io/votredepot/`, l’URL d’installation est :

```text
https://votrecompte.github.io/votredepot/ext.json
```

1. Ouvrez cette adresse dans votre navigateur : elle doit afficher le manifeste JSON.
2. Dans Standard Notes, ouvrez **Settings / Préférences → Extensions → Import Extension** (selon la version : **Général → Extensions avancées**).
3. Collez l’adresse du manifeste et cliquez sur **Install / Installer**.
4. Ouvrez une note et choisissez **Numi Notes** dans le sélecteur d’éditeur.

Utilisez **l’adresse GitHub Pages du manifeste**, pas l’adresse du dépôt ni son fichier Raw. L’installation d’éditeurs personnalisés dépend de votre version et de votre offre Standard Notes.

### Manifeste et chemins de publication

[`ext.json`](./ext.json) à la racine est le modèle du manifeste. Après la compilation, [`scripts/pages-manifest.mjs`](./scripts/pages-manifest.mjs) génère `dist/client/ext.json` avec l’adresse réelle fournie par GitHub Pages : `url` pointe vers l’éditeur et `latest_url` vers son manifeste. Le compte, le nom du dépôt et un éventuel domaine personnalisé sont pris en compte automatiquement ; **ne collez pas les adresses d’exemple du modèle dans Standard Notes**.

Le workflow adapte également les chemins au sous-dossier du dépôt et publie uniquement les fichiers statiques. Les calculs et l’intégration Standard Notes fonctionnent dans le navigateur.

`download_url` reste vide : aucune archive `latest.zip` n’est fournie, et la prise en charge hors ligne de Standard Notes n’est pas promise. L’installation réelle dans Standard Notes reste à vérifier après la première publication.

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
