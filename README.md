# SHOP 4ème partie

l'objectif sera d'avoir un fichier users.json contenants les données des utilisateurs qui auront créé un compte.

un objet user aura les propriétés suivantes :
- id (Number) Auto-incrémenté
- email (String)
- password (String) qui sera `hashé`
- signup_date (Date)

## modules supplémentaires

Pour le password, il va falloir le `hashé`.
Pour ça, on va utilisé le module `bcrypt`, qui possède une méthode de hashage, et de comparaison, car une fois hashé ça sera une chaîne de caractères et de chiffres n'ayant plus rien à voir avec son état d'origine.
https://www.npmjs.com/package/bcrypt

```
npm install bcrypt
```
ne pas oublier de l'importer !!
ainsi que le module `fs` pour lire et écrire dans le fichier json

### étapes

#### création d'un compte

Sur la route POST :

- déclarer un objet pour l'utilisateur souhaitant créer un compte
- y créer les propriétés requises (id, email, pwd, date)

> trouver un moyen pour que l'id soit unique
> hasher le password
```js
bcrypt.hash(req.body.password, 10); // ou bcrypt.hashSync
```

- `lire` le fichier users.json
- ... subtilité ici je vous laisse brain un peu :p
- `écrire` dans le fichier user.json les données récupérés + le nouvel utilisateur


#### connexion au compte

Sur la route POST :

- vérifier si l'utilisateur a bien un compte
- si c'est le cas, on peut comparer les passwords
```js
    bcrypt.compare(req.body.password, user.password, (err, same) => { /*...*/}); // bcrypt.compareSync
```
- si les passwords sont identiques, on peut procéder à la connexion
- mettre à jour les variables de session

> NE PAS HÉSITER A AJOUTER DES CONTRÔLES DE VERIFICATION ET REDIRECTION SUR LE FORMULAIRE AVEC UN MESSAGE, LA QUERY DANS L'URL POURRAIT ÊTRE UTILE

> VALABLE POUR LES ROUTES POST DE CONNEXION ET CREATION

## HAVE FUN