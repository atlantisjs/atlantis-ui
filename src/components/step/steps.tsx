import {
  defineComponent,
  provide,
  toRefs,
  InjectionKey,
  PropType,
  Ref,
  watch,
  ref
} from 'vue';
import Step, { StepStatus, StepItemState } from './step';

interface StepsCtx {
  steps: Ref<StepItemState[]>;
  status: Ref<StepStatus>;
  current: Ref<number>;
}

export const stepsKey: InjectionKey<StepsCtx> = Symbol.for('AtsStep');

interface StepOptions {
  title: string;
  description: string;
}

export default defineComponent({
  name: 'AtsSteps',
  props: {
    options: { type: Array as PropType<StepOptions[]>, default: () => [] },
    current: { type: Number, default: 0 },
    status: { type: String as PropType<StepStatus>, default: 'process' }
  },
  emits: ['change'],
  setup(props, { slots, emit }) {
    const steps = ref<StepItemState[]>([]);
    const { current, status } = toRefs(props);

    watch(current, (newVal, oldVal) => {
      emit('change', newVal, oldVal);
    });

    provide(stepsKey, {
      steps,
      current,
      status
    });

    watch(steps, steps => {
      steps.forEach((instance, index) => {
        instance.setIndex(index);
      });
    });

    return () => (
      <div class="ats-steps">
        {slots.default
          ? slots.default()
          : props.options.map(item => (
              <Step title={item.title} description={item.description}></Step>
            ))}
      </div>
    );
  }
});
