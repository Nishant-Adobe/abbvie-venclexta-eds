# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is an **AEM Edge Delivery Services (Helix) project** based on the `aem-boilerplate` template. It's a component-based, content-authored website that uses Adobe Experience Manager (AEM) for content management and AEM Edge Delivery Services for delivery.

**Key URLs:**
- Preview: `https://main--abbvie-venclexta-eds--nishant-adobe.aem.page/`
- Live: `https://main--abbvie-venclexta-eds--nishant-adobe.aem.live/`
- Content Author (DA): Maps to AEM Cloud Service via `fstab.yaml` mountpoint

## Architecture

### Content & Authoring Model

This project uses **content-driven development** with a WYSIWYG authoring experience:

- **Content source:** AEM Cloud Service at `https://author-p160552-e1944799.adobeaemcloud.com/bin/franklin.delivery/nishant-adobe/abbvie-venclexta-eds/main`
- **Content delivery:** Content authors create pages in Document Authoring (DA), which generate HTML markup
- **Code vs Content:** Code (blocks, styles, scripts) lives in this repo; content lives in AEM
- **Markup format:** Authors structure content using block names and metadata in documents (similar to markdown/Word tables)

### Block-Based Architecture

The site is built from **reusable blocks** that authors can compose into pages:

- **Block location:** `blocks/` directory
- **Current blocks:** `cards`, `columns`, `footer`, `fragment`, `header`, `hero`
- **Block structure:** Each block has:
  - `{blockname}.js` - JavaScript enhancements (decorators, dynamic behavior)
  - `{blockname}.css` - Styling
  - `_{blockname}.json` (in `blocks/` if exists) - Content model definition
  - Optional subdirectories for additional block variants

- **Block content models:** Defined in `blocks/{blockname}/{blockname}.json` and aggregated into root-level JSON files
  - `blocks/cards/_cards.json` → merged into `component-definition.json`, `component-models.json`, `component-filters.json`
  - Models define authoring structure (fields, component types, validation)

### Content Models & Metadata

- **Block definitions:** `blocks/{blockname}/_blockname.json` → defines how authors can compose the block
- **Page models:** `models/_page.json` → defines page-level metadata (title, description, keywords)
- **Content definitions:** `models/_component-definition.json` → central registry of all components available to authors
- **Build process:** `npm run build:json` merges all `_*.json` files into root-level `*.json` files consumed by authoring tools

### Styling & Theming

- **Global styles:** `styles/styles.css` (typography, layout, design tokens via CSS variables)
- **Lazy-loaded styles:** `styles/lazy-styles.css` (deferred rendering optimizations)
- **Font definitions:** `styles/fonts.css` (web font loading with fallbacks)
- **Section styles:** Applied via Section Metadata blocks in authored content (e.g., `style: highlight`, `style: narrow`)
- **Design tokens:** Defined as CSS variables in `:root` (colors, fonts, spacing, nav height)

### Scripts & Client-Side Logic

- **Core AEM framework:** `scripts/aem.js` (decorators, block loading, section management, icon/button decoration)
- **Project scripts:** `scripts/scripts.js` (project-specific enhancements, auto-blocking, font loading)
- **Utilities:** `scripts/editor-support.js`, `scripts/editor-support-rte.js` (authoring UI integration), `scripts/dompurify.min.js` (HTML sanitization)
- **Execution flow:** AEM lazy-loads sections and blocks on scroll; `loadEager()` decorates visible content

### AI Skills Integration

Located in `.agents/skills/`, these are Claude AI capabilities for automating common tasks:

- **Content workflow skills:** `authoring`, `page-import`, `content-driven-development`, `authoring-analysis`, `page-decomposition`
- **Block & structure skills:** `building-blocks`, `block-inventory`, `block-collection-and-party`, `identify-page-structure`, `testing-blocks`
- **Automation & analysis:** `code-review`, `scrape-webpage`, `generate-import-html`, `docs-search`, `find-test-content`, `preview-import`
- **Project setup:** `create-site`, `da-auth`, `admin`, `auth`, `development`, `handover`, `whitepaper`
- **Planning & coordination:** `analyze-and-plan`, `content-modeling`, `ue-component-model`

Each skill is independently versioned (semantic release) and configured with `.releaserc.json`.

### Configuration & Tooling

