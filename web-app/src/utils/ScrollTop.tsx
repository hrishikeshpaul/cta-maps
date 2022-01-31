import { FC, useEffect } from 'react';

import { useSystemStore } from 'store/system/SystemStore';

export const ScrollTop: FC = () => {
    const [, { setUIScrollTop }] = useSystemStore();

    useEffect(() => {
        document.addEventListener('scroll', () => {
            const scrolled = document.scrollingElement?.scrollTop;
            setUIScrollTop(scrolled);
        });

        return () => {
            document.removeEventListener('scroll', () => {
                setUIScrollTop(0);
            });
        };
    }, []);
    return <></>;
};
