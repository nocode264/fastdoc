<div align="center">

# ⚡ fastdoc

**AI-powered documentation generator for your codebase**  
**Générateur de documentation technique propulsé par l'IA**

[![npm version](https://img.shields.io/npm/v/fastdoc)](https://www.npmjs.com/package/fastdoc)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![GitHub Action](https://img.shields.io/badge/GitHub-Action-blue?logo=github)](action/action.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue?logo=typescript)](tsconfig.json)

[English](#english) • [Français](#français)

</div>

---

## English

### What is fastdoc?

**fastdoc** is a CLI tool and GitHub Action that analyzes your source code and automatically generates professional technical documentation using AI (Claude by Anthropic).

One command. Professional docs. Every time.

```bash
npx fastdoc generate
```

### ✨ Features

- 🔍 **Smart code analysis** — parses functions, classes, routes, and parameters
- 🤖 **AI-powered generation** — uses Claude to write clear, human-readable documentation
- 📦 **Multi-language support** — JS, TypeScript, PHP/Laravel, Dart/Flutter, Python, Node.js, NestJS
- 📄 **Multiple output formats** — Markdown and JSON
- ⚙️ **GitHub Action** — automate doc generation in your CI/CD pipeline
- 🌐 **Multilingual output** — generate docs in English or French

### 🚀 Installation

```bash
# Install globally
npm install -g fastdoc

# Or use without installing
npx fastdoc generate
```

### 📋 Requirements

- Node.js >= 18
- An Anthropic API key → [Get one here](https://console.anthropic.com)

### ⚙️ Quick Start

**1. Set your API key**

```bash
export ANTHROPIC_API_KEY=your_api_key_here
```

**2. Initialize configuration (optional)**

```bash
fastdoc init
```

This creates a `.fastdocrc` file at the root of your project:

```json
{
  "language": "auto",
  "output": ["md", "json"],
  "outDir": "./docs",
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "*.test.ts"],
  "ai": {
    "model": "claude-sonnet-4-20250514",
    "language": "en"
  }
}
```

**3. Generate your documentation**

```bash
# Generate docs for the entire project
fastdoc generate

# Generate docs for a single file
fastdoc generate --file src/api/users.ts

# Choose output format
fastdoc generate --output json

# Force language detection
fastdoc generate --lang php
```

### 🛠️ CLI Reference

| Command | Description |
|---|---|
| `fastdoc generate` | Analyze and generate docs for the whole project |
| `fastdoc generate --file <path>` | Generate docs for a single file |
| `fastdoc generate --lang <lang>` | Force language (`js`, `ts`, `php`, `dart`, `py`) |
| `fastdoc generate --output <fmt>` | Output format (`md`, `json`, `all`) |
| `fastdoc generate --out-dir <path>` | Output directory (default: `./docs`) |
| `fastdoc init` | Create a `.fastdocrc` config file |
| `fastdoc --version` | Show installed version |
| `fastdoc --help` | Show help |

### 🤖 GitHub Action

Automate your documentation on every push:

```yaml
# .github/workflows/docs.yml
name: Generate Documentation

on:
  push:
    branches: [main]

jobs:
  docs:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Generate docs with fastdoc
        uses: your-username/fastdoc@v1
        with:
          api-key: ${{ secrets.ANTHROPIC_API_KEY }}
          output-format: md
          output-dir: ./docs
          language: en
          commit-docs: true
```

### 📁 Output Example

Given this TypeScript function:

```typescript
export function calculateDiscount(price: number, rate: number): number {
  if (rate < 0 || rate > 1) throw new Error("Rate must be between 0 and 1");
  return price * (1 - rate);
}
```

fastdoc generates:

```markdown
## `calculateDiscount`

Calculates the final price after applying a discount rate.

**Parameters**
| Name | Type | Description |
|------|------|-------------|
| price | number | The original price before discount |
| rate | number | Discount rate between 0 and 1 (e.g., 0.2 for 20%) |

**Returns** `number` — The discounted price.

**Throws** `Error` if the rate is not between 0 and 1.

**Example**
```typescript
calculateDiscount(100, 0.2); // → 80
```
```

### 🌍 Supported Languages

| Language | Framework | Status |
|---|---|---|
| JavaScript | Node.js, Express | ✅ v1.0 |
| TypeScript | NestJS | ✅ v1.0 |
| PHP | Laravel | ✅ v1.0 |
| Dart | Flutter | ✅ v1.0 |
| Python | — | ✅ v1.0 |
| Java | Spring | 🔜 v1.1 |
| Kotlin | — | 🔜 v1.1 |

### 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) before submitting a pull request.

```bash
git clone https://github.com/your-username/fastdoc.git
cd fastdoc
npm install
npm run dev
```

### 📄 License

MIT © [Mbemdia Saliou Mohamed](https://github.com/nocode264)

---

## Français

### Qu'est-ce que fastdoc ?

**fastdoc** est un outil CLI et une GitHub Action qui analyse ton code source et génère automatiquement une documentation technique professionnelle grâce à l'IA (Claude d'Anthropic).

Une seule commande. Une documentation professionnelle. À chaque fois.

```bash
npx fastdoc generate
```

### ✨ Fonctionnalités

- 🔍 **Analyse intelligente du code** — parse les fonctions, classes, routes et paramètres
- 🤖 **Génération par IA** — utilise Claude pour rédiger une documentation claire et lisible
- 📦 **Multi-langages** — JS, TypeScript, PHP/Laravel, Dart/Flutter, Python, Node.js, NestJS
- 📄 **Formats de sortie multiples** — Markdown et JSON
- ⚙️ **GitHub Action** — automatise la génération de doc dans ton pipeline CI/CD
- 🌐 **Documentation multilingue** — génère la doc en français ou en anglais

### 🚀 Installation

```bash
# Installation globale
npm install -g fastdoc

# Ou utilisation sans installation
npx fastdoc generate
```

### 📋 Prérequis

- Node.js >= 18
- Une clé API Anthropic → [En obtenir une ici](https://console.anthropic.com)

### ⚙️ Démarrage rapide

**1. Configurer ta clé API**

```bash
export ANTHROPIC_API_KEY=ta_cle_api_ici
```

**2. Initialiser la configuration (optionnel)**

```bash
fastdoc init
```

Cela crée un fichier `.fastdocrc` à la racine de ton projet :

```json
{
  "language": "auto",
  "output": ["md", "json"],
  "outDir": "./docs",
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "*.test.ts"],
  "ai": {
    "model": "claude-sonnet-4-20250514",
    "language": "fr"
  }
}
```

**3. Générer ta documentation**

```bash
# Générer la doc pour tout le projet
fastdoc generate

# Générer la doc pour un seul fichier
fastdoc generate --file src/api/users.ts

# Choisir le format de sortie
fastdoc generate --output json

# Forcer la détection du langage
fastdoc generate --lang php
```

### 🛠️ Référence CLI

| Commande | Description |
|---|---|
| `fastdoc generate` | Analyse et génère la doc pour tout le projet |
| `fastdoc generate --file <chemin>` | Génère la doc pour un seul fichier |
| `fastdoc generate --lang <lang>` | Force le langage (`js`, `ts`, `php`, `dart`, `py`) |
| `fastdoc generate --output <fmt>` | Format de sortie (`md`, `json`, `all`) |
| `fastdoc generate --out-dir <chemin>` | Dossier de sortie (défaut : `./docs`) |
| `fastdoc init` | Crée un fichier de configuration `.fastdocrc` |
| `fastdoc --version` | Affiche la version installée |
| `fastdoc --help` | Affiche l'aide |

### 🤖 GitHub Action

Automatise ta documentation à chaque push :

```yaml
# .github/workflows/docs.yml
name: Génération de la documentation

on:
  push:
    branches: [main]

jobs:
  docs:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Générer la doc avec fastdoc
        uses: your-username/fastdoc@v1
        with:
          api-key: ${{ secrets.ANTHROPIC_API_KEY }}
          output-format: md
          output-dir: ./docs
          language: fr
          commit-docs: true
```

### 🤝 Contribuer

Les contributions sont les bienvenues ! Consulte [CONTRIBUTING.md](CONTRIBUTING.md) avant de soumettre une pull request.

```bash
git clone https://github.com/your-username/fastdoc.git
cd fastdoc
npm install
npm run dev
```

### 📄 Licence

MIT © [Mbemdia Saliou Mohamed](https://github.com/nocode264)
