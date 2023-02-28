const cardsContainer = document.querySelector('.cards');
const btnOpenPopup = document.querySelector('.toggle-popup');
const cards = cardsContainer.querySelectorAll('.card');
let popupAdd = null;
let popupCard = null;

document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.footer__copyrights_year').textContent = new Date().getFullYear();
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

cats.forEach((catData) => {
    const newElement = new Card(
        catData,
        '#card-template',
        handleCardMouseEnter,
        handleCardMouseLeave,
        handleCardClick
    );
    cardsContainer.append(newElement.getElement());
});

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
  
        const newElement = new Card(
            formData,
            '#card-template',
            handleCardMouseEnter,
            handleCardMouseLeave,
            handleCardClick
        );

        cardsContainer.append(newElement.getElement());
        
        setTimeout(() => {
            popupAdd.close();
        }, 1000)
    });
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
