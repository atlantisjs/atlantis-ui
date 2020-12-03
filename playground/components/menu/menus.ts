export interface AppMenu {
  name: string;
  route: string;
}

export const appMenus: AppMenu[] = [
  {
    name: '按钮',
    route: 'normal/button',
  },
  {
    name: 'Layout',
    route: 'normal/layout',
  },
  {
    name: 'Input',
    route: 'normal/input',
  },
];
