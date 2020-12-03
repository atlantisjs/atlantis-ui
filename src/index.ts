import { App } from 'vue';
import { Alert } from './components/alert';
import { Backdrop } from './components/backdrop';
import { Button } from './components/button';
import { Checkbox, CheckboxGroup } from './components/checkbox';
import { Drawer } from './components/drawer';
import { Form, FormItem } from './components/form';
import { Input } from './components/input';
import { Notification, createNotification } from './components/notification';
import { Modal } from './components/modal';
import { Radio, RadioGroup, RadioGroupButton } from './components/radio';
import { Step, Steps } from './components/step';
import { Tooltip } from './components/tooltip';
import { TreeView } from './components/tree-view';

import './theme/index.scss';

export {
  Alert,
  Backdrop,
  Button,
  Checkbox,
  CheckboxGroup,
  Drawer,
  Form,
  FormItem,
  Input,
  Modal,
  Radio,
  RadioGroup,
  RadioGroupButton,
  Step,
  Steps,
  Tooltip,
  TreeView,
  // methods
  createNotification,
  Notification,
};

export const install = (app: App) => {
  app.component(Alert.name, Alert);
  app.component(Backdrop.name, Backdrop);
  app.component(Button.name, Button);
  app.component(Checkbox.name, Checkbox);
  app.component(CheckboxGroup.name, CheckboxGroup);
  app.component(Drawer.name, Drawer);
  app.component(Form.name, Form);
  app.component(FormItem.name, FormItem);
  app.component(Input.name, Input);
  app.component(Modal.name, Modal);
  app.component(Radio.name, Radio);
  app.component(RadioGroup.name, RadioGroup);
  app.component(RadioGroupButton.name, RadioGroupButton);
  app.component(Steps.name, Steps);
  app.component(Step.name, Step);
  app.component(Tooltip.name, Tooltip);
  app.component(TreeView.name, TreeView);
};

export default {
  install,
};
