import { createVNode, render, VNode } from 'vue';
import NotificationConstrutor from './notification';

type NotificationVM = VNode;

interface NotificationQueueItem {
  cid: string;
  vm: NotificationVM;
  $el: HTMLElement;
  destroy: () => void;
}

export type NotificationQueue = Array<NotificationQueueItem>;

export const notifications: NotificationQueue = [];

interface NotificationOptions {
  title: string;
  message?: string | VNode;
  type?: 'success' | 'warning' | 'info' | 'error';
  closable?: boolean;
  customClass?: string;
  duration?: number;
  zIndex?: number;
  position?:
    | 'top-right'
    | 'top-left'
    | 'top-center'
    | 'bottom-right'
    | 'bottom-left'
    | 'bottom-center';
  pauseOnHover?: boolean;
  onClose?: () => void;
}

interface NotificationReturnType {
  destroy: () => void;
}

export function createNotification() {
  let uid = 0;

  function open(options: NotificationOptions): NotificationReturnType {
    const {
      title,
      message,
      type,
      closable,
      customClass,
      position,
      pauseOnHover,
      onClose: userOnClose
    } = options;

    const container = document.createElement('div');
    const cid = `notice_container--${uid++}`;

    container.id = cid;

    const destroy = () => close(cid, userOnClose);

    const vnode = createVNode(
      NotificationConstrutor,
      {
        title,
        message,
        type,
        closable,
        customClass,
        position,
        pauseOnHover,
        onClose: destroy
      },
      message
        ? {
            default: () => message
          }
        : null
    );

    render(vnode, container);
    const notification: NotificationQueueItem = {
      cid,
      vm: vnode,
      $el: container,
      destroy
    };

    notifications.push(notification);
    document.body.appendChild(container);

    return {
      destroy
    };
  }

  function clearAll() {
    for (let i = notifications.length - 1; i >= 0; i--) {
      notifications[i].destroy();
    }
  }

  return {
    open,
    clearAll
  };
}

export const Notification = createNotification();

function close(cid: string, userOnClose?: (vm: NotificationVM) => void) {
  const idx = notifications.findIndex(notify => notify.cid === cid);
  const notification = notifications[idx];

  if (!notification) return;

  const { vm, $el } = notification;

  userOnClose?.(vm);
  notifications.splice(idx, 1);

  if ($el.parentNode) {
    $el.parentNode.removeChild($el);
  }
}
