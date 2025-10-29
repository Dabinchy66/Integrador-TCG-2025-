// ======== VARIABLES ========
const player1Hand = document.querySelector("#hand1");
const player2Hand = document.querySelector("#hand2");
const campo = document.querySelector(".campo");
const turnosLeft = document.querySelector(".turnos.left");
const turnosRight = document.querySelector(".turnos.right");

let turno = 1;
let cartaSeleccionada = null;
let jugadorActual = 1;
let victorias1 = 0;
let victorias2 = 0;

// ======== CREAR MAZO ========
// 10 cartas por jugador, con valores aleatorios entre 1, 2, 3
function generarMazo() {
  const mazo = [];
  for (let i = 0; i < 10; i++) {
    mazo.push(Math.floor(Math.random() * 3) + 1);
  }
  return mazo;
}

const mazo1 = generarMazo();
const mazo2 = generarMazo();

function crearCartas(playerHand, jugador, mazo) {
  playerHand.innerHTML = "";
  mazo.forEach((valor, index) => {
    const carta = document.createElement("div");
    carta.classList.add("card");
    carta.dataset.valor = valor;
    carta.dataset.jugador = jugador;
    carta.dataset.index = index;
    carta.style.background = `linear-gradient(160deg, rgba(255,255,255,0.1), rgba(0,0,0,0.7))`;
    carta.textContent = valor;
    carta.style.display = "flex";
    carta.style.justifyContent = "center";
    carta.style.alignItems = "center";
    carta.style.fontSize = "28px";
    carta.style.fontWeight = "bold";
    carta.style.color = "white";
    carta.addEventListener("click", seleccionarCarta);
    playerHand.appendChild(carta);
  });
}

crearCartas(player1Hand, 1, mazo1);
crearCartas(player2Hand, 2, mazo2);

// ======== SELECCIONAR CARTA ========
function seleccionarCarta(e) {
  const carta = e.currentTarget;

  // Solo puede jugar el jugador actual
  if (parseInt(carta.dataset.jugador) !== jugadorActual) return;

  // Selección visual
  document.querySelectorAll(".card").forEach((c) => (c.style.border = "none"));
  carta.style.border = "2px solid gold";
  cartaSeleccionada = carta;
}

// ======== CAMPO Y COMBATE ========
campo.addEventListener("click", () => {
  if (!cartaSeleccionada) return;

  const carta = cartaSeleccionada;
  const jugador = parseInt(carta.dataset.jugador);
  const valor = parseInt(carta.dataset.valor);

  // Animación al campo
  const cartaClon = carta.cloneNode(true);
  cartaClon.style.cursor = "default";
  cartaClon.style.border = "none";
  cartaClon.classList.remove("selected");
  cartaClon.classList.add(`jugador${jugador}`);
  cartaClon.textContent = valor;
  campo.appendChild(cartaClon);

  // Eliminar carta jugada de la mano
  carta.remove();

  cartaSeleccionada = null;

  // Pasar turno al otro jugador
  if (jugadorActual === 1) {
    jugadorActual = 2;
  } else {
    jugadorActual = 1;
    // Cuando ambos jugaron, resolver la ronda
    setTimeout(resolverRonda, 1000);
  }
});

function resolverRonda() {
  const cartasCampo = campo.querySelectorAll(".card");
  if (cartasCampo.length < 2) return;

  const [c1, c2] = cartasCampo;
  const v1 = parseInt(c1.dataset.valor);
  const v2 = parseInt(c2.dataset.valor);

  let resultado = "";

  // Piedra papel tijera: 1 vence 3, 2 vence 1, 3 vence 2
  if (v1 === v2) {
    resultado = "Empate";
  } else if (
    (v1 === 1 && v2 === 3) ||
    (v1 === 2 && v2 === 1) ||
    (v1 === 3 && v2 === 2)
  ) {
    resultado = "Jugador 1 gana";
    victorias1++;
  } else {
    resultado = "Jugador 2 gana";
    victorias2++;
  }

  // Mostrar resultado visualmente
  const mensaje = document.createElement("div");
  mensaje.textContent = resultado;
  mensaje.style.position = "absolute";
  mensaje.style.top = "50%";
  mensaje.style.left = "50%";
  mensaje.style.transform = "translate(-50%, -50%)";
  mensaje.style.fontSize = "32px";
  mensaje.style.fontWeight = "bold";
  mensaje.style.textShadow = "2px 2px 6px black";
  campo.appendChild(mensaje);

  // Limpieza tras un tiempo
  setTimeout(() => {
    cartasCampo.forEach((c) => c.remove());
    mensaje.remove();
    avanzarTurno();
  }, 1500);
}

// ======== SISTEMA DE TURNOS ========
function avanzarTurno() {
  turno++;
  if (turno > 15) {
    finalizarPartida();
    return;
  }
  turnosLeft.textContent = `FINAL 15 TURNOS (${turno}/15)`;
  turnosRight.textContent = `FINAL 15 TURNOS (${turno}/15)`;
}

// ======== FINAL ========
function finalizarPartida() {
  const mensajeFinal = document.createElement("div");
  mensajeFinal.style.position = "absolute";
  mensajeFinal.style.top = "50%";
  mensajeFinal.style.left = "50%";
  mensajeFinal.style.transform = "translate(-50%, -50%)";
  mensajeFinal.style.fontSize = "40px";
  mensajeFinal.style.fontWeight = "bold";
  mensajeFinal.style.textShadow = "2px 2px 8px black";
  mensajeFinal.style.color = "gold";

  if (victorias1 > victorias2) {
    mensajeFinal.textContent = "🏆 ¡Jugador 1 gana la partida!";
  } else if (victorias2 > victorias1) {
    mensajeFinal.textContent = "🏆 ¡Jugador 2 gana la partida!";
  } else {
    mensajeFinal.textContent = "🤝 ¡Empate total!";
  }

  document.querySelector(".game-board").appendChild(mensajeFinal);
}
