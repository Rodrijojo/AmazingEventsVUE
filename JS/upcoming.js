const { createApp } = Vue

createApp({
  //aca inicializo mis variables
  data(){
    return{
      eventos: [],
      categorias: [],
      eventosFiltrados: [],
      categoriasChecked: [],
      inputSearchValue: "",
      currentDate: ""
    }
  },
  // esto se ejecuta al crear la pagina, va el fetch
  created(){
    fetch( 'https://mindhub-xj03.onrender.com/api/amazing' )
      .then( response => response.json() )
      .then( ( data )  => {
        this.eventos = data.events
        this.currentDate = data.currentDate
        this.eventosFiltrados = this.eventos.filter(evento => evento.estimate)     // no recononce los eventos filtrados
        console.log(this.eventosFiltrados)
        this.categorias = [...new Set(this.eventosFiltrados.map(evento => evento.category))]
        console.log(this.categorias)
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
      console.log(this.categoriasChecked)
    },
  },
  // funciones que se ejecutan al cambiar una propiedad reactiva 
  computed:{
    estaVacio() {
        return this.eventosFiltrados.length === 0;
    }
  }
}).mount('#app')