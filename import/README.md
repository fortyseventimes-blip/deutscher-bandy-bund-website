# Папка для импорта (не попадает в git)

Сюда кладутся материалы для одноразового импорта в CMS. Всё, кроме этого файла,
игнорируется git'ом и в образ Docker не попадает — в продакшен-стеке папка
подключается к контейнеру только на чтение (`/app/import`).

```
import/
├── players/
│   ├── m-10-Jan-Kowalski.jpg      ← {пол}-{номер}-{имя}-{фамилия}.jpg
│   ├── w-7-Anna_Lena-Berg.jpg     ← "_" = пробел внутри имени
│   └── players.json               ← необязательно: позиция, клуб, автор фото
└── games.json                     ← матчи и турниры с ссылками на источник
```

Пол: `m` — Herren, `w` — Damen. Позиция в `players.json`: `TW`, `VER`, `MF`, `ST`.

```json
{
  "credit": "Instagram @deutscherbandybund",
  "players": {
    "m-10-Jan-Kowalski.jpg": { "position": "MF", "captain": true, "club": "…" }
  }
}
```

Запуск (из корня репозитория, стек уже поднят):

```powershell
docker compose -f infra\compose.prod.yml --env-file .env.production exec app pnpm import:players
docker compose -f infra\compose.prod.yml --env-file .env.production exec app pnpm import:games
```

Всё создаётся **черновиками**. Отчёт в конце перечисляет всё, что нужно
проверить (нет позиции, нет автора фото, одинаковые номера и т. п.) — ничего
не угадывается. Проверь записи в `/admin` и опубликуй. Повторный запуск
безопасен: игроки сопоставляются по slug, фото — по имени файла.
