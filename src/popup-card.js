import { Popup } from './popup.js';

export class PopupCard extends Popup {

  constructor(selectorTemplate, selectorContent, title, classes) {
    super(selectorTemplate, selectorContent, title, classes);
  }

  open(data) {
    const popupCardImageEl = this._popupElement.querySelector('.popup-card_image img');
    const popupCardTitleEl = this._popupElement.querySelector('.popup-card_title');
    const popupCardYearEl = this._popupElement.querySelector('.popup-card_year');
    const popupCardRatingEl = this._popupElement.querySelector('.popup-card_rating .rating__value');
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
}
