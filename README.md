# Incident Squad

**An AI incident-response squad that lives in your team chat.** Report a bug in Discord and a squad of agents takes it from report to a reviewed fix in a pull request. Triage finds the cause, Fixer writes the patch, Reviewer checks it, and a human approves the merge right in the chat.

Built on [Switch](https://docs.switchagents.ai/) for the [Flip the Switch Hackathon](https://www.wemakedevs.org/hackathons/switch).

> 🚧 Work in progress. This README is an outline and fills in as we build.

## How it works

1. Someone reports a bug in the incidents channel ("checkout returns 500").
2. **incident-lead** opens a dedicated incident room from a Switch template and brings in the squad plus the reporter.
3. **triage** reproduces the bug, reads the logs and code, and posts the root cause with a failing test.
4. **fixer** creates a branch, writes the patch, gets the tests passing and opens a PR.
5. **reviewer** checks the diff and reruns the tests, then approves or sends it back to fixer.
6. A **human** replies `approve` in chat, and the PR is merged.
7. **incident-lead** posts an incident summary in the main channel and archives the room.

## How Switch is used

_TODO: rooms from templates, roles, agent-to-agent handoffs, human approval in chat, room documents, room links. Screenshots to come._

## The demo app: mini-shop

A small Express + TypeScript shop API that the squad works on. It's in this repo so anyone can reproduce the demo.

| Endpoint | What it does |
| --- | --- |
| `GET /health` | Health check |
| `GET /products`, `GET /products/:id` | Product catalogue |
| `POST /cart` | Create a cart |
| `GET /cart/:id` | View a cart |
| `POST /cart/:id/items` | Add `{ productId, quantity }` |
| `DELETE /cart/:id/items/:productId` | Remove an item |
| `POST /checkout` | Check out `{ cartId, coupon? }` |
| `GET /checkout/orders/:id` | View an order |

Coupons: `SAVE10` (10% off), `WELCOME5` (5% off).

The app ships with a few realistic bugs for the squad to find. Errors are logged as JSON lines to `logs/app.log`, and `logs/sample-incident.log` holds a captured example.

```bash
npm install
npm test        # Jest + supertest
npm run dev     # http://localhost:3000
```

Requires Node 20+.

## Setting up the squad

_TODO: Switch Console setup, agent creation, room template, one-command setup script._

## Team

- Sivarao (sivarao1771)
- Girish (girish_25_9)

## License

MIT
