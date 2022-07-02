const miModulo = (() => {
    'use strict';//estricto a la hora de evaluar el codigo

    let deck = [];
    const
        tipos = ['C', 'D', 'H', 'S'],
        especiales = ['A', 'J', 'Q', 'K'];
    let puntosJugadores = [];

    //NOTE referencias del HTML
    const
        btnPedir = document.querySelector('#btnPedir'),
        btnDetener = document.querySelector('#btnDetener'),
        btnNuevo = document.querySelector('#btnNuevo');

    const
        divCartasJugadores = document.querySelectorAll('.divCartas'),
        puntosHTML = document.querySelectorAll('small');

    //NOTE inicializa el juego
    const inicializarJuego = (numeroJugadore = 2) => {
        deck = crearDeck();
        puntosJugadores = [];
        for (let i = 0; i < numeroJugadore; i++) {
            puntosJugadores.push(0);
        }
        puntosHTML.forEach(puntos => puntos.innerText = 0);
        divCartasJugadores.forEach(div => div.innerHTML = '');

        btnPedir.disabled = false;
        btnDetener.disabled = false;
    }

    //NOTE esta funcion crea un nuevo deck (barajas)
    const crearDeck = () => {
        deck = [];
        for (let i = 2; i <= 10; i++) {
            for (let tipo of tipos) {
                deck.push(i + tipo);
            }
        }

        for (let tipo of tipos) {
            for (let especial of especiales) {
                deck.push(especial + tipo);
            }
        }
        return _.shuffle(deck);
    }

    //NOTE esta funcion me permite tomar una carta
    const pedirCarta = () => {
        if (deck.length === 0)
            throw 'no hay cartas en el deck';
        return deck.pop();
    }

    const valorCarta = (carta) => {
        const valor = carta.substring(0, carta.length - 1);
        return (isNaN(valor)) ?
            (valor === 'A') ? 11 : 10
            : valor * 1;
    }

    //turno:0= 1re jugador, ultimo sera la cpu
    const acumularPuntos = (carta, turno) => {
        puntosJugadores[turno] += valorCarta(carta);
        puntosHTML[turno].innerText = puntosJugadores[turno];
        return puntosJugadores[turno];
    }

    const crearCarta = (carta, turno) => {
        const imgCarta = document.createElement('img');
        imgCarta.src = `assets/cartas/${carta}.png`;
        imgCarta.classList.add('carta');
        divCartasJugadores[turno].append(imgCarta);
    }

    const determinarGanador = () => {
        const [puntosMinimos, puntosCpu] = puntosJugadores;
        setTimeout(() => {
            if (puntosCpu === puntosMinimos) {
                alert('empate :(');
            } else if (puntosMinimos > 21) {
                alert('cpu gana :D');
            } else if (puntosCpu > 21) {
                alert('jugador gana')
            } else {
                alert('cpu gana :D');
            }
        }, 10);
    }

    //NOTE turno de la cpu
    const turnoCpu = (puntosMinimos) => {
        let puntosComputadora = 0;
        do {
            const carta = pedirCarta();
            puntosComputadora = acumularPuntos(carta, puntosJugadores.length - 1);
            crearCarta(carta, puntosJugadores.length - 1);
            if (puntosMinimos > 21)
                break;
        } while ((puntosComputadora < puntosMinimos) && (puntosMinimos <= 21));
        determinarGanador();
    }

    //NOTE eventos
    //el primer parametro es el nombre del evento y el segundo es la funcion callback
    btnPedir.addEventListener('click', () => {
        const carta = pedirCarta();
        const puntosJugador = acumularPuntos(carta, 0);
        crearCarta(carta, 0);

        if (puntosJugador > 21) {
            btnPedir.disabled = true;
            btnDetener.disabled = true;
            turnoCpu(puntosJugador);
            console.log('perdites')
        } else if (puntosJugador === 21) {
            btnPedir.disabled = true;
            btnDetener.disabled = true;
            turnoCpu(puntosJugador);
            console.log('ganaste')
        }
    });

    btnDetener.addEventListener('click', () => {
        btnPedir.disabled = true;
        btnDetener.disabled = true;
        turnoCpu(puntosJugadores[0]);
    });

    // btnNuevo.addEventListener('click', () => {
    //     location.reload();//recarga la pagina
    // }, false);
    btnNuevo.addEventListener('click', () => {
        inicializarJuego();
    });

    return {
        nuevoJuego: inicializarJuego
    };
})();