import { useRouter } from 'vue-router'

export function useDashboardNavigation() {
  const router = useRouter()
  
  const navigateTo = (path) => {
    router.push(path)
  }
  
  const navigationCards = [
    {
      id: 'paap',
      title: 'PAAP',
      subtitle: 'Planul anual al achizitiilor publice',
      color: 'primary',
      operatePath: '/paap'
    },
    {
      id: 'referate',
      title: 'Referate necesitate',
      subtitle: 'Angajamente bugetare/legale',
      color: 'purple',
      operatePath: '/referatenecesitate'
    },
    {
      id: 'contracte',
      title: 'Contracte',
      subtitle: 'Proceduri achizitie',
      color: 'teal',
      operatePath: '/contracteproceduri'
    },
    {
      id: 'comenzi',
      title: 'Comenzi/Receptii',
      subtitle: 'Lichidare angajamente',
      color: 'grey-8',
      operatePath: null
    }
  ]
  
  const alopSections = [
    {
      group: 'alop',
      icon: 'explore',
      label: 'ALOP',
      headerClass: 'text-primary',
      defaultOpened: true,
      buttons: [
        { label: 'Angajamente\nBugetare', color: 'indigo' },
        { label: 'Lichidari\nReceptii', color: 'indigo' },
        { label: 'Ordonantari\nPlata', color: 'indigo' }
      ]
    },
    {
      group: 'nomenclatoare',
      icon: 'perm_identity',
      label: 'Nomenclatoare',
      headerClass: 'text-teal',
      buttons: [
        { label: 'Prevederi\nBugetare', color: 'teal' },
        { label: 'Furnizori', color: 'teal' }
      ]
    },
    {
      group: 'administrare',
      icon: 'shopping_cart',
      label: 'Administrare',
      headerClass: 'text-purple',
      buttons: [
        { label: 'Categorii\nrepere', color: 'purple' }
      ]
    }
  ]
  
  return {
    navigateTo,
    navigationCards,
    alopSections
  }
}