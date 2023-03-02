export class Popup {
    #selectorTemplate;
    #selectorContent;

    #getTemplate() {
        const template = document
            .querySelector(this.#selectorTemplate)
            .content.querySelector('.popup');
        return template;
    }

    #getContent() {
        return document.querySelector(this.#selectorContent)
            .content /*.querySelector('.content-block')*/;
    }

    #handleEscUp = (evt) => {
        if (evt.key === 'Escape' || evt.key === 'Esc') {
            this.close();
        }
    };

    constructor(selectorTemplate, selectorContent, title, classes) {
        this.#selectorTemplate = selectorTemplate;
        this.#selectorContent = selectorContent;
        this._title = title;
        this._classes = classes.split(',');
    }

    getElement() {
        this._popupElement = this.#getTemplate().cloneNode(true);
        this._popupElement.classList.add(...this._classes);

        const popupTitleEl = this._popupElement.querySelector('.popup__title');

        if (popupTitleEl) {
            popupTitleEl.textContent = this._title ? this._title : '';
        }

        const popupContentEl = this._popupElement.querySelector('.popup__content');

        popupContentEl.append(this.getContent());

        return this._popupElement;
    }

    getContent() {
        this._popupContent = this.#getContent().cloneNode(true);

        return this._popupContent;
    }

    open() {
        this._popupElement.classList.add('popup-active');

        /*if (this._popupElement.classList.contains('popup-add')) {
            this._popupElement.querySelector('[name="id"]').value =
                Math.floor(Math.random() * 1000) + 1;
            this._popupElement.querySelector('[name="age"]').value = new Date().getFullYear();
            this._popupElement.querySelector('[name="rate"]').value =
                Math.floor(Math.random() * 10) + 1;
            document.addEventListener('keyup', this.#handleEscUp);
            this._popupElement.querySelector('#popup-form-add input:first-child').focus();
        }*/
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
