# Migration Task List: Quasar v1 to v2 with Vue 3 Composition API

## Overview
Complete migration of BIFA Gestiune frontend application from Quasar v1/Vue 2 (Options API) to Quasar v2/Vue 3 (Composition API).

**Total estimated time: 3-4 weeks**

## Phase 1: Setup & Infrastructure (2-3 days)

### 1.1 Project Preparation
- [x] Document current working features for testing checklist

### 1.2 Dependencies Update
- [x] Update package.json with Vue 3 and Quasar v2 dependencies
- [x] Remove Vue 2 specific dependencies
- [x] Add @quasar/app-vite or @quasar/app-webpack v2
- [x] Add Pinia for state management (replacing Vuex)
- [x] Update all Quasar-related packages to v2

### 1.3 Configuration Migration
- [x] Convert `quasar.conf.js` to `quasar.config.js` format
- [x] Update build configuration for Vite/Webpack 5
- [x] Update framework detection from 'all' to specific imports
- [x] Configure Vue 3 compiler options
- [x] Update ESLint configuration for Vue 3

### 1.4 Core Files Migration
- [x] Update `src/index.template.html` to new format
- [x] Migrate `src/App.vue` to Composition API
- [x] Update boot files structure for Vue 3
- [x] Migrate `boot/axios.js` to use Vue 3 app instance

### 1.5 Router Migration
- [x] Update Vue Router to v4
- [x] Convert router configuration to Vue Router 4 syntax
- [x] Update route guards to new format
- [x] Test all route navigation

### 1.6 State Management Migration
- [x] Install and configure Pinia
- [x] Convert Vuex user module to Pinia store
- [x] Update all store references in components
- [x] Remove Vuex dependencies

## Phase 2: Simple Components Migration (1-2 days)

### 2.1 PaapResponsabil.vue (23 lines)
- [x] Convert template refs from `ref="name"` to `ref` with setup()
- [x] Convert props to defineProps()
- [x] Convert emits to defineEmits()
- [x] Move logic to setup() or `<script setup>`

### 2.2 ContracteNoi.vue (30 lines)
- [x] Convert data() to ref/reactive
- [x] Convert methods to regular functions
- [x] Update component registration

### 2.3 PaapCompartimente.vue (45 lines)
- [x] Migrate Options API to Composition API
- [x] Update any Quasar component usage
- [x] Test functionality

### 2.4 PaapProceduri.vue (45 lines)
- [x] Complete Composition API conversion
- [x] Verify all event handlers work
- [x] Update any deprecated Quasar components

## Phase 3: Medium Components Migration (3-4 days)

### 3.1 PaapArticolBugetar.vue (78 lines)
- [x] Convert data properties to ref/reactive
- [x] Migrate computed properties to computed()
- [x] Convert watchers to watch/watchEffect
- [x] Update lifecycle hooks (created -> onMounted, etc.)

### 3.2 FisaCont.vue (80 lines)
- [x] Migrate component logic to Composition API
- [x] Update $refs usage to template refs
- [x] Convert this.$q usage to useQuasar()

### 3.3 PaapCodCPV.vue (99 lines)
- [x] Full Composition API migration
- [x] Update form handling
- [x] Migrate validation logic

### 3.4 Repere.vue (111 lines)
- [x] Convert component to Composition API
- [x] Update data table configuration
- [x] Migrate filters and sorting logic

### 3.5 MaterialAdd.vue (114 lines)
- [x] Migrate form component to Composition API
- [x] Update v-model usage
- [x] Convert validation rules

### 3.6 Balanta.vue (127 lines)
- [x] Complete Composition API conversion
- [x] Update calculations and computed values
- [x] Migrate API calls pattern

## Phase 4: Complex Components Migration (4-5 days)

### 4.1 PozitiePAAPAdd.vue (155 lines)
- [ ] Break down into composables where applicable
- [ ] Migrate complex form logic
- [ ] Update all event emitters
- [ ] Convert validation logic

### 4.2 BaraIntervalDocumente.vue (194 lines)
- [ ] Extract date handling into composable
- [ ] Migrate component state management
- [ ] Update all watchers and computed properties
- [ ] Test date range functionality

### 4.3 ListaInventariere.vue (237 lines)
- [ ] Migrate table component logic
- [ ] Convert pagination handling
- [ ] Update sorting and filtering
- [ ] Migrate print functionality

### 4.4 Meniu.vue (265 lines)
- [ ] Convert navigation logic to Composition API
- [ ] Update route handling
- [ ] Migrate permission checks
- [ ] Convert all click handlers

