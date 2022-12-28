window.onload = ()=>{

    const seleccionarAtaque = document.getElementById('seleccionar-ataque')
    const botonReiniciar = document.getElementById('boton-reiniciar')

    seleccionarAtaque.style.display = 'none'   
    botonReiniciar.style.display = 'none'


    const mensajes = document.getElementById('resultado')
    const ataquesJugadorE = document.getElementById('ataques-jugador')
    const ataquesEnemigoE = document.getElementById('ataques-enemigo')

    const vidasjugador = document.getElementById('vidas-jugador')
    const vidasEnemigo = document.getElementById('vidas-enemigo')

    const mascotaEnemigo = document.getElementById('mascota-enemigo')

    const botonMascota= document.getElementById('boton-mascota')
    const mascotaJugador = document.getElementById('mascota-jugador') 
    const seleccionarMascota = document.getElementById('seleccionar-mascota')

    const contenedorTarjetas = document.getElementById('contenedor-tarjetas')

    const botonesAtaque = document.getElementById('botones-ataque')

    const sectionVerMapa = document.getElementById('ver-mapa')    
    const mapa = document.getElementById('mapa')
    sectionVerMapa.style.display = 'none'
    //mapa.style.display = 'none'

    let lienzo = mapa.getContext('2d')

    let inputGoku 
    let inputVegeta
    let inputBroly 

    let ataqueEnemigo = []
    let opcionGuerreros

    let selecionado
    let ataquesGuerreroEnemigo
    let ataqueJugadorA = []
    let botones = []
    let indexAtaqueJugador 
    let indexAtaqueEnemigo
    let guerrerosEnemigos = []
    let guerreros = []

    let victoriasJugador = 0
    let victoriasEnemigo = 0

    let intervalo

    let jugadorId
    let enemigoId
    let mapaBackgroud = new Image()
    mapaBackgroud.src = './images/mapafondo.png'
    
    let alturaBuscada
    let anchoMapa = window.innerWidth - 20
    let anchoMaxMapa = 500 

    if (anchoMapa > anchoMaxMapa){
        anchoMapa = anchoMaxMapa -20
    }
    alturaBuscada = (anchoMapa * 600) /800

    mapa.width = anchoMapa
    mapa.height = alturaBuscada

    const aleatorio = (min,max) =>{
        return Math.floor(Math.random()*(max-min+1)+min)
    }
    class Gurerrero {
        constructor(nombre, foto, vida,fotoMapa, id = null){
            this.id = id
            this.nombre = nombre
            this.foto = foto
            this.vida = vida
            this.ataques= []
            this.ancho = 80
            this.alto = 80
            this.x = aleatorio(0,mapa.width-this.ancho)
            this.y = aleatorio(0,mapa.height-this.alto)
            this.mapaFoto = new Image()
            this.mapaFoto.src = fotoMapa
            this.velocidadX = 0
            this.velocidadY = 0

        }
        pintarGuerrero =()=>{
            lienzo.drawImage(
                this.mapaFoto,
                this.x,
                this.y,
                this.ancho,
                this.alto
            )
        }
    }
    let goku = new Gurerrero('Goku','./images/guku.png',3,'./images/cabezaG.png');
    let vegeta = new Gurerrero('Vegeta','./images/vegeta.png',3,'./images/cabezaV.png');
    let broly = new Gurerrero('Broly','./images/broly.png',3,'./images/cabezaB.png');

    const GOKUATAQUES = [
        {nombre: '💧',id: 'boton-agua'},
        {nombre: '💧',id: 'boton-agua'},
        {nombre: '💧',id: 'boton-agua'},
        {nombre: '🔥',id: 'boton-fuego'},
        {nombre: '🌱', id:'boton-tierra'}
    ]
    const VEGETAATAQUES = [
        {nombre: '💧',id: 'boton-agua'},
        {nombre: '🔥',id: 'boton-fuego'},
        {nombre: '🔥',id: 'boton-fuego'},
        {nombre: '🔥',id: 'boton-fuego'},
        {nombre: '🌱', id:'boton-tierra'}
    ]    
    const BROLYATAQUES = [
        {nombre: '💧',id: 'boton-agua'},
        {nombre: '🔥',id: 'boton-fuego'},
        {nombre: '🌱', id:'boton-tierra'},
        {nombre: '🌱', id:'boton-tierra'},
        {nombre: '🌱', id:'boton-tierra'},
    ]
    goku.ataques.push(...GOKUATAQUES)
    vegeta.ataques.push(...VEGETAATAQUES)
    broly.ataques.push(...BROLYATAQUES)

    guerreros.push(goku,vegeta,broly)

    guerreros.forEach((guerrero)=>{
        opcionGuerreros = `
        <input type="radio" name="mascota" id="${guerrero.nombre}"/>
            <label for="${guerrero.nombre}" class="tarjeta">
                <img src="${guerrero.foto}" alt="${guerrero.nombre}">
                <p>${guerrero.nombre}</p>
            </label>
        `
        contenedorTarjetas.innerHTML +=(opcionGuerreros)
    })
    const unirseAlJuego=()=>{
        fetch("http://192.168.1.7:3000/unirse")
            .then((res)=>{
                if (res.ok){
                    res.text()
                    .then((respuesta)=>{
                        console.log(respuesta)
                        jugadorId = respuesta
                    })
                }
            })
    }
    const ataqueAleatorioEnemigo = () =>{
        let ataqueAleatorio = aleatorio(0,ataquesGuerreroEnemigo.length -1)
       
        if(ataqueAleatorio == 0 || ataqueAleatorio == 1){
            ataqueEnemigo.push('Fuego')
        }else if(ataqueAleatorio == 2 || ataqueAleatorio == 3){
            ataqueEnemigo.push('Agua')
        }else{
            ataqueEnemigo.push('Tierra')
        }
        console.log(ataqueEnemigo)
        
        iniciarPelea()
    }
    const iniciarPelea = () =>{
        if(ataqueJugadorA.length === 5){
            validarPartida()
            revisarVictorias()
        }
    }
    const validarPartida =() =>{
        clearInterval(intervalo)
        for (let index = 0; index < ataqueJugadorA.length; index++) {
            if (ataqueJugadorA[index] === ataqueEnemigo[index]) {
                indexAmbosOponentes(index,index)
                resultado = 'Empate'
                crearMensaje()
            }else  if (ataqueJugadorA[index] == 'Agua' && ataqueEnemigo[index] == 'Fuego' || 
            ataqueJugadorA[index] == 'Fuego' && ataqueEnemigo[index] == 'Tierra' ||
            ataqueJugadorA[index] == 'Tierra' && ataqueEnemigo[index] == 'Agua'){
                indexAmbosOponentes(index,index)
                resultado = 'Ganaste'
                victoriasJugador++
                vidasjugador.innerHTML = victoriasJugador
                crearMensaje(resultado)
            }else if (ataqueJugadorA[index] == 'Fuego' && ataqueEnemigo[index] == 'Agua' ||
            ataqueJugadorA[index] == 'Tierra' && ataqueEnemigo[index] == 'Fuego' ||
            ataqueJugadorA[index] == 'Agua' && ataqueEnemigo[index] == 'Tierra'){
                indexAmbosOponentes(index,index)
                resultado = 'Perdiste'
                victoriasEnemigo++
                vidasEnemigo.innerHTML = victoriasEnemigo
                crearMensaje()
            }
        }
        
    }
    const crearMensaje =()=>{
       
        let parrafoAtaqueJugador = document.createElement('p')
        let parrafoAtaqueEnemigo  = document.createElement('p')

        
        parrafoAtaqueJugador.innerHTML = indexAtaqueJugador
        parrafoAtaqueEnemigo.innerHTML = indexAtaqueEnemigo

        ataquesJugadorE.appendChild(parrafoAtaqueJugador);
        ataquesEnemigoE.appendChild(parrafoAtaqueEnemigo );
      
    }
    const indexAmbosOponentes = (jugador,enemigo) =>{
        indexAtaqueJugador = ataqueJugadorA[jugador]
        indexAtaqueEnemigo = ataqueEnemigo[enemigo]
    }
    const revisarVictorias = ()=>{
        if (victoriasEnemigo === victoriasJugador){
            resultado = ('EMPATE!!')
            mensajes.innerHTML = resultado
            alert( resultado)
            botonReiniciar.style.display = 'block'
        }else  if (victoriasEnemigo > victoriasJugador){
            resultado = ('HAS PERDIDO')
            mensajes.innerHTML = resultado
            alert( resultado)
            
            botonReiniciar.style.display = 'block'
        } else  if (victoriasEnemigo  < victoriasJugador){
            resultado = ('HAS GANADO')
            mensajes.innerHTML = resultado
            alert( resultado)
            botonReiniciar.style.display = 'block'
        }
    }
    const seleccionarMascotaEnemigo= (enemigo)=>{
        
        mascotaEnemigo.innerHTML = enemigo.nombre
        ataquesGuerreroEnemigo = enemigo.ataques
        
    }
    botonMascota.addEventListener('click',()=>{

        inputGoku = document.getElementById(`Goku`)
        inputVegeta = document.getElementById(`Vegeta`)
        inputBroly = document.getElementById(`Broly`)
        if(inputGoku.checked){
            mascotaJugador.innerHTML = (`${inputGoku.id}`)
            iniciarMapa()
            sectionVerMapa.style.display = 'flex'
            seleccionarMascota.style.display = 'none'
            generarBotones()
        }else if(inputVegeta.checked){
            mascotaJugador.innerHTML = (`${inputVegeta.id}`)
            iniciarMapa()
            sectionVerMapa.style.display = 'flex'
            seleccionarMascota.style.display = 'none'
            generarBotones()
        }else if(inputBroly.checked){
            mascotaJugador.innerHTML =(`${inputBroly.id}`)
           iniciarMapa()
            sectionVerMapa.style.display = 'flex'
            seleccionarMascota.style.display = 'none'
            generarBotones()
        }else{
            alert('Selecciona una guerrero')
        }     

        seleccionarGuerrero(mascotaJugador.innerHTML)
    })
    seleccionarGuerrero =(mascota)=>{
        fetch(`http://192.168.1.7:3000/guerrero/${jugadorId}`,{
            method:'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                guerrero: mascota
            })
        })
    }
    const generarBotones=()=>{
        selecionado = mascotaJugador.innerHTML;
        guerreros.forEach((guerrero)=>{           
            if (guerrero.nombre == selecionado){
                console.log(guerrero.nombre +""+ selecionado)
    
                for(y=0 ; y<guerrero.ataques.length; y++){
                    boton = `
                    <button id="${guerrero.ataques[y].id}" class='boton-ataque BAtaque'>${guerrero.ataques[y].nombre}</button>
                    `
                    botonesAtaque.innerHTML += (boton)
                }
            }
        })    
    
        botones =  document.querySelectorAll('.BAtaque')
    
      
        secuenciaAtaque()
    }
    const secuenciaAtaque = () =>{
      
        botones.forEach((boton)=>{
            boton.addEventListener('click', (e) => {
                if(e.target.textContent === '🔥'){
                    ataqueJugadorA.push('Fuego')
                    console.log(ataqueJugadorA)
                    boton.style.backgroundColor = '#fff'
                }else if(e.target.textContent === '💧'){
                    ataqueJugadorA.push('Agua')
                    console.log(ataqueJugadorA)
                    boton.style.backgroundColor = '#fff'
                }else if(e.target.textContent === '🌱'){
                    ataqueJugadorA.push('Tierra')
                    console.log(ataqueJugadorA)
                    boton.style.backgroundColor = '#fff'
                }
                if (ataqueJugadorA.length === 5) {
                    EnviarAtaques()    
                }
                
            })
        })
       
    }
    EnviarAtaques = () =>{
        fetch(`http://192.168.1.7:3000/guerrero/${jugadorId}/ataques`,{
            method: 'POST',
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                ataques: ataqueJugadorA
            })    
        })
        intervalo = setInterval(obtenerAtaques, 50)
    }
