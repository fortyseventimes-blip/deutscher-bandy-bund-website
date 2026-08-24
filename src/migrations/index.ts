import * as migration_20260824_045145_initial from './20260824_045145_initial';

export const migrations = [
  {
    up: migration_20260824_045145_initial.up,
    down: migration_20260824_045145_initial.down,
    name: '20260824_045145_initial'
  },
];
