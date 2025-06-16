import { components, MenuProps, GroupBase } from 'react-select';
import { useEffect, useRef, useState } from 'react';

interface SortOption {
    value: string;
    label: string;
}
export const AnimatedMenu = (
    props: MenuProps<SortOption, false, GroupBase<SortOption>>
) => {
    const ref = useRef<HTMLDivElement>(null);
    const [animate, setAnimate] = useState(false);

    useEffect(() => {
        requestAnimationFrame(() => setAnimate(true));
    }, []);

    return (
        <components.Menu {...props}>
            <div
                ref={ref}
                style={{
                    opacity: animate ? 1 : 0,
                    transform: animate ? 'translateY(0)' : 'translateY(-10px)',
                    transition: 'opacity 0.3s ease, transform 0.3s ease',
                }}
            >
                {props.children}
            </div>
        </components.Menu>
    );
};