- **Sidebar toolkit:** `tools/sidekick/config.json` - Configures editor sidebar for previewing/editing pages with AEM Editor link pattern
- **Dependency management:** `package.json` with linting, JSON building, and git hooks via Husky
- **CI/CD:** `.github/workflows/main.yaml` runs linting on push; `.github/workflows/cleanup-on-create.yaml` initializes new repos
- **Automated updates:** `.renovaterc.json` manages dependency upgrades (automerges devDependencies)

## Commands

### Linting & Code Quality

```bash
npm run lint              # Run both JS and CSS linting
npm run lint:js           # Lint JavaScript and JSON (eslint)
npm run lint:css          # Lint CSS (stylelint)
npm run lint:fix          # Auto-fix JS and CSS issues
```

**Note:** Linting runs in CI/CD on every push. Fix linting errors before committing.

### Building Assets

```bash
npm run build:json        # Merge all _*.json files into root-level JSON files
npm run build:json:models # Merge component models
npm run build:json:definitions # Merge component definitions
npm run build:json:filters # Merge component filters
```

**When to run:** After modifying `models/*.json` or `blocks/*/_*.json` files. These build outputs are consumed by authoring tools.

### Development Setup

```bash
npm install               # Install dependencies
npm run prepare            # Setup Husky git hooks
npm run setup:skills       # Install Adobe skills plugins (authoring agents)
```

### Local Development

