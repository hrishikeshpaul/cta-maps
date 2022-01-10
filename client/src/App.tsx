import { FC, useState } from 'react';

import { Center, Spinner } from '@chakra-ui/react';
import { LocaleProvider } from 'locale/LocaleProvider';
import { Content } from 'utils/Content';

import './App.scss';

export const App: FC = () => {
    const [loading, setLoading] = useState<boolean>(true);

    return (
        <div className="App">
            <LocaleProvider setSystemLoading={setLoading} />
            {loading ? (
                <Center>
                    <Spinner />
                </Center>
            ) : (
                <Content />
            )}
        </div>
    );
};
