import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

export function useNavigation() {
  const router = useRouter()
  const store = useStore()
  
  const link = ref('inbox')
  const ruta = ref('')
  const confirm = ref(false)
  const ok = ref(false)
  
  // Computed properties
  const inLucru = computed(() => store.getters.documentInLucru)
  
  // Navigation methods
  const abandoneazaSiMergiMaiDeparte = () => {
    store.dispatch('comutaDocumentInLucru', false)
    link.value = ruta.value
    router.push('/' + ruta.value)
  }
  
  const navigateWithConfirm = (route, linkName) => {
    ruta.value = route
    if (inLucru.value) {
      confirm.value = true
    } else {
      link.value = linkName || route
      abandoneazaSiMergiMaiDeparte()
    }
  }
  
  const navigateDirect = (route, linkName) => {
    link.value = linkName
    router.push(route)
  }
  
  // Specific navigation methods
  const clickUtilizatori = () => {
    navigateDirect('/utilizatori', 'inbox')
  }
  
  const clickIntrari = () => {
    router.push('/test')
  }
  
  const clickLocuri = () => {
    navigateWithConfirm('locuri', 'locuri')
  }
  
  const clickDocNou = () => {
    navigateDirect('/documente', 'operatiunenoua')
  }
  
  const clickMateriale = () => {
    navigateWithConfirm('materiale', 'materiale')
  }
  
  const clickGestiuni = () => {
    navigateDirect('/gestiuni', 'outbox')
  }
  
  const clickConturi = () => {
    navigateDirect('/conturi', 'conturi')
  }
  
  const clickSetari = () => {
    link.value = 'setari'
    alert('Setari aplicatie neimplementat!')
  }
  
  const clickCategorii = () => {
    navigateDirect('/categorii', 'trash')
  }
  
  const clickRapoarte = () => {
    navigateWithConfirm('rap', 'rap')
  }
  
  return {
    link,
    ruta,
    confirm,
    ok,
    inLucru,
    abandoneazaSiMergiMaiDeparte,
    clickUtilizatori,
    clickIntrari,
    clickLocuri,
    clickDocNou,
    clickMateriale,
    clickGestiuni,
    clickConturi,
    clickSetari,
    clickCategorii,
    clickRapoarte
  }
}