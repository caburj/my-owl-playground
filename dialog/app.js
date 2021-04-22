/**
 * This is the javascript code defined in the playground.
 * In a larger application, this code should probably be moved in different
 * sub files.
 */
function app() {
  const { Component, useState } = owl;

  class App extends Component {
    state = useState({
      name: '',
      isSure: false,
    });

    async onClick() {
      const response = await this.env.dialog.askUser('prompt', {
        message: 'What is your name?',
      });
      this.state.name = response;
    }

    async onAreYouSure() {
      const confirm = await this.env.dialog.askUser('confirm', {
        message: 'Are you really sure?',
      });
      this.state.isSure = confirm;
    }
  }

  /**
   * @prop {string} message message that will be displayed when this dialog is shown.
   * @prop {(result) => void} respondWith used to send response of this Dialog
   */
  class CustomPrompt extends Component {
    state = useState({ inputText: '' });
    _onSubmit() {
      this.props.respondWith(this.state.inputText);
    }
  }

  class CustomConfirm extends Component {}

  class Dialog extends Component {
    static components = { prompt: CustomPrompt, confirm: CustomConfirm };
    state = useState({ showDialog: false, dialogName: '' });
    dialogProps = {};
    dialogComponent = false;
    askUser(dialogName, props) {
      return new Promise((resolve) => {
        this.state.showDialog = true;
        this.dialogComponent = this.constructor.components[dialogName];
        console.log(this.dialogComponent);
        const respondWith = (result) => {
          this.state.showDialog = false;
          this.dialogProps = {};
          this.dialogComponent = false;
          resolve(result);
        };
        this.dialogProps = { ...props, respondWith };
      });
    }
  }

  const dialog = new Dialog();
  App.env = { ...(App.env || {}), dialog };
  const app = new App();

  app.mount(document.body).then(() => dialog.mount(document.body));
}

/**
 * Initialization code
 * This code load templates, and make sure everything is properly connected.
 */
async function start() {
  let templates;
  try {
    templates = await owl.utils.loadFile('app.xml');
  } catch (e) {
    console.error(
      `This app requires a static server.  If you have python installed, try 'python app.py'`
    );
    return;
  }
  const env = { qweb: new owl.QWeb({ templates }) };
  owl.Component.env = env;
  await owl.utils.whenReady();
  app();
}

start();
