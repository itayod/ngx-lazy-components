import {Injector, ΔdirectiveInject, INJECTOR, ɵrenderComponent as renderComponent} from '@angular/core';

export interface AfterViewLoaded {
  afterViewLoaded(): void;
}


export interface LazyComponentsMetadata {
  url: string;
}

function addComponentToView(container, component, injector: Injector) {
  renderComponent(component, {injector});
}

function loadComponents(lazyComponentsConfig: LazyComponentsMetadata[]): Promise<any> {
  const promises = lazyComponentsConfig.map(conf => {
    const arr = conf.url.split('#');
    return import(`${arr[0]}`).then((data) => data[arr[1]]);
  });

  return Promise.all(promises);
}

export function LazyComponents(lazyComponentsConfig: LazyComponentsMetadata[]) {
  return (cmpType) => {
    const originalFactory = cmpType.ngComponentDef.factory;
    cmpType.ngComponentDef.factory = (...args) => {
      const cmp: any = originalFactory(...args);

      const injector = ΔdirectiveInject(INJECTOR);
      loadComponents(lazyComponentsConfig).then((lazyComponents) => {
        lazyComponents.forEach(lazyCmp => addComponentToView(cmp, lazyCmp, injector));
        if (cmp.afterViewLoaded) {
          cmp.afterViewLoaded();
        }
      });

      return cmp;
    };
    return cmpType;
  };
}

