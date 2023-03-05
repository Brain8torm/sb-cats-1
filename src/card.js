export class Card {
    #data;
    #selectorTemplate;
    #element;
    #handleCardClick;
    #handleCardMouseEnter;
    #handleCardMouseLeave;
    #handleCardEdit;
    #handleCardDelete;
    #handleCardLike;

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
        handleCardDelete,
        handleCardLike
    ) {
        this.#data = data;
        this.#selectorTemplate = selectorTemplate;
        this.#handleCardClick = handleCardClick;
        this.#handleCardMouseEnter = handleCardMouseEnter;
        this.#handleCardMouseLeave = handleCardMouseLeave;
        this.#handleCardEdit = handleCardEdit;
        this.#handleCardDelete = handleCardDelete;
        this.#handleCardLike = handleCardLike;
    }

    setData(data) {
        this.#data = { ...this.#data, ...data };
        this.updateView();
    }

    getData() {
        return this.#data;
    }

    updateView() {
        const cardClass = [`card-${this.#data.id}`];
        if (this.#data.favorite) cardClass.push('card-favorite');
        this.#element.classList.add(...cardClass);
        this.#element.dataset.id = this.#data.id;
        this.#element.dataset.rate = this.#data.rate;
        this.cardTitleElement.textContent = this.#data.name;
        if (this.#data.image) {
            this.cardImageElement.src = this.#data.image;
        }
    }

    getElement() {
        this.#element = this.#getTemplate().cloneNode(true);

        this.cardTitleElement = this.#element.querySelector('.card__title');
        this.cardImageElement = this.#element.querySelector('.card__image');
        const cardHoverElement = this.#element.querySelector('.card__hover');

        this.updateView();

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
            this.#handleCardEdit(this);
        });

        this.#element.querySelector('.card__delete').addEventListener('click', (e) => {
            this.#handleCardDelete(this);
        });

        this.#element.querySelector('.card__favorite').addEventListener('click', (e) => {
            this.#handleCardLike(this);
        });

        return this.#element;
    }
}
