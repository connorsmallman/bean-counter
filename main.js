import { h, app } from 'hyperapp';
import hyperx from 'hyperx';

const html = hyperx(h);

const counter = {
  amount: 0,
  total: 0
}

const model = {
  counters: Array.from({length: 3}, (v, i) => Object.assign({ id: i }, counter))
};

const counterView = (counter, actions) => html`
  <div>
    <div>beans: ${counter.amount}</div>
    <div>total: ${counter.total}</div>
    <button onclick=${() => actions.increment(counter)}>Increment</button>
  </div>
`;

const view = (model, actions) => html`
  <div>${model.counters.map(c => counterView(c, actions))}</div>
`;

const reducers = {
  increment(model, counter) {
    counter.amount = counter.amount + 1;
    counter.total = counter.total + 1;

    for (const o of model.counters.filter(c => c.id !== counter.id)) {
    	o.total = Math.max(counter.total, o.total);
    }
  }
};

app({ model, view, reducers })
