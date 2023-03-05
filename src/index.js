import { api } from './api.js';
import { Card } from './card.js';
import { PopupCard } from './popup-card.js';
import { Popup } from './popup.js';
import Cookies from './js.cookie.min.mjs';
import { Notify } from './notify.js';

const MAX_LIVE_STORAGE = 10;
const cardsContainer = document.querySelector('.cards');
const btnOpenPopup = document.querySelector('.toggle-popup');
const btnOpenPopupLogin = document.querySelector('.toggle-login-popup');
const btnLogout = document.querySelector('.toggle-logout');
const cards = cardsContainer.querySelectorAll('.card');
const orderBtnRate = document.querySelector('.order-toggle_rate');
const orderBtnFavorite = document.querySelector('.order-toggle_favorite');

let popupAdd = null;
let popupCard = null;
let popupLogin = null;
let popupEdit = null;
let notify = null;
let order = null;

const isAuth = Cookies.get('email');

document.addEventListener('DOMContentLoaded', () => {
    checkLocalStorage();

    document.querySelector('.footer__copyrights_year').textContent = new Date().getFullYear();

    popupLogin = new Popup('#popup-template', '#form-auth', 'Авторизация', 'popup-login');
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
                notify = new Notify('#notify-template', 'Вы вошли :)', 'notify-message-success');
                document.body.append(notify.getElement());
                notify.setEventListener();
                notify.open();
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

    order = localStorage.getItem('order');

    if (order && order === 'rate') {
        orderBtnRate.classList.add('order-toggle_active');
    }
    if (order && order === 'favorite') {
        orderBtnFavorite.classList.add('order-toggle_active');
    }

    orderBtnRate.addEventListener('click', (e) => {
        if (!e.target.classList.contains('order-toggle_active')) {
            e.target.classList.toggle('order-toggle_active');
            orderBtnFavorite.classList.toggle('order-toggle_active');
            localStorage.setItem('order', 'rate');
            checkLocalStorage();
        }
    });

    orderBtnFavorite.addEventListener('click', (e) => {
        if (!e.target.classList.contains('order-toggle_active')) {
            e.target.classList.toggle('order-toggle_active');
            orderBtnRate.classList.toggle('order-toggle_active');
            localStorage.setItem('order', 'favorite');
        }
        checkLocalStorage();
    });
});

function handleCardClick(data) {
    const classes = ['popup-card'];
    if (data.favorite) classes.push('card-favorite');
    popupCard = new PopupCard('#popup-template', '#popup-card-template', '', classes.join(','));

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

    popupAdd = new Popup('#popup-template', '#form-add-content', 'Добавить питомца', 'popup-add');
    if (!document.body.contains(document.querySelector('.popup-add'))) {
        document.body.append(popupAdd.getElement());
        popupAdd.setEventListener();
        const data = {
            id: Math.floor(Math.random() * 1000) + 1,
            age: new Date().getFullYear(),
            rate: Math.floor(Math.random() * 10) + 1,
        };

        popupAdd.open(data);
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
                    notify = new Notify(
                        '#notify-template',
                        'Вы добавили мульт-котика',
                        'notify-message-success'
                    );
                    document.body.append(notify.getElement());
                    notify.setEventListener();
                    notify.open();
                }, 100);
            })
            .catch((err) => {
                notify = new Notify('#notify-template', err, 'notify-message-danger');
                notify.open();
            });
    });
});

