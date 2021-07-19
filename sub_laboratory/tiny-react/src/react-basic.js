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

export function render(vdom, container) {
    container.appendChild(renderRealDOM(vdom));
}

export function createElement(tagName, props, ...children) {
    if(typeof tagName === 'function')
        return tagName.apply(null, [ props, ...children ]);
    
    return {tagName, props, children};
}