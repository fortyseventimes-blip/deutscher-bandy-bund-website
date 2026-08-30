import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_teams_gender" AS ENUM('herren', 'damen', 'nachwuchs');
  CREATE TYPE "public"."enum_players_position" AS ENUM('TW', 'VER', 'MF', 'ST');
  CREATE TYPE "public"."enum_players_player_status" AS ENUM('active', 'injured', 'inactive', 'alumni');
  CREATE TYPE "public"."enum_players_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__players_v_version_position" AS ENUM('TW', 'VER', 'MF', 'ST');
  CREATE TYPE "public"."enum__players_v_version_player_status" AS ENUM('active', 'injured', 'inactive', 'alumni');
  CREATE TYPE "public"."enum__players_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__players_v_published_locale" AS ENUM('de', 'en');
  CREATE TYPE "public"."enum_games_roster_home_players_events_type" AS ENUM('goal', 'assist', 'penalty');
  CREATE TYPE "public"."enum_games_roster_home_players_position" AS ENUM('TW', 'VER', 'MF', 'ST');
  CREATE TYPE "public"."enum_games_roster_away_players_events_type" AS ENUM('goal', 'assist', 'penalty');
  CREATE TYPE "public"."enum_games_roster_away_players_position" AS ENUM('TW', 'VER', 'MF', 'ST');
  CREATE TYPE "public"."enum_games_events_type" AS ENUM('goal', 'penalty', 'card', 'info');
  CREATE TYPE "public"."enum_games_events_side" AS ENUM('home', 'away');
  CREATE TYPE "public"."enum_games_game_status" AS ENUM('scheduled', 'live', 'finished', 'postponed', 'cancelled');
  CREATE TYPE "public"."enum_games_competition_kind" AS ENUM('friendly', 'tournament', 'qualifier', 'league');
  CREATE TYPE "public"."enum_games_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__games_v_version_roster_home_players_events_type" AS ENUM('goal', 'assist', 'penalty');
  CREATE TYPE "public"."enum__games_v_version_roster_home_players_position" AS ENUM('TW', 'VER', 'MF', 'ST');
  CREATE TYPE "public"."enum__games_v_version_roster_away_players_events_type" AS ENUM('goal', 'assist', 'penalty');
  CREATE TYPE "public"."enum__games_v_version_roster_away_players_position" AS ENUM('TW', 'VER', 'MF', 'ST');
  CREATE TYPE "public"."enum__games_v_version_events_type" AS ENUM('goal', 'penalty', 'card', 'info');
  CREATE TYPE "public"."enum__games_v_version_events_side" AS ENUM('home', 'away');
  CREATE TYPE "public"."enum__games_v_version_game_status" AS ENUM('scheduled', 'live', 'finished', 'postponed', 'cancelled');
  CREATE TYPE "public"."enum__games_v_version_competition_kind" AS ENUM('friendly', 'tournament', 'qualifier', 'league');
  CREATE TYPE "public"."enum__games_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__games_v_published_locale" AS ENUM('de', 'en');
  CREATE TYPE "public"."enum_tournaments_standings_rows_zone" AS ENUM('qualify', 'relegate');
  CREATE TYPE "public"."enum_tournaments_type" AS ENUM('weltmeisterschaft', 'pokal', 'liga', 'qualifikation', 'turnier', 'sonstiges');
  CREATE TYPE "public"."enum_tournaments_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__tournaments_v_version_standings_rows_zone" AS ENUM('qualify', 'relegate');
  CREATE TYPE "public"."enum__tournaments_v_version_type" AS ENUM('weltmeisterschaft', 'pokal', 'liga', 'qualifikation', 'turnier', 'sonstiges');
  CREATE TYPE "public"."enum__tournaments_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__tournaments_v_published_locale" AS ENUM('de', 'en');
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"credit" varchar,
  	"license" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumbnail_url" varchar,
  	"sizes_thumbnail_width" numeric,
  	"sizes_thumbnail_height" numeric,
  	"sizes_thumbnail_mime_type" varchar,
  	"sizes_thumbnail_filesize" numeric,
  	"sizes_thumbnail_filename" varchar,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar
  );
  
  CREATE TABLE "media_locales" (
  	"alt" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "seasons" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"start_date" timestamp(3) with time zone,
  	"end_date" timestamp(3) with time zone,
  	"is_current" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "venues" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"city" varchar NOT NULL,
  	"address" varchar,
  	"map_query" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "opponents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"short_name" varchar NOT NULL,
  	"crest_code" varchar NOT NULL,
  	"country" varchar,
  	"accent" varchar,
  	"website" varchar,
  	"crest_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "teams" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"gender" "enum_teams_gender" NOT NULL,
  	"age_group" varchar,
  	"crest_code" varchar DEFAULT 'DEU' NOT NULL,
  	"short_name" varchar DEFAULT 'GER' NOT NULL,
  	"accent" varchar,
  	"crest_id" integer,
  	"coach" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "teams_locales" (
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "staff" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"team_id" integer NOT NULL,
  	"portrait_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "staff_locales" (
  	"role" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "players_memberships" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"season_id" integer,
  	"team_id" integer
  );
  
  CREATE TABLE "players" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"first_name" varchar,
  	"last_name" varchar,
  	"team_id" integer,
  	"number" numeric,
  	"position" "enum_players_position",
  	"player_status" "enum_players_player_status" DEFAULT 'active',
  	"captain" boolean DEFAULT false,
  	"nationality" varchar DEFAULT 'Deutschland',
  	"birth_year" numeric,
  	"joined_year" numeric,
  	"height_cm" numeric,
  	"weight_kg" numeric,
  	"club" varchar,
  	"portrait_id" integer,
  	"stats_caps" numeric DEFAULT 0,
  	"stats_goals" numeric DEFAULT 0,
  	"stats_assists" numeric DEFAULT 0,
  	"ai_assisted" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_players_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "players_locales" (
  	"slug" varchar,
  	"bio" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_players_v_version_memberships" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"season_id" integer,
  	"team_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_players_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_first_name" varchar,
  	"version_last_name" varchar,
  	"version_team_id" integer,
  	"version_number" numeric,
  	"version_position" "enum__players_v_version_position",
  	"version_player_status" "enum__players_v_version_player_status" DEFAULT 'active',
  	"version_captain" boolean DEFAULT false,
  	"version_nationality" varchar DEFAULT 'Deutschland',
  	"version_birth_year" numeric,
  	"version_joined_year" numeric,
  	"version_height_cm" numeric,
  	"version_weight_kg" numeric,
  	"version_club" varchar,
  	"version_portrait_id" integer,
  	"version_stats_caps" numeric DEFAULT 0,
  	"version_stats_goals" numeric DEFAULT 0,
  	"version_stats_assists" numeric DEFAULT 0,
  	"version_ai_assisted" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__players_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__players_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_players_v_locales" (
  	"version_slug" varchar,
  	"version_bio" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "games_roster_home_players_events" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"type" "enum_games_roster_home_players_events_type"
  );
  
  CREATE TABLE "games_roster_home_players" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"player_id" integer,
  	"first_name" varchar,
  	"last_name" varchar,
  	"number" numeric,
  	"position" "enum_games_roster_home_players_position",
  	"starter" boolean DEFAULT true,
  	"captain" boolean DEFAULT false
  );
  
  CREATE TABLE "games_roster_away_players_events" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"type" "enum_games_roster_away_players_events_type"
  );
  
  CREATE TABLE "games_roster_away_players" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"player_id" integer,
  	"first_name" varchar,
  	"last_name" varchar,
  	"number" numeric,
  	"position" "enum_games_roster_away_players_position",
  	"starter" boolean DEFAULT true,
  	"captain" boolean DEFAULT false
  );
  
  CREATE TABLE "games_report_paragraphs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "games_events" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"minute" numeric,
  	"type" "enum_games_events_type",
  	"side" "enum_games_events_side",
  	"running_home" numeric,
  	"running_away" numeric
  );
  
  CREATE TABLE "games_events_locales" (
  	"title" varchar,
  	"detail" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "games_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"home" numeric,
  	"away" numeric
  );
  
  CREATE TABLE "games_stats_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "games_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer
  );
  
  CREATE TABLE "games" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar,
  	"kickoff" timestamp(3) with time zone,
  	"game_status" "enum_games_game_status" DEFAULT 'scheduled',
  	"competition_name" varchar,
  	"competition_kind" "enum_games_competition_kind",
  	"home_score" numeric,
  	"away_score" numeric,
  	"halftime_home" numeric,
  	"halftime_away" numeric,
  	"venue_id" integer,
  	"is_tournament_game" boolean DEFAULT false,
  	"tournament_id" integer,
  	"live_minute" numeric,
  	"postponed_to" timestamp(3) with time zone,
  	"ticket_url" varchar,
  	"roster_submitted" boolean DEFAULT false,
  	"roster_home_coach" varchar,
  	"roster_home_formation" varchar,
  	"roster_away_coach" varchar,
  	"roster_away_formation" varchar,
  	"referee" varchar,
  	"attendance" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_games_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "games_locales" (
  	"round" varchar,
  	"tournament_day_label" varchar,
  	"cancellation_reason" varchar,
  	"report_pull_quote" varchar,
  	"weather_note" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "games_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "games_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"teams_id" integer,
  	"opponents_id" integer
  );
  
  CREATE TABLE "_games_v_version_roster_home_players_events" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"type" "enum__games_v_version_roster_home_players_events_type",
  	"_uuid" varchar
  );
  
  CREATE TABLE "_games_v_version_roster_home_players" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"player_id" integer,
  	"first_name" varchar,
  	"last_name" varchar,
  	"number" numeric,
  	"position" "enum__games_v_version_roster_home_players_position",
  	"starter" boolean DEFAULT true,
  	"captain" boolean DEFAULT false,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_games_v_version_roster_away_players_events" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"type" "enum__games_v_version_roster_away_players_events_type",
  	"_uuid" varchar
  );
  
  CREATE TABLE "_games_v_version_roster_away_players" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"player_id" integer,
  	"first_name" varchar,
  	"last_name" varchar,
  	"number" numeric,
  	"position" "enum__games_v_version_roster_away_players_position",
  	"starter" boolean DEFAULT true,
  	"captain" boolean DEFAULT false,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_games_v_version_report_paragraphs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_games_v_version_events" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"minute" numeric,
  	"type" "enum__games_v_version_events_type",
  	"side" "enum__games_v_version_events_side",
  	"running_home" numeric,
  	"running_away" numeric,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_games_v_version_events_locales" (
  	"title" varchar,
  	"detail" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_games_v_version_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"home" numeric,
  	"away" numeric,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_games_v_version_stats_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_games_v_version_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_games_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_slug" varchar,
  	"version_kickoff" timestamp(3) with time zone,
  	"version_game_status" "enum__games_v_version_game_status" DEFAULT 'scheduled',
  	"version_competition_name" varchar,
  	"version_competition_kind" "enum__games_v_version_competition_kind",
  	"version_home_score" numeric,
  	"version_away_score" numeric,
  	"version_halftime_home" numeric,
  	"version_halftime_away" numeric,
  	"version_venue_id" integer,
  	"version_is_tournament_game" boolean DEFAULT false,
  	"version_tournament_id" integer,
  	"version_live_minute" numeric,
  	"version_postponed_to" timestamp(3) with time zone,
  	"version_ticket_url" varchar,
  	"version_roster_submitted" boolean DEFAULT false,
  	"version_roster_home_coach" varchar,
  	"version_roster_home_formation" varchar,
  	"version_roster_away_coach" varchar,
  	"version_roster_away_formation" varchar,
  	"version_referee" varchar,
  	"version_attendance" numeric,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__games_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__games_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_games_v_locales" (
  	"version_round" varchar,
  	"version_tournament_day_label" varchar,
  	"version_cancellation_reason" varchar,
  	"version_report_pull_quote" varchar,
  	"version_weather_note" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_games_v_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "_games_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"teams_id" integer,
  	"opponents_id" integer
  );
  
  CREATE TABLE "tournaments_participants" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"host" boolean DEFAULT false,
  	"resolved" boolean DEFAULT true
  );
  
  CREATE TABLE "tournaments_standings_rows" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"rank" numeric,
  	"team_name" varchar,
  	"is_germany" boolean DEFAULT false,
  	"played" numeric DEFAULT 0,
  	"win" numeric DEFAULT 0,
  	"draw" numeric DEFAULT 0,
  	"loss" numeric DEFAULT 0,
  	"goals_for" numeric DEFAULT 0,
  	"goals_against" numeric DEFAULT 0,
  	"points" numeric DEFAULT 0,
  	"zone" "enum_tournaments_standings_rows_zone"
  );
  
  CREATE TABLE "tournaments" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"type" "enum_tournaments_type",
  	"start_date" timestamp(3) with time zone,
  	"end_date" timestamp(3) with time zone,
  	"venue_id" integer,
  	"hero_id" integer,
  	"featured_standings" boolean DEFAULT false,
  	"standings_preseason" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_tournaments_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "tournaments_locales" (
  	"name" varchar,
  	"slug" varchar,
  	"format" varchar,
  	"weather_note" varchar,
  	"placement" varchar,
  	"standings_note" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "tournaments_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar,
  	"locale" "_locales"
  );
  
  CREATE TABLE "_tournaments_v_version_participants" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"host" boolean DEFAULT false,
  	"resolved" boolean DEFAULT true,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_tournaments_v_version_standings_rows" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"rank" numeric,
  	"team_name" varchar,
  	"is_germany" boolean DEFAULT false,
  	"played" numeric DEFAULT 0,
  	"win" numeric DEFAULT 0,
  	"draw" numeric DEFAULT 0,
  	"loss" numeric DEFAULT 0,
  	"goals_for" numeric DEFAULT 0,
  	"goals_against" numeric DEFAULT 0,
  	"points" numeric DEFAULT 0,
  	"zone" "enum__tournaments_v_version_standings_rows_zone",
  	"_uuid" varchar
  );
  
  CREATE TABLE "_tournaments_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_type" "enum__tournaments_v_version_type",
  	"version_start_date" timestamp(3) with time zone,
  	"version_end_date" timestamp(3) with time zone,
  	"version_venue_id" integer,
  	"version_hero_id" integer,
  	"version_featured_standings" boolean DEFAULT false,
  	"version_standings_preseason" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__tournaments_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__tournaments_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_tournaments_v_locales" (
  	"version_name" varchar,
  	"version_slug" varchar,
  	"version_format" varchar,
  	"version_weather_note" varchar,
  	"version_placement" varchar,
  	"version_standings_note" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_tournaments_v_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar,
  	"locale" "_locales"
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "media_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "seasons_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "venues_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "opponents_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "teams_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "staff_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "players_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "games_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "tournaments_id" integer;
  ALTER TABLE "media_locales" ADD CONSTRAINT "media_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "opponents" ADD CONSTRAINT "opponents_crest_id_media_id_fk" FOREIGN KEY ("crest_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "teams" ADD CONSTRAINT "teams_crest_id_media_id_fk" FOREIGN KEY ("crest_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "teams_locales" ADD CONSTRAINT "teams_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."teams"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "staff" ADD CONSTRAINT "staff_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "staff" ADD CONSTRAINT "staff_portrait_id_media_id_fk" FOREIGN KEY ("portrait_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "staff_locales" ADD CONSTRAINT "staff_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."staff"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "players_memberships" ADD CONSTRAINT "players_memberships_season_id_seasons_id_fk" FOREIGN KEY ("season_id") REFERENCES "public"."seasons"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "players_memberships" ADD CONSTRAINT "players_memberships_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "players_memberships" ADD CONSTRAINT "players_memberships_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."players"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "players" ADD CONSTRAINT "players_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "players" ADD CONSTRAINT "players_portrait_id_media_id_fk" FOREIGN KEY ("portrait_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "players_locales" ADD CONSTRAINT "players_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."players"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_players_v_version_memberships" ADD CONSTRAINT "_players_v_version_memberships_season_id_seasons_id_fk" FOREIGN KEY ("season_id") REFERENCES "public"."seasons"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_players_v_version_memberships" ADD CONSTRAINT "_players_v_version_memberships_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_players_v_version_memberships" ADD CONSTRAINT "_players_v_version_memberships_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_players_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_players_v" ADD CONSTRAINT "_players_v_parent_id_players_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."players"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_players_v" ADD CONSTRAINT "_players_v_version_team_id_teams_id_fk" FOREIGN KEY ("version_team_id") REFERENCES "public"."teams"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_players_v" ADD CONSTRAINT "_players_v_version_portrait_id_media_id_fk" FOREIGN KEY ("version_portrait_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_players_v_locales" ADD CONSTRAINT "_players_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_players_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "games_roster_home_players_events" ADD CONSTRAINT "games_roster_home_players_events_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."games_roster_home_players"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "games_roster_home_players" ADD CONSTRAINT "games_roster_home_players_player_id_players_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."players"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "games_roster_home_players" ADD CONSTRAINT "games_roster_home_players_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."games"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "games_roster_away_players_events" ADD CONSTRAINT "games_roster_away_players_events_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."games_roster_away_players"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "games_roster_away_players" ADD CONSTRAINT "games_roster_away_players_player_id_players_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."players"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "games_roster_away_players" ADD CONSTRAINT "games_roster_away_players_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."games"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "games_report_paragraphs" ADD CONSTRAINT "games_report_paragraphs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."games"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "games_events" ADD CONSTRAINT "games_events_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."games"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "games_events_locales" ADD CONSTRAINT "games_events_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."games_events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "games_stats" ADD CONSTRAINT "games_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."games"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "games_stats_locales" ADD CONSTRAINT "games_stats_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."games_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "games_gallery" ADD CONSTRAINT "games_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "games_gallery" ADD CONSTRAINT "games_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."games"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "games" ADD CONSTRAINT "games_venue_id_venues_id_fk" FOREIGN KEY ("venue_id") REFERENCES "public"."venues"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "games" ADD CONSTRAINT "games_tournament_id_tournaments_id_fk" FOREIGN KEY ("tournament_id") REFERENCES "public"."tournaments"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "games_locales" ADD CONSTRAINT "games_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."games"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "games_texts" ADD CONSTRAINT "games_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."games"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "games_rels" ADD CONSTRAINT "games_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."games"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "games_rels" ADD CONSTRAINT "games_rels_teams_fk" FOREIGN KEY ("teams_id") REFERENCES "public"."teams"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "games_rels" ADD CONSTRAINT "games_rels_opponents_fk" FOREIGN KEY ("opponents_id") REFERENCES "public"."opponents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_games_v_version_roster_home_players_events" ADD CONSTRAINT "_games_v_version_roster_home_players_events_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_games_v_version_roster_home_players"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_games_v_version_roster_home_players" ADD CONSTRAINT "_games_v_version_roster_home_players_player_id_players_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."players"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_games_v_version_roster_home_players" ADD CONSTRAINT "_games_v_version_roster_home_players_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_games_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_games_v_version_roster_away_players_events" ADD CONSTRAINT "_games_v_version_roster_away_players_events_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_games_v_version_roster_away_players"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_games_v_version_roster_away_players" ADD CONSTRAINT "_games_v_version_roster_away_players_player_id_players_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."players"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_games_v_version_roster_away_players" ADD CONSTRAINT "_games_v_version_roster_away_players_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_games_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_games_v_version_report_paragraphs" ADD CONSTRAINT "_games_v_version_report_paragraphs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_games_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_games_v_version_events" ADD CONSTRAINT "_games_v_version_events_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_games_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_games_v_version_events_locales" ADD CONSTRAINT "_games_v_version_events_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_games_v_version_events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_games_v_version_stats" ADD CONSTRAINT "_games_v_version_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_games_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_games_v_version_stats_locales" ADD CONSTRAINT "_games_v_version_stats_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_games_v_version_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_games_v_version_gallery" ADD CONSTRAINT "_games_v_version_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_games_v_version_gallery" ADD CONSTRAINT "_games_v_version_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_games_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_games_v" ADD CONSTRAINT "_games_v_parent_id_games_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."games"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_games_v" ADD CONSTRAINT "_games_v_version_venue_id_venues_id_fk" FOREIGN KEY ("version_venue_id") REFERENCES "public"."venues"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_games_v" ADD CONSTRAINT "_games_v_version_tournament_id_tournaments_id_fk" FOREIGN KEY ("version_tournament_id") REFERENCES "public"."tournaments"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_games_v_locales" ADD CONSTRAINT "_games_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_games_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_games_v_texts" ADD CONSTRAINT "_games_v_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_games_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_games_v_rels" ADD CONSTRAINT "_games_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_games_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_games_v_rels" ADD CONSTRAINT "_games_v_rels_teams_fk" FOREIGN KEY ("teams_id") REFERENCES "public"."teams"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_games_v_rels" ADD CONSTRAINT "_games_v_rels_opponents_fk" FOREIGN KEY ("opponents_id") REFERENCES "public"."opponents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tournaments_participants" ADD CONSTRAINT "tournaments_participants_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tournaments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tournaments_standings_rows" ADD CONSTRAINT "tournaments_standings_rows_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tournaments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tournaments" ADD CONSTRAINT "tournaments_venue_id_venues_id_fk" FOREIGN KEY ("venue_id") REFERENCES "public"."venues"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "tournaments" ADD CONSTRAINT "tournaments_hero_id_media_id_fk" FOREIGN KEY ("hero_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "tournaments_locales" ADD CONSTRAINT "tournaments_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tournaments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tournaments_texts" ADD CONSTRAINT "tournaments_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."tournaments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_tournaments_v_version_participants" ADD CONSTRAINT "_tournaments_v_version_participants_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_tournaments_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_tournaments_v_version_standings_rows" ADD CONSTRAINT "_tournaments_v_version_standings_rows_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_tournaments_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_tournaments_v" ADD CONSTRAINT "_tournaments_v_parent_id_tournaments_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."tournaments"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_tournaments_v" ADD CONSTRAINT "_tournaments_v_version_venue_id_venues_id_fk" FOREIGN KEY ("version_venue_id") REFERENCES "public"."venues"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_tournaments_v" ADD CONSTRAINT "_tournaments_v_version_hero_id_media_id_fk" FOREIGN KEY ("version_hero_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_tournaments_v_locales" ADD CONSTRAINT "_tournaments_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_tournaments_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_tournaments_v_texts" ADD CONSTRAINT "_tournaments_v_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_tournaments_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "media" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE UNIQUE INDEX "media_locales_locale_parent_id_unique" ON "media_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "seasons_name_idx" ON "seasons" USING btree ("name");
  CREATE INDEX "seasons_updated_at_idx" ON "seasons" USING btree ("updated_at");
  CREATE INDEX "seasons_created_at_idx" ON "seasons" USING btree ("created_at");
  CREATE INDEX "venues_updated_at_idx" ON "venues" USING btree ("updated_at");
  CREATE INDEX "venues_created_at_idx" ON "venues" USING btree ("created_at");
  CREATE INDEX "opponents_crest_idx" ON "opponents" USING btree ("crest_id");
  CREATE INDEX "opponents_updated_at_idx" ON "opponents" USING btree ("updated_at");
  CREATE INDEX "opponents_created_at_idx" ON "opponents" USING btree ("created_at");
  CREATE INDEX "teams_crest_idx" ON "teams" USING btree ("crest_id");
  CREATE INDEX "teams_updated_at_idx" ON "teams" USING btree ("updated_at");
  CREATE INDEX "teams_created_at_idx" ON "teams" USING btree ("created_at");
  CREATE UNIQUE INDEX "teams_slug_idx" ON "teams_locales" USING btree ("slug","_locale");
  CREATE UNIQUE INDEX "teams_locales_locale_parent_id_unique" ON "teams_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "staff_team_idx" ON "staff" USING btree ("team_id");
  CREATE INDEX "staff_portrait_idx" ON "staff" USING btree ("portrait_id");
  CREATE INDEX "staff_updated_at_idx" ON "staff" USING btree ("updated_at");
  CREATE INDEX "staff_created_at_idx" ON "staff" USING btree ("created_at");
  CREATE UNIQUE INDEX "staff_locales_locale_parent_id_unique" ON "staff_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "players_memberships_order_idx" ON "players_memberships" USING btree ("_order");
  CREATE INDEX "players_memberships_parent_id_idx" ON "players_memberships" USING btree ("_parent_id");
  CREATE INDEX "players_memberships_season_idx" ON "players_memberships" USING btree ("season_id");
  CREATE INDEX "players_memberships_team_idx" ON "players_memberships" USING btree ("team_id");
  CREATE INDEX "players_team_idx" ON "players" USING btree ("team_id");
  CREATE INDEX "players_portrait_idx" ON "players" USING btree ("portrait_id");
  CREATE INDEX "players_updated_at_idx" ON "players" USING btree ("updated_at");
  CREATE INDEX "players_created_at_idx" ON "players" USING btree ("created_at");
  CREATE INDEX "players__status_idx" ON "players" USING btree ("_status");
  CREATE UNIQUE INDEX "players_slug_idx" ON "players_locales" USING btree ("slug","_locale");
  CREATE UNIQUE INDEX "players_locales_locale_parent_id_unique" ON "players_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_players_v_version_memberships_order_idx" ON "_players_v_version_memberships" USING btree ("_order");
  CREATE INDEX "_players_v_version_memberships_parent_id_idx" ON "_players_v_version_memberships" USING btree ("_parent_id");
  CREATE INDEX "_players_v_version_memberships_season_idx" ON "_players_v_version_memberships" USING btree ("season_id");
  CREATE INDEX "_players_v_version_memberships_team_idx" ON "_players_v_version_memberships" USING btree ("team_id");
  CREATE INDEX "_players_v_parent_idx" ON "_players_v" USING btree ("parent_id");
  CREATE INDEX "_players_v_version_version_team_idx" ON "_players_v" USING btree ("version_team_id");
  CREATE INDEX "_players_v_version_version_portrait_idx" ON "_players_v" USING btree ("version_portrait_id");
  CREATE INDEX "_players_v_version_version_updated_at_idx" ON "_players_v" USING btree ("version_updated_at");
  CREATE INDEX "_players_v_version_version_created_at_idx" ON "_players_v" USING btree ("version_created_at");
  CREATE INDEX "_players_v_version_version__status_idx" ON "_players_v" USING btree ("version__status");
  CREATE INDEX "_players_v_created_at_idx" ON "_players_v" USING btree ("created_at");
  CREATE INDEX "_players_v_updated_at_idx" ON "_players_v" USING btree ("updated_at");
  CREATE INDEX "_players_v_snapshot_idx" ON "_players_v" USING btree ("snapshot");
  CREATE INDEX "_players_v_published_locale_idx" ON "_players_v" USING btree ("published_locale");
  CREATE INDEX "_players_v_latest_idx" ON "_players_v" USING btree ("latest");
  CREATE INDEX "_players_v_version_version_slug_idx" ON "_players_v_locales" USING btree ("version_slug","_locale");
  CREATE UNIQUE INDEX "_players_v_locales_locale_parent_id_unique" ON "_players_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "games_roster_home_players_events_order_idx" ON "games_roster_home_players_events" USING btree ("_order");
  CREATE INDEX "games_roster_home_players_events_parent_id_idx" ON "games_roster_home_players_events" USING btree ("_parent_id");
  CREATE INDEX "games_roster_home_players_order_idx" ON "games_roster_home_players" USING btree ("_order");
  CREATE INDEX "games_roster_home_players_parent_id_idx" ON "games_roster_home_players" USING btree ("_parent_id");
  CREATE INDEX "games_roster_home_players_player_idx" ON "games_roster_home_players" USING btree ("player_id");
  CREATE INDEX "games_roster_away_players_events_order_idx" ON "games_roster_away_players_events" USING btree ("_order");
  CREATE INDEX "games_roster_away_players_events_parent_id_idx" ON "games_roster_away_players_events" USING btree ("_parent_id");
  CREATE INDEX "games_roster_away_players_order_idx" ON "games_roster_away_players" USING btree ("_order");
  CREATE INDEX "games_roster_away_players_parent_id_idx" ON "games_roster_away_players" USING btree ("_parent_id");
  CREATE INDEX "games_roster_away_players_player_idx" ON "games_roster_away_players" USING btree ("player_id");
  CREATE INDEX "games_report_paragraphs_order_idx" ON "games_report_paragraphs" USING btree ("_order");
  CREATE INDEX "games_report_paragraphs_parent_id_idx" ON "games_report_paragraphs" USING btree ("_parent_id");
  CREATE INDEX "games_report_paragraphs_locale_idx" ON "games_report_paragraphs" USING btree ("_locale");
  CREATE INDEX "games_events_order_idx" ON "games_events" USING btree ("_order");
  CREATE INDEX "games_events_parent_id_idx" ON "games_events" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "games_events_locales_locale_parent_id_unique" ON "games_events_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "games_stats_order_idx" ON "games_stats" USING btree ("_order");
  CREATE INDEX "games_stats_parent_id_idx" ON "games_stats" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "games_stats_locales_locale_parent_id_unique" ON "games_stats_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "games_gallery_order_idx" ON "games_gallery" USING btree ("_order");
  CREATE INDEX "games_gallery_parent_id_idx" ON "games_gallery" USING btree ("_parent_id");
  CREATE INDEX "games_gallery_image_idx" ON "games_gallery" USING btree ("image_id");
  CREATE UNIQUE INDEX "games_slug_idx" ON "games" USING btree ("slug");
  CREATE INDEX "games_venue_idx" ON "games" USING btree ("venue_id");
  CREATE INDEX "games_tournament_idx" ON "games" USING btree ("tournament_id");
  CREATE INDEX "games_updated_at_idx" ON "games" USING btree ("updated_at");
  CREATE INDEX "games_created_at_idx" ON "games" USING btree ("created_at");
  CREATE INDEX "games__status_idx" ON "games" USING btree ("_status");
  CREATE UNIQUE INDEX "games_locales_locale_parent_id_unique" ON "games_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "games_texts_order_parent" ON "games_texts" USING btree ("order","parent_id");
  CREATE INDEX "games_rels_order_idx" ON "games_rels" USING btree ("order");
  CREATE INDEX "games_rels_parent_idx" ON "games_rels" USING btree ("parent_id");
  CREATE INDEX "games_rels_path_idx" ON "games_rels" USING btree ("path");
  CREATE INDEX "games_rels_teams_id_idx" ON "games_rels" USING btree ("teams_id");
  CREATE INDEX "games_rels_opponents_id_idx" ON "games_rels" USING btree ("opponents_id");
  CREATE INDEX "_games_v_version_roster_home_players_events_order_idx" ON "_games_v_version_roster_home_players_events" USING btree ("_order");
  CREATE INDEX "_games_v_version_roster_home_players_events_parent_id_idx" ON "_games_v_version_roster_home_players_events" USING btree ("_parent_id");
  CREATE INDEX "_games_v_version_roster_home_players_order_idx" ON "_games_v_version_roster_home_players" USING btree ("_order");
  CREATE INDEX "_games_v_version_roster_home_players_parent_id_idx" ON "_games_v_version_roster_home_players" USING btree ("_parent_id");
  CREATE INDEX "_games_v_version_roster_home_players_player_idx" ON "_games_v_version_roster_home_players" USING btree ("player_id");
  CREATE INDEX "_games_v_version_roster_away_players_events_order_idx" ON "_games_v_version_roster_away_players_events" USING btree ("_order");
  CREATE INDEX "_games_v_version_roster_away_players_events_parent_id_idx" ON "_games_v_version_roster_away_players_events" USING btree ("_parent_id");
  CREATE INDEX "_games_v_version_roster_away_players_order_idx" ON "_games_v_version_roster_away_players" USING btree ("_order");
  CREATE INDEX "_games_v_version_roster_away_players_parent_id_idx" ON "_games_v_version_roster_away_players" USING btree ("_parent_id");
  CREATE INDEX "_games_v_version_roster_away_players_player_idx" ON "_games_v_version_roster_away_players" USING btree ("player_id");
  CREATE INDEX "_games_v_version_report_paragraphs_order_idx" ON "_games_v_version_report_paragraphs" USING btree ("_order");
  CREATE INDEX "_games_v_version_report_paragraphs_parent_id_idx" ON "_games_v_version_report_paragraphs" USING btree ("_parent_id");
  CREATE INDEX "_games_v_version_report_paragraphs_locale_idx" ON "_games_v_version_report_paragraphs" USING btree ("_locale");
  CREATE INDEX "_games_v_version_events_order_idx" ON "_games_v_version_events" USING btree ("_order");
  CREATE INDEX "_games_v_version_events_parent_id_idx" ON "_games_v_version_events" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_games_v_version_events_locales_locale_parent_id_unique" ON "_games_v_version_events_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_games_v_version_stats_order_idx" ON "_games_v_version_stats" USING btree ("_order");
  CREATE INDEX "_games_v_version_stats_parent_id_idx" ON "_games_v_version_stats" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_games_v_version_stats_locales_locale_parent_id_unique" ON "_games_v_version_stats_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_games_v_version_gallery_order_idx" ON "_games_v_version_gallery" USING btree ("_order");
  CREATE INDEX "_games_v_version_gallery_parent_id_idx" ON "_games_v_version_gallery" USING btree ("_parent_id");
  CREATE INDEX "_games_v_version_gallery_image_idx" ON "_games_v_version_gallery" USING btree ("image_id");
  CREATE INDEX "_games_v_parent_idx" ON "_games_v" USING btree ("parent_id");
  CREATE INDEX "_games_v_version_version_slug_idx" ON "_games_v" USING btree ("version_slug");
  CREATE INDEX "_games_v_version_version_venue_idx" ON "_games_v" USING btree ("version_venue_id");
  CREATE INDEX "_games_v_version_version_tournament_idx" ON "_games_v" USING btree ("version_tournament_id");
  CREATE INDEX "_games_v_version_version_updated_at_idx" ON "_games_v" USING btree ("version_updated_at");
  CREATE INDEX "_games_v_version_version_created_at_idx" ON "_games_v" USING btree ("version_created_at");
  CREATE INDEX "_games_v_version_version__status_idx" ON "_games_v" USING btree ("version__status");
  CREATE INDEX "_games_v_created_at_idx" ON "_games_v" USING btree ("created_at");
  CREATE INDEX "_games_v_updated_at_idx" ON "_games_v" USING btree ("updated_at");
  CREATE INDEX "_games_v_snapshot_idx" ON "_games_v" USING btree ("snapshot");
  CREATE INDEX "_games_v_published_locale_idx" ON "_games_v" USING btree ("published_locale");
  CREATE INDEX "_games_v_latest_idx" ON "_games_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_games_v_locales_locale_parent_id_unique" ON "_games_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_games_v_texts_order_parent" ON "_games_v_texts" USING btree ("order","parent_id");
  CREATE INDEX "_games_v_rels_order_idx" ON "_games_v_rels" USING btree ("order");
  CREATE INDEX "_games_v_rels_parent_idx" ON "_games_v_rels" USING btree ("parent_id");
  CREATE INDEX "_games_v_rels_path_idx" ON "_games_v_rels" USING btree ("path");
  CREATE INDEX "_games_v_rels_teams_id_idx" ON "_games_v_rels" USING btree ("teams_id");
  CREATE INDEX "_games_v_rels_opponents_id_idx" ON "_games_v_rels" USING btree ("opponents_id");
  CREATE INDEX "tournaments_participants_order_idx" ON "tournaments_participants" USING btree ("_order");
  CREATE INDEX "tournaments_participants_parent_id_idx" ON "tournaments_participants" USING btree ("_parent_id");
  CREATE INDEX "tournaments_standings_rows_order_idx" ON "tournaments_standings_rows" USING btree ("_order");
  CREATE INDEX "tournaments_standings_rows_parent_id_idx" ON "tournaments_standings_rows" USING btree ("_parent_id");
  CREATE INDEX "tournaments_venue_idx" ON "tournaments" USING btree ("venue_id");
  CREATE INDEX "tournaments_hero_idx" ON "tournaments" USING btree ("hero_id");
  CREATE INDEX "tournaments_updated_at_idx" ON "tournaments" USING btree ("updated_at");
  CREATE INDEX "tournaments_created_at_idx" ON "tournaments" USING btree ("created_at");
  CREATE INDEX "tournaments__status_idx" ON "tournaments" USING btree ("_status");
  CREATE UNIQUE INDEX "tournaments_slug_idx" ON "tournaments_locales" USING btree ("slug","_locale");
  CREATE UNIQUE INDEX "tournaments_locales_locale_parent_id_unique" ON "tournaments_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "tournaments_texts_order_parent" ON "tournaments_texts" USING btree ("order","parent_id");
  CREATE INDEX "tournaments_texts_locale_parent" ON "tournaments_texts" USING btree ("locale","parent_id");
  CREATE INDEX "_tournaments_v_version_participants_order_idx" ON "_tournaments_v_version_participants" USING btree ("_order");
  CREATE INDEX "_tournaments_v_version_participants_parent_id_idx" ON "_tournaments_v_version_participants" USING btree ("_parent_id");
  CREATE INDEX "_tournaments_v_version_standings_rows_order_idx" ON "_tournaments_v_version_standings_rows" USING btree ("_order");
  CREATE INDEX "_tournaments_v_version_standings_rows_parent_id_idx" ON "_tournaments_v_version_standings_rows" USING btree ("_parent_id");
  CREATE INDEX "_tournaments_v_parent_idx" ON "_tournaments_v" USING btree ("parent_id");
  CREATE INDEX "_tournaments_v_version_version_venue_idx" ON "_tournaments_v" USING btree ("version_venue_id");
  CREATE INDEX "_tournaments_v_version_version_hero_idx" ON "_tournaments_v" USING btree ("version_hero_id");
  CREATE INDEX "_tournaments_v_version_version_updated_at_idx" ON "_tournaments_v" USING btree ("version_updated_at");
  CREATE INDEX "_tournaments_v_version_version_created_at_idx" ON "_tournaments_v" USING btree ("version_created_at");
  CREATE INDEX "_tournaments_v_version_version__status_idx" ON "_tournaments_v" USING btree ("version__status");
  CREATE INDEX "_tournaments_v_created_at_idx" ON "_tournaments_v" USING btree ("created_at");
  CREATE INDEX "_tournaments_v_updated_at_idx" ON "_tournaments_v" USING btree ("updated_at");
  CREATE INDEX "_tournaments_v_snapshot_idx" ON "_tournaments_v" USING btree ("snapshot");
  CREATE INDEX "_tournaments_v_published_locale_idx" ON "_tournaments_v" USING btree ("published_locale");
  CREATE INDEX "_tournaments_v_latest_idx" ON "_tournaments_v" USING btree ("latest");
  CREATE INDEX "_tournaments_v_version_version_slug_idx" ON "_tournaments_v_locales" USING btree ("version_slug","_locale");
  CREATE UNIQUE INDEX "_tournaments_v_locales_locale_parent_id_unique" ON "_tournaments_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_tournaments_v_texts_order_parent" ON "_tournaments_v_texts" USING btree ("order","parent_id");
  CREATE INDEX "_tournaments_v_texts_locale_parent" ON "_tournaments_v_texts" USING btree ("locale","parent_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_seasons_fk" FOREIGN KEY ("seasons_id") REFERENCES "public"."seasons"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_venues_fk" FOREIGN KEY ("venues_id") REFERENCES "public"."venues"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_opponents_fk" FOREIGN KEY ("opponents_id") REFERENCES "public"."opponents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_teams_fk" FOREIGN KEY ("teams_id") REFERENCES "public"."teams"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_staff_fk" FOREIGN KEY ("staff_id") REFERENCES "public"."staff"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_players_fk" FOREIGN KEY ("players_id") REFERENCES "public"."players"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_games_fk" FOREIGN KEY ("games_id") REFERENCES "public"."games"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_tournaments_fk" FOREIGN KEY ("tournaments_id") REFERENCES "public"."tournaments"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_seasons_id_idx" ON "payload_locked_documents_rels" USING btree ("seasons_id");
  CREATE INDEX "payload_locked_documents_rels_venues_id_idx" ON "payload_locked_documents_rels" USING btree ("venues_id");
  CREATE INDEX "payload_locked_documents_rels_opponents_id_idx" ON "payload_locked_documents_rels" USING btree ("opponents_id");
  CREATE INDEX "payload_locked_documents_rels_teams_id_idx" ON "payload_locked_documents_rels" USING btree ("teams_id");
  CREATE INDEX "payload_locked_documents_rels_staff_id_idx" ON "payload_locked_documents_rels" USING btree ("staff_id");
  CREATE INDEX "payload_locked_documents_rels_players_id_idx" ON "payload_locked_documents_rels" USING btree ("players_id");
  CREATE INDEX "payload_locked_documents_rels_games_id_idx" ON "payload_locked_documents_rels" USING btree ("games_id");
  CREATE INDEX "payload_locked_documents_rels_tournaments_id_idx" ON "payload_locked_documents_rels" USING btree ("tournaments_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "media" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "media_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "seasons" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "venues" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "opponents" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "teams" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "teams_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "staff" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "staff_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "players_memberships" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "players" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "players_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_players_v_version_memberships" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_players_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_players_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "games_roster_home_players_events" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "games_roster_home_players" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "games_roster_away_players_events" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "games_roster_away_players" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "games_report_paragraphs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "games_events" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "games_events_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "games_stats" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "games_stats_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "games_gallery" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "games" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "games_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "games_texts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "games_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_games_v_version_roster_home_players_events" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_games_v_version_roster_home_players" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_games_v_version_roster_away_players_events" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_games_v_version_roster_away_players" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_games_v_version_report_paragraphs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_games_v_version_events" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_games_v_version_events_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_games_v_version_stats" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_games_v_version_stats_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_games_v_version_gallery" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_games_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_games_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_games_v_texts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_games_v_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "tournaments_participants" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "tournaments_standings_rows" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "tournaments" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "tournaments_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "tournaments_texts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_tournaments_v_version_participants" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_tournaments_v_version_standings_rows" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_tournaments_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_tournaments_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_tournaments_v_texts" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "media" CASCADE;
  DROP TABLE "media_locales" CASCADE;
  DROP TABLE "seasons" CASCADE;
  DROP TABLE "venues" CASCADE;
  DROP TABLE "opponents" CASCADE;
  DROP TABLE "teams" CASCADE;
  DROP TABLE "teams_locales" CASCADE;
  DROP TABLE "staff" CASCADE;
  DROP TABLE "staff_locales" CASCADE;
  DROP TABLE "players_memberships" CASCADE;
  DROP TABLE "players" CASCADE;
  DROP TABLE "players_locales" CASCADE;
  DROP TABLE "_players_v_version_memberships" CASCADE;
  DROP TABLE "_players_v" CASCADE;
  DROP TABLE "_players_v_locales" CASCADE;
  DROP TABLE "games_roster_home_players_events" CASCADE;
  DROP TABLE "games_roster_home_players" CASCADE;
  DROP TABLE "games_roster_away_players_events" CASCADE;
  DROP TABLE "games_roster_away_players" CASCADE;
  DROP TABLE "games_report_paragraphs" CASCADE;
  DROP TABLE "games_events" CASCADE;
  DROP TABLE "games_events_locales" CASCADE;
  DROP TABLE "games_stats" CASCADE;
  DROP TABLE "games_stats_locales" CASCADE;
  DROP TABLE "games_gallery" CASCADE;
  DROP TABLE "games" CASCADE;
  DROP TABLE "games_locales" CASCADE;
  DROP TABLE "games_texts" CASCADE;
  DROP TABLE "games_rels" CASCADE;
  DROP TABLE "_games_v_version_roster_home_players_events" CASCADE;
  DROP TABLE "_games_v_version_roster_home_players" CASCADE;
  DROP TABLE "_games_v_version_roster_away_players_events" CASCADE;
  DROP TABLE "_games_v_version_roster_away_players" CASCADE;
  DROP TABLE "_games_v_version_report_paragraphs" CASCADE;
  DROP TABLE "_games_v_version_events" CASCADE;
  DROP TABLE "_games_v_version_events_locales" CASCADE;
  DROP TABLE "_games_v_version_stats" CASCADE;
  DROP TABLE "_games_v_version_stats_locales" CASCADE;
  DROP TABLE "_games_v_version_gallery" CASCADE;
  DROP TABLE "_games_v" CASCADE;
  DROP TABLE "_games_v_locales" CASCADE;
  DROP TABLE "_games_v_texts" CASCADE;
  DROP TABLE "_games_v_rels" CASCADE;
  DROP TABLE "tournaments_participants" CASCADE;
  DROP TABLE "tournaments_standings_rows" CASCADE;
  DROP TABLE "tournaments" CASCADE;
  DROP TABLE "tournaments_locales" CASCADE;
  DROP TABLE "tournaments_texts" CASCADE;
  DROP TABLE "_tournaments_v_version_participants" CASCADE;
  DROP TABLE "_tournaments_v_version_standings_rows" CASCADE;
  DROP TABLE "_tournaments_v" CASCADE;
  DROP TABLE "_tournaments_v_locales" CASCADE;
  DROP TABLE "_tournaments_v_texts" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_media_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_seasons_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_venues_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_opponents_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_teams_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_staff_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_players_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_games_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_tournaments_fk";
  
  DROP INDEX "payload_locked_documents_rels_media_id_idx";
  DROP INDEX "payload_locked_documents_rels_seasons_id_idx";
  DROP INDEX "payload_locked_documents_rels_venues_id_idx";
  DROP INDEX "payload_locked_documents_rels_opponents_id_idx";
  DROP INDEX "payload_locked_documents_rels_teams_id_idx";
  DROP INDEX "payload_locked_documents_rels_staff_id_idx";
  DROP INDEX "payload_locked_documents_rels_players_id_idx";
  DROP INDEX "payload_locked_documents_rels_games_id_idx";
  DROP INDEX "payload_locked_documents_rels_tournaments_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "media_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "seasons_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "venues_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "opponents_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "teams_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "staff_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "players_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "games_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "tournaments_id";
  DROP TYPE "public"."enum_teams_gender";
  DROP TYPE "public"."enum_players_position";
  DROP TYPE "public"."enum_players_player_status";
  DROP TYPE "public"."enum_players_status";
  DROP TYPE "public"."enum__players_v_version_position";
  DROP TYPE "public"."enum__players_v_version_player_status";
  DROP TYPE "public"."enum__players_v_version_status";
  DROP TYPE "public"."enum__players_v_published_locale";
  DROP TYPE "public"."enum_games_roster_home_players_events_type";
  DROP TYPE "public"."enum_games_roster_home_players_position";
  DROP TYPE "public"."enum_games_roster_away_players_events_type";
  DROP TYPE "public"."enum_games_roster_away_players_position";
  DROP TYPE "public"."enum_games_events_type";
  DROP TYPE "public"."enum_games_events_side";
  DROP TYPE "public"."enum_games_game_status";
  DROP TYPE "public"."enum_games_competition_kind";
  DROP TYPE "public"."enum_games_status";
  DROP TYPE "public"."enum__games_v_version_roster_home_players_events_type";
  DROP TYPE "public"."enum__games_v_version_roster_home_players_position";
  DROP TYPE "public"."enum__games_v_version_roster_away_players_events_type";
  DROP TYPE "public"."enum__games_v_version_roster_away_players_position";
  DROP TYPE "public"."enum__games_v_version_events_type";
  DROP TYPE "public"."enum__games_v_version_events_side";
  DROP TYPE "public"."enum__games_v_version_game_status";
  DROP TYPE "public"."enum__games_v_version_competition_kind";
  DROP TYPE "public"."enum__games_v_version_status";
  DROP TYPE "public"."enum__games_v_published_locale";
  DROP TYPE "public"."enum_tournaments_standings_rows_zone";
  DROP TYPE "public"."enum_tournaments_type";
  DROP TYPE "public"."enum_tournaments_status";
  DROP TYPE "public"."enum__tournaments_v_version_standings_rows_zone";
  DROP TYPE "public"."enum__tournaments_v_version_type";
  DROP TYPE "public"."enum__tournaments_v_version_status";
  DROP TYPE "public"."enum__tournaments_v_published_locale";`)
}
