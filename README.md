# Mahalaxmi Dudh Kendra — V2

A single-center MERN storefront for Naigaon, Dadar East, Mumbai. React and Vite frontend; Express/Node API; MongoDB/Mongoose persistence. The hosted review site runs the explicit, isolated demo mode. Run this source with MongoDB to enable real accounts and orders.

## V2 additions

- New responsive blue-and-white layout with non-overlapping hero imagery, larger text, wrapping controls and reduced-motion support.
- React Router URL navigation, reusable components, and Bootstrap registration with JavaScript validation.
- Admin product/SKU create, edit, delete, image upload and atomic stock receipts. Products with order history cannot be deleted.
- Web lab route, Node.js lab scripts, Postman collection and deployment configuration.
- See `docs/EXPERIMENTS.txt` for the experiment-by-experiment mapping and `docs/COMPLETE_SETUP_V2.txt` for beginner instructions.

## What is included

- Emerald and milk-white responsive storefront, real brand pack imagery, search, category filtering, quantity controls and persistent bag.
- Customer registration/login and separately selectable admin login. Admin privilege is granted only by the seed script, never through registration.
- Cash-on-delivery checkout with server-calculated prices and a 5 km straight-line delivery radius. Coordinates must be supplied and independently checked by the server. Browser location is not proof of a street address; staff should check the address before confirming.
- Atomic MongoDB transactions reserve stock and create the order together. Cancellation before dispatch restores stock once. Delivery stages cannot be skipped or reversed.
- Customer order history, quick reordering, admin orders, product creation, image uploads, price/stock editing, and status refresh every 30 seconds.
- Milk schedule requests and wholesale enquiries. Admins confirm/manage these; customers can pause/close their requests. These are manually fulfilled arrangements, not automatic billing or a recurring order scheduler.
- HttpOnly signed session cookies, hashed passwords, role checks, request origin checks, rate limits, validated inputs, and security headers.

## USPs designed for one local MSME

1. **Morning milk planner** — households request their preferred milk, quantity and schedule, with pause/close controls.
2. **Retailer supply desk** — kiranas, cafés and tea stalls request bulk quantities and negotiated supply schedules.
3. **Everyday bag + repeat order** — milk, biscuits, snacks and beverages together, then repeat a previous order.
4. **Honest local delivery** — 5 km coverage and store-controlled fulfilment rather than an unsupported ten-minute promise.
5. **Direct store operations** — customer orders, inventory, enquiries and delivery stages in one admin view.

## Quick start: real MERN application

Requires Node.js 22+ and MongoDB running as a replica set (transactions are essential). The included Docker Compose file creates a local single-node replica set; it binds MongoDB only to localhost. Alternatively use an existing authenticated MongoDB replica set.

```bash
npm ci
cp .env.example .env
```

On Windows PowerShell use `Copy-Item .env.example .env` instead of `cp`.

Edit `.env`:

- `MONGODB_URI`: the local URI from the example, or your database connection string.
- `JWT_SECRET`: generate using `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`.
- `ADMIN_EMAIL` and `ADMIN_PASSWORD`: your own admin credentials; use at least 12 password characters.
- `STORE_LAT` and `STORE_LNG`: the verified coordinates of the actual shop. Live server startup fails when they are absent.
- Keep `VITE_API_URL=/` to enable the same-origin real API, and `APP_ORIGIN=http://localhost:3000` for local use.

```bash
docker compose up -d --wait
npm run seed
npm run build
npm start
```

Open **http://localhost:3000**. Create a customer account or log in with the admin credentials configured above. The seed command preserves existing products and accounts; it will not reset inventory or passwords. Keep `.env` private.

## Frontend preview only

If no `.env` / `VITE_API_URL` is configured, `npm run dev` starts the demo on port 4173. It uses sample prices and browser-local data, with explicit customer/admin demo buttons. In checkout, use “sample nearby location” to test from outside Mumbai. No real credentials, order transmission, payment, or delivery occurs in demo mode. Do not enter real personal details into a shared demo. Clear site storage to reset it.

