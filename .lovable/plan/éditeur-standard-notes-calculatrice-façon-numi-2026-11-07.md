# Éditeur Standard Notes « calculatrice » façon Numi

## Objectif
Un éditeur personnalisé pour Standard Notes : à gauche, on tape du texte librement ; à droite, chaque ligne affiche son résultat calculé en temps réel, comme Numi. Le contenu est enregistré dans la note Standard Notes.

## Ce que l'utilisateur pourra écrire
- Arithmétique : `12 * (3 + 4)`, `2^10`, `sqrt(16)`, `sin(pi/2)`
- Variables : `loyer = 850 €` puis `loyer * 12`
- Références : `prev` (ligne précédente), `sum` / `total` (somme du bloc au-dessus)
- Pourcentages : `20% de 150`, `150 + 20%`, `150 - 10%`
- Unités et conversions : `5 km en miles`, `3 h 20 min en min`, `100 °C en °F`, `2 Go en Mo`
- Devises (taux statiques ajustables) : `100 € en $`
- Dates simples : `aujourd'hui + 3 semaines`
- Commentaires : lignes commençant par `#` ou `//`, en-têtes ignorés
- Mots-clés français et anglais (`en`/`in`, `de`/`of`, `plus`, `moins`, `fois`)

## Interface
- Deux colonnes alignées ligne à ligne, police monospace, thème sombre/clair suivant Standard Notes
- Coloration : nombres, unités, variables, commentaires
- Clic sur un résultat = copie dans le presse-papiers
- Total de la note en bas

## Intégration Standard Notes
- Communication avec l'application via la bibliothèque officielle « component relay » : lecture du texte de la note, sauvegarde automatique à chaque modification
- Fichier d'installation `ext.json` servi par l'app : après publication, on colle son lien dans Standard Notes → Préférences → Général → Avancé → Installer une extension
- Hors Standard Notes (aperçu Lovable), l'éditeur fonctionne en mode démo avec sauvegarde locale du navigateur

## Détails techniques
- Page unique sur `/` ; `public/ext.json` (identifier, `area: "editor-editor"`, URL de l'app)
- Moteur de calcul : `mathjs` (expressions, unités) + pré-analyseur maison pour variables, `prev`/`sum`, pourcentages, mots-clés FR/EN, devises et dates
- `@standardnotes/component-relay` chargé côté navigateur uniquement ; texte brut stocké dans `note.content.text`
- Éditeur : textarea + calque de coloration synchronisé (pas de dépendance lourde)
- Tests Vitest du moteur (pourcentages, conversions, variables, sum)
