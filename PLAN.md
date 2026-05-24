# Korba — Plan de Développement

> Document vivant — mis à jour à chaque session.
> **Dernière mise à jour :** 2026-05-23

---

## Vision

Marketplace de livraison rapide pour l'Afrique francophone (Dakar, Abidjan, Douala).
4 rôles : Client · Vendeur · Agence · Livreur.
Paiement mobile (Orange Money + Wave) avec escrow.

---

## Contrainte absolue

> **Ne jamais modifier les JSX originaux** dans `screens/` (racine) ni dans `korba/frontend/src/screens/`.
> Toute logique passe par les **Containers** dans `korba/frontend/src/containers/`.

---

## Stack technique

| Couche | Techno | Port local |
|--------|--------|------------|
| Frontend | React 18 + TypeScript + Vite + PWA | 5173 |
| Backend | FastAPI Python 3.12 + SQLAlchemy async | 8000 |
| Base de données | PostgreSQL 16 + PostGIS 3.4 | 5432 |
| Cache / Queue | Redis 7 | 6379 |
| Temps réel | python-socketio + Redis pub/sub | (via 8000) |

---

## Architecture

```
korba/
├── frontend/
│   ├── src/
│   │   ├── screens/        ← COPIES des JSX (read-only, exports ajoutés)
│   │   ├── containers/     ← Wrappers avec données réelles (12 containers)
│   │   ├── api/            ← Clients HTTP (Axios + React Query)
│   │   ├── socket/         ← Socket.io hooks (useTracking, useNotifications)
│   │   ├── store/          ← Zustand (auth, cart, notifications)
│   │   └── router/         ← React Router v6 (23 routes, RequireAuth)
├── backend/
│   ├── app/
│   │   ├── api/v1/         ← 38 routes (auth, orders, products, couriers, payments...)
│   │   ├── models/         ← 14 modèles SQLAlchemy (ORM async)
│   │   ├── services/       ← Logique métier (state_machine, assignment, escrow, notifications)
│   │   └── socket_events.py ← Redis pub/sub → Socket.io
│   ├── alembic/            ← Migrations DB
│   └── tests/              ← 18 tests (state machine + scoring + auth)
├── docker-compose.yml
├── nginx.conf
└── .env.example
```

---

## Machine d'états commande (12 états)

```
EN_ATTENTE → [paiement confirmé] → A_PREPARER
A_PREPARER → [assignation auto] → LIVREUR_ASSIGNE
LIVREUR_ASSIGNE → [livreur accepte 12s] → EN_ROUTE_VERS_VENDEUR
EN_ROUTE_VERS_VENDEUR → [scan OTP vendeur] → EN_ROUTE_VERS_CLIENT
EN_ROUTE_VERS_CLIENT → [arrivée client] → LIVREE
LIVREE → [client valide] → VALIDEE → [auto] → TERMINEE (escrow libéré)
LIVREE → [client conteste] → LITIGE → REMBOURSEE | TERMINEE
Toute transition → ANNULEE possible (si autorisée)
```

---

## Algorithme assignation livreur (100 pts)

```
score = distance(×30) + rating/5(×20) + acceptance_rate(×15) + success_rate(×15)
      + is_favorite(×10) + vehicle_match(×5) + vendor_history(×5)
```
Timer Redis TTL **12 secondes** → cascade au livreur suivant si refus.

---

## Endpoints API (résumé)

| Méthode | URL | Description |
|---------|-----|-------------|
| POST | `/v1/auth/send-otp` | Envoie OTP SMS (AfricasTalking) |
| POST | `/v1/auth/verify-otp` | Vérifie OTP → JWT + refresh |
| POST | `/v1/auth/refresh` | Renouvelle access token |
| GET  | `/v1/auth/me` | Profil courant |
| GET/POST | `/v1/products` | Catalogue / Création produit |
| POST | `/v1/orders` | Créer commande |
| POST | `/v1/orders/{id}/pay` | Initier paiement escrow |
| POST | `/v1/orders/{id}/status` | Transition d'état |
| POST | `/v1/orders/{id}/validate` | Client valide → libère escrow |
| PATCH | `/v1/couriers/location` | Mise à jour GPS livreur |
| POST | `/v1/payments/webhook/orange` | Webhook Orange Money |
| POST | `/v1/payments/webhook/wave` | Webhook Wave |
| POST | `/v1/payments/orders/{id}/delivered` | Livreur marque livraison (OTP + photo) |

---

## Variables d'environnement

Copier `.env.example` → `.env` dans `korba/backend/` :

```bash
DATABASE_URL=postgresql+asyncpg://korba:korba@localhost:5432/korba
REDIS_URL=redis://localhost:6379/0
SECRET_KEY=<32-char random>
AFRICAS_TALKING_API_KEY=<key>
AFRICAS_TALKING_USERNAME=sandbox  # 'sandbox' pour les tests
ORANGE_MONEY_MERCHANT_KEY=<key>
WAVE_API_KEY=<key>
```

---

## État des phases

| Phase | Description | Statut |
|-------|-------------|--------|
| 0 | Setup monorepo (Vite + FastAPI + Docker) | ✅ Fait |
| 1 | Auth + Profils (JWT + OTP + refresh) | ✅ Fait |
| 2 | Catalogue + Vendeurs (CRUD produits) | ✅ Fait |
| 3 | Commandes + Paiements (escrow) | ✅ Fait |
| 4 | Assignation livreur + Temps réel (Socket.io) | ✅ Fait |
| 5 | Tracking GPS (PostGIS + pub/sub) | ✅ Fait |
| 6 | Notifications + Messagerie | ✅ Fait |
| 7 | Litiges + Notations + Admin | ✅ Fait |
| 8 | PWA + Déploiement (Hetzner CAX21) | 🔲 À faire |

---

## Lancer en développement local

### Option 1 — Frontend seul (UI sans backend)

```bash
cd korba/frontend
npm install
npm run dev
# → http://localhost:5173
```

### Option 2 — Stack complète

```bash
# 1. Démarrer Postgres + Redis
docker compose up postgres redis -d

# 2. Backend
cd korba/backend
pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:socket_app --reload --port 8000

# 3. Frontend (autre terminal)
cd korba/frontend
npm run dev
```

### Option 3 — Docker Compose complet

```bash
cp korba/.env.example korba/backend/.env  # Remplir les secrets
docker compose up --build
# → Frontend : http://localhost:3000
# → API      : http://localhost:8000
```

---

## Tests

```bash
cd korba/backend
pytest tests/ -v
# 18 tests : state machine + scoring algorithm + auth endpoints
```

---

## Prochaines tâches (Phase 8)

- [ ] Service Worker Workbox — offline-first catalogue
- [ ] Manifest PWA + install prompt natif
- [ ] SSL Nginx + Certbot (Hetzner CAX21)
- [ ] Prometheus + Grafana métriques (latence API + assignation)
- [ ] Tests E2E Playwright (parcours client→livreur→vendeur complet)
- [ ] Optimisation chunk size (code splitting React.lazy)