To run the real frontend in development, build and use the Express server as above. The default Vite dev server does not proxy the API.

## Production deployment

The hosted review link contains the React demo only; the Express server and MongoDB are delivered here as runnable source. Deploy the complete source to a Node-capable host with a MongoDB replica set. Run `npm ci && npm run build`, then `npm start`. Set `VITE_API_URL=/` **during build**, `NODE_ENV=production`, `APP_ORIGIN` to the exact HTTPS origin, and all database/store/session secrets. Set `UPLOAD_DIR` to a persistent writable disk path to retain uploaded images. Serve frontend and API from the same origin. HTTPS is required for secure cookies and browser geolocation.

Set up backups and restrict database access. If deploying behind a reverse proxy, configure Express `trust proxy` to the actual known proxy topology before relying on IP rate limits. Do not use unrestricted `trust proxy=true` without checking the host configuration.

Before accepting real customers, the owner must confirm the exact store pin/address, opening hours, stock, pack sizes, selling prices, delivery charge (sample: ₹25, free at ₹299), delivery staffing, cancellation policy, and contact details. No business phone number or guaranteed delivery time was invented.

Online payment, automated SMS/WhatsApp, a rider app, GPS rider tracking, password recovery/email verification, invoicing, automated recurring deliveries and payment subscriptions are not connected. The included payment method is cash on delivery; schedule and wholesale requests are store-managed.

## Tests and validation

```bash
npm test
npm run build
node --check server/index.js
```

Four domain tests cover distance/coordinate validation, invalid cart quantities/duplicates, order-state transitions and delivery-fee boundaries. Production build and server syntax checks passed during creation. A real MongoDB connection was not available in the creation environment, so database-backed registration, concurrency and checkout still require integration testing with your configured instance. Nine DOM interaction checks pass (catalogue, login route, admin entry, SKU creation, stock receipt, deletion, lab route and lifecycle events). These are not real-browser layout checks; browser visual QA was unavailable. The Postman integration runner attempted to launch a temporary MongoDB replica set, but this execution environment blocked it with "open: Operation not permitted". No database-backed passing results are claimed.

## Project structure

- `src/main.jsx`: routed customer, admin and demo user flows.
- `src/components/`: product cards, Bootstrap authentication form, inventory editor and web lab.
- `labs/`: Node and MongoDB practical examples.
- `postman/`: collection and environment template.
- `scripts/`: DOM checks and Newman integration runner.
- `docs/`: beginner instructions, experiment map, test results and cloud guide.
- `src/style.css`: responsive visual system and reduced-motion handling.
- `src/catalog.js`: seed catalogue (illustrative prices).
- `public/images/` and `public/images.json`: local product assets and mapping.
- `server/index.js`: Express API, authentication, transactions and static frontend serving.
- `server/models.js`: users, products, orders and service requests.
- `server/domain.js`: validation and business rules.
- `server/seed.js`: non-destructive catalogue/admin initialization.
- `compose.yaml`: local replica-set development database.
- `ASSET_SOURCES.md`: image provenance and launch notes.

## API summary

Public: `GET /api/products`, `GET /api/health`, `POST /api/delivery/check`, and authentication endpoints under `/api/auth`.
Customer: `GET/POST /api/orders`, `GET/POST /api/requests`, `PATCH /api/requests/:id` (own requests only).
Admin products: `POST /api/admin/products`, `PATCH/DELETE /api/admin/products/:id`, `POST /api/admin/products/:id/stock` and multipart `POST /api/admin/uploads`.

Admin: `GET /api/admin/orders`, `PATCH /api/admin/orders/:id`, `PATCH /api/admin/products/:id`; service requests use the shared authenticated endpoints with role-based access.

All order prices and totals come from the database. Client-submitted prices are ignored. The checkout API requires unique product IDs, whole positive quantities, a complete delivery address, and in-range coordinates.
