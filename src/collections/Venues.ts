import type { CollectionConfig } from 'payload'
import { publicRead, createSport, updateSport, deleteSport } from '../access'
import { auditAfterChange, auditAfterDelete } from '../audit/hooks'

/** A venue a game or tournament is played at. Reference data. */
export const Venues: CollectionConfig = {
  slug: 'venues',
  labels: {
    singular: { de: 'Spielstätte', en: 'Venue' },
    plural: { de: 'Spielstätten', en: 'Venues' },
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'city'],
    group: { de: 'Sport', en: 'Sport' },
  },
  access: {
    read: publicRead,
    create: createSport,
    update: updateSport,
    delete: deleteSport,
  },
  hooks: {
    afterChange: [auditAfterChange('venues')],
    afterDelete: [auditAfterDelete('venues')],
  },
  fields: [
    { name: 'name', type: 'text', label: { de: 'Name', en: 'Name' }, required: true },
    { name: 'city', type: 'text', label: { de: 'Stadt', en: 'City' }, required: true },
    { name: 'address', type: 'text', label: { de: 'Adresse', en: 'Address' } },
    {
      name: 'mapQuery',
      type: 'text',
      label: { de: 'Kartensuche', en: 'Map search query' },
      admin: {
        description: {
          de: 'Suchbegriff für den „In Karten-App öffnen"-Link, falls abweichend von Name + Stadt.',
          en: 'Search text for the "open in maps app" link, if different from name + city.',
        },
      },
    },
  ],
}
