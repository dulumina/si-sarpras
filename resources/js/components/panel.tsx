import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type PanelProps = {
    title?: ReactNode;
    description?: ReactNode;
    actions?: ReactNode;
    children: ReactNode;
    className?: string;
    bodyClassName?: string;
};

export default function Panel({
    title,
    description,
    actions,
    children,
    className,
    bodyClassName,
}: PanelProps) {
    return (
        <section
            className={cn(
                'overflow-hidden rounded-2xl border border-border bg-card shadow-sm',
                className,
            )}
        >
            {(title || actions) && (
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4 sm:px-6">
                    <div className="min-w-0">
                        {title && (
                            <h2 className="text-base font-semibold text-foreground">
                                {title}
                            </h2>
                        )}
                        {description && (
                            <p className="mt-0.5 text-sm text-muted-foreground">
                                {description}
                            </p>
                        )}
                    </div>
                    {actions && (
                        <div className="flex flex-wrap items-center gap-2">
                            {actions}
                        </div>
                    )}
                </div>
            )}
            <div className={cn('p-5 sm:p-6', bodyClassName)}>{children}</div>
        </section>
    );
}
