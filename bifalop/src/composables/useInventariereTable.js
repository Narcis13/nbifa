import { ref, computed } from 'vue'

export function useInventariereTable() {
  const selected = ref([])
  const loading = ref(false)
  const filter = ref('')
  const group = ref('eyecolor')
  
  const options = ref([
    {
      label: 'Ungrouped',
      value: ':nothing'
    },
    {
      label: 'Eye Color',
      value: 'eyecolor'
    },
    {
      label: 'Company',
      value: 'company'
    },
    {
      label: 'Gender',
      value: 'gender'
    }
  ])
  
  const niceTitle = ref('Employees')
  
  const column_defs = ref([
    { name: 'index', align: 'center', label: 'Index', field: 'index' },
    { name: 'balance', label: 'Balance', field: 'balance', align: 'center' },
    { 
      name: 'eyecolor', 
      label: 'Eye Color', 
      field: 'eyecolor', 
      align: 'center',
      formatGroupHeader: (value, count) => `Stuff with ${value} eyes (${count} people)` 
    },
    { name: 'name', label: 'Name', field: 'name', align: 'left' },
    { name: 'gender', label: 'Gender', field: 'gender', align: 'center' },
    { 
      name: 'company', 
      label: 'Company', 
      field: 'company', 
      align: 'left',
      formatGroupHeader: (value, count) => `${count} people in ${value} company` 
    }
  ])
  
  const users = ref([])
  
  const lazyusers = [
    {
      index: 0,
      balance: "$3,091.58",
      eyecolor: "green",
      name: "Stafford Mathews",
      gender: "male",
      company: "APPLE"
    },
    {
      index: 1,
      balance: "$3,305.95",
      eyecolor: "brown",
      name: "Darlene Harvey",
      gender: "female",
      company: "AMAZON"
    },
    {
      index: 2,
      balance: "$2,943.30",
      eyecolor: "brown",
      name: "Rochelle Morse",
      gender: "female",
      company: "GOOGLE"
    },
    {
      index: 3,
      balance: "$1,228.44",
      eyecolor: "brown",
      name: "Holloway Joseph",
      gender: "male",
      company: "GOOGLE"
    },
    {
      index: 4,
      balance: "$3,501.66",
      eyecolor: "green",
      name: "Leona Alford",
      gender: "female",
      company: "GOOGLE"
    },
    {
      index: 5,
      balance: "$3,615.24",
      eyecolor: "brown",
      name: "Rojas Madden",
      gender: "male",
      company: "AMAZON"
    },
    {
      index: 6,
      balance: "$1,942.56",
      eyecolor: "blue",
      name: "Mann Lloyd",
      gender: "male",
      company: "GOOGLE"
    },
    {
      index: 7,
      balance: "$1,640.86",
      eyecolor: "brown",
      name: "Jeannine Trevino",
      gender: "female",
      company: "APPLE"
    },
    {
      index: 8,
      balance: "$1,472.26",
      eyecolor: "green",
      name: "Reba Sellers",
      gender: "female",
      company: "APPLE"
    },
    {
      index: 9,
      balance: "$1,824.55",
      eyecolor: "brown",
      name: "Osborn Stein",
      gender: "male",
      company: "GOOGLE"
    },
    {
      index: 10,
      balance: "$1,057.34",
      eyecolor: "blue",
      name: "Sarah Cantrell",
      gender: "female",
      company: "AMAZON"
    },
    {
      index: 11,
      balance: "$1,328.18",
      eyecolor: "blue",
      name: "Traci Mcguire",
      gender: "female",
      company: "GOOGLE"
    },
    {
      index: 12,
      balance: "$2,848.73",
      eyecolor: "brown",
      name: "Karina Rose",
      gender: "female",
      company: "GOOGLE"
    },
    {
      index: 13,
      balance: "$1,379.99",
      eyecolor: "green",
      name: "Caroline Lamb",
      gender: "female",
      company: "GOOGLE"
    },
    {
      index: 14,
      balance: "$3,593.06",
      eyecolor: "brown",
      name: "Trudy Savage",
      gender: "female",
      company: "AMAZON"
    },
    {
      index: 15,
      balance: "$2,207.32",
      eyecolor: "brown",
      name: "Elinor Burch",
      gender: "female",
      company: "GOOGLE"
    },
    {
      index: 16,
      balance: "$1,493.05",
      eyecolor: "green",
      name: "Walls Sawyer",
      gender: "male",
      company: "AMAZON"
    },
    {
      index: 17,
      balance: "$3,149.86",
      eyecolor: "blue",
      name: "Porter Ayala",
      gender: "male",
      company: "GOOGLE"
    },
    {
      index: 18,
      balance: "$3,773.37",
      eyecolor: "blue",
      name: "Mooney Frederick",
      gender: "male",
      company: "AMAZON"
    }
  ]
  
  // Methods
  const get_selection = (selection) => {
    selected.value = selection
  }
  
  const addrow = () => {
    alert('CUSTOM TOP SLOT IS WORKING!')
  }
  
  const remove = () => {
    users.value.shift()
  }
  
  const loadData = () => {
    loading.value = true
    setTimeout(() => {
      users.value = [...lazyusers]
      loading.value = false
    }, 3000)
  }
  
  // Computed properties for filtering
  const filteredUsers = computed(() => {
    if (!filter.value) {
      return users.value
    }
    
    const searchTerm = filter.value.toLowerCase()
    return users.value.filter(user => {
      return Object.values(user).some(val => 
        String(val).toLowerCase().includes(searchTerm)
      )
    })
  })
  
  // Grouping logic
  const groupedUsers = computed(() => {
    if (group.value === ':nothing') {
      return { '': filteredUsers.value }
    }
    
    return filteredUsers.value.reduce((acc, user) => {
      const groupKey = user[group.value]
      if (!acc[groupKey]) {
        acc[groupKey] = []
      }
      acc[groupKey].push(user)
      return acc
    }, {})
  })
  
  return {
    selected,
    loading,
    filter,
    group,
    options,
    niceTitle,
    column_defs,
    users,
    filteredUsers,
    groupedUsers,
    get_selection,
    addrow,
    remove,
    loadData
  }
}