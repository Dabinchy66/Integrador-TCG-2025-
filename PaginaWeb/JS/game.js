// game.js - Lógica del juego Crownfall

// ===== TEMPLATES DE CARTAS =====
const UNIT_TEMPLATES = {
    milicia: { 
        name: 'Milicia', 
        type: 'unit', 
        unitType: 'cac', 
        hp: 5, 
        damage: 5, 
        level: 1, 
        ability: '+5 PV/PD a milicias',
        hasAbility: true
    },
    caballeroNovato: { 
        name: 'Caballero Novato', 
        type: 'unit', 
        unitType: 'cac', 
        hp: 15, 
        damage: 6, 
        level: 1 
    },
    caballero: { 
        name: 'Caballero', 
        type: 'unit', 
        unitType: 'cac', 
        hp: 25, 
        damage: 10, 
        level: 2 
    },
    jineteNovato: { 
        name: 'Jinete Novato', 
        type: 'unit', 
        unitType: 'cavalry', 
        hp: 10, 
        damage: 5, 
        level: 1 
    },
    jineteVeterano: { 
        name: 'Jinete Veterano', 
        type: 'unit', 
        unitType: 'cavalry', 
        hp: 16, 
        damage: 8, 
        level: 2 
    },
    caballeroJustas: { 
        name: 'Caballero Justas', 
        type: 'unit', 
        unitType: 'cavalry', 
        hp: 25, 
        damage: 10, 
        level: 2, 
        ability: 'Cargar: x2 daño',
        hasAbility: true
    },
    arquero: { 
        name: 'Arquero', 
        type: 'unit', 
        unitType: 'ranged', 
        hp: 10, 
        damage: 5, 
        level: 1 
    },
    ballestero: { 
        name: 'Ballestero', 
        type: 'unit', 
        unitType: 'ranged', 
        hp: 15, 
        damage: 10, 
        level: 2 
    },
    canonMano: { 
        name: 'Cañón de Mano', 
        type: 'unit', 
        unitType: 'ranged', 
        hp: 18, 
        damage: 15, 
        level: 2 
    },
    guardia: {
        name: 'Guardia',
        type: 'unit',
        unitType: 'cac',
        hp: 10,
        damage: 5,
        level: 1
    },
    miliciaMontada: {
        name: 'Milicia Montada',
        type: 'unit',
        unitType: 'cavalry',
        hp: 8,
        damage: 5,
        level: 1,
        ability: 'Cargar: x2 daño',
        hasAbility: true
    }
};

// ===== ESTADO DEL JUEGO =====
const gameState = {
    round: 1,
    currentPlayer: 'player',
    playerTurns: 15,
    aiTurns: 15,
    playerWins: 0,
    aiWins: 0,
    playerHand: [],
    aiHand: [],
    playerBattlefield: [],
    aiBattlefield: [],
    selectedCard: null,
    selectedSilver: null,
    waitingForTarget: false,
    waitingForAbilityTarget: false,
    actionType: null,
    activePlayerKing: 'balduino',
    activeAiKing: 'rey-arquero'
};

let cardIdCounter = 0;

// ===== INICIALIZACIÓN =====
function initGame() {
    dealInitialHands();
    updateUI();
}

function dealInitialHands() {
    gameState.playerHand = [];
    gameState.aiHand = [];
    
    const unitKeys = Object.keys(UNIT_TEMPLATES);
    
    // Jugador: 10 cartas (3 platas + 7 unidades aleatorias)
    for (let i = 0; i < 3; i++) {
        gameState.playerHand.push({
            id: `silver-${cardIdCounter++}`,
            name: 'Plata',
            type: 'silver'
        });
    }

    for (let i = 0; i < 7; i++) {
        const randomUnit = unitKeys[Math.floor(Math.random() * unitKeys.length)];
        const template = UNIT_TEMPLATES[randomUnit];
        gameState.playerHand.push({
            ...template,
            id: `unit-${cardIdCounter++}`,
            currentHp: template.hp,
            canAttack: false,
            abilityActive: false
        });
    }

    // IA: 10 cartas (3 platas + 7 unidades aleatorias)
    for (let i = 0; i < 3; i++) {
        gameState.aiHand.push({
            id: `ai-silver-${cardIdCounter++}`,
            name: 'Plata',
            type: 'silver'
        });
    }

    for (let i = 0; i < 7; i++) {
        const randomUnit = unitKeys[Math.floor(Math.random() * unitKeys.length)];
        const template = UNIT_TEMPLATES[randomUnit];
        gameState.aiHand.push({
            ...template,
            id: `ai-unit-${cardIdCounter++}`,
            currentHp: template.hp,
            canAttack: false,
            abilityActive: false
        });
    }
}

