import { api } from './api';

export class CatsInfo {
    constructor(handleEditCat, handleDeleteCat, handleLikeCat) {
        this._handleEditCat = handleEditCat;
        this._handleDeleteCat = handleDeleteCat;
        this._handleLikeCat = handleLikeCat;
        this._data = {};
    }

    setData() {

    }


    delete(id) {
        api.deleteCatById()
    }
}
