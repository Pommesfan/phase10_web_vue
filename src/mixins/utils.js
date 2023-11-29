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

export var selectedPlayerCard = null
export var switchMode = null
export var discardedCardIndices = []

export function setSelectedPlayerCard(v) {
    selectedPlayerCard = v
}

export function setSwitchMode(v) {
    switchMode = v
}

export function setDiscardedCardIndices(v) {
    discardedCardIndices = v
}
