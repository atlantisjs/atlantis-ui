import type { Placement, PositioningStrategy, Instance as PopperInstance, Options } from '@popperjs/core'

export type { Placement, PositioningStrategy, PopperInstance, Options };

export type TriggerType = 'click' | 'hover' | 'focus' | 'manual';

export type Trigger = TriggerType | TriggerType[];
