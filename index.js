const express = require("express")
const cors = require("cors")
const app = express()

app.use(cors())
app.use(express.json())

const jugadores = []
class Jugador{
    constructor(id){
        this.id = id
    }
    asignarGuerrero(guerrero){
        this.guerrero = guerrero
    }
}
class Guerrero{
    constructor(nombre){
        this.nombre = nombre
    }
}

app.get('/unirse', (req,res)=>{
    const id = `${Math.random()}`

    const jugador = new Jugador(id)
    jugadores.push(jugador)
    res.setHeader("Access-Control-Allow-Origin","*")
    res.send(id)
})

app.post('/guerrero/:jugadorId', (req,res)=>{
    const jugadorId = req.params.jugadorId || ""
    const nombre = req.body.guerrero || ""
    const guerrero = new Guerrero(nombre)
    const jugadorIndex = jugadores.findIndex((jugador)=> jugadorId === jugador.id)
    if (jugadorIndex >=0 ){
        jugadores[jugadorIndex].asignarGuerrero(guerrero)
    }
    console.log(jugadores);
    console.log(jugadorId);
    res.end()
})
app.listen(8080, ()=>{
    console.log('Servidor Creado')
})