import { h, app } from 'hyperapp';
import hyperx from 'hyperx';

const html = hyperx(h);

const n = 3;

const createEdges = (vertices, edges = []) => {
  if (!vertices.length) return edges;
  const [head, ...tail] = vertices;
  for (const e of tail) {
    edges.push({
      id: `edge-${head}${e}-${e}${head}`,
      a: head,
      b: e,
      active: false
    });
  }
  return createEdges(tail, edges);
}

const wait = time => new Promise(resolve => setTimeout(() => resolve(), time));

const counter = {
  amount: 0,
  total: 0,
  merging: false
}

const model = {
  counters: Array.from({length: n}, (v, i) => Object.assign({ id: i }, counter)),
  edges: createEdges(Array.from({length: n}, (v, i) => i))
};

const counterView = (counter, actions) => html`
  <div class="counter">
    <div>beans: ${counter.amount}</div>
    <div>total: ${counter.total}</div>
    <button onclick=${() => actions.increment(counter)}>Increment</button>
  </div>
`;

const view = (model, actions) => html`
  <div class="container">
    <div class="counter-container">
      ${model.counters.map(c => counterView(c, actions))}
    </div>
    ${model.edges.map(e => html`<div class="edge ${e.active ? 'active' : ''}" id="${e.id}">${e.a} - ${e.b}</div>`)}
  </div>
`;

const effects = {
  increment(model, actions, counter) {
    actions.incrementCounter(counter);

    for (const c of model.counters.filter(c => c.id !== counter.id)) {
      const time = (Math.floor(Math.random() * 5) + 1) * 1000;
      const edge = model.edges.filter(e => e.id.includes(`${counter.id}${c.id}`))[0];

      wait(time).then(() => {
        edge.active = true;
        actions.merge(c);
        edge.active = false;
      });
    }
  }
}

const reducers = {
  incrementCounter(model, counter) {
    counter.amount = counter.amount + 1;
    counter.total = Math.max(counter.total + 1, counter.total);
  },
  merge(model, counter) {
    counter.total = Math.max(counter.total + 1, counter.total);
  }
};

app({ model, view, reducers, effects })
