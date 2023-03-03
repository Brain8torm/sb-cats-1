export class Card {
    #data;
    #selectorTemplate;
    #element;
    #handleCardClick;
    #handleCardMouseEnter;
    #handleCardMouseLeave;
    #handleCardEdit;
    #handleCardDelete;

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
        handleCardClick,
        handleCardEdit,
        handleCardDelete
    ) {
        this.#data = data;
        this.#selectorTemplate = selectorTemplate;
        this.#handleCardClick = handleCardClick;
        this.#handleCardMouseEnter = handleCardMouseEnter;
        this.#handleCardMouseLeave = handleCardMouseLeave;
        this.#handleCardEdit = handleCardEdit;
        this.#handleCardDelete = handleCardDelete;
    }

    getElement() {
        this.#element = this.#getTemplate().cloneNode(true);

        const cardClass = [`card-${this.#data.id}`];

        if (this.#data.favorite) cardClass.push('card-favorite');
        this.#element.classList.add(...cardClass);
        this.#element.dataset.id = this.#data.id;

        const cardTitleElement = this.#element.querySelector('.card__title');
        const cardImageElement = this.#element.querySelector('.card__image');
        const cardHoverElement = this.#element.querySelector('.card__hover');

        cardTitleElement.textContent = this.#data.name;
        if (this.#data.image) {
            cardImageElement.src = this.#data.image;
        }

        cardHoverElement.addEventListener('click', () => {
            this.#handleCardClick(this.#data);
        });

        this.#element.addEventListener('mouseenter', (e) => {
            this.#handleCardMouseEnter(e.target.querySelector('.card__hover'));
        });

        this.#element.addEventListener('mouseleave', (e) => {
            this.#handleCardMouseLeave(e.target.querySelector('.card__hover'));
        });

        this.#element.querySelector('.card__edit').addEventListener('click', (e) => {
            this.#handleCardEdit(this.#element);
        })

        this.#element.querySelector('.card__delete').addEventListener('click', (e) => {
            this.#handleCardDelete(this.#element);
        });

        return this.#element;
    }
}
