import { Component, utils, QWeb, useState } from './owl.es.js';

class App extends Component {
  setup() {
    const groups = {
      1: [],
      2: [],
      3: [],
    };
    for (let i = 0; i < 10; i++) {
      for (let j = 1; j < 4; j++) {
        const id = Math.trunc(Math.random() * 10 + Math.random() * 3);
        groups[j].push({ id, val: id });
      }
    }
    this.state = useState({
      groups,
      selectedGroup: 1,
    });
  }
  onClickGroup(group) {
    this.state.selectedGroup = group;
  }
  getItems() {
    return this.state.groups[this.state.selectedGroup];
  }
}

window.addEventListener('DOMContentLoaded', async function () {
  let templates;
  try {
    templates = await utils.loadFile('app.xml');
  } catch (e) {
    console.error(
      `This app requires a static server.  If you have python installed, try 'python app.py'`
    );
    return;
  }
  const env = { qweb: new QWeb({ templates }) };
  Component.env = env;
  await utils.whenReady();
  const app = new App();
  await app.mount(document.body);
});
