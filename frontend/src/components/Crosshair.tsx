import React, { useEffect, useState } from 'react';

interface CrosshairProps {
    color?: string;
    containerRef?: React.RefObject<HTMLElement | null>;
    targeted?: boolean;
}

const Crosshair: React.FC<CrosshairProps> = ({ color = '#ffffff', containerRef, targeted }) => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const container = containerRef?.current;
            if (container) {
                const rect = container.getBoundingClientRect();
                if (
                    e.clientX >= rect.left &&
                    e.clientX <= rect.right &&
                    e.clientY >= rect.top &&
                    e.clientY <= rect.bottom
                ) {
                    setIsVisible(true);
                    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
                } else {
                    setIsVisible(false);
                }
            } else {
                setIsVisible(true);
                setPosition({ x: e.clientX, y: e.clientY });
            }
        };

        const handleMouseLeave = () => {
            setIsVisible(false);
        };

        const targetElement = containerRef?.current || window;

        targetElement.addEventListener('mousemove', handleMouseMove as any);
        if (containerRef?.current) {
            containerRef.current.addEventListener('mouseleave', handleMouseLeave);
            containerRef.current.addEventListener('mouseenter', () => setIsVisible(true));
        }

        return () => {
            targetElement.removeEventListener('mousemove', handleMouseMove as any);
            if (containerRef?.current) {
                containerRef.current.removeEventListener('mouseleave', handleMouseLeave);
                containerRef.current.removeEventListener('mouseenter', () => setIsVisible(true));
            }
        };
    }, [containerRef]);

    if (!isVisible) return null;

    return (
        <div
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 9999,
                overflow: 'hidden'
            }}
        >
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: position.x,
                    width: '1px',
                    height: '100%',
                    backgroundColor: color,
                    opacity: 0.8,
                }}
            />
            <div
                style={{
                    position: 'absolute',
                    top: position.y,
                    left: 0,
                    width: '100%',
                    height: '1px',
                    backgroundColor: color,
                    opacity: 0.8,
                }}
            />
            {targeted && (
                <div
                    style={{
                        position: 'absolute',
                        top: position.y - 12,
                        left: position.x - 12,
                        width: '24px',
                        height: '24px',
                        border: `1.5px solid ${color}`,
                        borderRadius: '50%',
                        opacity: 1,
                    }}
                />
            )}
        </div>
    );
};

export default Crosshair;
