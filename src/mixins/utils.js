import router from "@/router";

export function get_player_name(idx) {
    return sessionStorage.getItem("player_" + idx)
}

export function back_to_home_or_game() {
    if(sessionStorage.getItem('thisPlayer') == null) {
        router.push({path : "/"})
    } else {
        router.push({path : "/game"})
    }
}
export function post_data(route, json, update_function) {
    fetch("http://" + location.hostname + ":9000" + route, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': location.hostname + ':8080',
        },
        body: JSON.stringify(json)
    }).then(response => response.json().then(data => update_function(data)))
}

export function inverted_idx_list(n, indices) {
    let res = []
    for(let i = 0; i < n; i++) {
        if(!indices.includes(i)) {
            res.push(i)
        }
    }
    return res
}

export function map_cards(playerCardIndices, cards) {
    let res = []
    for(let i = 0; i < playerCardIndices.length; i++) {
        res.push(cards[playerCardIndices[i]])
    }
    return res
}

export function sort_cards(stash) {
    stash.sort(function(a,b) {return a.value > b.value})
    for(let i = 0; i < stash.length - 1; i++) {
        let j = i+1
        if(stash[i].value + 1 != (stash[i+1].value)) {
            let a = stash.slice(0,j)
            let b = stash.slice(j,7)
            return b.concat(a)
        }
    }
    return stash
}

export class InjectCardData {
    constructor(playerCard, playerTo, groupTo, positionTo) {
        this.playerCard = playerCard
        this.playerTo = playerTo
        this.groupTo = groupTo
        this.positionTo = positionTo
    }
}

export const INJECT_TO_FRONT = 1
export const INJECT_AFTER = 2

export var selectedPlayerCard = null
export var switchMode = null
export var discardedCardIndices = []
export var injectTo = null

export function setSelectedPlayerCard(v) {
    selectedPlayerCard = v
}

export function setSwitchMode(v) {
    switchMode = v
}

export function setDiscardedCardIndices(v) {
    discardedCardIndices = v
}

export function setInjectTo(v) {
    injectTo = v
}