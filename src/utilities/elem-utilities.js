import { GameVars } from "../game-variables";

export const setElemSize = (elem, width, height) => {
    elem.width = width;
    elem.height = height;
}

export const createElem = (parentElem, elemType, id, classList, width, height, backgroundColor, clickFn, endClickFn) => {
    let elem = document.createElement(elemType);
    if (id) elem.id = id;
    if (classList) classList.forEach((e) => elem.classList.add(e));
    if (width) elem.width = width;
    if (height) elem.height = height;
    if (backgroundColor) elem.style.backgroundColor = backgroundColor;
    if (clickFn) createEvent(elem, 'touchstart', clickFn) && createEvent(elem, 'mousedown', clickFn);
    if (endClickFn) createEvent(elem, 'touchend', endClickFn) && createEvent(elem, 'mouseup', endClickFn);
    parentElem.appendChild(elem);
    return elem;
}

const createEvent = (elem, type, fn) => {
    elem.addEventListener(type, (e) => {
        GameVars.isMobile = e.type === 'touchstart';
        e.preventDefault();
        fn(e);
    });
    return true;
}