// ===== RENDERIZADO DE CARTAS =====
function renderCard(card, inHand = false, owner = 'player') {
    const cardEl = document.createElement('div');
    cardEl.className = `card ${card.type === 'unit' ? `unit-${card.unitType}` : card.type}`;
    cardEl.dataset.cardId = card.id;
    
    if (card.canAttack && !inHand) {
        cardEl.classList.add('can-attack');
    }

    if (card.abilityActive) {
        cardEl.style.boxShadow = '0 0 20px #00ff00';
    }

    // Configurar eventos de click
    if (inHand && gameState.currentPlayer === 'player') {
        cardEl.onclick = () => selectCard(card);
    } else if (!inHand && owner === 'player' && gameState.currentPlayer === 'player') {
        cardEl.onclick = () => selectCard(card);
    } else if (!inHand && owner === 'ai') {
        cardEl.onclick = () => selectTarget(card);
    }
    
    let content = `<div class="card-header">${card.name}</div>`;
    
    if (card.type === 'unit') {
        const armyPoints = card.currentHp;
        content += `
            <div class="army-points">${armyPoints}</div>
            <div class="card-stats">
                <div class="stat">
                    <div class="stat-label">PV</div>
                    <div>${card.currentHp}</div>
                </div>
                <div class="stat">
                    <div class="stat-label">PD</div>
                    <div>${card.damage}</div>
                </div>
            </div>
        `;
        if (card.ability) {
            const abilityStatus = card.abilityActive ? '✓' : '';
            content += `<div class="card-ability">${abilityStatus} ${card.ability}</div>`;
        }
    }
    
    cardEl.innerHTML = content;
    return cardEl;
}

// ===== SELECCIÓN DE CARTAS =====
function selectCard(card) {
    if (gameState.currentPlayer !== 'player') return;
    
    // Si estamos esperando seleccionar una carta para activar habilidad
    if (gameState.waitingForAbilityTarget && gameState.selectedSilver) {
        if (card.type === 'unit' && card.hasAbility && !card.abilityActive) {
            const inBattlefield = gameState.playerBattlefield.some(c => c.id === card.id);
            if (inBattlefield) {
                activateAbility(card);
                return;
            } else {
                showStatus('La unidad debe estar en el campo para activar su habilidad');
                return;
            }
        } else {
            showStatus('Selecciona una unidad con habilidad no activada');
            return;
        }
    }
    
    // Limpiar selección anterior
    document.querySelectorAll('.card.selected').forEach(el => el.classList.remove('selected'));
    
    gameState.selectedCard = card;
    const cardEl = document.querySelector(`[data-card-id="${card.id}"]`);
    if (cardEl) cardEl.classList.add('selected');

    // Verificar si la carta está en la mano
    const inHand = gameState.playerHand.some(c => c.id === card.id);
    
    if (inHand) {
        if (card.type === 'unit') {
            // Colocar unidad en el campo
            placeUnitOnBattlefield(card);
        } else if (card.type === 'silver') {
            gameState.selectedSilver = card;
            gameState.waitingForAbilityTarget = true;
            showStatus('Selecciona una unidad en el campo para activar su habilidad');
        }
    } else {
        // Carta en el campo de batalla
        if (card.type === 'unit' && card.canAttack) {
            showStatus('Selecciona una unidad enemiga para atacar');
            gameState.waitingForTarget = true;
            gameState.actionType = 'attack';
        } else if (card.type === 'unit' && !card.canAttack) {
            showStatus('Esta unidad ya atacó este turno o acaba de ser colocada');
        }
    }
}

