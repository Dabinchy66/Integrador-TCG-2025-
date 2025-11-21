// game.js - Lógica del juego Crownfall

// ===== CONFIGURACIÓN DE MAZOS =====
const DECK_1_CONFIG = {
    // CARTAS DE PLATA
    plata: { count: 15, name: 'Plata', type: 'silver' },
    
    // UNIDADES CUERPO A CUERPO
    milicia: { count: 3, name: 'Milicia', type: 'unit', unitType: 'cac', hp: 5, damage: 5, level: 1, ability: '+5 PV/PD a milicias', hasAbility: true },
    caballeroNovato: { count: 1, name: 'Caballero Novato', type: 'unit', unitType: 'cac', hp: 15, damage: 6, level: 1 },
    caballero: { count: 1, name: 'Caballero', type: 'unit', unitType: 'cac', hp: 25, damage: 10, level: 2 },
    
    // CABALLERÍA
    jineteNovato: { count: 3, name: 'Jinete Novato', type: 'unit', unitType: 'cavalry', hp: 10, damage: 5, level: 1 },
    jineteVeterano: { count: 1, name: 'Jinete Veterano', type: 'unit', unitType: 'cavalry', hp: 16, damage: 8, level: 2 },
    caballeroJustas: { count: 1, name: 'Caballero de Justas', type: 'unit', unitType: 'cavalry', hp: 25, damage: 10, level: 2, ability: 'Cargar: x2 daño', hasAbility: true },
    
    // A DISTANCIA
    arquero: { count: 3, name: 'Arquero', type: 'unit', unitType: 'ranged', hp: 10, damage: 5, level: 1 },
    ballestero: { count: 1, name: 'Ballestero', type: 'unit', unitType: 'ranged', hp: 15, damage: 10, level: 2 },
    canonMano: { count: 1, name: 'Soldado con Cañón', type: 'unit', unitType: 'ranged', hp: 18, damage: 15, level: 2 },
    
    // ÓRDENES
    catapulta: { count: 1, name: 'Tiro de Catapulta', type: 'order', damage: 20 },
    bombarda: { count: 1, name: 'Tiro de Bombarda', type: 'order', damage: 35 },
    lluviaFlechas: { count: 1, name: 'Lluvia de Flechas', type: 'order', damage: 12 },
    ariete: { count: 1, name: 'Golpe de Ariete', type: 'order', damage: 5, destroysStructures: true },
    
    // ESTRUCTURAS
    torreMadera: { count: 1, name: 'Torre de Madera', type: 'structure', hp: 20, requires: 2, requiresType: 'ranged' },
    torrePiedra: { count: 1, name: 'Torre de Piedra', type: 'structure', hp: 35, requires: 3, requiresType: 'ranged' },
    cabana: { count: 1, name: 'Cabaña', type: 'structure', hp: 25, buff: { hp: 5, damage: 5, turns: 2 } },
    
    // ESPECIALES
    ladron: { count: 1, name: 'Ladrón', type: 'special', options: ['draw2', 'steal2silver', 'killUnit'] }
};

const DECK_2_CONFIG = {
    // CARTAS DE PLATA
    plata: { count: 15, name: 'Plata', type: 'silver' },
    
    // UNIDADES CUERPO A CUERPO
    guardia: { count: 3, name: 'Guardia', type: 'unit', unitType: 'cac', hp: 10, damage: 5, level: 1 },
    caballeroNovato: { count: 1, name: 'Caballero Novato', type: 'unit', unitType: 'cac', hp: 15, damage: 6, level: 1 },
    cruzado: { count: 1, name: 'Cruzado', type: 'unit', unitType: 'cac', hp: 20, damage: 10, level: 2, ability: 'Todas las unidades +2 PD', hasAbility: true },
    
    // CABALLERÍA
    miliciaMontada: { count: 3, name: 'Milicia Montada', type: 'unit', unitType: 'cavalry', hp: 8, damage: 5, level: 1, ability: 'Cargar: x2 daño', hasAbility: true },
    jineteVeterano: { count: 1, name: 'Jinete Veterano', type: 'unit', unitType: 'cavalry', hp: 16, damage: 8, level: 2 },
    caballeroJustas: { count: 1, name: 'Caballero de Justas', type: 'unit', unitType: 'cavalry', hp: 25, damage: 10, level: 2, ability: 'Cargar: x2 daño', hasAbility: true },
    
    // A DISTANCIA
    cazadorFurtivo: { count: 3, name: 'Cazador Furtivo', type: 'unit', unitType: 'ranged', hp: 8, damage: 5, level: 1, ability: 'Camuflaje', hasAbility: true },
    ballestero: { count: 1, name: 'Ballestero', type: 'unit', unitType: 'ranged', hp: 15, damage: 10, level: 2 },
    canonMano: { count: 1, name: 'Soldado con Cañón', type: 'unit', unitType: 'ranged', hp: 18, damage: 15, level: 2 },
    
    // ÓRDENES
    catapulta: { count: 1, name: 'Tiro de Catapulta', type: 'order', damage: 20 },
    bombarda: { count: 1, name: 'Tiro de Bombarda', type: 'order', damage: 35 },
    lluviaFlechas: { count: 1, name: 'Lluvia de Flechas', type: 'order', damage: 12 },
    ariete: { count: 1, name: 'Golpe de Ariete', type: 'order', damage: 5, destroysStructures: true },
    
    // ESTRUCTURAS
    torreMadera: { count: 1, name: 'Torre de Madera', type: 'structure', hp: 20, requires: 2, requiresType: 'ranged' },
    torrePiedra: { count: 1, name: 'Torre de Piedra', type: 'structure', hp: 35, requires: 3, requiresType: 'ranged' },
    cabana: { count: 1, name: 'Cabaña', type: 'structure', hp: 25, buff: { hp: 5, damage: 5, turns: 2 } },
    
    // ESPECIALES
    ladron: { count: 1, name: 'Ladrón', type: 'special', options: ['draw2', 'steal2silver', 'killUnit'] }
};

