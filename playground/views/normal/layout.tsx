import { defineComponent } from 'vue';
import { Notification } from '../../../src';

export default defineComponent({
  name: 'LayoutPage',
  setup() {
    return () => (
      <div>
        <ats-button
          onClick={() =>
            Notification.open({
              title: 'Notification',
              message: 'message',
              pauseOnHover: false
            })
          }
        >
          open
        </ats-button>
      </div>
    );
  }
});
