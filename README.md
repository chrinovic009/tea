# Technical Engineering Appointment (TEA) — site web

Site vitrine statique (HTML/CSS/JS), en français et en anglais.

- `index.html` : accueil (français) — `en-index.html` : accueil (anglais)
- `site.css`, `site.js` : styles et animations partagés
- `img/` : photos et logo

## Mise en ligne avec GitHub Pages
1. Créer un dépôt (par exemple `tea`) et y déposer tout le contenu de ce dossier.
2. Dans le dépôt : **Settings → Pages → Build and deployment → Source : Deploy from a branch**, branche `main`, dossier `/ (root)`.
3. Le site est publié à l'adresse `https://<utilisateur>.github.io/tea/`.
4. Pour utiliser `tea-rdc.com` : ajouter le domaine dans **Settings → Pages → Custom domain**, puis créer chez le registraire un enregistrement CNAME `www` → `<utilisateur>.github.io`.

Le formulaire de contact affiche un message de confirmation mais n'envoie rien : il faut le relier à un service d'envoi (Formspree, par exemple) avant la mise en ligne.
