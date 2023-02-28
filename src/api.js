const config = {
    baseUrl: 'https://cats.petiteweb.dev/api/single/Brain8torm',
    headers: {
        'content-type': 'application/json',
    },
};

class Api {
    #baseUrl;
    #headers;

    constructor(config) {
        (this.#baseUrl = config.baseUrl), (this.#headers = config.headers);
    }
}

export const api = new Api(config);
