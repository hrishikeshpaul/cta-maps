import { ChangeEvent, FunctionComponent, useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';

import { IconButton, Input, InputGroup, InputRightElement, useColorModeValue } from '@chakra-ui/react';
import { BackArrowIcon, CloseIcon } from 'utils/Icons';
import useDebounce from 'utils/Hook';
import { useDataStore } from 'store/data/DataStore';
import { RouteExtended } from './RouteOption';
import { RouteSelect } from './RouteSelect';
import { BasePage } from 'utils/BasePage';

const LIMIT = 5;

export const RouteQuery: FunctionComponent = () => {
    const { t } = useTranslation();
    const [{ routes: currentRoutes }, { getRoutes }] = useDataStore();
    const [query, setQuery] = useState<string>('');
    const [routes, setRoutes] = useState<RouteExtended[]>([]);
    const debouncedQuery = useDebounce(query);
    const inputBg = useColorModeValue('gray.50', 'gray.600');

    const getFilter = () => {
        return Object.keys(currentRoutes)
            .map((route) => route)
            .join(',');
    };

    useEffect(() => {
        (async () => {
            if (debouncedQuery) {
                const filter = getFilter();
                const response = await getRoutes(debouncedQuery, filter, LIMIT, 1);

                if (response) {
                    setRoutes(response.map((route) => ({ ...route, selected: false })));
                }
            } else {
                setRoutes([]);
            }
        })();
    }, [debouncedQuery]); // eslint-disable-line

    return (
        <BasePage
            title=""
            constantPadding
            header={
                <InputGroup mt="2">
                    <IconButton
                        ml="-2"
                        fontSize="xl"
                        aria-label="back-button"
                        variant="ghost"
                        icon={<BackArrowIcon />}
                    />
                    {query && (
                        <InputRightElement>
                            <IconButton
                                variant="ghost"
                                aria-label="clear"
                                icon={<CloseIcon />}
                                size="sm"
                                fontSize="3xl"
                                color="gray.500"
                                onClick={() => setQuery('')}
                            />
                        </InputRightElement>
                    )}
                    <Input
                        autoFocus
                        border="0"
                        bg={inputBg}
                        name="query"
                        value={query}
                        placeholder={t('ROUTE_SEARCH_PLACEHOLDER')}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            setQuery(e.target.value);
                        }}
                    />
                </InputGroup>
            }
        >
            <RouteSelect routes={routes} query={query} getData={getRoutes} />
        </BasePage>
    );
};