function obtenerAtaques(){
    fetch(`http://192.168.1.7:3000/guerrero/${enemigoId}/ataques`)
        .then(function(res){
            if (res.ok){
                res.json()
                    .then(function({ataques}){
                        if (ataques.length === 5){
                            ataqueEnemigo = ataques 
                            iniciarPelea()
                        }
                    })
            }
        })
}

    botonReiniciar.addEventListener('click',()=>{
        location.reload()
    })
    const pintarCanvas=()=>{

        selecionado =  mascotaJugador.innerHTML
        guerreros.forEach((guerrero)=>{           
            if (guerrero.nombre == selecionado){
   
                guerrero.x = guerrero.x +guerrero.velocidadX
                guerrero.y = guerrero.y +guerrero.velocidadY

                lienzo.clearRect(0,0, mapa.width, mapa.height)
                lienzo.drawImage(mapaBackgroud,0,0,mapa.width,mapa.height)
                guerrero.pintarGuerrero()
                
                enviarPosicion(guerrero.x,guerrero.y)
                guerrerosEnemigos.forEach((guerrero)=>{
                    guerrero.pintarGuerrero()
                    colision(guerrero)
                })
            }
        })
    }
    enviarPosicion=(x,y)=>{
        console.log(jugadorId);
        fetch(`http://192.168.1.7:3000/guerrero/${jugadorId}/posicion`,{
            method: 'POST',
            headers:{
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({
                x,
                y
            })
        })
        .then( (res)=>{
            if(res.ok){
                res.json()
                .then(({enemigos})=>{
                    guerrerosEnemigos = enemigos.map((enemigo)=>{
                        let guerreroEnemigo = null
                        const guerreroNombre = enemigo.guerrero.nombre || ""
                        console.log(guerreroNombre);
                        if (guerreroNombre === 'Goku'){
                            guerreroEnemigo = new Gurerrero('Goku','./images/guku.png',3,'./images/cabezaG.png', enemigo.id);
                        }else if(guerreroNombre === 'Vegeta'){
                            guerreroEnemigo = new Gurerrero('Vegeta','./images/vegeta.png',3,'./images/cabezaV.png', enemigo.id);
                        }else if(guerreroNombre === 'Broly'){
                            guerreroEnemigo = new Gurerrero('Broly','./images/broly.png',3,'./images/cabezaB.png', enemigo.id);
                        }
                        guerreroEnemigo.x = enemigo.x
                        guerreroEnemigo.y = enemigo.y

                        return guerreroEnemigo
                    })
                })
            }
        })
    }
    moverDerecha=()=>{
        guerreros.forEach((guerrero)=>{           
            if (guerrero.nombre == selecionado){
                guerrero.velocidadX = 5
            }
        })
    }
    moverIzquierda=()=>{
        guerreros.forEach((guerrero)=>{           
            if (guerrero.nombre == selecionado){
                guerrero.velocidadX = -5
            }
        })
    }
    moverArriba=()=>{
        guerreros.forEach((guerrero)=>{           
            if (guerrero.nombre == selecionado){
                guerrero.velocidadY = -5
            }
        })
    }
    moverAbajo=()=>{
        guerreros.forEach((guerrero)=>{           
            if (guerrero.nombre == selecionado){
                guerrero.velocidadY = 5
            }
        })
    }
    detenerMovimiento = () =>{
        guerreros.forEach((guerrero)=>{           
            if (guerrero.nombre == selecionado){
                guerrero.velocidadX = 0
                guerrero.velocidadY = 0
            }
        })
    }
    teclaPresionada = (event) =>{
        switch (event.key) {
            case 'ArrowUp':
                moverArriba()
                break;
            case 'ArrowRight':
                moverDerecha()
                break;
            case 'ArrowLeft':
                moverIzquierda()
                break;
            case 'ArrowDown':
                moverAbajo()
                break;
            default:
                break;
        }
    }
    iniciarMapa = ()=>{        
       
        intervalo = setInterval(pintarCanvas, 50)
        window.addEventListener('keydown', teclaPresionada)
        window.addEventListener('keyup', detenerMovimiento)
    }
    colision = (enemigo) =>{
        const arribaE = enemigo.y
        const abajoE = enemigo.y + enemigo.alto
        const derechaE = enemigo.x + enemigo.ancho 
        const izquierdaE = enemigo.x

        guerreros.forEach((guerrero)=>{           
            if (guerrero.nombre == selecionado){
                arribaG = guerrero.y
                abajoG = guerrero.y + guerrero.alto
                derechaG = guerrero.x + guerrero.ancho 
                izquierdaG= guerrero.x
            }
        })
        if (abajoG < arribaE ||
        arribaG > abajoE ||
        derechaG < izquierdaE ||
        izquierdaG > derechaE) {
            return;
        }
        detenerMovimiento()
        clearInterval(intervalo)
        console.log('Se detecto una cola');
        enemigoId = enemigo.id
        seleccionarAtaque.style.display = 'flex'
        sectionVerMapa.style.display = 'none'
        seleccionarMascotaEnemigo(enemigo);
       // alert('Hay Colision con '+ enemigo.nombre)
    }
    unirseAlJuego()
}
    



