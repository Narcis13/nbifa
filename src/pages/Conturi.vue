<template>
  <q-page padding>
    <div class="q-pa-md q-gutter-sm">
      <q-splitter
        v-model="splitterModel"
        style="height: 90vh;"
      >
        <template #before>
          <q-tree
            :nodes="conturi"
            node-key="id"
            ref="tree"
            @update:selected="getSelectedNode"
            selected-color="primary"
            v-model:selected="selected"
          />
        </template>
        
        <template #after>
          <div class="q-pa-md q-gutter-sm">
            <h5 v-if="eFrunza">Cont sintetic: {{ nodSelectat.label }}</h5>
            <q-input 
              v-if="eFrunza" 
              standout 
              v-model="analitic"  
              :prefix="nodSelectat.cont"
            >
              <template #prepend>
                <q-icon name="mail" />
              </template>
            </q-input>
            <q-input
              v-model="explicatii"
              v-if="eFrunza"
              label="Explicatii"
              filled
              type="textarea"
            />
            <q-btn 
              v-if="eFrunza" 
              outline 
              rounded  
              color="primary"  
              label="Adauga analitic" 
              @click="adaugAnalitic" 
            />
          </div>
        </template>
      </q-splitter>
    </div>
    
    <q-btn
      v-if="eAnalitic"
      round
      color="red"
      @click="stergCont"
      class="fixed"
      icon="delete"
      style="right: 48px; bottom: 64px"
    />
  </q-page>
</template>     

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useStore } from 'vuex'
import axios from 'axios'

const $q = useQuasar()
const store = useStore()

const conturi = ref([])
const analitic = ref('')
const explicatii = ref('')
const selected = ref(null)
const nodSelectat = ref(null)
const splitterModel = ref(50)
const tree = ref(null)

function searchTree(element, matchingTitle) {
  if (element.id == matchingTitle) {
    return element
  } else if (element.children != null) {
    let result = null
    for (let i = 0; result == null && i < element.children.length; i++) {
      result = searchTree(element.children[i], matchingTitle)
    }
    return result
  }
  return null
}

const eAnalitic = computed(() => {
  if (nodSelectat.value) {
    return nodSelectat.value.tip == "N"
  }
  return false
})

const eFrunza = computed(() => {
  let contineFrunze = false
  if (nodSelectat.value) {
    if (nodSelectat.value.tip == "N") return false
    else {
      if (nodSelectat.value.children) {
        nodSelectat.value.children.map((item) => {
          if (item.tip == "N") contineFrunze = true
        })
        if (nodSelectat.value.children.length == 0 || contineFrunze)
          return true
        else
          return false  
      } else {
        if (nodSelectat.value.nivel < 3)
          return true
        else
          return false
      }
    }
  }
  return false
})

const getSelectedNode = (target) => {
  analitic.value = ""
  explicatii.value = ""
  console.log('Element selectat', target, tree.value?.getNodeByKey(target))
  nodSelectat.value = tree.value?.getNodeByKey(target)
}

const stergCont = async () => {
  if (!nodSelectat.value) return
  
  console.log("sterg acest cont", nodSelectat.value)
  const token = store.getters.token
  
  try {
    await axios.delete(`${process.env.host}conturi/${nodSelectat.value.id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    
    $q.notify({
      color: 'secondary',
      icon: 'delete',
      position: 'top',
      message: 'Cont analitic sters!'
    })
    
    let parinte = null
    const id = nodSelectat.value.parentID
    conturi.value.map((c) => {
      let p = searchTree(c, id)
      if (p !== null) parinte = p
    })

    if (parinte && parinte.children) {
      for (let i = 0; i < parinte.children.length; i++) {
        if (parinte.children[i].id == nodSelectat.value.id) {
          parinte.children.splice(i, 1)
          break
        }
      }
    }
  } catch (err) {
    console.error('Delete error:', err)
  }
}

const adaugAnalitic = async () => {
  if (explicatii.value == "" || analitic.value == "") {
    $q.notify({
      color: 'secondary',
      icon: 'delete',
      position: 'top',
      message: 'Nu sunt acceptate cimpuri vide!'
    })
    return
  }
  
  const token = store.getters.token
  
  try {
    const res = await axios.post(`${process.env.host}conturi/analiticnou`, {
      cont: analitic.value,
      idsintetic: nodSelectat.value.id,
      explicatii: explicatii.value,
      contsintetic: nodSelectat.value.cont,
      contcomplet: nodSelectat.value.cont + analitic.value,
      nivel: nodSelectat.value.nivel + 1,
      stare: "activ"
    }, {
      headers: { Authorization: `Bearer ${token}` }
    })
    
    console.log('raspuns insert analitic', res)
    $q.notify({
      message: 'Cont analitic adaugat cu succes!',
      timeout: 1500,
      position: 'top',
      color: 'positive'
    })
    
    const newNode = {
      id: res.data.id,
      tip: "N",
      cont: analitic.value,
      sintetic: nodSelectat.value.cont,
      isLeaf: false,
      label: nodSelectat.value.cont + analitic.value + " " + explicatii.value
    }
    
    if (nodSelectat.value.children) {
      nodSelectat.value.children.push(newNode)
    } else {
      nodSelectat.value.children = [newNode]
    }
    
    nodSelectat.value = null
    
  } catch (err) {
    console.error('Add analitic error:', err.response?.data?.message)
    $q.notify({
      color: 'negative',
      timeout: 1500,
      position: 'top',
      icon: 'delete',
      message: `ATENTIE! ${err.response?.data?.message || 'Eroare la adaugarea contului analitic'}`
    })
  }
}

const loadConturi = async () => {
  const token = store.getters.token
  
  try {
    const res = await axios.get(`${process.env.host}conturi/toate`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    
    console.log('Rspuns la toate conturile', res.data.conturi)
    conturi.value = [...res.data.conturi]
  } catch (err) {
    console.error('Load conturi error:', err)
  }
}

onMounted(() => {
  loadConturi()
})
</script>
