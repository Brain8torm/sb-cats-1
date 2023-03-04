export class Popup {
    #selectorTemplate;

    #getTemplate() {
        const template = document
            .querySelector(this.#selectorTemplate)
            .content.querySelector('.popup');
        return template;
    }

    #getContent() {
        return document.querySelector(this._selectorContent).content;
    }

    #handleEscUp = (evt) => {
        if (evt.key === 'Escape' || evt.key === 'Esc') {
            this.close();
        }
    };

    constructor(selectorTemplate, selectorContent, title, classes) {
        this.#selectorTemplate = selectorTemplate;
        this._selectorContent = selectorContent;
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

    open(data) {
        this._popupElement.classList.add('popup-active');

        const inputId = this._popupElement.querySelector('[name="id"]');
        const inputName = this._popupElement.querySelector('[name="name"]');
        const inputAge = this._popupElement.querySelector('[name="age"]');
        const inputRate = this._popupElement.querySelector('[name="rate"]');
        const inputFavorite = this._popupElement.querySelector('[name="favorite"]');
        const inputImage = this._popupElement.querySelector('[name="image"]');
        const inputDescr = this._popupElement.querySelector('[name="description"]');
        const popupClasses = this._popupElement.classList;

        if (popupClasses.contains('popup-add') || popupClasses.contains('popup-edit')) {
            if (popupClasses.contains('popup-edit')) {
                inputId.disabled = true;
                this._popupElement.querySelector('.button').textContent = 'Изменить';
            }

            inputId.value = data.id ? data.id : '';
            inputAge.value = data.age ? data.age : '';
            inputRate.value = data.rate ? data.rate : '';
            inputName.value = data.name ? data.name : '';
            inputImage.value = data.image ? data.image : '';
            inputDescr.value = data.description ? data.description : '';
            if (data.favorite) inputFavorite.checked = true;

            this._popupElement.querySelector('#popup-form-add input:first-child').focus();
        }

        document.addEventListener('keyup', this.#handleEscUp);
    }

    close() {
        this._popupElement.classList.remove('popup-active');
        document.removeEventListener('keyup', this.#handleEscUp);

        const popupClasses = this._popupElement.classList;

        if (popupClasses.contains('popup-add') || popupClasses.contains('popup-edit')) {
            localStorage.removeItem('formData');
        }

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
