import { components, MenuProps } from 'react-select';
import { useEffect, useRef, useState } from 'react';

export const AnimatedMenu = <
  Option,
  IsMulti extends boolean = false
>(
  props: MenuProps<Option, IsMulti>
) => {
  const ref = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(true);
  const [visible, setVisible] = useState(false);

  // Анимация появления
  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  // Плавное исчезновение и задержка размонтирования
  useEffect(() => {
    if (!props.selectProps.menuIsOpen) {
      setVisible(false);
      const timer = setTimeout(() => setMounted(false), 400); // match transition
      return () => clearTimeout(timer);
    } else {
      setMounted(true);
      requestAnimationFrame(() => setVisible(true)); // снова показать при повторном открытии
    }
  }, [props.selectProps.menuIsOpen]);

  if (!mounted) return null;

  return (
    <components.Menu {...props}>
      <div
        ref={ref}
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(-10px)',
          transition: 'opacity 0.4s ease, transform 0.4s ease',
        }}
      >
        {props.children}
      </div>
    </components.Menu>
  );
};
