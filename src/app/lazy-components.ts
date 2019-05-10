import {Injector, ComponentFactoryResolver, ViewContainerRef, Renderer2, ChangeDetectorRef, ComponentFactory, ɵcreateInjector} from '@angular/core';

export interface AfterViewLoaded {
  afterViewLoaded(): void;
}

export interface LazyComponentsMetadata {
  url: string;
}

// TODO: check how to use the Ivy view compiler to add components dynamically to the view.
function addComponentToView(container, component, injector: Injector) {
  const cfr = injector.get(ComponentFactoryResolver);
  const vcr = injector.get(ViewContainerRef);
  const renderer = injector.get(Renderer2);
  const cdr = injector.get(ChangeDetectorRef);
  const componentFactory = cfr.resolveComponentFactory(component);
  const elementHosts = vcr.element.nativeElement.getElementsByTagName(componentFactory.selector);
  const length = elementHosts.length;
  for (let i = 0; i < length; i++) {
    const cmpInstance = vcr.createComponent(componentFactory);
    const cmpElement = cmpInstance.location.nativeElement;
    renderer.appendChild(elementHosts[i], cmpElement);
    cdr.detectChanges();
  }
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
      // TODO: check if there is an option to get the injector without forcing the user to inject it,
      //  or if there will be a future api.
      const injector = cmp.injector;
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

