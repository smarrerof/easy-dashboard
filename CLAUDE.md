# CLAUDE.md — Angular Project Rules

## Angular version and config

- Angular 20+ with standalone components — no NgModules
- Zoneless change detection (`provideZonelessChangeDetection()`)
- `ChangeDetectionStrategy.OnPush` on every component
- `provideHttpClient()` registered in `app.config.ts`

## Reactivity

- Signals for all reactive state: `signal`, `computed`, `effect`
- `input()` / `output()` for component I/O
- RxJS only when bridging with `HttpClient` (`firstValueFrom`)

## Component templates

- New control flow syntax: `@if`, `@for`, `@defer`, `@switch`
- `@defer (on viewport)` for off-screen content
- `track` is mandatory in every `@for`

## TypeScript

- Prefer `interface` over `class` for data models
- Group related interfaces in a single `*.models.ts` file per feature
- Prefer `type` for unions and aliases
- No `any` — use `unknown` and narrow explicitly
- After a type guard + throw, extract to a `const` before using in closures
  to ensure TypeScript narrowing holds inside callbacks

## File and folder naming

Follow the Angular style guide:
- `kebab-case` for all file names
- Suffix pattern: `*.component.ts`, `*.service.ts`, `*.pipe.ts`,
  `*.directive.ts`, `*.models.ts`, `*.routes.ts`, `*.config.ts`
- One Angular artifact (component, service, pipe…) per file
- Multiple interfaces in one `*.models.ts` per feature domain is acceptable

## Folder structure

```
src/app/
  <feature>/
    models/
      <feature>.models.ts
    services/
      <feature>.service.ts
    components/
      <component-name>/
        <component-name>.component.ts
```

## Code style

- No standalone helper functions inside service files — use `private` methods
- No error handling for impossible scenarios
- Validate only at system boundaries (HTTP responses, external input)
- Keep components as thin as possible — logic belongs in services

## JSDoc

All methods in components, services and classes must have a JSDoc comment in English.
Keep it concise: one line is enough unless params or return value need clarification.

```ts
/** Fetches and validates the dashboard YAML, then logs the result. */
async load(): Promise<Dashboard> { … }

/**
 * Parses and validates a raw server object.
 * @param raw   Unknown value from the parsed YAML.
 * @param index Position in the servers array, used in error messages.
 */
private parseServer(raw: unknown, index: number): Server { … }
```

Rules:
- Use `/** … */` — never `//` for method documentation
- Document `@param` and `@returns` only when their purpose is not obvious from the signature
- No `@param` for `self-explanatory` arguments like `id: string` or `index: number`

## Git workflow

- Commit and push only to the current branch (`develop` or a feature branch)
- Never commit or push directly to `main` — merging to `main` triggers a new `latest` Docker image publish
