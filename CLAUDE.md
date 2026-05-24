# CLAUDE.md — Korba Frontend

> Fichier lu automatiquement par Claude Code à chaque session.
> Contient l'architecture, les règles absolues, l'état du projet et les conventions pour travailler sur Korba sans erreur.

---

## ÉTAT DU PROJET — Mise à jour : 2026-05-24

**Korba** est une marketplace de livraison rapide (Dakar, Sénégal) — 4 rôles : client, vendeur, agence, livreur.

### Avancement
- ✅ Frontend React 18 + TypeScript + Vite complet (proto → app interactive)
- ✅ 27 containers standalone couvrant tous les écrans
- ✅ Auth Zustand persistée (mode démo fonctionnel, 0 bug navigation)
- ✅ Panier Zustand connecté (addItem, checkout, badge AppLayout)
- ✅ Bottom nav bar mobile (4 onglets par rôle, couleurs rôle)
- ✅ Messagerie temps réel simulée (MessagingContainer partagé)
- ✅ Machine d'états commande côté UI (vendeur + livreur)
- ⏳ Backend FastAPI — modèles créés, endpoints partiels (pas encore branché au frontend)
- ⏳ Paiements réels Orange Money / Wave — non intégrés
- ⏳ Socket.io temps réel — non intégré
- ⏳ OTP SMS AfricasTalking — non intégré

---

## RÈGLE ABSOLUE N°1 — NE JAMAIS MODIFIER LES SCREENS

```
korba/frontend/src/screens/   ← FICHIERS READ-ONLY, NE JAMAIS ÉDITER
  client.jsx
  vendor.jsx
  agency.jsx
  driver.jsx
  shared.jsx
  components.jsx
```

Ces fichiers sont des prototypes UI purs (JSX via CDN React / Babel). Ils servent de **référence design uniquement**.

Toute nouvelle fonctionnalité passe par un **Container** dans `src/containers/`.

---

## RÈGLE ABSOLUE N°2 — CONTAINERS STANDALONE

Chaque container est **100% autonome** : il n'importe JAMAIS depuis `../screens/`. Il utilise ses propres JSX inline avec les design tokens Korba.

```typescript
// INTERDIT
import { ClientHome } from '../screens/client.jsx'

// CORRECT — container standalone
export function ClientHomeContainer() {
  const navigate = useNavigate()
  // ... JSX complet avec styles inline
}
```

---

## STACK TECHNIQUE

| Couche | Techno | Notes |
|--------|--------|-------|
| Frontend | React 18 + TypeScript + Vite | PWA-ready |
| Routing | React Router v6 | Routes par rôle + RequireAuth |
| State auth | Zustand + persist | `store/auth.ts` → `korba-auth` localStorage |
| State panier | Zustand + persist | `store/cart.ts` → `korba-cart` localStorage |
| Styles | CSS inline (design tokens) | Pas de Tailwind, pas de CSS modules |
| Backend | FastAPI + Python 3.12 | `korba/backend/` — partiellement implémenté |
| DB | SQLite (dev) → PostgreSQL (prod) | Alembic migrations |
| Cache | Redis (dev simulé sans serveur) | `dev_redis.py` |

### Lancer le frontend
```bash
cd korba/frontend
npm run dev   # → http://localhost:3001
```

### TypeScript check
```bash
npx tsc --noEmit   # doit retourner 0 erreur
```

---

## DESIGN TOKENS — COULEURS PAR RÔLE

```
Client  → #E87B36  (orange)    bg: #FFF1E2
Vendor  → #6E58F1  (violet)    bg: #F0EDFF
Agency  → #1F8B5B  (vert)      bg: #E0F2EC
Driver  → #5BA4F0  (bleu)      bg: #E0EEFF

Texte principal : #1a1a1a
Texte secondaire : #888
Fond global : #F6F2EF
Radius cartes : 18-24px
Font : Switzer, system-ui, sans-serif
```

Toujours utiliser ces couleurs pour les boutons, badges, icônes actives. Ne jamais hardcoder d'autres couleurs primaires.

---

## ARCHITECTURE FICHIERS FRONTEND

