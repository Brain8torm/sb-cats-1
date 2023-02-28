class Card {
    #data;
    #selectorTemplate;
    #element;
    #handleCardClick;
    #handleCardMouseEnter;
    #handleCardMouseLeave;

    #getTemplate() {
        const template = document
            .querySelector(this.#selectorTemplate)
            .content.querySelector('.card');
        return template;
    }

    constructor(
        data,
        selectorTemplate,
        handleCardMouseEnter,
        handleCardMouseLeave,
        handleCardClick
    ) {
        this.#data = data;
        this.#selectorTemplate = selectorTemplate;
        this.#handleCardClick = handleCardClick;
        this.#handleCardMouseEnter = handleCardMouseEnter;
        this.#handleCardMouseLeave = handleCardMouseLeave;
    }

    getElement() {
        this.#element = this.#getTemplate().cloneNode(true);

        const cardClass = [`card-${this.#data.id}`];

        if (this.#data.favorite) cardClass.push('card-favorite');
        this.#element.classList.add(...cardClass);

        const cardTitleElement = this.#element.querySelector('.card__title');
        const cardImageElement = this.#element.querySelector('.card__image');
        const cardHoverElement = this.#element.querySelector('.card__hover');

        cardTitleElement.textContent = this.#data.name;
        cardImageElement.src = this.#data.image;

        cardHoverElement.addEventListener('click', () => {
            this.#handleCardClick(this.#data);
        });

        this.#element.addEventListener('mouseenter', (e) => {
            this.#handleCardMouseEnter(e.target.querySelector('.card__hover'));
        });

        this.#element.addEventListener('mouseleave', (e) => {
            this.#handleCardMouseLeave(e.target.querySelector('.card__hover'));
        });

        return this.#element;
    }
}
