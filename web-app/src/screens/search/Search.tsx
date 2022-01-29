import { Fragment, FunctionComponent, ReactFragment } from 'react';

import { Navigate, Route, Routes } from 'react-router-dom';

import { RouteQuery } from 'screens/search/route-query/RouteQuery';
import { SearchView } from 'screens/search/search-view/SearchView';

export const Search = () => {
    return (
        <Routes>
            <Route index={true} element={<SearchView />} />
            <Route path="query" element={<RouteQuery />} />
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
};
