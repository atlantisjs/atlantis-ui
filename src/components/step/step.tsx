import {
  computed,
  defineComponent,
  getCurrentInstance,
  inject,
  onBeforeUnmount,
  reactive,
  ref
} from 'vue';
import { stepsKey } from './steps';

export type StepStatus = 'process' | 'wait' | 'finish' | 'error';

export interface StepItemState {
  uid: number;
  currentStatus: string;
  setIndex: (val: number) => void;
}

export default defineComponent({
  name: 'AtsStep',
  props: {
    title: { type: String, default: '' },
    description: { type: String, default: '' }
  },
  setup(props) {
    const steps = inject(stepsKey);
    const currentInstance = getCurrentInstance();

    const stepIndex = ref(0);
    const currentStatus = ref('');

    const setIndex = (index: number) => {
      stepIndex.value = index;
    };

    if (steps && currentInstance) {
      const stepItemState = reactive({
        uid: computed(() => currentInstance.uid),
        currentStatus,
        setIndex
      });

      steps.steps.value = [...steps.steps.value, stepItemState];
    }

    onBeforeUnmount(() => {
      if (steps) {
        steps.steps.value = steps.steps.value.filter(
          instance => instance.uid !== currentInstance?.uid
        );
      }
    });

    return () => {
      const classes = computed(() => [
        'ats-step',
        {
          'ats-step--active': stepIndex.value === steps?.current.value
        }
      ]);

      return (
        <div class={classes.value}>
          <div class="ats-step__title">{props.title}</div>
          <div class="ats-step__description">{props.description}</div>
        </div>
      );
    };
  }
});
