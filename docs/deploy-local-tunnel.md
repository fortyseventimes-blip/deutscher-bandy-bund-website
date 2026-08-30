# Временный деплой: Windows ПК + Cloudflare Tunnel + домен с Hostinger

Это инструкция для интерим-хостинга сайта на твоём собственном Windows ПК, пока
не куплен настоящий VPS. Не полноценный деплой из `openspec/specs/delivery-infra`
(там staging, CI/CD, off-site бэкапы, quarterly restore drills) — это упрощённый,
но рабочий вариант: один `docker compose up -d` поднимает сайт, БД и туннель, и
всё это само перезапускается после перезагрузки ПК или падения контейнера.

Домен и хостинг физически разделены: домен как был куплен на Hostinger, так там
и остаётся (продлевать/платить — по-прежнему там). Меняется только то, **куда
он указывает** — через Cloudflare, который бесплатно выступает прокси/DNS и
поднимает зашифрованный туннель прямо к твоему ПК, без проброса портов на
роутере и без раскрытия домашнего IP.

## Что понадобится

- Тот же Windows ПК, что использовался для разработки (там уже есть Docker
  Desktop и склонирован репозиторий).
- Доступ к аккаунту Hostinger (чтобы сменить nameservers у домена).
- Бесплатный аккаунт на [cloudflare.com](https://cloudflare.com).
- Docker Desktop должен быть запущен и оставаться запущенным всё то время,
  пока сайт должен быть доступен.

## Шаг 1 — подключить домен к Cloudflare

1. Зарегистрируйся на cloudflare.com (бесплатный план — Free — этого достаточно).
2. **Add a site** → введи домен (например `bandy-bund.de`) → выбери план Free.
3. Cloudflare просканирует текущие DNS-записи домена и покажет **два
   nameserver-адреса** (что-то вроде `xxx.ns.cloudflare.com`,
   `yyy.ns.cloudflare.com`) — скопируй их.
4. Зайди в hPanel на Hostinger → раздел **Domains** → выбери домен → найди
   **Nameservers** (или **DNS / Name Servers**) → переключи на **Custom
   nameservers** → вставь те два адреса из Cloudflare → сохрани.
5. Подожди применения — обычно от 5–30 минут, иногда до суток. В Cloudflare
   статус домена изменится с "Pending Nameserver Update" на **"Active"**.
   Дальше все DNS-записи домена (включая почту, если она есть на Hostinger)
   настраиваются уже в Cloudflare, а не в Hostinger — если на домене есть
   почтовые (MX) записи, Cloudflare обычно переносит их автоматически при
   сканировании, но после переключения стоит проверить в Cloudflare → DNS,
   что MX-записи на месте, иначе почта на этом домене перестанет приходить.

## Шаг 2 — создать Cloudflare Tunnel

1. В Cloudflare зайди в **Zero Trust** (в левом меню, для аккаунта может
   попросить один раз задать team name — это ни на что не влияет, пиши любое).
2. **Networks → Tunnels → Create a tunnel**.
3. Тип коннектора — **Cloudflared**. Назови туннель, например `bandy-bund`.
4. На следующем шаге выбери окружение **Docker** — Cloudflare покажет команду
   вида:
   ```
   docker run cloudflare/cloudflared:latest tunnel run --token eyJhbGciOиJ...
   ```
   Не запускай эту команду — просто скопируй значение после `--token`
   (длинная строка). Она пойдёт в `.env.production` (шаг 4).
5. На этом же экране — **Public Hostname**: добавь hostname:
   - Domain: выбери свой домен из списка
   - Path: оставь пустым
   - Service: **HTTP**, URL: `app:3000`

   (`app` — это имя контейнера в `docker-compose`, не «localhost»: cloudflared
   и сайт будут в одной docker-сети и видят друг друга по имени сервиса.)
6. Сохрани. Cloudflare сам создаст нужную DNS-запись — руками в DNS ничего
   добавлять не нужно.

## Шаг 3 — настроить окружение и поднять стек

В корне репозитория на Windows ПК:

```powershell
copy .env.production.example .env.production
notepad .env.production
```

Заполни в `.env.production`:
- `NEXT_PUBLIC_SERVER_URL` — реальный домен с `https://`, например
  `https://bandy-bund.de`
- `POSTGRES_PASSWORD` — длинный случайный пароль (никуда, кроме этого файла и
  внутренней docker-сети, не уходит)
- `PAYLOAD_SECRET` — длинная случайная строка. В PowerShell можно
  сгенерировать так:
  ```powershell
  [Convert]::ToBase64String((1..48 | ForEach-Object { Get-Random -Maximum 256 }))
  ```
- `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` — логин/пароль первого
  админ-аккаунта (пароль поменяешь сразу после первого входа)
- `CLOUDFLARE_TUNNEL_TOKEN` — токен из шага 2.4

Дальше:

```powershell
docker compose -f infra\compose.prod.yml --env-file .env.production up -d --build
```

Первый запуск соберёт образ и накатит миграции — может занять несколько минут.
Проверить, что всё поднялось:

```powershell
docker compose -f infra\compose.prod.yml --env-file .env.production ps
docker compose -f infra\compose.prod.yml --env-file .env.production logs -f app
```

Все три контейнера (`bandy-prod-db`, `bandy-prod-app`, `bandy-prod-tunnel`)
должны быть в статусе `Up`. Открой `https://bandy-bund.de` в браузере — сайт
должен открыться с настоящим замком (HTTPS), это заслуга Cloudflare, ничего
для этого настраивать отдельно не нужно.

## Шаг 4 — первый вход в админку и смена пароля

Открой `https://bandy-bund.de/admin`, войди под `SEED_ADMIN_EMAIL` /
`SEED_ADMIN_PASSWORD` из `.env.production`, сразу зайди в свой профиль и смени
пароль на постоянный.

## Важно — в базе сейчас тестовые данные

В CMS уже лежат тестовые команды, игроки и матчи (сид для разработки —
вымышленный "Ян Ковальски" и придуманные результаты). Это специально сделано,
чтобы можно было проверить, что все страницы сайта работают с реальной базой,
а не выдумкой в коде. Прежде чем показывать сайт реальным посетителям,
реши один из двух вариантов:

- **Удалить тестовые записи** — зайти в `/admin`, в каждой из коллекций
  Teams / Players / Games / Tournaments / Staff / Venues / Opponents / Seasons
  выделить все строки и удалить, дальше вносить реальные данные вручную.
- **Оставить как временную демо-заглушку** — если сайт открывается только
  ограниченному кругу «на посмотреть, как это будет выглядеть», а не
  публично — тогда можно оставить и объяснить смотрящим, что это тестовые
  данные.

Продакшен-стек **не** запускает `pnpm seed` автоматически (это сознательно —
seed заново создаёт/обновляет тестовые записи, чего быть не должно на реальном
сайте). Если всё же нужно накатить тестовые данные вручную:

```powershell
docker compose -f infra\compose.prod.yml --env-file .env.production exec app pnpm seed
```

## Бэкапы

Есть готовый скрипт `infra\backup.ps1` — снимает дамп базы и архивирует
загруженные медиафайлы в папку `backups\` (не попадает в git).

Проверить руками:

```powershell
powershell -ExecutionPolicy Bypass -File infra\backup.ps1
```

Настроить ежедневный автозапуск через Планировщик заданий Windows:

1. **Планировщик заданий** (Task Scheduler) → **Создать задачу** (не
   «простую» — именно «Задачу», там больше настроек).
2. Вкладка **Общие**: имя — «Бэкап Bandy-Bund», отметить **Выполнять
   независимо от того, выполнен ли вход пользователя в систему**.
3. Вкладка **Триггеры** → **Создать** → Ежедневно, удобное время (например,
   03:00 ночи).
4. Вкладка **Действия** → **Создать** → Программа: `powershell.exe`,
   аргументы:
   ```
   -ExecutionPolicy Bypass -File "C:\путь\до\репозитория\infra\backup.ps1"
   ```
5. Сохранить, ввести пароль пользователя Windows при запросе.

По умолчанию скрипт хранит бэкапы за последние 30 дней и удаляет более
старые. Это защита только на этом же ПК — если ПК сгорит вместе с бэкапами,
они пропадут вместе с сайтом. Раз в 1–2 недели стоит вручную скопировать
папку `backups\` на внешний диск или в облако (Google Drive/Яндекс.Диск) —
это уже вручную, отдельного автоматизма для этого нет.

## Автозапуск после перезагрузки ПК

1. Docker Desktop → Settings → General → включить **Start Docker Desktop
   when you sign in**.
2. Контейнеры подняты с `restart: unless-stopped` — как только Docker Desktop
   стартует после перезагрузки, все три контейнера поднимутся сами (если их
   не останавливали руками перед выключением).
3. Проверка после следующей перезагрузки ПК: подожди пару минут, зайди на
   `https://bandy-bund.de` — должно открыться само, без ручного запуска
   `docker compose up`.

## Рекомендация по безопасности: закрыть /admin через Cloudflare Access

Порт приложения нигде не торчит наружу напрямую (только внутри docker-сети и
на `127.0.0.1` для твоей же проверки) — весь публичный трафик идёт только
через Cloudflare. Дополнительно стоит закрыть `/admin` отдельным логином
через Cloudflare Access (бесплатно для небольшого числа пользователей):

1. Zero Trust → **Access → Applications → Add an application → Self-hosted**.
2. Domain: тот же домен, Path: `/admin`.
3. Policy: allow только по списку email-адресов (свой + будущие редакторы).
4. При заходе на `/admin` сначала будет экран Cloudflare с вводом
   одноразового кода на email, и только потом — обычный логин в Payload.

Это не обязательно для старта, но сильно снижает риск перебора пароля
админки, пока сайт открыт всему интернету.

## Повседневные команды

```powershell
# посмотреть логи
docker compose -f infra\compose.prod.yml --env-file .env.production logs -f app

# перезапустить после обновления кода (git pull сделан заранее)
docker compose -f infra\compose.prod.yml --env-file .env.production up -d --build

# остановить всё
docker compose -f infra\compose.prod.yml --env-file .env.production down

# зайти внутрь контейнера приложения (например, вручную накатить сид)
docker compose -f infra\compose.prod.yml --env-file .env.production exec app sh
```

## Когда появится настоящий VPS

`Dockerfile` и `infra/compose.prod.yml` переносятся на VPS почти без
изменений — тот же образ, тот же `docker compose up -d --build`. Туннель
Cloudflare можно оставить (он одинаково хорошо работает что с домашнего ПК,
что с VPS) или заменить на прямой nginx/Caddy + Let's Encrypt на VPS — тогда
`cloudflared`-сервис из compose просто убирается. Дальше уже актуальна полная
`openspec/specs/delivery-infra`: staging-окружение, CI-пайплайн, off-site
бэкапы с ретеншеном, quarterly restore drills, мониторинг.
