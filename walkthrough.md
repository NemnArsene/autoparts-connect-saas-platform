# 🚀 Walkthrough : Migration Monorepo Turborepo & App Mobile Expo

Félicitations ! Nous avons accompli la transformation majeure du prototype web React en un écosystème cross-platform (Web + Mobile) propulsé par un Monorepo Turborepo.

Voici un aperçu de l'architecture mise en place et des fonctionnalités développées.

## 🏗️ L'Architecture Monorepo

Le projet est désormais découpé de manière granulaire, permettant une réutilisation maximale du code.

### Applications (`apps/`)
- `apps/web` : L'application React + Vite originale. Elle utilise maintenant les paquets partagés de l'espace de travail.
- `apps/mobile` : La nouvelle application React Native propulsée par Expo et Expo Router.
- `apps/api` : La coquille vide (scaffold) pour le futur backend NestJS.

### Packages Partagés (`packages/`)
- `@autoparts/models` : Types TypeScript (Part, Vehicle, Reservation, etc.), données fictives (seeds), et utilitaires.
- `@autoparts/hooks` : **Le cœur de la logique**. Tous les *stores* Zustand (useAuth, useCart, useFavorites, etc.) ont été extraits ici. 
- `@autoparts/ui-core` : Tokens de design (couleurs, espacements) partagés.
- `@autoparts/validators` : Schémas de validation Zod.
- `@autoparts/services` : Interfaces d'accès aux API (mocks implémentés pour l'instant).

> [!TIP]
> **Le secret de la portabilité** : Le paquet `@autoparts/hooks` utilise un `AppStorageAdapter` dynamique. Sur le Web, il utilise `localStorage`. Sur mobile, il injecte `AsyncStorage`. La même logique métier tourne donc partout sans modification !

---

## 📱 L'Application Mobile (React Native + Expo)

Nous avons recréé l'expérience utilisateur complète du web sur l'application mobile en utilisant **React Native Paper** (Material Design 3).

### 1. Structure de Navigation
Le routage est géré de manière déclarative par **Expo Router**.
- **Tabs (Barre de navigation inférieure)** : Permet de basculer rapidement entre l'Accueil, la Recherche, les Commandes (Réservations) et le Profil.
- **Stack** : Les écrans de détail (ex: `PartDetailScreen`, `CartScreen`, `CheckoutScreen`) s'empilent par-dessus les onglets.

### 2. Écrans Principaux Implémentés

* **Accueil (`HomeScreen`)** : 
  Message d'accueil dynamique, section de recherche rapide, widget du véhicule, et carrousels horizontaux pour les "Nouveautés" et les "Tendances".
* **Recherche (`SearchScreen`)** :
  Barre de recherche performante couplée à un panneau de filtres (Marques, Catégories) rétractable. Les résultats s'affichent sous forme de grille adaptative.
* **Détail de la Pièce (`PartDetailScreen`)** :
  Vue immersive affichant la pièce, le prix (avec promotions), les détails de compatibilité, et des actions rapides (Ajout aux Favoris, Panier, Commander).
* **Panier & Checkout (`CartScreen`, `CheckoutScreen`)** :
  Gestion des quantités, retrait d'articles, résumé du sous-total. Le Checkout confirme le mode de retrait (en magasin) et le paiement (à la livraison).
* **Réservations (`ReservationsScreen`)** :
  Liste de l'historique des réservations avec des badges de statuts codés par couleur.
* **Profil (`ProfileScreen`)** :
  Regroupement des paramètres utilisateur et accès aux sous-menus (Véhicules, Historique, Support) ainsi qu'au bouton de déconnexion.
* **Notifications (`NotificationsScreen`)** :
  Liste des alertes (promos, infos systèmes, statuts de commande) accessible depuis l'icône cloche de l'accueil.

### 3. Composants Partagés
- `PartCard` : Un composant mobile de carte produit réutilisé dans l'accueil, la recherche et les favoris.

---

## 🛠️ Prochaines Étapes (Phase 5)

Maintenant que l'UI complète est en place, les prochaines évolutions se concentreront sur la consolidation et la connexion aux vraies données :
1. **NestJS** : Connecter l'API NestJS à une base de données MongoDB.
2. **Swap de Service** : Remplacer les "mocks" dans `@autoparts/services` par de vrais appels Axios/fetch vers l'API.
3. **EAS Build** : Compiler l'application mobile pour les stores iOS et Android.

🚀 **La plateforme AutoParts Connect est désormais taillée pour l'échelle !**
