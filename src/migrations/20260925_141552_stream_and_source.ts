import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_games_stream_provider" AS ENUM('fib-tv', 'bandyplay', 'youtube', 'other');
  CREATE TYPE "public"."enum__games_v_version_stream_provider" AS ENUM('fib-tv', 'bandyplay', 'youtube', 'other');
  ALTER TABLE "games" ADD COLUMN "stream_url" varchar;
  ALTER TABLE "games" ADD COLUMN "stream_provider" "enum_games_stream_provider";
  ALTER TABLE "games" ADD COLUMN "source_url" varchar;
  ALTER TABLE "_games_v" ADD COLUMN "version_stream_url" varchar;
  ALTER TABLE "_games_v" ADD COLUMN "version_stream_provider" "enum__games_v_version_stream_provider";
  ALTER TABLE "_games_v" ADD COLUMN "version_source_url" varchar;
  ALTER TABLE "tournaments" ADD COLUMN "source_url" varchar;
  ALTER TABLE "_tournaments_v" ADD COLUMN "version_source_url" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "games" DROP COLUMN "stream_url";
  ALTER TABLE "games" DROP COLUMN "stream_provider";
  ALTER TABLE "games" DROP COLUMN "source_url";
  ALTER TABLE "_games_v" DROP COLUMN "version_stream_url";
  ALTER TABLE "_games_v" DROP COLUMN "version_stream_provider";
  ALTER TABLE "_games_v" DROP COLUMN "version_source_url";
  ALTER TABLE "tournaments" DROP COLUMN "source_url";
  ALTER TABLE "_tournaments_v" DROP COLUMN "version_source_url";
  DROP TYPE "public"."enum_games_stream_provider";
  DROP TYPE "public"."enum__games_v_version_stream_provider";`)
}
