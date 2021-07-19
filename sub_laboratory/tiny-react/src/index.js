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