const { createApp } = Vue

createApp({
  //aca inicializo mis variables
  data(){
    return{
      eventos: [],
      categorias: [],
      eventosFiltrados: [],
      categoriasChecked: [],
      inputSearchValue: ""
    }
  },
  // esto se ejecuta al crear la pagina, va el fetch
  created(){
    fetch( 'https://mindhub-xj03.onrender.com/api/amazing' )
      .then( response => response.json() )
      .then( ( data )  => {
        this.eventos = data.events
        this.categorias = [...new Set(this.eventos.map(evento => evento.category))]
        this.eventosFiltrados = this.eventos
      })
      .catch(error => console.log(error))
  },
  // aca van las funciones
  methods:{
    filtroPorSearch(eventos, inputSearchValue){
      if(inputSearchValue.length === 0){
        return eventos
      }
      return eventos.filter( evento => evento.name.includes(inputSearchValue))
    },
    filtroCategoria(eventos, checked){
      if(checked.length === 0){
        return eventos
      }
      return eventos.filter( evento => checked.includes( evento.category ))
    },
    filtroCruzado(){
      const filtradoSearch = this.filtroPorSearch(this.eventos, this.inputSearchValue)
      const filtradoCheck = this.filtroCategoria(filtradoSearch, this.categoriasChecked)
      this.eventosFiltrados = filtradoCheck
    },
  },
  // funciones que se ejecutan al cambiar una propiedad reactiva 
  computed:{
    estaVacio() {
      return this.eventosFiltrados.length === 0;
    }
  }
}).mount('#app')