// ===== ESTADO DEL JUEGO =====
const gameState = {
    round: 1,
    currentPlayer: 'player',
    playerTurns: 15,
    aiTurns: 15,
    playerWins: 0,
    aiWins: 0,
    playerDeck: [],
    aiDeck: [],
    playerHand: [],
    aiHand: [],
    playerBattlefield: [],
    aiBattlefield: [],
    selectedCard: null,
    selectedSilver: null,
    selectedStructure: null,
    waitingForTarget: false,
    waitingForAbilityTarget: false,
    waitingForStructureUnit: false,
    waitingForThiefAction: false,
    actionType: null,
    activePlayerKing: 'balduino',
    activeAiKing: 'rey-arquero',
    turnCounter: 0
};

let cardIdCounter = 0;

// ===== CREAR MAZO COMPLETO =====
function createFullDeck(deckConfig) {
    const deck = [];
    
    for (const [key, cardData] of Object.entries(deckConfig)) {
        for (let i = 0; i < cardData.count; i++) {
            const card = {
                ...cardData,
                id: `${key}-${cardIdCounter++}`,
                uniqueId: `${key}-${i}`
            };
            
            if (card.type === 'unit') {
                card.currentHp = card.hp;
                card.canAttack = false;
                card.abilityActive = false;
            } else if (card.type === 'structure') {
                card.currentHp = card.hp;
            }
            
            deck.push(card);
        }
    }
    
    return deck;
}

// ===== MEZCLAR MAZO =====
function shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
}

// ===== INICIALIZACIÓN =====
function initGame() {
    // Crear mazos completos
    gameState.playerDeck = shuffleDeck(createFullDeck(DECK_1_CONFIG));
    gameState.aiDeck = shuffleDeck(createFullDeck(DECK_2_CONFIG));
    
    // Robar 10 cartas iniciales
    dealInitialHands();
    
    updateUI();
    console.log('Juego inicializado correctamente');
    console.log('Cartas en mazo jugador:', gameState.playerDeck.length);
    console.log('Cartas en mazo IA:', gameState.aiDeck.length);
}

function dealInitialHands() {
    gameState.playerHand = [];
    gameState.aiHand = [];
    
    // Jugador: exactamente 3 platas + 7 cartas aleatorias NO PLATA
    for (let i = 0; i < 3; i++) {
        const plataIndex = gameState.playerDeck.findIndex(c => c.type === 'silver');
        if (plataIndex !== -1) {
            gameState.playerHand.push(gameState.playerDeck.splice(plataIndex, 1)[0]);
        }
    }
    
    // Filtrar deck temporal sin platas para las otras 7 cartas
    const nonSilverCards = gameState.playerDeck.filter(c => c.type !== 'silver');
    for (let i = 0; i < 7 && nonSilverCards.length > 0; i++) {
        const randomIndex = Math.floor(Math.random() * nonSilverCards.length);
        const card = nonSilverCards.splice(randomIndex, 1)[0];
        const deckIndex = gameState.playerDeck.findIndex(c => c.id === card.id);
        if (deckIndex !== -1) {
            gameState.playerHand.push(gameState.playerDeck.splice(deckIndex, 1)[0]);
        }
    }
    
    // IA: exactamente 3 platas + 7 cartas aleatorias NO PLATA
    for (let i = 0; i < 3; i++) {
        const plataIndex = gameState.aiDeck.findIndex(c => c.type === 'silver');
        if (plataIndex !== -1) {
            gameState.aiHand.push(gameState.aiDeck.splice(plataIndex, 1)[0]);
        }
    }
    
    const aiNonSilverCards = gameState.aiDeck.filter(c => c.type !== 'silver');
    for (let i = 0; i < 7 && aiNonSilverCards.length > 0; i++) {
        const randomIndex = Math.floor(Math.random() * aiNonSilverCards.length);
        const card = aiNonSilverCards.splice(randomIndex, 1)[0];
        const deckIndex = gameState.aiDeck.findIndex(c => c.id === card.id);
        if (deckIndex !== -1) {
            gameState.aiHand.push(gameState.aiDeck.splice(deckIndex, 1)[0]);
        }
    }
}

