import type { CollectionConfig } from 'payload'
import { publicRead, createSport, updateSport, deleteSport } from '../access'
import { auditAfterChange, auditAfterDelete } from '../audit/hooks'

/** A coach or support staff member attached to a team. Reference data. */
export const Staff: CollectionConfig = {
  slug: 'staff',
  labels: {
    singular: { de: 'Betreuer', en: 'Staff member' },
    plural: { de: 'Betreuerstab', en: 'Staff' },
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'role', 'team'],
    group: { de: 'Sport', en: 'Sport' },
  },
  access: {
    read: publicRead,
    create: createSport,
    update: updateSport,
    delete: deleteSport,
  },
  hooks: {
    afterChange: [auditAfterChange('staff')],
    afterDelete: [auditAfterDelete('staff')],
  },
  fields: [
    { name: 'name', type: 'text', label: { de: 'Name', en: 'Name' }, required: true },
    {
      name: 'role',
      type: 'text',
      label: { de: 'Funktion', en: 'Role' },
      localized: true,
      required: true,
      admin: { description: { de: 'z. B. „Cheftrainer"', en: 'e.g. "Head coach"' } },
    },
    {
      name: 'team',
      type: 'relationship',
      relationTo: 'teams',
      label: { de: 'Team', en: 'Team' },
      required: true,
    },
    {
      name: 'portrait',
      type: 'upload',
      relationTo: 'media',
      label: { de: 'Porträt', en: 'Portrait' },
    },
  ],
}