btnOpenPopupLogin.addEventListener('click', (e) => {
    e.preventDefault();
    if (!isAuth) {
        popupLogin = new Popup(
            '#popup-template',
            '#form-add-content',
            'Авторизация',
            'popup-login'
        );
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
    notify = new Notify('#notify-template', 'Вы вышли :(', 'notify-message-warning');
    document.body.append(notify.getElement());
    notify.setEventListener();
    notify.open();
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

    if (cardsContainer.childNodes.length !== 0) {
        cardsContainer.innerHTML = '';
    }

    const order = localStorage.getItem('order');

    if (localData && localData.length && new Date() < new Date(getTimeExpires)) {
        if (order && order === 'rate') {
            localData.sort((a, b) => {
                return b.rate - a.rate;
            });
        }
        if (order && order === 'favorite') {
            localData.sort((a, b) => {
                return b.favorite - a.favorite;
            });
        }

        localData.forEach((catData) => {
            createCard(catData);
        });
    } else {
        api.getAllCats()
            .then((data) => {
                if (order && order === 'rate') {
                    data.sort((a, b) => {
                        return b.rate - a.rate;
                    });
                }
                if (order && order === 'favorite') {
                    data.sort((a, b) => {
                        return b.favorite - a.favorite;
                    });
                }

                data.forEach((catData) => {
                    createCard(catData);
                });

                setDataRefresh(MAX_LIVE_STORAGE, 'catsRefresh');
                updateLocalStorage(data, { type: 'ALL_CATS' });
            })
            .catch((err) => {
                notify = new Notify('#notify-template', err, 'notify-message-danger');
                notify.open();
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
        case 'DELETE_CAT':
            const newStorage = oldStorage.filter((cat) => cat.id !== data);
            localStorage.setItem('cats', JSON.stringify(newStorage));
        case 'EDIT_CAT':
            const updateStorage = oldStorage.map((cat) => {
                return Number(cat.id) !== Number(data.id) ? cat : data;
            });
            localStorage.setItem('cats', JSON.stringify(updateStorage));
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
        handleCardClick,
        handleCardEdit,
        handleCardDelete,
        handleCardLike
    );

    cardsContainer.append(newElement.getElement());
}

function handleCardEdit(instance) {
    if (isAuth) {
        popupEdit = new Popup(
            '#popup-template',
            '#form-add-content',
            'Редактировать котика',
            'popup-edit'
        );
        if (!document.body.contains(document.querySelector('.popup-edit'))) {
            document.body.append(popupEdit.getElement());
            popupEdit.setEventListener();
            popupEdit.open(instance.getData());
        }

        const formCatsEdit = document.querySelector('.popup-edit #popup-form-add');
        formCatsEdit.addEventListener('submit', (e) => {
            e.preventDefault();

            const elementsFormCat = [...formCatsEdit.elements];
            const formData = serializeForm(elementsFormCat);
            const postData = {};

            Object.entries(formData).forEach((entry) => {
                const [key, value] = entry;

                if (key !== 'id' && value != instance.getData()[key]) {
                    postData[key] = value;
                }
            });

            if (postData) {
                api.updateCatById(formData.id, postData)
                    .then(() => {
                        instance.setData(postData);
                        updateLocalStorage(formData, { type: 'EDIT_CAT' });
                        setTimeout(() => {
                            popupEdit.close();
                            checkLocalStorage();
                            notify = new Notify(
                                '#notify-template',
                                'Вы изменили данные о котике',
                                'notify-message-success'
                            );
                            document.body.append(notify.getElement());
                            notify.setEventListener();
                            notify.open();
                        }, 100);
                    })
                    .catch((err) => {
                        notify = new Notify('#notify-template', err, 'notify-message-danger');
                        notify.open();
                    });
            }
        });
    } else {
        notify = new Notify('#notify-template', 'Вы не авторизованы', 'notify-message-danger');
        document.body.append(notify.getElement());
        notify.setEventListener();
        notify.open();
    }
}

function handleCardLike(instance) {
    const cardId = instance.getElement().dataset.id;
    const data = instance.getData();
    const favoriteNew = data.favorite ? false : true;

    data.favorite = favoriteNew;
    api.updateCatById(cardId, data)
        .then(() => {
            instance.setData(data);
            updateLocalStorage(data, { type: 'EDIT_CAT' });
            setTimeout(() => {
                checkLocalStorage();
                notify = new Notify(
                    '#notify-template',
                    favoriteNew ? 'Вам понравился котик!' : 'Вам разонравился котик :(',
                    favoriteNew ? 'notify-message-success' : 'notify-message-danger'
                );
                document.body.append(notify.getElement());
                notify.setEventListener();
                notify.open();
            }, 100);
        })
        .catch((err) => {
            notify = new Notify('#notify-template', err, 'notify-message-danger');
            notify.open();
        });
}

function handleCardDelete(instance) {
    if (isAuth) {
        const startDel = confirm('Вы действительно собираетесь удалить кота?');
        const cardId = instance.getElement().dataset.id;
        if (startDel) {
            api.deleteCatById(cardId);
            localStorage.removeItem('catsRefresh');
            updateLocalStorage(cardId, 'DELETE_CAT');

            setTimeout(() => {
                checkLocalStorage();
                notify = new Notify(
                    '#notify-template',
                    'Вы удалили котика',
                    'notify-message-danger'
                );
                document.body.append(notify.getElement());
                notify.setEventListener();
                notify.open();
            }, 100);
        }
    } else {
        notify = new Notify('#notify-template', 'Вы не авторизованы', 'notify-message-danger');
        document.body.append(notify.getElement());
        notify.setEventListener();
        notify.open();
    }
}

const headerEl = document.querySelector('.header');
const sticky = headerEl.clientHeight;
const rootEl = document.body;
const scrollToTopBtn = document.querySelector('.on-top-button');

window.addEventListener('scroll', (e) => {
    if (window.pageYOffset > sticky) {
        headerEl.classList.add('sticky');
    } else {
        headerEl.classList.remove('sticky');
    }

    const scrollableHeight =
        document.documentElement.scrollHeight - document.documentElement.clientHeight;
    if (document.documentElement.scrollTop / scrollableHeight > 0.5) {
        scrollToTopBtn.classList.add('show');
    } else {
        scrollToTopBtn.classList.remove('show');
    }
});

scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth',
    });
});
