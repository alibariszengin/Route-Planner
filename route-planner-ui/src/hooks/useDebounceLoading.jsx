import { useEffect, useState } from 'react';

export function useDebouncedLoading(loading, delay = 300) {
    const [show, setShow] = useState(false);

    useEffect(() => {
        let timeout;

        if (loading) {
            timeout = setTimeout(() => setShow(true), delay); // gecikmeli göster
        } else {
            setShow(false); // hemen gizle
        }

        return () => clearTimeout(timeout);
    }, [loading, delay]);

    return show;
}