// ===== RENDERIZADO DE CARTAS =====
function renderCard(card, inHand = false, owner = 'player') {
    const cardEl = document.createElement('div');
    cardEl.className = `card ${card.type === 'unit' ? `unit-${card.unitType}` : card.type}`;
    cardEl.dataset.cardId = card.id;
    
    if (card.canAttack && !inHand && card.type === 'unit') {
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
        
        // Mostrar si está en torre o cabaña
        if (card.inStructure) {
            content += `<div class="card-ability" style="background: rgba(255,215,0,0.3);">En ${card.inStructure}</div>`;
        }
    } else if (card.type === 'order') {
        content += `
            <div class="card-stats">
                <div class="stat">
                    <div class="stat-label">Daño</div>
                    <div>${card.damage}</div>
                </div>
            </div>
        `;
    } else if (card.type === 'structure') {
        content += `
            <div class="card-stats">
                <div class="stat">
                    <div class="stat-label">PV</div>
                    <div>${card.currentHp}</div>
                </div>
            </div>
        `;
        
        // Mostrar unidades en la estructura
        if (card.unitsInside && card.unitsInside.length > 0) {
            content += `<div class="card-ability" style="background: rgba(0,255,0,0.2);">${card.unitsInside.length} unidad(es) dentro</div>`;
        }
    }
    
    cardEl.innerHTML = content;
    return cardEl;
}

// ===== SELECCIÓN DE CARTAS =====
function selectCard(card) {
    if (gameState.currentPlayer !== 'player') return;
    
    // Si estamos esperando agregar unidad a estructura
    if (gameState.waitingForStructureUnit && gameState.selectedStructure) {
        if (card.type === 'unit') {
            addUnitToStructure(card, gameState.selectedStructure);
            return;
        } else {
            showStatus('Selecciona una unidad para agregar a la estructura');
            return;
        }
    }
    
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
            placeUnitOnBattlefield(card);
        } else if (card.type === 'silver') {
            gameState.selectedSilver = card;
            gameState.waitingForAbilityTarget = true;
            showStatus('Selecciona una unidad en el campo para activar su habilidad');
        } else if (card.type === 'order') {
            const silverIndex = gameState.playerHand.findIndex(c => c.type === 'silver');
            if (silverIndex === -1) {
                showStatus('Necesitas una carta de Plata para usar esta orden');
                return;
            }
            gameState.waitingForTarget = true;
            gameState.actionType = 'order';
            showStatus('Selecciona un objetivo para la orden');
        } else if (card.type === 'structure') {
            placeStructureOnBattlefield(card);
        } else if (card.type === 'special' && card.name === 'Ladrón') {
            useThiefCard(card);
        }
    } else {
        // Carta en el campo de batalla
        if (card.type === 'unit' && card.canAttack && !card.inCabin) {
            showStatus('Selecciona una unidad enemiga para atacar');
            gameState.waitingForTarget = true;
            gameState.actionType = 'attack';
        } else if (card.type === 'unit' && card.inCabin) {
            showStatus('Las unidades en la cabaña no pueden atacar');
        } else if (card.type === 'unit' && !card.canAttack) {
            showStatus('Esta unidad ya atacó este turno o acaba de ser colocada');
        } else if (card.type === 'structure') {
            // Seleccionar estructura para agregar unidades
            if (card.name === 'Cabaña' && (!card.unitsInside || card.unitsInside.length < 2)) {
                gameState.selectedStructure = card;
                gameState.waitingForStructureUnit = true;
                showStatus('Selecciona una unidad para meter en la cabaña');
            } else if ((card.name === 'Torre de Madera' && (!card.unitsInside || card.unitsInside.length < 2)) ||
                       (card.name === 'Torre de Piedra' && (!card.unitsInside || card.unitsInside.length < 3))) {
                gameState.selectedStructure = card;
                gameState.waitingForStructureUnit = true;
                showStatus('Selecciona una unidad a distancia para poner en la torre');
            }
        }
    }
}

