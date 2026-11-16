# Mettre en ligne le site TEA sur Infomaniak

Le dossier `web/` contient tout le site, prêt à être déposé tel quel sur l'hébergement.

## 1. Avant de commencer
- Un **hébergement Web** Infomaniak (offre « Hébergement Web » ou « Web & Mail »).
- Le domaine **tea-rdc.com** relié à cet hébergement (Manager → Hébergement → Sites → Ajouter un site).
- Les adresses **info@tea-rdc.com**, **rh@tea-rdc.com** et **no-reply@tea-rdc.com** créées dans le Service Mail Infomaniak. L'adresse no-reply sert d'expéditeur aux messages du formulaire ; elle doit exister sur le domaine pour que les e-mails ne soient pas classés en spam.

## 2. Déposer les fichiers
**Avec le Gestionnaire FTP du Manager (le plus simple)**
1. Manager Infomaniak → Hébergement → votre hébergement → **FTP / SSH** → **Gestionnaire FTP**.
2. Ouvrez le dossier du site (par défaut `/sites/tea-rdc.com/`).
3. Supprimez la page d'attente d'Infomaniak si elle existe (`index.html` ou `index.php` par défaut).
4. Déposez **tout le contenu** du dossier `web/` (pas le dossier lui-même) : les pages `.html`, `site.css`, `site.js`, `contact.php`, `.htaccess`, `robots.txt`, `sitemap.xml`, `favicon.ico` et le dossier `img/`.

**Avec FileZilla**
1. Créez un compte FTP dans Manager → FTP / SSH (hôte du type `xxxx.ftp.infomaniak.com`).
2. Connectez-vous en **SFTP** (port 22) ou FTP (port 21).
3. Glissez le contenu de `web/` dans `/sites/tea-rdc.com/`.
4. Le fichier `.htaccess` commence par un point : dans FileZilla, activez **Serveur → Forcer l'affichage des fichiers cachés** pour vérifier qu'il a bien été envoyé.

## 3. Activer le HTTPS
Manager → Hébergement → Sites → tea-rdc.com → **Certificats SSL** → installer le certificat gratuit **Let's Encrypt** (cocher `tea-rdc.com` et `www.tea-rdc.com`).
Le fichier `.htaccess` redirige ensuite automatiquement tout le trafic vers `https://tea-rdc.com`.

## 4. Vérifier
- `https://tea-rdc.com` affiche l'accueil, `https://tea-rdc.com/en-index.html` la version anglaise.
- `https://www.tea-rdc.com` redirige vers `https://tea-rdc.com`.
- Une adresse inexistante (`https://tea-rdc.com/test`) affiche la page « Page introuvable ».
- **Formulaire** : envoyez un message test depuis la page Contact. Il arrive sur info@tea-rdc.com ; une « Candidature spontanée » arrive sur rh@tea-rdc.com. Le bouton « Répondre » de votre messagerie répond directement au visiteur.

## 5. Référencement Google
1. Ouvrez Google Search Console, ajoutez la propriété `tea-rdc.com` (vérification par enregistrement DNS dans le Manager → Domaine → Zone DNS).
2. Envoyez le sitemap : `https://tea-rdc.com/sitemap.xml`.

## Contenu du dossier web/
| Fichier | Rôle |
|---|---|
| `index.html`, `*.html` | Pages en français |
| `en-*.html` | Pages en anglais |
| `site.css`, `site.js` | Styles et animations communs |
| `contact.php` | Envoi du formulaire par e-mail (PHP) |
| `.htaccess` | HTTPS, redirections, cache, sécurité, page 404 |
| `404.html` | Page « introuvable » |
| `robots.txt`, `sitemap.xml` | Référencement |
| `favicon.ico`, `img/` | Icône du site, logo et photos |

## Modifier les adresses de réception
Ouvrez `contact.php` et changez les lignes `DEST_GENERAL`, `DEST_RH` et `EXPEDITEUR` en haut du fichier.
