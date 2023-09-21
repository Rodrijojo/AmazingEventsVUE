const { createApp } = Vue

createApp({
  //aca inicializo mis variables
  data(){
    return{
      eventos: [],
      currentDate: "",
      evento: null
    }
  },
  // esto se ejecuta al crear la pagina, va el fetch
  created(){
    const parametro = location.search
    console.log(parametro)
    const params = new URLSearchParams(parametro)
    console.log(params)
    const idDetail = params.get("id")
    console.log(idDetail)
    fetch( 'https://mindhub-xj03.onrender.com/api/amazing' )
      .then( response => response.json() )
      .then( ( data )  => {
        this.eventos = data.events
        this.currentDate = data.currentDate
        this.evento = this.eventos.find(evento => evento._id == idDetail)
        console.log(this.evento)
      })
      .catch(error => console.log(error))
  },
  // aca van las funciones
  methods:{
    
  },
  // funciones que se ejecutan al cambiar una propiedad reactiva 
  computed:{
    estaVacio() {
        return this.eventosFiltrados.length === 0;
    }
  }
}).mount('#app')