function activateAbility(card) {
    const silverIndex = gameState.playerHand.findIndex(c => c.id === gameState.selectedSilver.id);
    if (silverIndex !== -1) {
        gameState.playerHand.splice(silverIndex, 1);
    }

    card.abilityActive = true;

    if (card.name === 'Milicia') {
        gameState.playerBattlefield.forEach(unit => {
            if (unit.name === 'Milicia') {
                unit.currentHp += 5;
                unit.damage += 5;
            }
        });
        showStatus('¡Habilidad activada! Todas las Milicias obtienen +5 PV/PD');
    } else if (card.name === 'Caballero de Justas' || card.name === 'Milicia Montada') {
        card.chargeActive = true;
        showStatus(`¡${card.name} está cargando! Próximo ataque x2 daño`);
    } else if (card.name === 'Cruzado') {
        gameState.playerBattlefield.forEach(unit => {
            if (unit.type === 'unit') {
                unit.damage += 2;
            }
        });
        showStatus('¡Habilidad activada! Todas las unidades obtienen +2 PD');
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
    card.canAttack = false;
    gameState.playerBattlefield.push(card);
    
    showStatus(`${card.name} colocado en el campo de batalla`);
    
    document.querySelectorAll('.card.selected').forEach(el => el.classList.remove('selected'));
    gameState.selectedCard = null;
    
    endPlayerTurn();
}

function placeStructureOnBattlefield(card) {
    const handIndex = gameState.playerHand.findIndex(c => c.id === card.id);
    if (handIndex === -1) return;

    gameState.playerHand.splice(handIndex, 1);
    card.unitsInside = [];
    card.turnCounter = 0;
    gameState.playerBattlefield.push(card);
    
    showStatus(`${card.name} colocada en el campo de batalla`);
    
    document.querySelectorAll('.card.selected').forEach(el => el.classList.remove('selected'));
    gameState.selectedCard = null;
    
    endPlayerTurn();
}

function addUnitToStructure(unit, structure) {
    // Verificar requisitos
    if (structure.name === 'Torre de Madera' || structure.name === 'Torre de Piedra') {
        if (unit.unitType !== 'ranged') {
            showStatus('Solo unidades a distancia pueden entrar en torres');
            return;
        }
        const maxUnits = structure.name === 'Torre de Madera' ? 2 : 3;
        if (structure.unitsInside && structure.unitsInside.length >= maxUnits) {
            showStatus('La torre está llena');
            return;
        }
    } else if (structure.name === 'Cabaña') {
        if (structure.unitsInside && structure.unitsInside.length >= 2) {
            showStatus('La cabaña está llena');
            return;
        }
    }

    // Buscar si la unidad está en mano o campo
    let unitIndex = gameState.playerHand.findIndex(c => c.id === unit.id);
    let fromHand = true;
    
    if (unitIndex === -1) {
        unitIndex = gameState.playerBattlefield.findIndex(c => c.id === unit.id);
        fromHand = false;
    }

    if (unitIndex === -1) return;

    // Remover de donde esté
    if (fromHand) {
        gameState.playerHand.splice(unitIndex, 1);
    } else {
        gameState.playerBattlefield.splice(unitIndex, 1);
    }

    // Agregar a estructura
    if (!structure.unitsInside) structure.unitsInside = [];
    
    if (structure.name === 'Cabaña') {
        unit.inCabin = true;
        unit.canAttack = false;
    } else {
        unit.inTower = structure.name;
    }
    
    structure.unitsInside.push(unit);
    
    // Volver a agregar al campo (las unidades siguen ahí visualmente)
    gameState.playerBattlefield.push(unit);
    
    showStatus(`${unit.name} agregado a ${structure.name}`);
    
    gameState.selectedStructure = null;
    gameState.waitingForStructureUnit = false;
    document.querySelectorAll('.card.selected').forEach(el => el.classList.remove('selected'));
    
    updateUI();
}

function useThiefCard(card) {
    const handIndex = gameState.playerHand.findIndex(c => c.id === card.id);
    if (handIndex === -1) return;

    // Mostrar opciones
    showModal(
        'Ladrón - Elige una acción',
        '<p>¿Qué deseas hacer?</p>',
        null,
        [
            { text: 'Robar 2 platas del rival', action: () => thiefStealSilver(card) },
            { text: 'Eliminar unidad enemiga', action: () => thiefKillUnit(card) }
        ]
    );
}

function thiefStealSilver(card) {
    const handIndex = gameState.playerHand.findIndex(c => c.id === card.id);
    if (handIndex !== -1) {
        gameState.playerHand.splice(handIndex, 1);
    }

    // Robar 2 platas de la IA
    let stolen = 0;
    for (let i = 0; i < 2; i++) {
        const silverIndex = gameState.aiHand.findIndex(c => c.type === 'silver');
        if (silverIndex !== -1) {
            const silverCard = gameState.aiHand.splice(silverIndex, 1)[0];
            gameState.playerHand.push(silverCard);
            stolen++;
        }
    }

    showStatus(`¡Robaste ${stolen} carta(s) de plata!`);
    closeModal();
    endPlayerTurn();
}

function thiefKillUnit(card) {
    const handIndex = gameState.playerHand.findIndex(c => c.id === card.id);
    if (handIndex !== -1) {
        gameState.playerHand.splice(handIndex, 1);
    }

    gameState.waitingForTarget = true;
    gameState.actionType = 'thiefKill';
    showStatus('Selecciona una unidad enemiga para eliminar');
    closeModal();
}

function selectTarget(target) {
    if (!gameState.waitingForTarget || gameState.currentPlayer !== 'player') return;

    // Si la unidad está en torre, redirigir al ataque a la torre
    if (target.type === 'unit' && target.inTower) {
        const tower = gameState.aiBattlefield.find(c => 
            c.type === 'structure' && 
            c.name === target.inTower &&
            c.unitsInside && 
            c.unitsInside.some(u => u.id === target.id)
        );
        
        if (tower) {
            showStatus('Debes atacar la torre primero');
            // Cambiar target a la torre
            if (gameState.actionType === 'attack') {
                attackStructure(gameState.selectedCard, tower);
            } else if (gameState.actionType === 'order') {
                useOrderOnStructure(gameState.selectedCard, tower);
            }
            
            gameState.waitingForTarget = false;
            gameState.actionType = null;
            gameState.selectedCard = null;
            updateUI();
            return;
        }
    }

    if (gameState.actionType === 'attack') {
        attackUnit(gameState.selectedCard, target);
    } else if (gameState.actionType === 'order') {
        useOrder(gameState.selectedCard, target);
    } else if (gameState.actionType === 'thiefKill') {
        killUnitWithThief(target);
    }

    gameState.waitingForTarget = false;
    gameState.actionType = null;
    gameState.selectedCard = null;
    updateUI();
}

function useOrderOnStructure(orderCard, structure) {
    const silverIndex = gameState.playerHand.findIndex(c => c.type === 'silver');
    if (silverIndex !== -1) {
        gameState.playerHand.splice(silverIndex, 1);
    }

    const handIndex = gameState.playerHand.findIndex(c => c.id === orderCard.id);
    if (handIndex !== -1) {
        gameState.playerHand.splice(handIndex, 1);
    }

    structure.currentHp -= orderCard.damage;
    showStatus(`${orderCard.name} inflige ${orderCard.damage} de daño a ${structure.name}`);

    const targetEl = document.querySelector(`[data-card-id="${structure.id}"]`);
    if (targetEl) {
        targetEl.classList.add('attacking');
        setTimeout(() => targetEl.classList.remove('attacking'), 500);
    }

    if (structure.currentHp <= 0) {
        destroyStructure(structure, 'ai');
    }

    endPlayerTurn();
}

function killUnitWithThief(target) {
    if (target.type !== 'unit') {
        showStatus('Solo puedes eliminar unidades');
        return;
    }

    const index = gameState.aiBattlefield.findIndex(c => c.id === target.id);
    if (index !== -1) {
        gameState.aiBattlefield.splice(index, 1);
        showStatus(`¡${target.name} eliminado por el Ladrón!`);
    }

    endPlayerTurn();
}

// ===== SISTEMA DE COMBATE =====
function attackUnit(attacker, defender) {
    if (!attacker || !defender) return;

    // Si el defensor está en una torre, atacar la torre en su lugar automáticamente
    if (defender.inTower && defender.type === 'unit') {
        const tower = gameState.aiBattlefield.find(c => 
            c.type === 'structure' && 
            c.name === defender.inTower && 
            c.unitsInside && 
            c.unitsInside.some(u => u.id === defender.id)
        );
        
        if (tower) {
            showStatus('La unidad está protegida por la torre - atacando torre');
            attackStructure(attacker, tower);
            return;
        }
    }

    let damage = attacker.damage;
    
    if (attacker.chargeActive) {
        damage *= 2;
        attacker.chargeActive = false;
        showStatus(`¡Carga! ${attacker.name} hace ${damage} de daño a ${defender.name}`);
    } else {
        const advantage = checkAdvantage(attacker.unitType, defender.unitType);
        if (advantage) {
            damage *= 2;
            showStatus(`¡Ventaja! ${attacker.name} hace ${damage} de daño a ${defender.name}`);
        } else {
            showStatus(`${attacker.name} ataca a ${defender.name} por ${damage} de daño`);
        }
    }

    defender.currentHp -= damage;
    attacker.canAttack = false;

    const targetEl = document.querySelector(`[data-card-id="${defender.id}"]`);
    if (targetEl) {
        targetEl.classList.add('attacking');
        setTimeout(() => targetEl.classList.remove('attacking'), 500);
    }

    if (defender.currentHp <= 0) {
        const index = gameState.aiBattlefield.findIndex(c => c.id === defender.id);
        if (index !== -1) {
            gameState.aiBattlefield.splice(index, 1);
            showStatus(`${defender.name} ha sido derrotado!`);
        }
    }

    endPlayerTurn();
}

function attackStructure(attacker, structure) {
    let damage = attacker.damage;
    
    if (attacker.chargeActive) {
        damage *= 2;
        attacker.chargeActive = false;
    }

    structure.currentHp -= damage;
    attacker.canAttack = false;

    showStatus(`${attacker.name} ataca a ${structure.name} por ${damage} de daño`);

    const targetEl = document.querySelector(`[data-card-id="${structure.id}"]`);
    if (targetEl) {
        targetEl.classList.add('attacking');
        setTimeout(() => targetEl.classList.remove('attacking'), 500);
    }

    if (structure.currentHp <= 0) {
        destroyStructure(structure, 'ai');
    }

    endPlayerTurn();
}

function destroyStructure(structure, owner) {
    const battlefield = owner === 'player' ? gameState.playerBattlefield : gameState.aiBattlefield;
    const structureIndex = battlefield.findIndex(c => c.id === structure.id);
    
    if (structureIndex !== -1) {
        // Si es torre, matar las unidades dentro
        if (structure.name === 'Torre de Madera' || structure.name === 'Torre de Piedra') {
            if (structure.unitsInside && structure.unitsInside.length > 0) {
                structure.unitsInside.forEach(unit => {
                    const unitIndex = battlefield.findIndex(c => c.id === unit.id);
                    if (unitIndex !== -1) {
                        battlefield.splice(unitIndex, 1);
                    }
                });
                showStatus(`${structure.name} destruida! Las unidades dentro mueren`);
            }
        } else if (structure.name === 'Cabaña') {
            // Si es cabaña, liberar las unidades
            if (structure.unitsInside && structure.unitsInside.length > 0) {
                structure.unitsInside.forEach(unit => {
                    unit.inCabin = false;
                    unit.canAttack = false;
                });
                showStatus(`${structure.name} destruida! Las unidades quedan libres`);
            }
        }
        
        battlefield.splice(structureIndex, 1);
    }
}

function useOrder(orderCard, target) {
    const silverIndex = gameState.playerHand.findIndex(c => c.type === 'silver');
    if (silverIndex !== -1) {
        gameState.playerHand.splice(silverIndex, 1);
    }

    const handIndex = gameState.playerHand.findIndex(c => c.id === orderCard.id);
    if (handIndex !== -1) {
        gameState.playerHand.splice(handIndex, 1);
    }

    target.currentHp -= orderCard.damage;
    showStatus(`${orderCard.name} inflige ${orderCard.damage} de daño a ${target.name}`);

    const targetEl = document.querySelector(`[data-card-id="${target.id}"]`);
    if (targetEl) {
        targetEl.classList.add('attacking');
        setTimeout(() => targetEl.classList.remove('attacking'), 500);
    }

    if (target.currentHp <= 0) {
        const index = gameState.aiBattlefield.findIndex(c => c.id === target.id);
        if (index !== -1) {
            gameState.aiBattlefield.splice(index, 1);
            showStatus(`${target.name} ha sido destruido!`);
        }
    }

    endPlayerTurn();
}

function checkAdvantage(attackerType, defenderType) {
    const advantages = {
        'cac': 'cavalry',
        'ranged': 'cac',
        'cavalry': 'ranged'
    };
    return advantages[attackerType] === defenderType;
}

// ===== GESTIÓN DE TURNOS =====
function endPlayerTurn() {
    if (gameState.currentPlayer !== 'player') return;

    gameState.playerTurns--;
    gameState.turnCounter++;
    document.querySelectorAll('.card.selected').forEach(el => el.classList.remove('selected'));
    gameState.selectedCard = null;
    gameState.selectedSilver = null;
    gameState.selectedStructure = null;
    gameState.waitingForTarget = false;
    gameState.waitingForAbilityTarget = false;
    gameState.waitingForStructureUnit = false;
    gameState.actionType = null;

    // Aplicar buff de cabañas cada 4 turnos totales
    if (gameState.turnCounter % 4 === 0) {
        applyCabinBuffs('player');
    }

    gameState.playerBattlefield.forEach(card => {
        if (card.type === 'unit' && !card.inCabin) card.canAttack = true;
    });

    if (gameState.playerTurns <= 0 && gameState.aiTurns <= 0) {
        endRound();
        return;
    }

    gameState.currentPlayer = 'ai';
    updateUI();
    
    // IA tarda entre 1 y 6 segundos aleatorio
    const aiDelay = Math.random() * 5000 + 1000;
    setTimeout(aiTurn, aiDelay);
}

function applyCabinBuffs(owner) {
    const battlefield = owner === 'player' ? gameState.playerBattlefield : gameState.aiBattlefield;
    
    battlefield.forEach(card => {
        if (card.type === 'structure' && card.name === 'Cabaña' && card.unitsInside) {
            card.unitsInside.forEach(unit => {
                unit.currentHp += 5;
                unit.damage += 5;
            });
            if (card.unitsInside.length > 0) {
                showStatus(`Cabaña ${owner === 'player' ? 'tuya' : 'enemiga'}: unidades reciben +5 PV/PD`);
            }
        }
    });
}

function aiTurn() {
    if (gameState.currentPlayer !== 'ai') return;

    gameState.aiTurns--;
    gameState.turnCounter++;

    // Aplicar buff de cabañas cada 4 turnos totales
    if (gameState.turnCounter % 4 === 0) {
        applyCabinBuffs('ai');
    }

    const unitsInHand = gameState.aiHand.filter(c => c.type === 'unit');
    const ordersInHand = gameState.aiHand.filter(c => c.type === 'order');
    const silversInHand = gameState.aiHand.filter(c => c.type === 'silver');
    const unitsWithAbilities = gameState.aiBattlefield.filter(c => 
        c.type === 'unit' && c.hasAbility && !c.abilityActive
    );

    // Decidir acción de la IA
    const decision = Math.random();

    // 30% usar habilidad si tiene plata y unidades con habilidad
    if (decision < 0.3 && silversInHand.length > 0 && unitsWithAbilities.length > 0) {
        const silverIndex = gameState.aiHand.findIndex(c => c.type === 'silver');
        gameState.aiHand.splice(silverIndex, 1);
        
        const unit = unitsWithAbilities[0];
        unit.abilityActive = true;

        if (unit.name === 'Milicia Montada' || unit.name === 'Caballero de Justas') {
            unit.chargeActive = true;
            showStatus(`IA activó habilidad de ${unit.name}`);
        } else if (unit.name === 'Cruzado') {
            gameState.aiBattlefield.forEach(u => {
                if (u.type === 'unit') u.damage += 2;
            });
            showStatus('IA activó habilidad de Cruzado');
        }
    }
    // 20% usar orden si tiene plata
    else if (decision < 0.5 && ordersInHand.length > 0 && silversInHand.length > 0 && gameState.playerBattlefield.length > 0) {
        const silverIndex = gameState.aiHand.findIndex(c => c.type === 'silver');
        gameState.aiHand.splice(silverIndex, 1);
        
        const order = ordersInHand[0];
        const orderIndex = gameState.aiHand.findIndex(c => c.id === order.id);
        gameState.aiHand.splice(orderIndex, 1);
        
        const target = gameState.playerBattlefield[Math.floor(Math.random() * gameState.playerBattlefield.length)];
        target.currentHp -= order.damage;
        
        showStatus(`IA usó ${order.name} contra ${target.name}`);
        
        if (target.currentHp <= 0) {
            const index = gameState.playerBattlefield.findIndex(c => c.id === target.id);
            if (index !== -1) {
                gameState.playerBattlefield.splice(index, 1);
            }
        }
    }
    // 50% colocar unidad si tiene
    else if (unitsInHand.length > 0 && Math.random() > 0.3) {
        const unit = unitsInHand[Math.floor(Math.random() * unitsInHand.length)];
        const handIndex = gameState.aiHand.findIndex(c => c.id === unit.id);
        
        if (handIndex !== -1) {
            gameState.aiHand.splice(handIndex, 1);
            unit.canAttack = false;
            gameState.aiBattlefield.push(unit);
            showStatus(`IA colocó ${unit.name} en el campo`);
        }
    }
    // Atacar
    else {
        const attackers = gameState.aiBattlefield.filter(c => c.type === 'unit' && c.canAttack && !c.inCabin);
        
        if (attackers.length > 0 && gameState.playerBattlefield.length > 0) {
            const attacker = attackers[Math.floor(Math.random() * attackers.length)];
            const target = gameState.playerBattlefield[Math.floor(Math.random() * gameState.playerBattlefield.length)];
            
            // Si el target está en torre, atacar la torre
            if (target.inTower) {
                const tower = gameState.playerBattlefield.find(c => 
                    c.type === 'structure' && 
                    c.name === target.inTower &&
                    c.unitsInside && 
                    c.unitsInside.some(u => u.id === target.id)
                );
                
                if (tower) {
                    let damage = attacker.damage;
                    if (attacker.chargeActive) {
                        damage *= 2;
                        attacker.chargeActive = false;
                    }
                    
                    tower.currentHp -= damage;
                    attacker.canAttack = false;
                    
                    showStatus(`IA: ${attacker.name} ataca ${tower.name} (${damage} daño)`);
                    
                    if (tower.currentHp <= 0) {
                        destroyStructure(tower, 'player');
                    }
                } else {
                    aiAttackNormal(attacker, target);
                }
            } else {
                aiAttackNormal(attacker, target);
            }
        }
    }

    if (gameState.playerTurns <= 0 && gameState.aiTurns <= 0) {
        setTimeout(endRound, 1000);
        return;
    }

    gameState.aiBattlefield.forEach(card => {
        if (card.type === 'unit' && !card.inCabin) card.canAttack = true;
    });

    gameState.currentPlayer = 'player';
    updateUI();
}

function aiAttackNormal(attacker, target) {
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
    gameState.turnCounter = 0;
    
    gameState.playerBattlefield = [];
    gameState.aiBattlefield = [];

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
    document.getElementById('round-number').textContent = gameState.round;
    document.getElementById('player-turns').textContent = gameState.playerTurns;
    document.getElementById('ai-turns').textContent = gameState.aiTurns;
    document.getElementById('player-wins').textContent = gameState.playerWins;
    document.getElementById('ai-wins').textContent = gameState.aiWins;
    
    const playerArmy = calculateArmyPoints('player');
    const aiArmy = calculateArmyPoints('ai');
    document.getElementById('player-army').textContent = playerArmy;
    document.getElementById('ai-army').textContent = aiArmy;
    
    document.getElementById('player-deck-count').textContent = gameState.playerDeck.length + gameState.playerHand.length;
    document.getElementById('ai-deck-count').textContent = gameState.aiDeck.length + gameState.aiHand.length;
    
    const turnIndicator = document.getElementById('turn-indicator');
    turnIndicator.textContent = gameState.currentPlayer === 'player' ? 'TURNO JUGADOR' : 'TURNO IA';
    turnIndicator.style.background = gameState.currentPlayer === 'player' 
        ? 'linear-gradient(135deg, #1a4d2e 0%, #2d6a4f 100%)'
        : 'linear-gradient(135deg, #8b0000 0%, #dc143c 100%)';
    
    // Resplandor verde en zona de batalla del jugador activo
    const playerBattlefieldEl = document.getElementById('player-battlefield');
    const aiBattlefieldEl = document.getElementById('ai-battlefield');
    
    if (gameState.currentPlayer === 'player') {
        playerBattlefieldEl.style.boxShadow = '0 0 30px 8px rgba(0, 255, 0, 0.7)';
        aiBattlefieldEl.style.boxShadow = 'none';
    } else {
        aiBattlefieldEl.style.boxShadow = '0 0 30px 8px rgba(255, 0, 0, 0.7)';
        playerBattlefieldEl.style.boxShadow = 'none';
    }
    
    const aiHandContainer = document.getElementById('ai-hand');
    aiHandContainer.innerHTML = '';
    gameState.aiHand.forEach((card, index) => {
        const cardBack = document.createElement('div');
        cardBack.className = 'card-back';
        cardBack.innerHTML = '🃏';
        cardBack.title = `Carta ${index + 1} de la IA`;
        aiHandContainer.appendChild(cardBack);
    });
    
    const handContainer = document.getElementById('player-hand');
    handContainer.innerHTML = '';
    gameState.playerHand.forEach(card => {
        handContainer.appendChild(renderCard(card, true, 'player'));
    });
    
    const playerBattlefield = document.getElementById('player-battlefield');
    playerBattlefield.innerHTML = '';
    renderBattlefieldWithStructures(gameState.playerBattlefield, playerBattlefield, 'player');
    
    const aiBattlefield = document.getElementById('ai-battlefield');
    aiBattlefield.innerHTML = '';
    renderBattlefieldWithStructures(gameState.aiBattlefield, aiBattlefield, 'ai');
}

function renderBattlefieldWithStructures(battlefield, container, owner) {
    // Primero identificar estructuras con unidades
    const structures = battlefield.filter(c => c.type === 'structure');
    const unitsInStructures = new Set();
    
    structures.forEach(structure => {
        if (structure.unitsInside && structure.unitsInside.length > 0) {
            structure.unitsInside.forEach(unit => unitsInStructures.add(unit.id));
        }
    });
    
    // Renderizar cartas normales (que no están en estructuras)
    battlefield.forEach(card => {
        if (card.type !== 'structure' && !unitsInStructures.has(card.id)) {
            container.appendChild(renderCard(card, false, owner));
        }
    });
    
    // Renderizar estructuras con sus unidades detrás
    structures.forEach(structure => {
        const structureGroup = document.createElement('div');
        structureGroup.style.position = 'relative';
        structureGroup.style.display = 'inline-block';
        structureGroup.style.marginRight = '10px';
        
        // Renderizar unidades detrás
        if (structure.unitsInside && structure.unitsInside.length > 0) {
            structure.unitsInside.forEach((unit, index) => {
                const unitCard = renderCard(unit, false, owner);
                unitCard.style.position = 'absolute';
                unitCard.style.left = `${-15 - (index * 8)}px`;
                unitCard.style.top = `${5 + (index * 8)}px`;
                unitCard.style.zIndex = index;
                unitCard.style.opacity = '0.8';
                
                // Las unidades en torres NO pueden ser atacadas directamente
                if (structure.name === 'Torre de Madera' || structure.name === 'Torre de Piedra') {
                    unitCard.style.pointerEvents = 'none';
                    unitCard.style.filter = 'brightness(0.7)';
                }
                
                structureGroup.appendChild(unitCard);
            });
        }
        
        // Renderizar estructura encima
        const structureCard = renderCard(structure, false, owner);
        structureCard.style.position = 'relative';
        structureCard.style.zIndex = 10;
        structureGroup.appendChild(structureCard);
        
        container.appendChild(structureGroup);
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

function showModal(title, message, callback, buttons = null) {
    const overlay = document.getElementById('message-overlay');
    const content = document.getElementById('message-content');
    
    let buttonsHtml = '';
    if (buttons && buttons.length > 0) {
        buttonsHtml = '<div class="modal-actions">';
        buttons.forEach((btn, index) => {
            buttonsHtml += `<button class="btn btn-primary" onclick="window.modalButtons[${index}]()">${btn.text}</button>`;
        });
        buttonsHtml += '</div>';
        window.modalButtons = buttons.map(btn => btn.action);
    } else {
        buttonsHtml = '<div class="modal-actions"><button class="btn btn-primary" onclick="closeModal()">Continuar</button></div>';
    }
    
    content.innerHTML = `
        <h2>${title}</h2>
        <p>${message}</p>
        ${buttonsHtml}
    `;
    
    overlay.classList.add('show');
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
    console.log('DOM cargado, iniciando juego...');
    initGame();
    
    document.getElementById('end-turn-btn').addEventListener('click', () => {
        if (gameState.currentPlayer === 'player') {
            endPlayerTurn();
        }
    });
});