const { createApp } = Vue

createApp({
  //aca inicializo mis variables
  data(){
    return{
      eventos: [],
      categorias: [],
      eventosFiltrados: [],
      currentDate: "",
      eventoConMasAsistencia: null,
      mayorAsistencia: null,
      eventoConMenosAsistencia: null,
      menorAsistencia: null,
      eventoConMayorCapacidad: null,
      mayorCapacidad: null,
      arrayPorCategoria: [],
      categoriasPast: [],
      categoriasUpcoming: [],
      eventosAgrupadosUpcoming: [],
      eventosAgrupadosPast: [],
      categoriasAcumuladas: [],
      categoriasAcumuladasUpcoming: []
    }
  },
  // esto se ejecuta al crear la pagina, va el fetch
  created(){
    fetch( 'https://mindhub-xj03.onrender.com/api/amazing' )
      .then( response => response.json() )
      .then( ( data )  => {
        this.eventos = data.events
        this.currentDate = data.currentDate.split("-")
        this.categorias = [...new Set(this.eventos.map(evento => evento.category))]
        this.eventosFiltrados = this.filtroEventosPorFecha(this.eventos, this.currentDate)
        this.eventoConMasAsistencia = this.highestAssistance(this.eventos, this.currentDate)[0]
        this.mayorAsistencia = this.highestAssistance(this.eventos, this.currentDate)[1].toFixed(2)
        this.eventoConMenosAsistencia = this.lowestAssistance(this.eventos, this.currentDate)[0]
        this.menorAsistencia = this.lowestAssistance(this.eventos, this.currentDate)[1].toFixed(2)
        this.eventoConMayorCapacidad = this.largerCapacity(this.eventos)[0]
        this.mayorCapacidad = this.largerCapacity(this.eventos)[1]
        this.arrayPorCategoria = this.agruparPorCategoria(this.eventos, this.categorias)
        this.categoriasPast = this.guardarCategory(this.eventosFiltrados[0])
        this.categoriasUpcoming = this.guardarCategory(this.eventosFiltrados[1])
        this.eventosAgrupadosUpcoming = this.agruparPorCategoria(this.eventosFiltrados[1], this.categoriasUpcoming)
        this.eventosAgrupadosPast = this.agruparPorCategoria(this.eventosFiltrados[0], this.categoriasPast)
        this.categoriasAcumuladas = this.acumulador(this.eventosAgrupadosPast)
        this.categoriasAcumuladasUpcoming = this.acumuladorUpcoming(this.eventosAgrupadosUpcoming)
      })
      .catch(error => console.log(error))
  },
  // aca van las funciones
  methods:{
    compararFecha(fecha, currentDate) {
        let fechaSplit = fecha.split("-");
        for (let i = 0; i < 3; i++) {
            if (parseInt(currentDate[i]) < parseInt(fechaSplit[i])) {
                return "mayor";
            } else if (parseInt(currentDate[i]) > parseInt(fechaSplit[i])) {
                return "menor";
            }
        }
        return "igual";
    },
    filtroEventosPorFecha (eventos, currentDate) {
        let pastEvents = []
        let upcomingEvents = []
    
        eventos.forEach(evento => {
            if(this.compararFecha(evento.date, currentDate) == "mayor"){
                upcomingEvents.push(evento)
            }
            else{
                pastEvents.push(evento)
            }
        })
        return [pastEvents, upcomingEvents]
    },
    agruparPorCategoria (eventos, categorias) {
        let arrayPorCategoria = []
        for (const categoria of categorias) {
            arrayPorCategoria.push(eventos.filter(evento => evento.category === categoria))
        }
        return arrayPorCategoria
    },
    guardarCategory (eventos) {
        let categorias = Array.from(new Set (...eventos.map(evento => evento.category)))
        return categorias;
    },
    highestAssistance (eventos) {
        let highestAssistance = 0
        let highestEvent
    
        eventos.forEach( evento => {
            let asistenciaAux = evento.assistance/(evento.capacity/100)
            if(asistenciaAux > highestAssistance){
                highestAssistance = asistenciaAux
                highestEvent = evento.name
            }
        })
    
        return [highestEvent, highestAssistance]
    },
    lowestAssistance (eventos, currentDate) {
        let lowestAssistance = 1000
        let lowestEvent
        let fecha
    
        eventos.forEach( evento => {
            fecha = this.compararFecha(evento.date, currentDate)
            if(fecha == "menor"){
                let asistenciaAux = evento.assistance/(evento.capacity/100)
                if(asistenciaAux < lowestAssistance){
                    lowestAssistance = asistenciaAux
                    lowestEvent = evento.name
                }
            }
            else{
                let asistenciaAux = evento.estimate/(evento.capacity/100)
                if(asistenciaAux < lowestAssistance){
                    lowestAssistance = asistenciaAux
                    lowestEvent = evento.name
                }
            }
        })
        return [lowestEvent, lowestAssistance]
    },
    largerCapacity(eventos) {
        let largestCapacity = 0
        let largestEvent
    
        eventos.forEach( evento => {
            if( evento.capacity > largestCapacity ){
                largestCapacity = evento.capacity;
                largestEvent = evento.name
            }
        })
        return [largestEvent, largestCapacity]
    },
    acumulador (arrayEventos) {
        let arrayAcumulado = []
        for (const subArray of arrayEventos) {
            arrayAcumulado.push(subArray.reduce((acc, cur) => {
                acc.revenue += cur.assistance * cur.price
                acc.assistance += cur.assistance
                acc.capacity += cur.capacity
                acc.porcentaje += (cur.assistance / (cur.capacity/100)) / subArray.length
                return acc
            }, {categoria: subArray[0].category, revenue: 0, assistance: 0, capacity: 0, porcentaje: 0}))
        }
        return arrayAcumulado
    },
    acumuladorUpcoming (arrayEventos) {
        let arrayAcumulado = []
        for (const subArray of arrayEventos) {
            arrayAcumulado.push(subArray.reduce((acc, cur) => {
                acc.revenue += cur.estimate * cur.price
                acc.estimate += cur.estimate
                acc.capacity += cur.capacity
                acc.porcentaje += (cur.estimate / (cur.capacity/100)) / subArray.length
                return acc
            }, {categoria: subArray[0].category, revenue: 0, estimate: 0, capacity: 0, porcentaje: 0}))
        }
        return arrayAcumulado
    }
  },
  // funciones que se ejecutan al cambiar una propiedad reactiva 
  computed:{

  }
}).mount('#app')