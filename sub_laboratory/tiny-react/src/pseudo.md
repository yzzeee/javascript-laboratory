## REACT 만들어보며 이해하기
> The RED : 김민태 React와 Redux로 구현하는 아키텍쳐와 리스크 관리

0. pre think!</br>
   가상돔은 기본적으로 html 태그로 변환시킬 수 있는 구조로 되어있을 것이다.
   

1. 가상돔의 구조 생각해보기

```html
<div id="root" class="container">
    <span>blabla</span>
</div>
```
돔의 element는 위와 같이 생겼다.
돔을 가상으로 만든다면 돔을 그릴 수 있도록 정보들을 담아주어야하는데 이는 아래와 같이 생각해볼 수 있다.

```  
{
    tagName: 'div',
    props: {
        id: 'root',
        className: 'container'
    },
    children: [
        {
            tagName: 'span',
            props: {},
            children: [
                'blabla'
            ]
        }
    ]
}
```

2.  기본적인 사용 형태 작성

리액트에는 어떤 함수가 있을까..
render, createElement

```javascript
// react.js

export function render() {
    
}

// jsx 구문을 사용하지 않는다면 해당 함수를 사용해서 구현하면되며 바벨을 사용하지 않아도 된다.
// 바벨 플러그인이 jsx 구문을 createElement로 변환하여 가상돔을 만든다.
export function createElement() {
    
}
```

```javascript
// index.js

/* @jsx createElement */
import { createElement, render } from './react';

function Title() {
    return (
        <h2>안녕, React!</h2>
    )
}

render(<Title/>, document.querySelector('#root'));
```
@babel/preset-react에 약속이 정해져 있어서 바벨로 트랜스파일링 시 규칙대로 변환된다.

```javascript
/* @jsx createElement */
// 해당 jsx 구문을 어떤 지시어로 변환할 것인가에 대한 명세 default React.createElement
import { createElement, render } from './react.js';

function Title() {
   return createElement("h2", null, "\uC548\uB155, React!");
}

render(createElement(Title, null), document.querySelector('#root'));
```
바벨이 리액트의 구조를 트랜스파일링 하면 위와 같다.
태그명, 속성, children 구조이다.

4. createElement 구현
```javascript
export function createElement(tagName, props, ...children) {
    return { tagName, props, children };
}
```
바벨로 변환된 createElement 함수의 인자를 알 수 있다.
createElement는 노드의 가상돔을 반환해주는 역할을 하므로 받은 인자를 통해 객체 반환을 해준다.

5. render 인자 확인하기
```javascript
export function render(vdom, container) {
   console.log(vdom, container)
}
```
render 함수에 넘겨주는 인자는 컴포넌트와, 가상돔을 랜더링 할 element 이다.
render에 들어온 인자를 console로 출력해보면 tagName에 함수가 들어온 것을 확인 할 수 있다.

```
{props: null, children: Array(0), tagName: ƒ}
```
번들된 파일도 살펴보면
```javascript
render(createElement(Title, null), document.querySelector('#root'));
```
render 함수 내에 첫번째 인자로 createElement의 반환된 값이 들어가고
createElement 함수의 첫 번째 인자로는 Title 함수가 들어간다.
createElement의 첫 번째 인자는 태그명인 문자열 또는 함수가 들어오는 것을 알 수 있다.
이는 jsx 컴파일러가 대문자로 시작하는 함수는 사용자가 정의한 컴포넌트로 인식하여 함수자체를 넘겨주도록 디자인이 되어있다.
따라서 createElement 함수에서 이를 실행하여 주어야 한다.

6. createElement 수정
```javascript
export function createElement(tagName, props, ...children) {
    if (typeof tagName === 'function')
        return tagName.apply(null, [props, ...children]);
    
    return { tagName, props, children };
}
```
createElement에서 함수를 실행해주면 render에서 첫 번째 인자로 태그명이 전달된다.

7. render 구현

render 함수는 인자로 넘어온 vdom 객체를 랜더링 해주는 역할을 수행하도록 구현한다.
```javascript
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
```
vdom은 children 배열을 element로 변환하는 재귀함수로 구현되어야 한다. 따라서 renderRealDOM 함수로 분리하여 구현한다.
여기까지 하면 기본 구조는 완료 되었다.

---
우리가 생각하는 가상돔 이라하면 diff 알고리즘을 이용하여 현재 dom과 업데이트 된 부분을 비교하여 변경된 부분만 적용하는 부분이 필요한데
그런 알고리즘은 구현하지 않았고 간단하게 jsx로 만들어진 컴포넌트를 가상돔으로 만들고 그 가상돔의 실체는 무엇이고 그 가상돔은 어떻게 실제돔으로 바꾸는지까지만 구현 된 것이다.

