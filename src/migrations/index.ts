import * as migration_20260824_045145_initial from './20260824_045145_initial';
import * as migration_20260830_074917_sport_collections from './20260830_074917_sport_collections';

export const migrations = [
  {
    up: migration_20260824_045145_initial.up,
    down: migration_20260824_045145_initial.down,
    name: '20260824_045145_initial',
  },
  {
    up: migration_20260830_074917_sport_collections.up,
    down: migration_20260830_074917_sport_collections.down,
    name: '20260830_074917_sport_collections'
  },
];
