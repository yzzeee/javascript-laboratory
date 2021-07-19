import { Component } from './index.js';

let hooks = [];
let currentComponent = -1;

export function useState(initValue) {
    let position = currentComponent;
    
    if(!hooks[position]) {
        hooks[position] = initValue;
    }
    
    return [
        hooks[position],
        (nextValue) => {
            hooks[position] = nextValue;
        }
    ]
}

function renderRealDOM(vdom) {
    if(typeof vdom === 'string')
        return document.createTextNode(vdom);
    
    if(vdom === undefined) return;
    
    const $el = document.createElement(vdom.tagName);
    
    vdom.children.map(renderRealDOM).forEach(node => {
        $el.appendChild(node);
    });
    return $el;
}

export const render = (function () {
    let prevVdom = null;
    
    return function (nextVdom, container) {
        if(prevVdom === null)
            prevVdom = nextVdom;
        
        // diff logic
        
        container.appendChild(renderRealDOM(nextVdom));
    };
})();

export function createElement(tagName, props, ...children) {
    if(typeof tagName === 'function') {
        if(tagName.prototype instanceof Component) { // 클래스형 컴포넌트
            const instance = new tagName({...props, children});
            return instance.render();
        }
        else { // 함수형 컴포넌트
            currentComponent++;
            
            return tagName.apply(null, [ props, ...children ]);
        }
    }
    
    return {tagName, props, children};
}