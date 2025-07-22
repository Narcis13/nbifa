# Quasar v2 Migration Notes

## Package.json Changes (Phase 1.2)

### Dependencies Updated
1. **Vue 2 → Vue 3**
   - Removed: Vue 2 (implicit)
   - Added: `vue@^3.3.10`

2. **Quasar v1 → v2**
   - Removed: `quasar@^1.22.10`
   - Added: `quasar@^2.14.2`
   - Updated: `@quasar/extras@^1.16.9` (compatible with v2)

3. **Vue Router 3 → 4**
   - Added: `vue-router@^4.2.5`

4. **State Management**
   - Added: `pinia@^2.1.7` (replacing Vuex)
   - Note: Vuex not explicitly removed as it wasn't in dependencies

5. **Build Tools**
   - Removed: `@quasar/cli@^1.2.1` (now part of app-vite)
   - Removed: `@quasar/app@^2.4.4` (old webpack version)
   - Added: `@quasar/app-vite@^1.7.1` (Vite-based build)
   - Added: `@vue/compiler-sfc@^3.3.10` (required for Vue 3)

### Dev Dependencies Added
- ESLint for Vue 3: `eslint@^8.54.0`
- Vue 3 ESLint plugin: `eslint-plugin-vue@^9.18.1`
- ESLint standard config and plugins

### Scripts Added
- `dev`: Run Quasar dev server
- `build`: Build for production
- `build:pwa`: Build PWA mode
- `clean`: Clean build artifacts

### Other Changes
- Updated Node engine requirements to support Vue 3/Vite
- Updated browserslist to match modern requirements
- Removed deprecated resolutions

### Backend Dependencies Preserved
All backend dependencies remain unchanged:
- Express, body-parser, cors
- Knex, mysql2
- JWT, puppeteer
- EJS for PDF templates

## Configuration Migration (Phase 1.3)

### Files Created/Updated
1. **quasar.config.js** - New Quasar v2 configuration format
   - Uses `configure` wrapper from 'quasar/wrappers'
   - Updated build target for modern browsers
   - Changed env variable format (API_URL instead of host)
   - Added ESLint configuration section
   - Removed deprecated `supportIE` option
   - Updated framework config structure
   - Kept hash routing mode for compatibility

2. **.eslintrc.js** - Vue 3 compatible ESLint configuration
   - Uses `plugin:vue/vue3-essential` rules
   - Includes Vue 3 setup compiler macros
   - Standard code style with Vue plugin

3. **CSS Files** - Converted from Stylus to Sass
   - Created `app.sass` from `app.styl`
   - Created `quasar.variables.sass` from `quasar.variables.styl`

### Key Configuration Changes
- Framework: Still using 'all' mode temporarily (will optimize later)
- Plugins: Only 'Notify' plugin explicitly loaded
- Build: Using Vite instead of Webpack
- API URL: Available as `process.env.API_URL` in code

### Backup Files Created
- `quasar.conf.js.backup` - Original Quasar v1 config
- Original .styl files preserved

## Core Files Migration (Phase 1.4)

### Files Updated
1. **src/index.template.html**
   - Updated template syntax from htmlWebpackPlugin to direct variables
   - Changed entry point from `<div id="q-app">` to `<!-- quasar:entry-point -->`
   - Updated favicon paths to match Quasar v2 structure

2. **src/App.vue**
   - Migrated to Composition API using `<script setup>`
   - Removed unnecessary wrapper div
   - Simplified to just `<router-view />`

3. **src/boot/axios.js**
   - Updated to use `boot` wrapper from 'quasar/wrappers'
   - Changed from Vue.prototype to app.config.globalProperties
   - Added pre-configured API instance with baseURL
   - Exported named `api` for Composition API usage

### Backup Files Created
- `src/index.template.html.backup`
- `src/App.vue.backup`
- `src/boot/axios.js.backup`

## Next Steps
1. Delete node_modules and package-lock.json
2. Run `npm install` to install new dependencies
3. Update router configuration for Vue Router 4
4. Convert Vuex store to Pinia
5. Begin migrating components to Composition API