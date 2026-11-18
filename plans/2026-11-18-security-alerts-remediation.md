# Remediação dos alertas de code scanning e Dependabot

## Context

O repositório acumulou 6 pendências de segurança: 5 alertas de code scanning
(CodeQL, default setup) e 1 alerta Dependabot.

| # | Severidade | Regra | Local | Causa raiz |
| --- | --- | --- | --- | --- |
| 1 | alto | `js/incomplete-sanitization` | `assets/es-module-shims.js:916` | `url.replace(/'/g, "\\'")` escapa apenas aspas simples ao gerar um literal JS, ignorando `\`, novas linhas e `U+2028`/`U+2029` |
| 2 | alto | `js/xss-through-dom` | `script.js:612` | saída gerada de `src/forms.js` (bundle IIFE); mesma causa do item 3 |
| 3 | alto | `js/xss-through-dom` | `src/forms.js:94` | `DOMParser` reinterpreta o texto da `textarea` (HTML do editor) como marcação |
| 4 | médio | `js/bad-code-sanitization` | `assets/es-module-shims.js:580` | `JSON.stringify(wasmBytes)` usado como sanitizador de *código* |
| 5 | médio | `js/bad-code-sanitization` | `assets/es-module-shims.js:588` | idem item 4 |
| 6 | médio | Dependabot `GHSA-g3hv-75wg-m249` | `package-lock.json` | `minimatch` 9.0.9 / 10.2.6 (range vulnerável `>=7.0.0 <11.0.1`) |

Fatos que orientam a solução:

- `assets/es-module-shims.js` é cópia byte-idêntica do `dist` publicado do
  **es-module-shims 2.8.4**, que é a última versão publicada. O upstream ainda
  contém os dois padrões sinalizados, portanto não há atualização que resolva os
  alertas 1, 4 e 5. O arquivo **não é código morto**: `templates/document_head.hbs`
  o carrega para navegadores sem `importmap` nativo, e é o único caminho que faz
  os módulos React funcionarem nesses navegadores.
- `script.js` é artefato de build (`rollup`, entrada `src/index.js`); corrigir
  `src/forms.js` e rebuildar resolve os alertas 2 e 3 de uma vez.
- `minimatch` é transitivo (Jest e `@zendesk/zcli`), sem uso direto no projeto, e
  a vulnerabilidade é de escopo `development`. A correção é um `overrides` npm
  restrito ao range vulnerável, preservando `3.x`/`5.x` (não afetados).

## Goal

Zerar os 5 alertas de code scanning e o alerta Dependabot sem suprimir regras,
sem exclusões no CodeQL e sem remover código em uso, mantendo build, typecheck,
testes e os gates de `build/validate.py` verdes.

## Steps

1. `git pull --ff-only` e baseline (`npm ci`, `npm test`, `npm run typecheck`).
2. `assets/es-module-shims.js`:
   - `urlJsString` passa a usar `JSON.stringify` e escapa `U+2028`/`U+2029`,
     cobrindo aspas, barras invertidas e quebras de linha;
   - o header wasm entra no script de feature-detection como texto constante
     (`wasmBytesLiteral`), eliminando `JSON.stringify` como "sanitizador" de
     código;
   - registrar proveniência e patches no header, em `docs/licensing.md`, e
     adicionar `LICENSES/es-module-shims-MIT.txt`.
3. `src/forms.js`: extrair a checagem de "comentário vazio" para
   `src/is-empty.js`, inspecionando a marcação como texto (sem `DOMParser`), com
   `src/is-empty.spec.js` cobrindo os casos do editor; rebuildar `script.js`.
4. `package.json`: `overrides` de `minimatch@>=7.0.0 <11.0.1` para `11.0.9`
   (última estável) e `npm install` para atualizar o lockfile.
5. Validar cada lote: `npm test`, `npm run typecheck`, `npm run build`,
   `npm run validate`, smoke test do `zcli`, `npm audit`.
6. Push e re-checagem dos alertas no GitHub após a análise do CodeQL.

## Risks

- **CodeQL pode re-apontar outro trecho** do mesmo template do shim: nesse caso,
  o header wasm é embutido como literal fixo no texto gerado (sem interpolação)
  e o escaping de URL vira um helper `escapeJsString` explícito.
- **`minimatch` 11 forçado em `glob@13`/Jest**: APIs são compatíveis
  (`minimatch` continua exportando a função e `Minimatch` em CJS), mas a suíte e
  o `zcli` são o teste real; fallback é restringir os overrides aos pacotes do
  Jest e/ou atualizar `glob`.
- **Divergência do vendor**: os patches locais precisam ser reaplicados ao subir
  a versão do es-module-shims (documentado no header e em `docs/licensing.md`).
- **Fora do escopo**: advisories de desenvolvimento sem correção disponível na
  cadeia do `@zendesk/zcli` (picomatch/readdirp/globby) continuam no
  `npm audit`; nenhum deles é alerta aberto nem afeta o runtime do tema.
