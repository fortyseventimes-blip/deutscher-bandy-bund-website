import * as migration_20260824_045145_initial from './20260824_045145_initial';
import * as migration_20260830_074917_sport_collections from './20260830_074917_sport_collections';
import * as migration_20260925_141552_stream_and_source from './20260925_141552_stream_and_source';

export const migrations = [
  {
    up: migration_20260824_045145_initial.up,
    down: migration_20260824_045145_initial.down,
    name: '20260824_045145_initial',
  },
  {
    up: migration_20260830_074917_sport_collections.up,
    down: migration_20260830_074917_sport_collections.down,
    name: '20260830_074917_sport_collections',
  },
  {
    up: migration_20260925_141552_stream_and_source.up,
    down: migration_20260925_141552_stream_and_source.down,
    name: '20260925_141552_stream_and_source'
  },
];