function activateAbility(card) {
    // Consumir carta de plata
    const silverIndex = gameState.playerHand.findIndex(c => c.id === gameState.selectedSilver.id);
    if (silverIndex !== -1) {
        gameState.playerHand.splice(silverIndex, 1);
    }

    // Activar habilidad según el tipo de carta
    card.abilityActive = true;

    if (card.name === 'Milicia') {
        // Todas las milicias obtienen +5 PV y PD
        gameState.playerBattlefield.forEach(unit => {
            if (unit.name === 'Milicia') {
                unit.currentHp += 5;
                unit.damage += 5;
            }
        });
        showStatus('¡Habilidad activada! Todas las Milicias obtienen +5 PV/PD');
    } else if (card.name === 'Caballero Justas' || card.name === 'Milicia Montada') {
        // Cargar: próximo ataque hace x2 daño
        card.chargeActive = true;
        showStatus(`¡${card.name} está cargando! Próximo ataque x2 daño`);
    }

    gameState.selectedSilver = null;
    gameState.waitingForAbilityTarget = false;
    document.querySelectorAll('.card.selected').forEach(el => el.classList.remove('selected'));
    
    endPlayerTurn();
}

function placeUnitOnBattlefield(card) {
    const handIndex = gameState.playerHand.findIndex(c => c.id === card.id);
    if (handIndex === -1) return;

    gameState.playerHand.splice(handIndex, 1);
    card.canAttack = false; // No puede atacar el turno que se coloca
    gameState.playerBattlefield.push(card);
    
    showStatus(`${card.name} colocado en el campo de batalla`);
    
    document.querySelectorAll('.card.selected').forEach(el => el.classList.remove('selected'));
    gameState.selectedCard = null;
    
    endPlayerTurn();
}

function selectTarget(target) {
    if (!gameState.waitingForTarget || gameState.currentPlayer !== 'player') return;

    if (gameState.actionType === 'attack') {
        attackUnit(gameState.selectedCard, target);
    }

    gameState.waitingForTarget = false;
    gameState.actionType = null;
    gameState.selectedCard = null;
    updateUI();
}

// ===== SISTEMA DE COMBATE =====
function attackUnit(attacker, defender) {
    if (!attacker || !defender) return;

    let damage = attacker.damage;
    
    // Verificar si tiene carga activa
    if (attacker.chargeActive) {
        damage *= 2;
        attacker.chargeActive = false;
        showStatus(`¡Carga! ${attacker.name} hace ${damage} de daño a ${defender.name}`);
    } else {
        // Calcular ventaja/desventaja (piedra-papel-tijera)
        const advantage = checkAdvantage(attacker.unitType, defender.unitType);
        if (advantage) {
            damage *= 2;
            showStatus(`¡Ventaja! ${attacker.name} hace ${damage} de daño a ${defender.name}`);
        } else {
            showStatus(`${attacker.name} ataca a ${defender.name} por ${damage} de daño`);
        }
    }

    // Aplicar daño
    defender.currentHp -= damage;
    attacker.canAttack = false;

    // Animación de ataque
    const targetEl = document.querySelector(`[data-card-id="${defender.id}"]`);
    if (targetEl) {
        targetEl.classList.add('attacking');
        setTimeout(() => targetEl.classList.remove('attacking'), 500);
    }

    // Eliminar unidad si murió
    if (defender.currentHp <= 0) {
        const index = gameState.aiBattlefield.findIndex(c => c.id === defender.id);
        if (index !== -1) {
            gameState.aiBattlefield.splice(index, 1);
            showStatus(`${defender.name} ha sido derrotado!`);
        }
    }

    endPlayerTurn();
}

function checkAdvantage(attackerType, defenderType) {
    const advantages = {
        'cac': 'cavalry',      // CaC es fuerte contra Caballería
        'ranged': 'cac',       // Ranged es fuerte contra CaC
        'cavalry': 'ranged'    // Caballería es fuerte contra Ranged
    };
    return advantages[attackerType] === defenderType;
}

