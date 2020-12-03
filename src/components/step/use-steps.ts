import { computed, ref } from 'vue';

interface StepsOptions {
  range: number[];
  nextValidate: () => Promise<any>;
  onFinished?: () => {};
}

export function useSteps({
  range,
  nextValidate = async () => true,
  onFinished,
}: StepsOptions) {
  const currentStep = ref(range[0]);
  const currentStatus = computed(() => {
    if (currentStep.value === range[0]) {
      return 'start';
    } else if (currentStep.value === range[1]) {
      return 'finish';
    } else {
      return 'process';
    }
  });

  const stepChange = (num: number) => {
    const result = currentStep.value + num;

    if (result >= range[0] && result <= range[1]) {
      currentStep.value = result;
    }
  };

  const dealValidate = async <T>(
    callback: T extends Function ? T : () => any
  ) => {
    const valid = await nextValidate();

    if (valid) {
      callback();
      return valid;
    }
  };

  const prev = () => {
    stepChange(-1);
  };
  const next = () => {
    dealValidate(() => {
      if (currentStatus.value === 'finish') {
        onFinished && onFinished();
      } else {
        stepChange(1);
      }
    });
  };

  return {
    currentStep,
    currentStatus,
    stepChange,
    prev,
    next,
  };
}
