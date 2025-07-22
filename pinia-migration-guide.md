# Pinia Migration Guide

## Store Migration Pattern

### From Vuex to Pinia

#### 1. Import Changes
```javascript
// OLD - Vuex
import { mapState, mapGetters, mapActions } from 'vuex'

// NEW - Pinia
import { useUserStore } from '@/stores/user'
import { useEventsStore } from '@/stores/events'
```

#### 2. In Composition API (setup)
```javascript
// OLD - Options API with Vuex
computed: {
  user() {
    return this.$store.getters.user
  }
},
methods: {
  login(data) {
    this.$store.dispatch('signUserIn', data)
  }
}

// NEW - Composition API with Pinia
const userStore = useUserStore()

// Access state directly
const user = computed(() => userStore.userGetter)

// Call actions directly
const login = (data) => {
  userStore.signUserIn(data)
}
```

#### 3. Event Bus Migration
```javascript
// OLD - Vue 2 Event Bus
this.$root.$emit('schimbgestiunea', value)
this.$root.$on('schimbgestiunea', this.handler)

// NEW - Pinia Events Store
const eventsStore = useEventsStore()
eventsStore.emit('schimbgestiunea', value)

// In setup or onMounted
const unsubscribe = eventsStore.on('schimbgestiunea', handler)

// Clean up in onUnmounted
onUnmounted(() => {
  unsubscribe()
})
```

## Common Patterns

### 1. Accessing Store State
```javascript
// Direct state access
userStore.user
userStore.token

// Using getters
userStore.userGetter
userStore.rolGetter
```

### 2. Calling Actions
```javascript
// Actions are called like methods
userStore.setUser(userData)
userStore.logout()
userStore.schimbaGestiuneaCurenta(gestiune)
```

### 3. Reactive Store State
```javascript
// Always use computed for reactive store state
const isAuthenticated = computed(() => userStore.user !== null)
```

## Migration Checklist for Each Component

1. ✅ Replace Vuex imports with Pinia store imports
2. ✅ Convert Options API to Composition API
3. ✅ Replace `this.$store` with store instance
4. ✅ Replace `$root.$emit` with events store
5. ✅ Replace `$root.$on` with events store subscription
6. ✅ Clean up event listeners in `onUnmounted`
7. ✅ Test all functionality

## Example Component Migration

See the following files for complete migration examples:
- `src/layouts/MyLayout.vue` - Complex layout with store usage
- `src/pages/Login.vue` - Authentication with store actions