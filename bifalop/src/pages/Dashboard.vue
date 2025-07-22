<template>
  <div class="q-pa-md row items-start q-gutter-md">
    <!-- Navigation Cards -->
    <q-card 
      v-for="card in navigationCards" 
      :key="card.id"
      class="my-card"
    >
      <q-card-section :class="`bg-${card.color} text-white`">
        <div class="text-h6">{{ card.title }}</div>
        <div class="text-subtitle2">{{ card.subtitle }}</div>
      </q-card-section>

      <q-separator v-if="card.id !== 'referate'" />

      <q-card-actions align="around">
        <q-btn 
          @click="card.operatePath && navigateTo(card.operatePath)" 
          flat
          :disable="!card.operatePath"
        >
          Opereaza
        </q-btn>
        <q-btn flat>Rapoarte</q-btn>
      </q-card-actions>
    </q-card>

    <!-- ALOP Card -->
    <q-card class="my-card">
      <q-card-section>
        <q-list bordered>
          <q-expansion-item
            v-for="section in alopSections"
            :key="section.group"
            :group="'somegroup'"
            :icon="section.icon"
            :label="section.label"
            :default-opened="section.defaultOpened || false"
            :header-class="section.headerClass"
          >
            <q-card>
              <q-card-section>
                <q-btn 
                  v-for="(button, index) in section.buttons"
                  :key="index"
                  class="full-width q-ma-xs" 
                  :color="button.color" 
                  no-caps
                  v-html="button.label"
                />
              </q-card-section>
            </q-card>
          </q-expansion-item>

          <q-separator 
            v-if="alopSections.indexOf(section) < alopSections.length - 1" 
          />
        </q-list>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { useDashboardNavigation } from '../composables/useDashboardNavigation'

const { navigateTo, navigationCards, alopSections } = useDashboardNavigation()
</script>

<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 250px
</style>