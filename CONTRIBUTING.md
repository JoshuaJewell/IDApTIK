# Contributing to IDApTIK

## Submitting changes

Please send a [GitHub Pull Request to Gitpoint](https://github.com/JoshuaJewell/Gitpoint/pull/new/main) with a clear list of what you've done (read more about [pull requests](http://help.github.com/pull-requests/)). Please follow our coding conventions (below) and make sure all of your commits are atomic (one feature per commit).
    
## Coding conventions

Start reading our code and you'll get the hang of it. We optimize for readability:

  * We indent using four spaces (soft tabs).
  * We ALWAYS put spaces after list items and method parameters (`[1, 2, 3]`, not `[1,2,3]`), around operators (`x += 1`, not `x+=1`), and around hash arrows.
  * If in doubt: [MDN JavaScript style guide](https://developer.mozilla.org/en-US/docs/MDN/Writing_guidelines/Writing_style_guide/Code_style_guide/JavaScript),
  * Or just do what looks right and it'll probably be fine.

# Tri‑Perimeter Modding Architecture
Welcome to the IDApTIK project!  
We use the **Tri‑Perimeter Modding Architecture (TPMA)** to balance developer control with community creativity.

---

## Perimeter 1: Core Systems (Dev Team Only)
- **Languages**: Rust (Bevy/Macroquad), Elixir (Phoenix/OTP)
- **Responsibilities**:
  - Core engine (physics, ECS, rendering)
  - Multiplayer backend (matchmaking, persistence, state authority)
  - Compiler/tooling pipeline
- **Access**: Maintainers only
- **Contribution Path**: Not open to community

---

## Perimeter 2: Expert Extensions
- **Languages**: Rescript + controlled Rust/Elixir bindings
- **Responsibilities**:
  - Advanced AI behaviors (guards, stealth logic)
  - Custom puzzle mechanics (gadgets, traps)
  - Networking extensions (lobby rules, protocol tweaks)
- **Access**: Trusted contributors
- **Contribution Path**:
  1. Apply for expert contributor status via issue template
  2. Submit proposals as pull requests under `/mods/extensions/`
  3. Include:
     - Unit tests
     - Documentation
     - Example usage
  4. Reviewed by core devs before merge

---

## Perimeter 3: Community Sandbox
- **Languages**: TypeScript (sandboxed)
- **Responsibilities**:
  - Level design (`/mods/community/levels/`)
  - Asset packs (sprites, sounds, UI skins)
  - Cosmetic mods
  - Declarative puzzle definitions
- **Access**: Open to all
- **Contribution Path**:
  1. Fork the repo
  2. Add your mod under `/mods/community/`
  3. Run `npm run validate-mod` locally
  4. Submit a pull request
  5. Automated CI will validate schema and sandbox safety

---

## Lifecycle & Automation
- **CI/CD**: All contributions tested automatically
- **SaltStack**: Enforces environment setup for each perimeter
- **Versioning**: APIs are versioned; deprecated features flagged before removal

---

## Code of Conduct
All contributors must follow our [Code of Conduct](CODE_OF_CONDUCT.md).

