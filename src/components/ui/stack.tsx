import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const stackVariants = cva('flex', {
  variants: {
    justifyContent: {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
      between: 'justify-between',
      evenly: 'justify-evenly',
      around: 'justify-around',
      stretch: 'justify-stretch',
    },
    alignItems: {
      start: 'items-start',
      center: 'items-center',
      end: 'items-end',
      baseline: 'items-baseline',
      stretch: 'items-stretch',
    },
    direction: {
      row: 'flex-row',
      rowReverse: 'flex-row-reverse',
      column: 'flex-col',
      columnReverse: 'flex-col-reverse',
    },
  },
  defaultVariants: {
    direction: 'column',
  },
});

const Stack = React.forwardRef<
  React.ElementRef<'div'>,
  React.ComponentProps<'div'> &
    VariantProps<typeof stackVariants> & {
      spacing?: number;
      divider?: boolean;
    }
>(
  (
    { className, justifyContent, alignItems, direction = 'column', divider, spacing, ...props },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        data-slot="stack"
        className={cn(
          stackVariants({
            justifyContent,
            alignItems,
            direction,
            className,
          }),
          spacing && `gap-${spacing}`,
          divider && {
            'divide-y': direction === 'column' || direction === 'columnReverse',
            'divide-x': direction === 'row' || direction === 'rowReverse',
          },
        )}
        {...props}
      />
    );
  },
);

export { Stack, stackVariants };