// ===== GESTIÓN DE TURNOS =====
function endPlayerTurn() {
    if (gameState.currentPlayer !== 'player') return;

    gameState.playerTurns--;
    document.querySelectorAll('.card.selected').forEach(el => el.classList.remove('selected'));
    gameState.selectedCard = null;
    gameState.selectedSilver = null;
    gameState.waitingForTarget = false;
    gameState.waitingForAbilityTarget = false;
    gameState.actionType = null;

    // Habilitar ataque para próximo turno
    gameState.playerBattlefield.forEach(card => {
        if (card.type === 'unit') card.canAttack = true;
    });

    // Verificar si terminó la ronda
    if (gameState.playerTurns <= 0 && gameState.aiTurns <= 0) {
        endRound();
        return;
    }

    gameState.currentPlayer = 'ai';
    updateUI();
    
    // Turno de la IA después de 1 segundo
    setTimeout(aiTurn, 1000);
}

function aiTurn() {
    if (gameState.currentPlayer !== 'ai') return;

    gameState.aiTurns--;

    // IA simple: prioriza colocar unidades si tiene en mano
    const unitsInHand = gameState.aiHand.filter(c => c.type === 'unit');
    
    if (unitsInHand.length > 0 && Math.random() > 0.3) {
        // 70% de probabilidad de colocar una unidad si tiene
        const unit = unitsInHand[Math.floor(Math.random() * unitsInHand.length)];
        const handIndex = gameState.aiHand.findIndex(c => c.id === unit.id);
        
        if (handIndex !== -1) {
            gameState.aiHand.splice(handIndex, 1);
            unit.canAttack = false;
            gameState.aiBattlefield.push(unit);
            showStatus(`IA colocó ${unit.name} en el campo`);
        }
    } else {
        // Si no coloca unidad, intenta atacar
        const attackers = gameState.aiBattlefield.filter(c => c.type === 'unit' && c.canAttack);
        
        if (attackers.length > 0 && gameState.playerBattlefield.length > 0) {
            const attacker = attackers[Math.floor(Math.random() * attackers.length)];
            const target = gameState.playerBattlefield[Math.floor(Math.random() * gameState.playerBattlefield.length)];
            
            let damage = attacker.damage;
            
            if (attacker.chargeActive) {
                damage *= 2;
                attacker.chargeActive = false;
            } else {
                const advantage = checkAdvantage(attacker.unitType, target.unitType);
                if (advantage) damage *= 2;
            }

            target.currentHp -= damage;
            attacker.canAttack = false;

            showStatus(`IA: ${attacker.name} ataca a ${target.name} (${damage} daño)`);

            // Animación
            const targetEl = document.querySelector(`[data-card-id="${target.id}"]`);
            if (targetEl) {
                targetEl.classList.add('attacking');
                setTimeout(() => targetEl.classList.remove('attacking'), 500);
            }

            if (target.currentHp <= 0) {
                const index = gameState.playerBattlefield.findIndex(c => c.id === target.id);
                if (index !== -1) {
                    gameState.playerBattlefield.splice(index, 1);
                    showStatus(`Tu ${target.name} ha sido derrotado!`);
                }
            }
        }
    }

    // Verificar si terminó la ronda
    if (gameState.playerTurns <= 0 && gameState.aiTurns <= 0) {
        setTimeout(endRound, 1000);
        return;
    }

    // Habilitar ataque para próximo turno de IA
    gameState.aiBattlefield.forEach(card => {
        if (card.type === 'unit') card.canAttack = true;
    });

    gameState.currentPlayer = 'player';
    updateUI();
}

// ===== FIN DE RONDA Y PARTIDA =====
function endRound() {
    const playerArmy = calculateArmyPoints('player');
    const aiArmy = calculateArmyPoints('ai');

    let winner = '';
    if (playerArmy > aiArmy) {
        gameState.playerWins++;
        winner = 'Jugador';
    } else if (aiArmy > playerArmy) {
        gameState.aiWins++;
        winner = 'IA';
    } else {
        winner = 'Empate';
    }

    showModal(
        `¡Fin de Ronda ${gameState.round}!`, 
        `Puntos Jugador: ${playerArmy}<br>Puntos IA: ${aiArmy}<br><br>Ganador: ${winner}`, 
        () => {
            if (gameState.playerWins >= 2) {
                showModal('¡VICTORIA!', 'Has ganado la partida', () => location.reload());
            } else if (gameState.aiWins >= 2) {
                showModal('¡DERROTA!', 'La IA ha ganado la partida', () => location.reload());
            } else {
                startNewRound();
            }
        }
    );
}

