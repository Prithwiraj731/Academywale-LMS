'use client';

import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const morphyButtonVariants = cva(
  'group relative inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#20b2aa] disabled:pointer-events-none disabled:opacity-50 overflow-hidden [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 rounded-full cursor-pointer select-none',
  {
    variants: {
      variant: {
        default: 'border-transparent',
        secondary: 'border-[#20b2aa] bg-white',
        whatsapp: 'border-transparent bg-[#25D366]',
      },
      size: {
        default: 'h-10 px-6 py-2 text-sm sm:text-base',
        sm: 'h-8 px-5 text-xs',
        lg: 'h-12 px-10 text-base sm:text-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

const MorphyButton = React.forwardRef(
  (
    {
      className,
      size,
      variant = 'default',
      asChild = false,
      children,
      dotClassName,
      animate = 'normal',
      ...props
    },
    ref,
  ) => {
    const [isHovered, setIsHovered] = React.useState(false);
    const timeoutRef = React.useRef(null);
    const buttonSize = size || 'default';

    const handleTouchStart = () => {
      setIsHovered(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setIsHovered(false), 1500);
    };

    React.useEffect(() => {
      return () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      };
    }, []);

    const active = animate === 'reverse' ? !isHovered : isHovered;

    const userHasTextColor = className?.includes('text-');

    // Internal components to render inside the button/slot
    const internalContent = (
      <>
        <div
          className={cn(
            'absolute inset-0 transition-colors duration-700 ease-in-out rounded-[inherit]',
            variant === 'whatsapp'
              ? (active ? 'bg-green-50' : 'bg-[#25D366]')
              : (variant === 'secondary'
                  ? (active ? 'bg-[#20b2aa]' : 'bg-white')
                  : (active ? 'bg-teal-50' : 'bg-[#20b2aa]')),
          )}
        />
        <div
          className={cn(
            'absolute top-1/2 -translate-y-1/2 rounded-full transition-all duration-700 ease-in-out',
            variant === 'whatsapp'
              ? 'bg-[#25D366]'
              : (variant === 'secondary' && !active ? 'bg-white' : 'bg-[#20b2aa]'),
            'w-[200%] h-[200%] -left-full',
            buttonSize === 'sm' &&
              (active ? 'w-2 h-2 left-3' : 'w-[200%] h-[200%] -left-full'),
            buttonSize === 'default' &&
              (active ? 'w-2.5 h-2.5 left-3' : 'w-[200%] h-[200%] -left-full'),
            buttonSize === 'lg' &&
              (active ? 'w-3 h-3 left-4' : 'w-[200%] h-[200%] -left-full'),
            dotClassName,
          )}
        />
        <span
          className={cn(
            'relative z-10 font-bold transition-all duration-700 ease-in-out flex items-center justify-center gap-2',
            active ? 'translate-x-1.5' : 'translate-x-0',
            !userHasTextColor &&
              (variant === 'whatsapp'
                ? (active ? 'text-[#1cbd57]' : 'text-white')
                : (variant === 'secondary'
                    ? (active ? 'text-white' : 'text-[#20b2aa]')
                    : (active ? 'text-[#20b2aa]' : 'text-white'))),
          )}
        >
          {asChild && React.isValidElement(children) ? children.props.children : children}
        </span>
      </>
    );

    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(
        children,
        {
          ref,
          ...props,
          className: cn(
            morphyButtonVariants({ size, variant }),
            'transition-colors duration-700 ease-in-out border',
            variant === 'whatsapp'
              ? (active ? 'border-[#25D366]' : 'border-transparent')
              : (variant === 'secondary'
                  ? 'border-[#20b2aa]'
                  : (active ? 'border-[#20b2aa]' : 'border-transparent')),
            children.props.className,
            className,
          ),
          onMouseEnter: (e) => {
            setIsHovered(true);
            if (children.props.onMouseEnter) children.props.onMouseEnter(e);
          },
          onMouseLeave: (e) => {
            setIsHovered(false);
            if (children.props.onMouseLeave) children.props.onMouseLeave(e);
          },
          onTouchStart: (e) => {
            handleTouchStart();
            if (children.props.onTouchStart) children.props.onTouchStart(e);
          },
        },
        internalContent,
      );
    }

    return (
      <button
        ref={ref}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onTouchStart={handleTouchStart}
        className={cn(
          morphyButtonVariants({ size, variant }),
          'transition-colors duration-700 ease-in-out border',
          variant === 'whatsapp'
            ? (active ? 'border-[#25D366]' : 'border-transparent')
            : (variant === 'secondary'
                ? 'border-[#20b2aa]'
                : (active ? 'border-[#20b2aa]' : 'border-transparent')),
          className,
        )}
        {...props}
      >
        {internalContent}
      </button>
    );
  },
);

MorphyButton.displayName = 'MorphyButton';

export { MorphyButton, morphyButtonVariants };
