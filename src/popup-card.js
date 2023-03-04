import { Popup } from './popup.js';

export class PopupCard extends Popup {
    constructor(selectorTemplate, selectorContent, title, classes) {
        super(selectorTemplate, selectorContent, title, classes);
    }

    open(data) {
        this._popupElement.dataset.id = data.id;
        const popupCardImageEl = this._popupElement.querySelector('.popup-card_image img');
        const popupCardTitleEl = this._popupElement.querySelector('.popup-card_title');
        const popupCardYearEl = this._popupElement.querySelector('.popup-card_year');
        const popupCardRatingEl = this._popupElement.querySelector(
            '.popup-card_rating .rating__value'
        );
        const popupCardDescrEl = this._popupElement.querySelector('.popup-card_description');

        if (data.image) {
            popupCardImageEl.src = data.image;
        }
        popupCardImageEl.alt = data.name;

        popupCardTitleEl.textContent = data.name;
        popupCardYearEl.textContent = `Год: ${data.age}`;
        popupCardDescrEl.textContent = data.description;
        popupCardRatingEl.textContent = `${data.rate} / 10`;

        super.open();
    }

    setEventListener() {
        const btnLikeCat = this._popupElement.querySelector('.popup-card__favorite');
        const btnDeleteCat = this._popupElement.querySelector('.popup-card__delete');
        const btnEditCat = this._popupElement.querySelector('.popup-card__edit');

        setTimeout(() => {
            const cardId = this._popupElement.dataset.id;
            const cardEl = document.querySelector(`.card-${cardId}`);

            btnDeleteCat.addEventListener('click', () => {
                setTimeout(() => {
                    this.close();
                }, 100);
                setTimeout(() => {
                    cardEl.querySelector('.card__delete-icon').click();
                }, 100);
            });
            btnEditCat.addEventListener('click', () => {
                cardEl.querySelector('.card__edit-icon').click();
                this.close();
            });
            btnLikeCat.addEventListener('click', (e) => {
                cardEl.querySelector('.card__favorite-icon').click();
                if (e.target.closest('.popup-card').classList.contains('card-favorite')) {
                    e.target.closest('.popup-card').classList.remove('card-favorite');
                } else {
                    e.target.closest('.popup-card').classList.add('card-favorite');
                }
            });
        }, 100);

        super.setEventListener();
    }
}
