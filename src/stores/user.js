import { defineStore } from 'pinia'
import { useRouter } from 'vue-router'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    akyuser: null,
    iduser: 0,
    token: null,
    rol: null,
    numereal: '',
    gestiuni: null,
    document_in_lucru: false,
    gestiuneCurenta: { id: 0, denumire: '' }
  }),

  getters: {
    userGetter: (state) => state.user,
    akyuserlogat: (state) => state.akyuser ? state.akyuser.utilizator[0].username : "Nimeni",
    akyroluserlogat: (state) => state.akyuser ? state.akyuser.utilizator[0].rol : "Niciunul",
    compartimentakyuserlogat: (state) => state.akyuser ? state.akyuser.utilizator[0].denumire : "Niciunul",
    idcompartimentakyuserlogat: (state) => state.akyuser ? state.akyuser.utilizator[0].idcompartiment : "Niciunul",
    userid: (state) => state.iduser,
    rolGetter: (state) => state.rol,
    tokenGetter: (state) => state.token,
    akytoken: (state) => state.akyuser ? state.akyuser.token : null,
    gestiuniGetter: (state) => state.gestiuni,
    gestiuneCurentaGetter: (state) => state.gestiuneCurenta,
    documentInLucruGetter: (state) => state.document_in_lucru,
    numeReal: (state) => state.numereal
  },

  actions: {
    registerUserForMeetup(payload) {
      const id = payload.id
      if (this.user.registeredMeetups.findIndex(meetup => meetup.id === id) >= 0) {
        return
      }
      this.user.registeredMeetups.push(id)
      this.user.fbKeys[id] = payload.fbKey
    },

    unregisterUserFromMeetup(payload) {
      const registeredMeetups = this.user.registeredMeetups
      registeredMeetups.splice(registeredMeetups.findIndex(meetup => meetup.id === payload), 1)
      Reflect.deleteProperty(this.user.fbKeys, payload)
    },

    setUser(payload) {
      if (payload) {
        this.user = payload.nume
        this.iduser = payload.iduser
        this.token = payload.token
        this.rol = payload.rol
        this.numereal = payload.nume_real
        this.gestiuni = payload.gestiuni
      } else {
        this.user = null
        this.iduser = 0
        this.token = null
        this.rol = null
        this.numereal = ''
        this.gestiuni = null
      }
    },

    setAkyUser(payload) {
      if (payload) {
        this.akyuser = payload
      } else {
        this.akyuser = null
      }
    },

    setGestiuneCurenta(payload) {
      this.gestiuneCurenta = payload
    },

    setDocumentInLucru(payload) {
      this.document_in_lucru = payload
    },

    async registerUserForMeetupAsync(payload) {
      // This action was using Firebase, which seems to be removed
      // Keeping the structure for compatibility
      console.log('registerUserForMeetupAsync not implemented - Firebase removed')
    },

    async unregisterUserFromMeetupAsync(payload) {
      // This action was using Firebase, which seems to be removed
      // Keeping the structure for compatibility
      console.log('unregisterUserFromMeetupAsync not implemented - Firebase removed')
    },

    async signUserUp(payload) {
      // This action was using Firebase, which seems to be removed
      // Keeping the structure for compatibility
      console.log('signUserUp not implemented - Firebase removed')
    },

    signUserIn(payload) {
      console.log('se ruleaza actiunea signUserIn...', payload)
      this.setUser(payload)
      const router = useRouter()
      router.push('/')
    },

    akysignUserIn(payload) {
      console.log('se ruleaza actiunea akysignUserIn...', payload)
      this.setAkyUser(payload)
      const router = useRouter()
      router.push('/dashboard')
    },

    schimbaGestiuneaCurenta(payload) {
      console.log('se ruleaza actiunea schimbaGestiuneaCurenta...', payload)
      this.setGestiuneCurenta(payload)
    },

    comutaDocumentInLucru(payload) {
      this.setDocumentInLucru(payload)
    },

    autoSignIn(payload) {
      this.setUser({
        id: payload.uid,
        registeredMeetups: [],
        fbKeys: {}
      })
    },

    async fetchUserData() {
      // This action was using Firebase, which seems to be removed
      // Keeping the structure for compatibility
      console.log('fetchUserData not implemented - Firebase removed')
    },

    logout() {
      console.log('Log out!')
      this.setUser(null)
      const router = useRouter()
      router.push('/login')
    },

    akylogout() {
      console.log('Log out din BIFA AKY!')
      this.setAkyUser(null)
      const router = useRouter()
      router.push('/aky')
    }
  }
})