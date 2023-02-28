const config = {
    baseUrl: 'https://cats.petiteweb.dev/api/single/Brain8torm',
    headers: {
        'content-type': 'application/json',
    },
};

class Api {
    #baseUrl;
    #headers;

    #getResponse(res) {
        return res.ok ? res.json() : Promise.reject('Ошибка на стороне сервера');
    }

    constructor(config) {
        (this.#baseUrl = config.baseUrl), (this.#headers = config.headers);
    }

    getAllCats() {
        return fetch(`${this.#baseUrl}/show`).then(this.#getResponse);
    }

    getCatById(idCat) {
        return fetch(`${this.#baseUrl}/show/${idCat}`).then(this.#getResponse);
    }

    addNewCat(data) {
        return fetch(`${this.#baseUrl}/add`, {
            method: 'POST',
            headers: this.#headers,
            body: JSON.stringify(data),
        }).then(this.#getResponse);
    }
}

export const api = new Api(config);
