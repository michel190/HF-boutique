# HF Boutique

Site de HF Boutique (Homme & Femme) : prêt-à-porter moderne, chaussures et accessoires de mode à Lomé.
Les commandes se font sur WhatsApp au +228 71 65 45 15, avec un message déjà rédigé pour chaque article.

Site en ligne : https://michel190.github.io/HF-boutique/

## Modifier le contenu

Tout se modifie dans `donnees.js` : coordonnées, horaires, articles, coloris, tailles et prix.
Les explications sont écrites dans le fichier, en français.

Sur GitHub, ouvrez `donnees.js`, cliquez sur le crayon (« Edit this file »), faites vos changements puis cliquez sur « Commit changes ». Le site se met à jour tout seul en une à deux minutes.

## Ajouter des photos

1. Ouvrez le dossier `images/`, puis « Add file » › « Upload files ». Préférez des photos verticales d'environ 1000 px de large et de moins de 200 Ko.
2. Dans `donnees.js`, indiquez le chemin de la photo dans l'article : `photo: "images/robe-soiree.jpg"`.

La photo remplace le dessin de l'article. C'est le même principe pour la grande photo d'accueil (`photos.accueil`) et les photos de la boutique (`photos.boutique`).

## À compléter

- Les articles du catalogue sont des exemples construits sur les rayons de la boutique : remplacez-les par les vrais articles.
- Les horaires sont des exemples, affichés comme « indicatifs ». Une fois les vrais horaires saisis, mettez `horairesAConfirmer: false` : le site affiche alors « Ouvert » ou « Fermé » en direct.
- L'adresse écrite (`adresse`) est vide : ajoutez le quartier et un repère. La position GPS de la boutique est déjà sur la carte (`lienCarte`).

## Fichiers

| Fichier | Rôle |
| --- | --- |
| `index.html` | Structure de la page et dessins des articles |
| `style.css` | Apparence |
| `app.js` | Fonctionnement : filtres, recherche, sélection, messages WhatsApp |
| `donnees.js` | Contenu à modifier |
| `fonts/inter.woff2` | Police Inter (licence SIL Open Font License, voir `fonts/LICENSE-Inter.txt`) |
| `images/` | Vos photos |

Le site est fait de fichiers statiques : il n'a besoin ni de serveur ni de base de données.
