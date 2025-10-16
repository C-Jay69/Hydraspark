
import React from 'react';

const ScrollArea = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={`overflow-auto ${className}`}
      {...props}
    />
  );
});

ScrollArea.displayName = 'ScrollArea';

export { ScrollArea };
