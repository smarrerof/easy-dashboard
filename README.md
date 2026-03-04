# easy-dashboard

Panel de control minimalista con estética terminal para gestionar los servicios de un homelab. La configuración se define en un archivo YAML que se monta como volumen — sin base de datos, sin backend.

easy-dashboard muestra de forma visual todos los servicios desplegados en tus servidores: nombre, puerto, estado (activo/inactivo) y un indicador de salud agregado por servidor. La configuración es completamente declarativa a través de un archivo `dashboard.yaml`.

---

## Configuración

| Clave | Obligatorio | Valor |
|---|---|---|
| DATA_PATH | 🟢 Sí | Directorio local que contiene `dashboard.yaml` |
| POLL_INTERVAL | ⚪ No | Intervalo en segundos para comprobar cambios en `dashboard.yaml` (defecto: `30`, `0` para desactivar) |

En el `docker-compose.yml`:

```yaml
volumes:
  - ./data:/usr/share/nginx/html/data:ro
```

Crea el directorio y el archivo de configuración antes de arrancar el contenedor:

```
proyecto/
├── docker-compose.yml
└── data/
    └── dashboard.yaml
```

---

## Estructura del archivo YAML

```yaml
version: 1  # Versión del esquema (requerida)

servers:
  - id: string          # Identificador único del servidor
    name: string        # Nombre visible en el panel
    host: string        # IP o hostname
    location: string    # Descripción de la ubicación (ej. "home", "rack")
    categories:
      - id: string      # Identificador único de la categoría
        name: string    # Nombre visible de la categoría
        services:
          - id: string          # Identificador único del servicio
            name: string        # Nombre visible del servicio
            description: string # Descripción breve
            url: string         # URL base del servicio (sin puerto)
            port: number        # Puerto del servicio
            status: string      # "active" | "inactive"
```

### Ejemplo básico

```yaml
version: 1

servers:
  - id: servidor-principal
    name: Servidor Principal
    host: 192.168.1.10
    location: home
    categories:
      - id: media
        name: Media
        services:
          - id: plex
            name: Plex
            description: Servidor personal de películas y series.
            url: http://192.168.1.10
            port: 32400
            status: active
```

---

## Uso con Docker Compose

### Imagen publicada en GitHub Container Registry

La forma más sencilla. Solo necesitas el `docker-compose.yml` y el directorio `data/`.

```yaml
services:
  easy-dashboard:
    image: ghcr.io/smarrerof/easy-dashboard:latest
    ports:
      - "8080:80"
    volumes:
      - <DATA_PATH>:/usr/share/nginx/html/data:ro
    restart: unless-stopped
```

```bash
docker compose up -d
```

### Construcción desde el repositorio

Si prefieres construir la imagen directamente desde el código fuente del repositorio:

```bash
# Última versión de main
docker build -t easy-dashboard .

# Versión específica
docker build --build-arg VERSION=0.1.0 -t easy-dashboard:0.1.0 .
```

Y en el `docker-compose.yml`:

```yaml
services:
  easy-dashboard:
    image: easy-dashboard:0.1.0
    ports:
      - "8080:80"
    volumes:
      - <DATA_PATH>:/usr/share/nginx/html/data:ro
    restart: unless-stopped
```

```bash
docker compose up -d
```

---

## Versiones disponibles

Las imágenes publicadas están disponibles en [ghcr.io/smarrerof/easy-dashboard](https://github.com/smarrerof/easy-dashboard/pkgs/container/easy-dashboard).

| Tag | Descripción |
|---|---|
| `latest` | Última versión estable publicada desde `main` |
| `0.1.0` | Versión específica |
