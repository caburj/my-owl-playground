import { Component, utils, QWeb, useState, hooks } from './owl.es.js';

const delay = (cb, ms) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(cb());
    }, ms);
  });
};

class Main extends Component {}

class App extends Component {
  static components = { Main };
  setup() {
    this.state = useState({
      showApp: 'LOADING',
    });
    this.loading = useState({
      progress: 0,
    });
    this.progressRef = hooks.useRef('progress-ref');
  }
  mounted() {
    this.start();
  }
  async start() {
    for (let i = 0; i < 150; i++) {
      await delay(() => {
        this.loading.progress += 1;
        if (this.progressRef.el) {
          this.progressRef.el.style.width = `${i}%`;
        }
      }, 50);
    }
    this.state.showApp = 'READY';
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
