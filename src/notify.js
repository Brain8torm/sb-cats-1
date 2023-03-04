export class Notify {
    #selectorTemplate;

    #getTemplate() {
        const template = document
            .querySelector(this.#selectorTemplate)
            .content.querySelector('.notify');
        return template;
    }

    #handleEscUp = (evt) => {
        if (evt.key === 'Escape' || evt.key === 'Esc') {
            this.close();
        }
    };

    constructor(selectorTemplate, content, classes) {
        this.#selectorTemplate = selectorTemplate;
        this._content = content;
        this._classes = classes.split(',');
    }

    getElement() {
        this._notifyElement = this.#getTemplate().cloneNode(true);
        this._notifyElement.querySelector('.notify-message').classList.add(...this._classes);

        const notifyContentEl = this._notifyElement.querySelector('.notify__body');

        notifyContentEl.innerHTML = this._content;

        return this._notifyElement;
    }

    open() {
        this._notifyElement.classList.add('notify-active');

        document.addEventListener('keyup', this.#handleEscUp);

        setTimeout(() => {
            this.close();
        }, 2000);
    }

    close() {
        this._notifyElement.classList.remove('notify-active');
        document.removeEventListener('keyup', this.#handleEscUp);

        const notifyClasses = this._notifyElement.classList;

        this._notifyElement.remove();
    }

    setEventListener() {
        this._notifyElement.addEventListener('mousedown', (evt) => {
            if (evt.target.classList.contains('notify') || evt.target.closest('.notify__close')) {
                this.close();
            }
        });
    }
}