```
korba/frontend/src/
├── containers/          ← Tout le code interactif (27 fichiers)
│   ├── AuthContainer.tsx
│   ├── Client*.tsx      (7 containers)
│   ├── Vendor*.tsx      (4 containers)
│   ├── Agency*.tsx      (6 containers)
│   ├── Driver*.tsx      (5 containers)
│   ├── MessagingContainer.tsx   (partagé tous rôles)
│   ├── NotificationsContainer.tsx
│   ├── ProfileContainer.tsx
│   └── DisputeContainer.tsx
├── layouts/
│   └── AppLayout.tsx    ← Header + bottom nav bar + badge panier
├── router/
│   └── index.tsx        ← Toutes les routes (RequireAuth par rôle)
├── store/
│   ├── auth.ts          ← Zustand auth (persist korba-auth)
│   └── cart.ts          ← Zustand panier (persist korba-cart)
└── screens/             ← READ-ONLY prototypes JSX
```

---

## ROUTES COMPLÈTES

### Client (`/client/*`)
| Route | Container |
|-------|-----------|
| `/client` | ClientHomeContainer |
| `/client/catalogue` | ClientCatalogueContainer |
| `/client/products/:productId` | ClientProductDetailContainer |
| `/client/payment-choice/:productId` | ClientPaymentChoiceContainer |
| `/client/checkout` | ClientCheckoutContainer |
| `/client/orders` | ClientOrdersContainer |
| `/client/orders/:orderId/tracking` | ClientTrackingContainer |
| `/client/orders/:orderId/dispute` | DisputeContainer |
| `/client/orders/:orderId/messaging` | MessagingContainer |
| `/client/messages/:conversationId` | MessagingContainer |
| `/client/notifications` | NotificationsContainer |
| `/client/profile` | ProfileContainer |

### Vendeur (`/vendor/*`)
| Route | Container |
|-------|-----------|
| `/vendor` | VendorHomeContainer |
| `/vendor/catalogue` | VendorCatalogueContainer |
| `/vendor/orders/:orderId` | VendorOrderDetailContainer |
| `/vendor/partners` | VendorPartnersContainer |
| `/vendor/messages/:conversationId` | MessagingContainer |
| `/vendor/notifications` | NotificationsContainer |
| `/vendor/profile` | ProfileContainer |

### Agence (`/agency/*`)
| Route | Container |
|-------|-----------|
| `/agency` | AgencyDashboardContainer |
| `/agency/team` | AgencyTeamZonesContainer |
| `/agency/deliveries` | AgencyDeliveryHistoryContainer |
| `/agency/drivers` | AgencyDriversContainer |
| `/agency/ratings` | AgencyRatingsContainer |
| `/agency/revenue` | AgencyRevenueContainer |
| `/agency/notifications` | NotificationsContainer |
| `/agency/profile` | ProfileContainer |

### Livreur (`/driver/*`)
| Route | Container |
|-------|-----------|
| `/driver` | DriverHomeContainer |
| `/driver/orders/:orderId/navigation` | DriverNavigationContainer |
| `/driver/orders/:orderId/proof` | DriverProofContainer |
| `/driver/history` | DriverHistoryContainer |
| `/driver/earnings` | DriverEarningsContainer |
| `/driver/messages/:conversationId` | MessagingContainer |
| `/driver/notifications` | NotificationsContainer |
| `/driver/profile` | ProfileContainer |

---

## SYSTÈME D'AUTH

### Mode démo (développement)
```typescript
// store/auth.ts
loginAsDemo(role: 'client' | 'vendor' | 'agency' | 'driver', name: string)
// → isAuthenticated: true, isDemo: true
// → persisté dans localStorage 'korba-auth'
// → effacé au rechargement de page (main.tsx nettoie les sessions demo)
```

### RequireAuth (router/index.tsx)
- Vérifie `isAuthenticated` depuis Zustand
- Redirige vers `/login` si non authentifié
- Redirige vers `/${role}` si mauvais rôle
- `partialize` persiste `{ isAuthenticated, isDemo, role, name, userId, refreshToken }`

### Bug historique résolu
Le `partialize` écrivait `isAuthenticated: false` pour les sessions démo → navigation supprimait l'auth. Corrigé : on persiste `isAuthenticated: true` quand `isDemo`.

---

## PANIER (useCartStore)

```typescript
import { useCartStore } from '@/store/cart'

// Ajouter un article
const addItem = useCartStore(s => s.addItem)
addItem({ productId, vendorId, name, price_centimes, quantity, image? })

// Lire les articles
const items = useCartStore(s => s.items)
const total = useCartStore(s => s.total) // total en centimes

// Vider
const clear = useCartStore(s => s.clear)
```

**Règle** : si les articles proviennent d'un autre vendeur, le panier est réinitialisé automatiquement.

---

## MESSAGERIE (MessagingContainer)

Utilisé par tous les rôles. Conversations clés disponibles :

