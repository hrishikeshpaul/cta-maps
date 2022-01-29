import { ChangeEvent, FunctionComponent, useEffect, useState } from 'react';

import { Box, Flex, IconButton, Input, InputGroup, InputRightElement, Text, useColorModeValue } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { RouteExtended } from 'search/RouteOption';
import { RouteSelect } from 'search/RouteSelect';
import { useDataStore } from 'store/data/DataStore';
import { BasePage } from 'utils/BasePage';
import useDebounce from 'utils/Hook';
import { BackArrowIcon, CloseIcon } from 'utils/Icons';

const LIMIT = 5;

export const RouteQuery: FunctionComponent = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [
        { routes: currentRoutes, searchHistory },
        { getRoutes, setSearchHistoryArray, setSearchHistoryItem, removeSearchHistoryItem },
    ] = useDataStore();
    const [query, setQuery] = useState<string>('');
    const [routes, setRoutes] = useState<RouteExtended[]>([]);
    const debouncedQuery = useDebounce(query.trim());
    const inputBg = useColorModeValue('gray.100', 'gray.600');
    const bg = useColorModeValue('gray.100', 'gray.500');

    const getFilter = () => {
        return Object.keys(currentRoutes)
            .map((route) => route)
            .join(',');
    };

    useEffect(() => {
        setSearchHistoryArray();
    }, []); // eslint-disable-line

    useEffect(() => {
        (async () => {
            if (debouncedQuery) {
                const filter = getFilter();
                const response = await getRoutes(debouncedQuery, filter, LIMIT, 1);

                if (response) {
                    setRoutes(response.map((route) => ({ ...route, selected: false })));
                }

                setSearchHistoryItem(debouncedQuery);
            } else {
                setSearchHistoryArray();
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
                        ml="-3"
                        mr="2"
                        fontSize="xl"
                        aria-label="back-button"
                        variant="ghost"
                        onClick={() => navigate(-1)}
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
            {query ? (
                <RouteSelect routes={routes} query={query} getData={getRoutes} />
            ) : (
                <Box px="4">
                    <Text fontSize="sm" fontWeight="600" opacity="0.6">
                        Previous Searches
                    </Text>
                    {searchHistory.map((history) => (
                        <Flex key={history} w="100%" alignItems="center">
                            <Text w="100%" onClick={() => setQuery(history)} _active={{ bg }} _hover={{ bg }} p="4">
                                {history}
                            </Text>
                            <IconButton
                                size="sm"
                                aria-label="delete-history"
                                variant="ghost"
                                fontSize="2xl"
                                mr="-2"
                                onClick={() => removeSearchHistoryItem(history)}
                                icon={<CloseIcon />}
                            />
                        </Flex>
                    ))}
                </Box>
            )}
        </BasePage>
    );
};
