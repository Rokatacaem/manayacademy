
import { ButtonHTMLAttributes, forwardRef } from 'react'
import { clsx } from 'clsx'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive'
    size?: 'sm' | 'md' | 'lg'
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={clsx(
                    'btn',
                    {
                        'btn-primary': variant === 'primary',
                        'btn-destructive': variant === 'destructive',
                        // Add other variants as needed based on globals.css
                    },
                    className
                )}
                {...props}
            />
        )
    }
)
Button.displayName = 'Button'

export { Button }