1. Install [AEM CLI](https://github.com/adobe/helix-cli): `npm install -g @adobe/aem-cli`
2. Start AEM Proxy: `aem up` (opens `http://localhost:3000`)
3. Code changes auto-reload via proxy

**Preview:** Pages authored in AEM render at `http://localhost:3000` through the proxy

## Key Files & Directories

| Path | Purpose |
|------|---------|
| `blocks/` | Reusable content blocks (HTML structure, styling, logic) |
| `models/` | Content models and definitions for authoring |
| `scripts/` | Client-side JavaScript (AEM framework + project enhancements) |
| `styles/` | Global CSS, typography, design tokens |
| `fonts/` | Web font files and loading logic |
| `tools/sidekick/` | Editor sidebar configuration |
| `.agents/skills/` | Claude AI skills for automation and workflows |
| `.github/workflows/` | CI/CD pipeline definitions |
| `fstab.yaml` | Content source mountpoint (AEM Cloud Service) |

## Important Concepts

### How Authors Create Content

1. Open Document Authoring (DA) interface
2. Create new document
3. Structure content using **block names** in tables (e.g., `cards`, `hero`)
4. Add **Metadata block** at bottom with page metadata (title, description, template, custom fields)
5. Preview → Publish to push to Preview environment, then to Live

### How Blocks Work

- **Definition:** Block structure defined in JSON models (fields, types, validation)
- **Decoration:** AEM loads HTML from author → JavaScript decorator enriches DOM with interactive behavior
- **Styling:** CSS applies visual design; section metadata controls variants
- **Reusability:** Same block used across pages with different content

### Content Modelling

- Blocks have **models** that define fields (text, rich text, image reference, etc.)
- Models support multi-value fields and nested structures
- Models are consumed by authoring UI to validate author input
- Use `content-modeling` skill to design new block structures

### Section Styles

Sections (horizontal content groupings) can be styled via metadata:
- Section created with horizontal rule (`---`) in authored content
- Add Section Metadata block at end of section with `style` property
- CSS applies `.section.{style-name}` classes

## Development Workflow

### Adding or Modifying a Block

1. Create `blocks/{blockname}/` directory
2. Add `{blockname}.js` (optional, if dynamic behavior needed)
3. Add `{blockname}.css` for styling
4. Add `blocks/{blockname}/_{blockname}.json` with content model (if authors need to configure it)
5. Run `npm run build:json` to aggregate models
6. Test in local AEM proxy (`aem up`)

### Modifying Content Models

1. Edit `blocks/{blockname}/_{blockname}.json` or `models/_*.json`
2. Run `npm run build:json` to rebuild aggregated files
3. Deploy code to GitHub (triggers CI/CD linting)
4. Changes appear in authoring UI immediately (DA consumes merged JSON)

### Testing Blocks

- Use `testing-blocks` skill to validate block rendering
- Use `preview-import` skill to verify imported content with blocks
- Manual testing: Create test pages in DA, preview via local proxy

### Importing External Content

- Use `page-import` skill to migrate pages from other sites
- Skill orchestrates: scrape → analyze structure → map to blocks → generate HTML → preview

## Git & Deployment

- **Code repo:** `https://github.com/nishant-adobe/abbvie-venclexta-eds`
- **Branch structure:** `main` is source of truth; deployed immediately to Preview/Live
- **Content repo:** Separate from code; lives in AEM Cloud Service (not in GitHub)
- **CI/CD:** GitHub Actions runs linting on push (`.github/workflows/main.yaml`)
- **Cleanup workflow:** New repos based on template have auto-cleanup of template files (`.github/workflows/cleanup-on-create.yaml`)

## AI Skills & Automation

### Available Skills for Common Tasks

| Task | Skill | When to Use |
|------|-------|------------|
| Generate author documentation | `authoring` | Onboarding content authors, project handover |
| Import external pages | `page-import` | Migrating content from competitors or staging sites |
| Create new content from scratch | `content-driven-development` | Designing content workflows and block usage |
| Design block structure | `content-modeling` | New block requirements or complex models |
| Build custom blocks | `building-blocks` | Extending existing blocks or new functionality |
| Code review & QA | `code-review` | Before merging to main |
| Scrape & analyze websites | `scrape-webpage` | Gathering reference content |
| Search documentation | `docs-search` | Understanding AEM Edge Delivery Services |

### How to Invoke a Skill

Skills are invoked by Claude in this repository context. Mention the skill name or its purpose, and Claude will execute it. Example:

```
"Generate an author guide for content managers"
→ Claude invokes `authoring` skill
→ Skill analyzes project structure, content models, blocks
→ Generates PDF guide with templates, workflows, FAQs
```

## Dependencies

| Dependency | Purpose | Version |
|-----------|---------|---------|
| `eslint` | JavaScript linting | 8.57.1 |
| `stylelint` | CSS linting | 17.0.0 |
| `husky` | Git hooks (pre-commit linting) | 9.1.1 |
| `merge-json-cli` | Merge JSON models for authoring | 1.0.4 |
| `npm-run-all` | Run multiple scripts in parallel | 4.1.5 |

All other dependencies are linting/building tools. **No production framework dependencies** — content and structure handled by AEM, styling by CSS, interactivity by vanilla JS.

## NodeJS & Prerequisites

- **NodeJS:** 18.3.x or newer (install via nvm or nodejs.org)
- **AEM Cloud Service:** Release 2024.8 or newer (>= `17465`)
- **AEM CLI:** Install globally: `npm install -g @adobe/aem-cli`

## Important Notes for Claude Code

### Content vs Code Distinction

- **This repository contains code only.** Do not expect to find authored content (pages, images) in the repo
- Content lives in AEM and is authored in Document Authoring (DA)
- Changes to code deploy via GitHub; changes to content authored via DA

### JSON Model Aggregation

- Do not edit `component-definition.json`, `component-models.json`, `component-filters.json` directly
- These are **generated** by `npm run build:json`
- Edit source files: `models/_*.json` and `blocks/*/_*.json`
- Always run `npm run build:json` after JSON changes before committing

### Block Decoration Philosophy

Blocks follow the pattern:
1. Authors create structured markup (HTML from DA)
2. JavaScript decorator enhances with interactivity
3. CSS styles the result
4. AEM lazy-loads scripts/CSS only when block appears on page

Keep blocks simple; prefer author-friendly content models over complex JavaScript.

### Performance Considerations

- Fonts lazy-loaded with fallbacks to avoid layout shift
- Sections lazy-loaded on scroll
- CSS is global; use scoped class names (e.g., `.{blockname}-{element}`) to avoid collisions
- Images optimized by AEM (WebP generation, CDN delivery)

### No Custom Testing Framework

This project does not have Jest, Mocha, or similar. Testing is manual (preview in `aem up`) and via AI skills (`testing-blocks`, `preview-import`).

## References

- [AEM Edge Delivery Services Documentation](https://www.aem.live/docs/)
- [Getting Started Guide](https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/edge-delivery/wysiwyg-authoring/edge-dev-getting-started)
- [Creating Blocks](https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/edge-delivery/wysiwyg-authoring/create-block)
- [Anatomy of a Project](https://www.aem.live/developer/anatomy-of-a-project)
- [Web Performance Best Practices](https://www.aem.live/developer/keeping-it-100)
