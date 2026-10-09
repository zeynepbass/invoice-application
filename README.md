# Invoice Application

A full-stack point-of-sale and invoicing app: browse the catalogue, build a cart, create an order and print a clean invoice for it. Built with React, Redux Toolkit and Ant Design on the client and an Express + MongoDB API on the server.

> The interface is in Turkish.

![Sales screen](docs/screenshots/home.png)

## Overview

The application models the daily flow of a small shop:

1. Sign in.
2. Pick products from the catalogue, filtered by category or search.
3. Review the cart and adjust quantities.
4. Complete the order with the customer's details and payment method.
5. Open the generated invoice and print it.

Catalogue management (products and categories), a customer overview and sales statistics sit alongside that flow.

## Features

- **Authentication** – register, login and logout. Sessions are JWTs stored in an `httpOnly` cookie and every data endpoint is verified on the server.
- **Product management** – create, list, update and delete products; search and sort in the management table.
- **Category management** – create, rename and delete categories. Renaming a category carries its products over.
- **Cart** – add products, change quantities, remove items, clear the cart. The cart is persisted in `localStorage`.
- **Order creation** – customer name, phone and payment method (cash or credit card). Prices, tax (8% VAT) and totals are calculated on the server from the current product prices.
- **Invoices** – searchable, sortable invoice list with payment badges and a stable invoice number per order.
- **Invoice printing** – a print-ready A4 invoice document, without any application chrome.
- **Customers** – customers derived from orders, with order count, total spend and last order date.
- **Statistics** – revenue, sales, customer and product totals, daily revenue and revenue by payment method.

## Tech Stack

**Frontend**

- React 18 (Create React App)
- Redux Toolkit and RTK Query
- React Router 6
- Ant Design 5 and `@ant-design/plots`
- Tailwind CSS
- react-to-print

**Backend**

- Node.js and Express
- Mongoose
- JSON Web Tokens (`jsonwebtoken`), `bcryptjs`, `cookie-parser`, `cors`, `morgan`

**Database**

- MongoDB

## Architecture

The repository holds two independent applications.

**`api/`** is a REST API. Requests pass through `app.js` (CORS, JSON parsing, cookies, logging) into a router per resource. Routers only map URLs to controllers; controllers validate input and talk to the Mongoose models. Everything except `/api/auth/*` and `/api/health` sits behind the `requireAuth` middleware, and a single error handler turns thrown errors into consistent `{ "message": "..." }` responses.

**`client/`** is a single-page app. All server communication goes through one RTK Query API slice (`redux/apiSlice.js`), which provides caching, loading and error state, and cache invalidation after mutations. The cart is a regular Redux slice whose totals are derived with selectors. Pages compose feature components from `components/`, and the design tokens live in the Ant Design theme and the Tailwind config.

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/api/auth/register` | Create an account |
| `POST` | `/api/auth/login` | Start a session |
| `POST` | `/api/auth/logout` | End the session |
| `GET` | `/api/auth/me` | Current user |
| `GET` `POST` | `/api/categories` | List / create categories |
| `PUT` `DELETE` | `/api/categories/:id` | Update / delete a category |
| `GET` `POST` | `/api/products` | List / create products |
| `PUT` `DELETE` | `/api/products/:id` | Update / delete a product |
| `GET` `POST` | `/api/bills` | List invoices / create an order |
| `GET` | `/api/users`, `/api/users/:id` | List users / get a user |

## Project Structure

```text
invoice-application/
├── api/
│   ├── config/          # environment and database connection
│   ├── controllers/     # request handlers per resource
│   ├── middleware/      # auth, id validation, error handling
│   ├── models/          # Mongoose schemas
│   ├── routes/          # Express routers
│   ├── utils/           # HttpError, asyncHandler, validators
│   ├── app.js           # Express app
│   └── server.js        # entry point
├── client/
│   ├── public/
│   └── src/
│       ├── components/  # auth, bills, cart, categories, common, layout, products, statistics
│       ├── config/      # API URL, theme, company details
│       ├── pages/       # route-level screens
│       ├── redux/       # store, API slice, cart slice
│       ├── utils/       # formatting, search, error messages
│       ├── App.jsx      # routes
│       └── index.js
└── docs/
    └── screenshots/
```

## Screenshots

All screenshots use demo data.

### Login

![Login](docs/screenshots/login.png)

### Sales (Home)

![Sales](docs/screenshots/home.png)

### Cart

![Cart](docs/screenshots/cart.png)

### Order Creation

![Order creation](docs/screenshots/checkout.png)

### Invoice

![Invoice](docs/screenshots/invoice.png)

The printed output is available as a sample: [invoice-print.pdf](docs/screenshots/invoice-print.pdf).

### Invoices

![Invoices](docs/screenshots/orders.png)

### Customers

![Customers](docs/screenshots/customers.png)

### Statistics

![Statistics](docs/screenshots/statistics.png)

### Product Management

![Product management](docs/screenshots/product-management.png)

![Product form](docs/screenshots/product-form.png)

### Category Management

![Category management](docs/screenshots/category-management.png)

### Mobile

<p>
  <img src="docs/screenshots/mobile-home.png" alt="Sales screen on mobile" width="260" />
  <img src="docs/screenshots/mobile-cart.png" alt="Cart on mobile" width="260" />
  <img src="docs/screenshots/mobile-menu.png" alt="Navigation drawer on mobile" width="260" />
</p>

## UI / UX Improvements

- Rebuilt the interface on a single design system: one colour palette, type scale, spacing, radius and shadow set shared by the Ant Design theme and Tailwind.
- Replaced the top icon bar with a sidebar layout on desktop and a drawer menu on mobile.
- Redesigned product cards with a fixed image ratio, category label, price and a dedicated add-to-cart button.
- Reworked the cart into a responsive list with quantity steppers, per-line totals and a prominent order summary.
- Redesigned the invoice as a real document (seller, customer, invoice number, date, payment method, line items, tax and total) with a dedicated A4 print layout.
- New orders open their invoice straight away.
- Replaced the per-column filter dropdowns with a single search field on invoices, customers and products.
- Added loading skeletons, empty states with a next step, and error states with retry.
- Consistent forms: labels, inline validation, loading buttons and clear success and error messages.
- Accessibility: semantic landmarks and headings, real buttons and links instead of clickable `div`s, labels on icon buttons, visible focus rings, a skip link and AA-level text contrast.

## Installation

Requirements: Node.js 18.11 or newer and a MongoDB database.

### API

```bash
cd api
npm install
cp .env.example .env   # then fill in the values
npm run dev            # restarts on change; use `npm start` for a plain run
```

The API listens on `http://localhost:8903` by default.

### Client

```bash
cd client
npm install
cp .env.example .env
npm start
```

The client runs on `http://localhost:3000`.

Other client scripts:

```bash
npm run lint
npm test
npm run build
```

## Environment Variables

### `api/.env`

| Variable | Required | Description |
| --- | --- | --- |
| `MONGODB_URI` | Yes | MongoDB connection string |
| `JWT_SECRET` | Yes | Secret used to sign session tokens; use a long random value |
| `PORT` | No | Port for the API (default `8903`) |
| `CLIENT_ORIGIN` | No | Origin allowed by CORS (default `http://localhost:3000`) |
| `NODE_ENV` | No | Set to `production` to send the session cookie over HTTPS only |

### `client/.env`

| Variable | Required | Description |
| --- | --- | --- |
| `REACT_APP_API_URL` | No | Base URL of the API (default `http://localhost:8903`) |

The session cookie is `SameSite=Lax`, so in production the client and the API should be served from the same site.

## License

See [LICENCE](LICENCE).
