import { renderFeatures } from './-utils';
import basicFields from './examples/basic-fields';
import nativeForm from './examples/native-form';
import profileForm from './examples/profile-form';
import registrationForm from './examples/registration-form';

type PageModule = {
  html: string;
  cleanup?: () => void;
  load?: () => void;
};

type ExampleModule = PageModule & {
  title: string;
  features: string[];
};

const examples: Record<string | number, ExampleModule> = {
  '/native-form': nativeForm,
  '/basic-fields': basicFields,
  '/registration-form': registrationForm,
  '/profile-form': profileForm
};

const home = {
  html: `<h1>Examples for <code>@hokulea/pahu</code> (Vanilla)</h1> 
  <ul>
    ${Object.entries(examples)
      .map(
        ([url, data]) =>
          `<li><a href="#${url}">${data.title}</a>${renderFeatures(data.features)}</li>`
      )
      .join('')}
  </ul>`
};

const modules: Record<string | number, PageModule> = {
  '/': home,
  ...examples,
  404: { html: `<h1>404</h1><p>Page not found.</p>` }
};

let currentModule: PageModule | undefined;

const renderPage = (app: Element, html: string) => {
  app.innerHTML = html;
};

export function router(app: Element, path: string) {
  if (typeof currentModule?.cleanup === 'function') {
    try {
      currentModule.cleanup();
    } catch (error) {
      console.error('Error occurred during cleanup:', error);
    }
  }

  currentModule = path in modules ? modules[path] : modules['404'];

  renderPage(app, currentModule.html);

  if (typeof currentModule.load === 'function') {
    currentModule.load();
  }
}

export function handleRoute() {
  const app = globalThis.document.querySelector('#app') as Element;
  const path = globalThis.location.hash.slice(1) || '/';

  router(app, path);
}

globalThis.addEventListener('load', handleRoute);
globalThis.addEventListener('hashchange', handleRoute);
