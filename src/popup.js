class Popup {
    #selectorTemplate;

    #getTemplate() {
        const template = document
            .querySelector(this.#selectorTemplate)
            .content.querySelector('.popup');
        return template;
    }

    #handleEscUp = (evt) => {
        if (evt.key === 'Escape' || evt.key === 'Esc') {
            this.close();
        }
    };

    constructor(selectorTemplate, classes) {
        this.#selectorTemplate = selectorTemplate;
        this._classes = classes.split(',');
    }

    getElement() {
        this._popupElement = this.#getTemplate().cloneNode(true);
        this._popupElement.classList.add(...this._classes);

        return this._popupElement;
    }

    open() {
        this._popupElement.classList.add('popup-active');
        if (this._popupElement.classList.contains('popup-add')) {
            this._popupElement.querySelector('[name="id"]').value =
                Math.floor(Math.random() * 1000) + 1;
            this._popupElement.querySelector('[name="age"]').value = new Date().getFullYear();
            this._popupElement.querySelector('[name="rate"]').value =
                Math.floor(Math.random() * 10) + 1;
            document.addEventListener('keyup', this.#handleEscUp);
            this._popupElement.querySelector('#popup-form-add input:first-child').focus();
        }
    }

    close() {
        this._popupElement.classList.remove('popup-active');
        document.removeEventListener('keyup', this.#handleEscUp);

        this._popupElement.remove();
    }

    setEventListener() {
        this._popupElement.addEventListener('mousedown', (evt) => {
            if (evt.target.classList.contains('popup') || evt.target.closest('.popup__close')) {
                this.close();
            }
        });
    }
}