### 4.5 ReferatNecesitateAdd.vue (384 lines)
- [ ] Break into smaller composables
- [ ] Migrate complex form validation
- [ ] Update file upload handling
- [ ] Convert all API integrations
- [ ] Test thoroughly due to complexity

## Phase 5: Simple & Medium Pages Migration (3-4 days)

### 5.1 Simple Pages
- [ ] Index.vue (14 lines) - Basic conversion
- [ ] Error404.vue (22 lines) - Update to Composition API
- [ ] Contracte.vue (39 lines) - Migrate page logic

### 5.2 Medium Pages - Part 1
- [ ] Login.vue (71 lines)
  - [ ] Migrate authentication logic
  - [ ] Update form handling
  - [ ] Convert to useRouter/useRoute
  
- [ ] Dashboard.vue (126 lines)
  - [ ] Convert data fetching
  - [ ] Update chart integrations
  - [ ] Migrate computed statistics

### 5.3 Medium Pages - Part 2
- [ ] Locuri.vue (141 lines)
  - [ ] Migrate CRUD operations
  - [ ] Update table handling
  
- [ ] Referate.vue (173 lines)
  - [ ] Convert listing logic
  - [ ] Update filters
  
- [ ] Materiale.vue (200 lines)
  - [ ] Full migration with search
  - [ ] Update pagination

## Phase 6: Complex Pages Migration (5-6 days)

### 6.1 First Batch
- [ ] Utilizatori.vue (213 lines)
  - [ ] Migrate user management logic
  - [ ] Update role handling
  - [ ] Convert form validation

- [ ] Conturi.vue (268 lines)
  - [ ] Migrate account tree structure
  - [ ] Update recursive components

### 6.2 Second Batch
- [ ] Categorii.vue (377 lines)
  - [ ] Complex state management migration
  - [ ] Update nested categories logic

- [ ] Gestiuni.vue (390 lines)
  - [ ] Migrate inventory management
  - [ ] Update complex forms

### 6.3 Third Batch
- [ ] Rapoarte.vue (454 lines)
  - [ ] Migrate report generation
  - [ ] Update PDF export logic
  - [ ] Convert date filtering

- [ ] Temporar.vue (463 lines)
  - [ ] Full migration of temporary operations
  - [ ] Update complex state management

### 6.4 Most Complex Pages
- [ ] Paap.vue (606 lines)
  - [ ] Break into multiple composables
  - [ ] Migrate complex data tables
  - [ ] Update all filtering and sorting
  - [ ] Convert Excel export functionality

- [ ] Documente.vue (1061 lines)
  - [ ] Major refactoring required
  - [ ] Split into smaller components
  - [ ] Create composables for document operations
  - [ ] Migrate all CRUD operations
  - [ ] Update file handling
  - [ ] Thoroughly test all features

## Phase 7: Testing & Refinement (2-3 days)

### 7.1 Component Testing
- [ ] Test all migrated components individually
- [ ] Verify props and emits work correctly
- [ ] Check all v-model bindings
- [ ] Validate form submissions

### 7.2 Integration Testing
- [ ] Test authentication flow
- [ ] Verify all API calls work
- [ ] Test state management with Pinia
- [ ] Check router navigation

### 7.3 Quasar Specific Updates
- [ ] Update deprecated Quasar components
- [ ] Migrate $q.notify to useQuasar composable
- [ ] Update dialog implementations
- [ ] Fix any breaking changes in Quasar components

### 7.4 Performance & Optimization
- [ ] Remove unused imports
- [ ] Optimize bundle size
- [ ] Lazy load heavy components
- [ ] Check for memory leaks

### 7.5 Final Review
- [ ] Code review all components
- [ ] Update documentation
- [ ] Create migration notes
- [ ] Final testing checklist

## Common Patterns to Apply

### Converting Options API to Composition API
1. **data()** → `ref()` or `reactive()`
2. **methods** → regular functions in setup()
3. **computed** → `computed(() => ...)`
4. **watch** → `watch()` or `watchEffect()`
5. **this.$refs** → template refs with `ref()`
6. **this.$router** → `useRouter()`
7. **this.$route** → `useRoute()`
8. **this.$q** → `useQuasar()`
9. **lifecycle hooks** → `onMounted()`, `onUpdated()`, etc.

### Vuex to Pinia Migration
1. **this.$store.state** → `store.stateName`
2. **this.$store.getters** → `store.getterName`
3. **this.$store.dispatch** → `store.actionName()`
4. **this.$store.commit** → direct state modification in actions

## Notes
- Always test each component after migration
- Keep the old code commented until the component is fully tested
- Use TypeScript where beneficial for better type safety
- Consider breaking large components into smaller ones during migration
- Document any workarounds or special cases encountered