import { api } from './api.js';
import { Card } from './card.js';
import { PopupCard } from './popup-card.js';
import { Popup } from './popup.js';
import Cookies from './js.cookie.min.mjs';

const MAX_LIVE_STORAGE = 1;
const cardsContainer = document.querySelector('.cards');
const btnOpenPopup = document.querySelector('.toggle-popup');
const btnOpenPopupLogin = document.querySelector('.toggle-login-popup');
const btnLogout = document.querySelector('.toggle-logout');
const cards = cardsContainer.querySelectorAll('.card');

let popupAdd = null;
let popupCard = null;
let popupLogin = null;

const isAuth = Cookies.get('email');

document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.footer__copyrights_year').textContent = new Date().getFullYear();

    popupLogin = new Popup('#popup-login-template', 'popup-login');
    if (!isAuth) {
        btnLogout.classList.add('hidden');
        btnOpenPopup.classList.add('hidden');
        if (!document.body.contains(document.querySelector('.popup-login'))) {
            document.body.append(popupLogin.getElement());
            popupLogin.setEventListener();
            popupLogin.open();

            const formLogin = document.querySelector('#popup-form-login');
            formLogin.addEventListener('submit', (e) => {
                e.preventDefault();
                const elementsFormLogin = [...formLogin.elements];
                const formData = serializeForm(elementsFormLogin);
                Cookies.set('email', formData.email, { expires: 1 });
                popupLogin.close();
                btnOpenPopupLogin.classList.add('hidden');
                btnLogout.classList.remove('hidden');
                btnOpenPopup.classList.remove('hidden');
            });
        }
    } else {
        btnOpenPopupLogin.classList.add('hidden');
        btnLogout.classList.remove('hidden');
        btnOpenPopup.classList.remove('hidden');
    }

    checkLocalStorage();
});

function handleCardClick(data) {
    popupCard = new PopupCard('#popup-card-template', 'popup-card');

    if (!document.body.contains(document.querySelector('.popup-card'))) {
        document.body.append(popupCard.getElement());
        popupCard.setEventListener();
        popupCard.open(data);
    }
}

function handleCardMouseEnter(target) {
    target.style.opacity = 1;
}

function handleCardMouseLeave(target) {
    target.style.opacity = '';
}

cards.forEach((card) => {
    card.addEventListener('mouseenter', (e) => {
        e.target.querySelector('.card__hover').style.opacity = 1;
    });
    card.addEventListener('mouseleave', (e) => {
        e.target.querySelector('.card__hover').style.opacity = '';
    });
});

btnOpenPopup.addEventListener('click', (e) => {
    e.preventDefault();

    popupAdd = new Popup('#popup-add-template', 'popup-add');
    if (!document.body.contains(document.querySelector('.popup-add'))) {
        document.body.append(popupAdd.getElement());
        popupAdd.setEventListener();
        popupAdd.open();
    }

    const formCatsAdd = document.querySelector('#popup-form-add');
    formCatsAdd.addEventListener('submit', (e) => {
        e.preventDefault();

        const elementsFormCat = [...formCatsAdd.elements];
        const formData = serializeForm(elementsFormCat);
        api.addNewCat(formData)
            .then(() => {
                createCard(formData);
                updateLocalStorage(formData, { type: 'ADD_CAT' });
                setTimeout(() => {
                    popupAdd.close();
                }, 1000);
            })
            .catch((err) => {
                console.log(err);
            });
    });
});

btnOpenPopupLogin.addEventListener('click', (e) => {
    e.preventDefault();
    if (!isAuth) {
        popupLogin = new Popup('#popup-login-template', 'popup-login');
        if (!document.body.contains(document.querySelector('.popup-login'))) {
            document.body.append(popupLogin.getElement());
            popupLogin.setEventListener();
            popupLogin.open();
        }
    }
});

btnLogout.addEventListener('click', (e) => {
    e.preventDefault();
    Cookies.remove('email');
    btnLogout.classList.add('hidden');
    btnOpenPopupLogin.classList.remove('hidden');
    btnOpenPopup.classList.add('hidden');
});

function serializeForm(elements) {
    const formData = {};

    elements.forEach((input) => {
        if (input.type === 'submit' || input.type === 'button') return;
        if (input.type === 'checkbox') {
            formData[input.name] = input.checked;
        }
        if (input.type !== 'checkbox') {
            formData[input.name] = input.value;
        }
    });

    return formData;
}

function checkLocalStorage() {
    const localData = JSON.parse(localStorage.getItem('cats'));
    const getTimeExpires = localStorage.getItem('catsRefresh');

    if (localData && localData.length && new Date() < new Date(getTimeExpires)) {
        localData.forEach((catData) => {
            createCard(catData);
        });
    } else {
        api.getAllCats()
            .then((data) => {
                data.forEach((catData) => {
                    createCard(catData);
                });
                setDataRefresh(MAX_LIVE_STORAGE, 'catsRefresh');
                //localStorage.setItem('cats', JSON.stringify(data));
                updateLocalStorage(data, { type: 'ALL_CATS' });
            })
            .catch((err) => {
                console.log(err);
            });
    }
}

function setDataRefresh(minutes, key) {
    const setTime = new Date(new Date().getTime() + minutes * 60000);

    localStorage.setItem(key, setTime);
    return setTime;
}

function updateLocalStorage(data, action) {
    const oldStorage = JSON.parse(localStorage.getItem('cats'));

    switch (action.type) {
        case 'ADD_CAT':
            oldStorage.push(data);
            localStorage.setItem('cats', JSON.stringify(oldStorage));
            return;
        case 'ALL_CATS':
            setDataRefresh(MAX_LIVE_STORAGE, 'catsRefresh');
            localStorage.setItem('cats', JSON.stringify(data));
            return;
        default:
            break;
    }
}

function createCard(data) {
    const newElement = new Card(
        data,
        '#card-template',
        handleCardMouseEnter,
        handleCardMouseLeave,
        handleCardClick
    );

    cardsContainer.append(newElement.getElement());
}