function startNewRound() {
    gameState.round++;
    gameState.playerTurns = 15;
    gameState.aiTurns = 15;
    gameState.currentPlayer = 'player';
    
    // Limpiar campos de batalla
    gameState.playerBattlefield = [];
    gameState.aiBattlefield = [];

    // Dar nuevas manos de 10 cartas
    dealInitialHands();

    updateUI();
}

function calculateArmyPoints(player) {
    const battlefield = player === 'player' ? gameState.playerBattlefield : gameState.aiBattlefield;
    return battlefield.reduce((total, card) => {
        if (card.type === 'unit') {
            return total + card.currentHp;
        }
        return total;
    }, 0);
}

// ===== ACTUALIZACIÓN DE UI =====
function updateUI() {
    // Actualizar información
    document.getElementById('round-number').textContent = gameState.round;
    document.getElementById('player-turns').textContent = gameState.playerTurns;
    document.getElementById('ai-turns').textContent = gameState.aiTurns;
    document.getElementById('player-wins').textContent = gameState.playerWins;
    document.getElementById('ai-wins').textContent = gameState.aiWins;
    
    // Calcular y mostrar puntos de ejército
    const playerArmy = calculateArmyPoints('player');
    const aiArmy = calculateArmyPoints('ai');
    document.getElementById('player-army').textContent = playerArmy;
    document.getElementById('ai-army').textContent = aiArmy;
    
    // Actualizar contadores de mazos (cartas en mano)
    document.getElementById('player-deck-count').textContent = gameState.playerHand.length;
    document.getElementById('ai-deck-count').textContent = gameState.aiHand.length;
    
    // Actualizar indicador de turno
    const turnIndicator = document.getElementById('turn-indicator');
    turnIndicator.textContent = gameState.currentPlayer === 'player' ? 'TURNO JUGADOR' : 'TURNO IA';
    turnIndicator.style.background = gameState.currentPlayer === 'player' 
        ? 'linear-gradient(135deg, #1a4d2e 0%, #2d6a4f 100%)'
        : 'linear-gradient(135deg, #8b0000 0%, #dc143c 100%)';
    
    // Renderizar mano del jugador
    const handContainer = document.getElementById('player-hand');
    handContainer.innerHTML = '';
    gameState.playerHand.forEach(card => {
        handContainer.appendChild(renderCard(card, true, 'player'));
    });
    
    // Renderizar campo de batalla del jugador
    const playerBattlefield = document.getElementById('player-battlefield');
    playerBattlefield.innerHTML = '';
    gameState.playerBattlefield.forEach(card => {
        playerBattlefield.appendChild(renderCard(card, false, 'player'));
    });
    
    // Renderizar campo de batalla de la IA
    const aiBattlefield = document.getElementById('ai-battlefield');
    aiBattlefield.innerHTML = '';
    gameState.aiBattlefield.forEach(card => {
        aiBattlefield.appendChild(renderCard(card, false, 'ai'));
    });
}

// ===== MENSAJES Y MODALES =====
function showStatus(message) {
    const statusEl = document.getElementById('status-message');
    statusEl.textContent = message;
    statusEl.classList.add('show');
    
    setTimeout(() => {
        statusEl.classList.remove('show');
    }, 2000);
}

function showModal(title, message, callback) {
    const overlay = document.getElementById('message-overlay');
    const content = document.getElementById('message-content');
    
    content.innerHTML = `
        <h2>${title}</h2>
        <p>${message}</p>
        <div class="modal-actions">
            <button class="btn btn-primary" onclick="closeModal()">Continuar</button>
        </div>
    `;
    
    overlay.classList.add('show');
    
    // Guardar callback para usarlo después
    window.modalCallback = callback;
}

function closeModal() {
    const overlay = document.getElementById('message-overlay');
    overlay.classList.remove('show');
    
    if (window.modalCallback) {
        window.modalCallback();
        window.modalCallback = null;
    }
}

// ===== EVENT LISTENERS =====
document.addEventListener('DOMContentLoaded', () => {
    initGame();
    
    // Botón de pasar turno
    document.getElementById('end-turn-btn').addEventListener('click', () => {
        if (gameState.currentPlayer === 'player') {
            endPlayerTurn();
        }
    });
});