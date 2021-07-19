/* @jsx createElement */
// 해당 jsx 구문을 어떤 지시어로 변환할 것인가에 대한 명세 default React.createElement
import { createElement, render } from './react.js';
export class Component {}

function Title() {
  return createElement("div", null, createElement("h2", null, "\uC548\uB155, React!"), createElement("p", null, "\uBC18\uAC00\uC6CC!"), createElement("div", null, "This is Functional Component"), createElement(Body, null));
}

class Body extends Component {
  render() {
    return createElement("div", null, "This is Class Component");
  }

}

console.log(Title()); // 가상돔의 형태를 볼 수 있도록 확인

render(createElement(Title, null), document.querySelector('#root'));