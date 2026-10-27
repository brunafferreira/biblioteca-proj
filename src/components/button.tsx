import type { ButtonHTMLAttributes } from 'react';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'subtle' | 'icon';
};

const variantClasses = {
  primary: 'add-button',
  subtle: 'logout-button',
  icon: 'delete-button',
} as const;

export function Button({ variant = 'primary', className = '', ...props }: ButtonProps) {
  const classes = [variantClasses[variant], className].filter(Boolean).join(' ');
  return <button className={classes} {...props} />;
}
