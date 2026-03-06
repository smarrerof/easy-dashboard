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

## Member ordering (components & services)

Use `// #region Name` / `// #endregion` to delimit sections (VS Code folds them).
Keep all regions in every file even if empty — it makes the structure consistent and obvious where to add things.

The `constructor` sits **between Computed and Lifecycle, outside any region** — it is always visible.

When a region has content, leave one blank line after `// #region Name` and one blank line before `// #endregion`. Empty regions have no blank lines.

Mandatory order inside every Angular class:

1. `#region Constants` — `static readonly` class-level constants
2. `#region Inputs & Outputs` — `input()` first (alphabetical), blank line, then `output()` (alphabetical)
3. `#region View Queries` — `viewChild()`, `viewChildren()`
4. `#region Dependencies` — `inject()`, alphabetical order
5. `#region Fields` — plain instance fields grouped by visibility (`private` / `protected` / `public`), each group alphabetical, groups separated by a blank line
6. `#region Properties` — `get` / `set` accessors
7. `#region State` — `signal()`, alphabetical order
8. `#region Computed` — `computed()`, alphabetical order
9. `constructor` ← outside any region
10. `#region Lifecycle` — `ngOnInit`, `ngOnChanges`, `ngOnDestroy`, … (no constructor here)
11. `#region Event Handlers` — `protected` methods called from the template
12. `#region Public Methods` — public API of the component / service
13. `#region Private Helpers` — `private` methods

Example:

```ts
@Component({ ... })
export class ServerCardComponent {

  // #region Constants

  static readonly MAX_SERVICES = 50;

  // #endregion

  // #region Inputs & Outputs

  readonly server = input.required<Server>();

  readonly selected = output<Server>();

  // #endregion

  // #region View Queries
  // #endregion

  // #region Dependencies

  private readonly dashboardService = inject(DashboardService);

  // #endregion

  // #region Fields

  private lastYaml: string | null = null;
  private notificationTimer: ReturnType<typeof setTimeout> | null = null;

  // #endregion

  // #region Properties

  get isActive(): boolean {
    return this.server().status === 'active';
  }

  // #endregion

  // #region State

  protected readonly isExpanded = signal(false);

  // #endregion

  // #region Computed

  protected readonly activeCount = computed(() => Server.getActiveServiceCount(this.server()));

  // #endregion

  constructor() {}

  // #region Lifecycle
  // #endregion

  // #region Event Handlers

  protected onCardClick(): void {
    this.selected.emit(this.server());
  }

  // #endregion

  // #region Public Methods
  // #endregion

  // #region Private Helpers
  // #endregion
}
```

## Git workflow

- Commit and push only to the current branch (`develop` or a feature branch)
- Never commit or push directly to `main` — merging to `main` triggers a new `latest` Docker image publish