이 구조까지만 보면 아쉬우니깐 실제 리액트에서는 어떤식으로 가상돔을 현재버전과 업데이트 할 가상돔을 비교할 수 있는지 구조만 잡아보자
함수내에서 이전 상태를 알 수 있으려면 어떻게해야할까.. 클로저를 사용해보자..

8. render 함수를 수정
```javascript
export const render = (function() {
    let prevVdom = null;
    
    return function (nextVdom, container) {
        if (prevVdom === null) 
            prevVdom = nextVdom;
        
        // diff logic
        
        container.appendChild(renderRealDOM(vdom));
    }
})();
```
기존의 함수와 동일하게 동작하면서 이전 상태값을 클로저를 통해 기억해둘 수 있도록 IIFE를 활용하여 수정한다.
diff logic 부분에서 이전값과 비교 알고리즘을 작성할 수 있을 것이다.
실제 구현은 이렇게 단순하지 않겠지만, Tiny react에서는 간단히 이정도만 생각하도록 한다.

---
9. 클래스 컴포넌트 랜더링하기
```javascript
/* @jsx createElement */
// 해당 jsx 구문을 어떤 지시어로 변환할 것인가에 대한 명세 default React.createElement
import { createElement, render } from './react.js';

export class Component {
}

function Title() {
   return (
           <div>
              <h2>안녕, React!</h2>
              <p>반가워!</p>
              <div>This is Functional Component</div>
              <Body/>
           </div>
   )
}

class Body extends Component {
   render() {
      return <div>This is Class Component</div>
   }
}

console.log(Title()); // 가상돔의 형태를 볼 수 있도록 확인

render(<Title/>, document.querySelector('#root'));

```

Title 함수는 함수형 컴포넌트이다. 그런데 React에는 클래스형 컴포넌트도 있으므로 클래스형 컴포넌트를 작성해서 랜더링을 해보도록 하자.
클래스 인스턴스를 생성해주어야하기 때문에 createElement 함수 내에서 해당 인스턴스를 생성하여 반환해주어야한다.
따라서 createElement 함수에서 인스턴스를 생성하는 로직을 추가한다.

```javascript
export function createElement(tagName, props, ...children) {
    if(typeof tagName === 'function') {
        if(tagName.prototype instanceof Component) {
            const instance = new tagName({...props, children});
            return instance.render();
        }
        else
            return tagName.apply(null, [ props, ...children ]);
    }
    
    return {tagName, props, children};
}
```

여기까지 하면 동작을 한다.
다만 프로퍼티 처리, 클래스컴포넌트의 라이프사이클,
인스턴스 생성 제한(인스턴스를 전역적인 저장소에 저장 후 상태를 관리 > 함수형 컴포넌트가 상태를 가지지 않는 이유를 생각해 볼 수 있다.) 등..

---

10. hook

함수형 컴포넌트가 어떻게 상태를 가질 수 있을까?
우선은 가장 많이 쓰이는 useState 훅을 작성해보자.
```javascript
export function useState(initValue) {
    let value = initValue;
    
    return [
        value,
        (nextValue) => {
            value = nextValue;
        }
    ]
}
```

useState 훅은 단순히 위와같은 형태로 구현 되어있는데, 초기 랜더링 이후에 함수가 이전 값을 가지고 있으려면,
값을 관리할 수 있는 공간이 따로 있어야 겠다.
훅의 상태를 관리하는 hooks라는 컨텍스트를 만들어서 상태를 관리할 수 있도록 수정하자!
대략적으로 아래와 같이 수정하면 createElement 함수와 useState 함수는 독립적이어서 서로의 상태를 알 수 없었지만,
하나의 컨텍스트를 공유하면서 이전 상태를 클로저로 관리할 수 있다.

```javascript
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

export function createElement(tagName, props, ...children) {
   if(typeof tagName === 'function') {
      if(tagName.prototype instanceof Component) { // 클래스형 컴포넌트
         const instance = new tagName({...props, children});
         return instance.render();
      }
      else { // 함수형 컴포넌트
         currentComponent++; // <-- 이 hook이 조건문 안에 들어가지 못하는 이유!

         return tagName.apply(null, [ props, ...children ]);
      }
   }

   return {tagName, props, children};
}
```

리액트 문서에서 살펴보면 컴포넌트 내에서 hook의 갯수는 동일해야한다고 한다.
hook은 함수형 컴포넌트에서만 사용할 수 있고, 컴포넌트 내의 hook의 수가 변하지 않는다는 전제하에 동작한다.