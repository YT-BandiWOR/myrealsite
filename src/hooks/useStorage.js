// Функция для установки значения в localStorage
function set(key, value, ttl) {
    ttl *= 1000; // переводим в секунды

    const now = new Date();
    const item = {
        value: value,
        expiry: now.getTime() + ttl,
    };
    localStorage.setItem(key, JSON.stringify(item));
}

// Функция для получения значения из localStorage
function get(key) {
    const itemStr = localStorage.getItem(key);
    // Если элемент не найден, возвращаем null
    if (!itemStr) {
        return null;
    }
    const item = JSON.parse(itemStr);
    const now = new Date();
    // Если срок жизни элемента истек, удаляем его и возвращаем null
    if (now.getTime() > item.expiry) {
        localStorage.removeItem(key);
        return null;
    }
    // Иначе возвращаем значение элемента
    return item.value;
}


const functions = {get, set};
export default functions;