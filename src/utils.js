export const getCookie = () => {
    return document.cookie.split('; ').reduce((acc, item) => {
        const [name, value] = item.split('=');

        return { ...acc, [name]: value };
    }, {});
}

export const deleteCookie = (key) => {
    document.cookie = `${key}=;expires=${new Date(0)}`
}