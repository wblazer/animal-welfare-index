# Animal Welfare Index

A curated index of writing, research, and data on animal welfare.

Live site: <https://wblazer.github.io/animal-welfare-index/>

Each entry links to a source, describes it, lists selected pages when useful, and records tags and reuse-license information. Annotations are original; linked content is not copied.

## Build and run

```bash
npm install
npm run build
npm run preview
```

Then open `http://localhost:8080/animal-welfare-index/`.

## Outputs

`src/data/catalog.json` is the single source of truth. Astro validates it and generates:

- A static HTML table containing every source
- `catalog.json` and `catalog.csv`
- JSON-LD in the HTML document
- `llms.txt` and `robots.txt`

The table includes search and multi-select filters for tags and license status. Filtering runs in the browser, and the JSON export follows the current selection. All sources remain in the initial HTML without JavaScript.

## Source audits

GitHub Actions validates catalog changes, checks new links on pull requests, checks all links weekly, and compares public crawl and reuse signals monthly. Reports are attached to each workflow run; failures and changed policy signals are kept in repository issues for review.

```bash
npm run audit:catalog
npm run test:audit
npm run audit:links
npm run audit:policies
```

The policy audit watches `robots.txt`, AI-specific directives and headers, machine-readable license metadata, and the pages listed in an entry's optional `policy_urls`. Refresh `data/source-audit-baseline.json` after reviewing detected changes:

```bash
node scripts/audit-sources.mjs policies --update-baseline
```

Automated results describe public technical and licensing signals; they do not determine legal permission to copy or train on a source. The audit never removes catalog entries.

## Licenses

Original editorial summaries and site prose are available under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Catalog facts and metadata are available under [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/).

These licenses cover this project’s original work only. Content on linked websites remains under the terms of its source.
