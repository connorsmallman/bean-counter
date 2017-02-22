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

const wait = time => new Promise(resolve => setTimeout(() => resolve(), time));

const counterView = (counter, actions) => html`
  <div class="counter">
    <div>beans: ${counter.amount}</div>
    <div>total: ${counter.total}</div>
    <button onclick=${() => actions.increment(counter)}>Increment</button>
  </div>
`;

const view = (model, actions) => html`
  <div class="container">${model.counters.map(c => counterView(c, actions))}</div>
`;

const effects = {
  increment(model, actions, counter) {
    actions.incrementCounter(counter);

    const time = (Math.floor(Math.random() * 5) + 1) * 1000;

    wait(time).then(() => actions.merge());
  }
}

const reducers = {
  incrementCounter(model, counter) {
    counter.amount = counter.amount + 1;
  },
  merge(model) {
    for (const c of model.counters) {
      c.total = Math.max(c.total + 1, c.total);
    }
  }
};

app({ model, view, reducers, effects })