| conversationId | Contexte |
|----------------|---------|
| `boutique` | Client → Pharmacie Liberté 6 |
| `vendor-boutique` | Vendeur → Cliente Fatou |
| `driver` | Client → Livreur Cheikh |
| `DEL-881`, `DEL-879` | Livreur → Client (par ID livraison) |
| `agency-cheikh`, `agency-omar` | Agence → Livreur |
| `demo` | Support Korba (fallback) |

Pour ajouter une conversation : ajouter une entrée dans `DEMO_CONVERSATIONS` dans `MessagingContainer.tsx`.

---

## APPLAYOUT — BARRE NAVIGATION

```typescript
// layouts/AppLayout.tsx
// Header sticky : logo + badge rôle + 🛒 (client) + 🔔 + ⇄ Rôles
// Contenu : padding-bottom 100px pour éviter overlap bottom bar
// Bottom nav : 4 onglets par rôle, couleur cfg.color, indicateur actif
```

Badge panier 🛒 : visible uniquement pour `role === 'client'`, compteur rouge si `cartCount > 0`.

---

## PATTERN POUR AJOUTER UN NOUVEAU CONTAINER

1. Créer `src/containers/NomContainer.tsx` standalone (pas d'import screens)
2. Importer `useNavigate` et `useAuthStore` si nécessaire
3. Utiliser les couleurs du rôle via `useAuthStore().role`
4. Ajouter la route dans `src/router/index.tsx`
5. Ajouter un lien de navigation dans le container parent ou AppLayout
6. Lancer `npx tsc --noEmit` → 0 erreur obligatoire avant commit

### Template minimal
```typescript
import { useNavigate } from 'react-router-dom'

export function MonContainer() {
  const navigate = useNavigate()

  return (
    <div style={{ width: '100%', maxWidth: 440, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <button onClick={() => navigate(-1)} style={{ width: 36, height: 36, borderRadius: 999, border: 'none', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>‹</button>
        <div style={{ fontWeight: 700, fontSize: 16, color: '#1a1a1a' }}>Titre</div>
      </div>
      {/* contenu */}
    </div>
  )
}
```

---

## MACHINE D'ÉTATS COMMANDE

```
EN_ATTENTE → A_PREPARER → LIVREUR_ASSIGNE → EN_ROUTE_VERS_VENDEUR
  → EN_ROUTE_VERS_CLIENT → LIVREE → VALIDEE → TERMINEE
                                  ↘ LITIGE → REMBOURSEE / TERMINEE
```

Implémenté côté UI dans :
- `VendorOrderDetailContainer` (vendeur fait avancer le statut)
- `DriverNavigationContainer` (livreur : 4 étapes, OTP vendeur = "4729")
- `ClientTrackingContainer` (client voit le statut + valide)
- `DisputeContainer` (client ouvre un litige)

---

## RÈGLES GIT

- `npx tsc --noEmit` doit passer avant chaque commit
- Messages de commit en français, préfixe `feat:` / `fix:` / `refactor:`
- Toujours committer et pusher après chaque session de travail importante
- Ne jamais committer `korba_dev.db` (base SQLite locale)

---

## PROCHAINES ÉTAPES TECHNIQUES

### Priorité 1 — Backend branché
- Remplacer les données mock dans les containers par des appels API réels
- `api/orders.ts`, `api/products.ts`, `api/auth.ts` avec React Query
- Auth OTP via AfricasTalking

### Priorité 2 — Temps réel
- Socket.io client dans `socket/socket.ts`
- Hook `useTracking(orderId)` pour la carte GPS du livreur
- Événements : `location:update`, `order:status_changed`, `assignment:new`

### Priorité 3 — Paiements
- Orange Money / Wave escrow
- Libération fonds après validation client

### Priorité 4 — PWA + déploiement
- Service Worker Workbox (catalogue offline)
- Docker Compose : postgres + redis + api + frontend + nginx
- Hetzner CAX21

---

## DONNÉES MOCK — IDENTIFIANTS DE DÉMO

| Rôle | Nom | ID commande / livraison |
|------|-----|------------------------|
| Client | Amina Diallo | orderId: `demo-order` |
| Vendeur | Pharmacie Liberté 6 | orderId: `KB-2841`, `KB-2839`, `KB-2835` |
| Agence | Rapid Dakar Express | driverId: `DRV-001` à `DRV-004` |
| Livreur | Cheikh Ndao | deliveryId: `DEL-881`, `DEL-879` |
| OTP vendeur | — | `4729` |

---

*Sources architecturales : PLAN.md (phases 0-8), store/auth.ts, router/index.tsx*
