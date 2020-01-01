<template>

<q-page padding>
    <div class="flex flex-center column ">
    <q-btn v-if="vreauGrid" icon="create" @click="docNou" color="secondary" flat label="Document nou..." class="q-mb-md" />
    <q-table
      v-if="vreauGrid"
      title="Treats"
      :data="data"
      :columns="columns"
      :pagination.sync="pagination"
      row-key="name"
    />
    </div>
    <div class="row">
        <div v-if="vreauLista" class="col-3 q-pa-sm" >
             <q-scroll-area style="height: 85vh; ">
                <q-list v-for="d in data" :key="d.name" bordered separator >


                <q-item clickable v-ripple>
                    <q-item-section>
                    <q-item-label overline>{{d.name}}</q-item-label>
                    <q-item-label>{{d.calories}}</q-item-label>
                     <q-item-label>Calciu: {{d.calcium}}</q-item-label>
                    </q-item-section>
                </q-item>
                </q-list>
             </q-scroll-area>
        </div>
        <div v-if="vreauFormular" id="formular" class="col-9 q-pa-sm">
            <div class="row justify-around items-start content-start">
                <q-select outlined v-model="model" :options="options" label="Tip document" style="min-width:200px;"/>

                <q-input outlined v-model="date" mask="date" :rules="['date']" >
                    <template v-slot:append>
                        <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                            <q-date v-model="date" @input="() => $refs.qDateProxy.hide()" />
                        </q-popup-proxy>
                        </q-icon>
                    </template>
                </q-input>

                <q-input outlined v-model="text" label="Nr. document" />
            </div>

            <div class="row ">

              <div class="col flex flex-center q-gutter-sm">
                  <q-radio v-model="tipmaterial" val="mat" label="Materiale" />
                  <q-radio v-model="tipmaterial" val="ob" label="Obiecte inventar" />
                  <q-radio v-model="tipmaterial" val="mf" label="Mijloace fixe" />
              </div>
                <q-separator vertical inset />
              <div class="col flex flex-center q-gutter-sm">
                <q-radio v-model="tipoperatiune" val="in" label="Intrare" />
                <q-radio v-model="tipoperatiune" val="out" label="Iesire" />
                <q-radio v-model="tipoperatiune" val="trans" label="Transfer" />
              </div>

            </div>

            <div class="row">
              <div class="col-5 column items-end q-px-md q-gutter-sm">
                  <div class="text-h6">Sursa</div>

                  <q-select
                      filled
                      v-model="model"
                      use-input
                      hide-selected
                      fill-input
                      input-debounce="0"
                      label="Loc dispunere"
                      :options="options"
                      @filter="filterFn"

                      style="width: 250px; padding-bottom: 32px"
                    >
                      <template v-slot:no-option>
                        <q-item>
                          <q-item-section class="text-grey">
                            No results
                          </q-item-section>
                        </q-item>
                      </template>
                  </q-select>

                  <q-select
                      filled
                      v-model="model"
                      use-input
                      hide-selected
                      fill-input
                      input-debounce="0"
                      label="Categorie reper"
                      :options="options"
                      @filter="filterFn"
                      style="width: 250px; "
                    >
                      <template v-slot:no-option>
                        <q-item>
                          <q-item-section class="text-grey">
                            No results
                          </q-item-section>
                        </q-item>
                      </template>
                  </q-select>

                <div class="col flex flex-center q-gutter-sm">
                  <q-radio v-model="starematerial" val="n" label="Nou" />
                  <q-radio v-model="starematerial" val="f" label="Folosit" />
                  <q-radio v-model="starematerial" val="c" label="Casare" />
                </div>
              </div>

              <div class="col-2 flex flex-center q-gutter-sm">
                    <q-icon name="fast_forward" class="text-red" style="font-size: 12rem;" ></q-icon>
              </div>

              <div class="col-5 column items-start q-px-md q-gutter-sm">
                 <div class="text-h6">Destinatie</div>

                  <q-select
                      filled
                      v-model="model"
                      use-input
                      hide-selected
                      fill-input
                      input-debounce="0"
                      label="Loc dispunere"
                      :options="options"
                      @filter="filterFn"

                      style="width: 250px; padding-bottom: 32px"
                    >
                      <template v-slot:no-option>
                        <q-item>
                          <q-item-section class="text-grey">
                            No results
                          </q-item-section>
                        </q-item>
                      </template>
                  </q-select>

                  <q-select
                      filled
                      v-model="model"
                      use-input
                      hide-selected
                      fill-input
                      input-debounce="0"
                      label="Categorie reper"
                      :options="options"

                      style="width: 250px; "
                    >
                      <template v-slot:no-option>
                        <q-item>
                          <q-item-section class="text-grey">
                            No results
                          </q-item-section>
                        </q-item>
                      </template>
                  </q-select>   
                  <div class="col flex flex-center q-gutter-sm">
                    <q-radio v-model="starematerial" val="n" label="Nou" />
                    <q-radio v-model="starematerial" val="f" label="Folosit" />
                   <q-radio v-model="starematerial" val="c" label="Casare" />
                </div>              
              </div>
            </div>

            <q-splitter
                    v-model="splitterModel"
                    style="margin-top: 25px;" 
                  >

                    <template v-slot:before>
                      <q-tabs
                        v-model="tab"
                        vertical
                        class="text-teal"
                      >
                        <q-tab name="mails" icon="mail" label="Repere" />
                        <q-tab name="alarms" icon="alarm" label="Statistici" />
                      </q-tabs>
                    </template>

                    <template v-slot:after>
                      <q-tab-panels
                        v-model="tab"
                        animated
                        transition-prev="jump-up"
                        transition-next="jump-up"
                      >
                        <q-tab-panel name="mails">
                          <Repere />
                        </q-tab-panel>

                        <q-tab-panel name="alarms">
                          <div class="text-h4 q-mb-md">Statistici</div>
                          <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque magnam odio iure quidem, quod illum numquam possimus obcaecati commodi minima assumenda consectetur culpa fuga nulla ullam. In, libero.</p>
                          <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque magnam odio iure quidem, quod illum numquam possimus obcaecati commodi minima assumenda consectetur culpa fuga nulla ullam. In, libero.</p>
                        </q-tab-panel>

                      </q-tab-panels>
                    </template>

            </q-splitter>
            <div class="row q-pa-md justify-center">
              <q-btn  icon="create" @click="clickDocumente" color="secondary" flat label="Salveaza"  />
              <q-btn  icon="create" @click="clickDocumente" color="secondary" flat label="Reset"  />
              <q-btn  icon="create" @click="clickDocumente" color="secondary" flat label="Documente..."  />

            </div>
                    
        </div>

    </div>

</q-page>
</template>