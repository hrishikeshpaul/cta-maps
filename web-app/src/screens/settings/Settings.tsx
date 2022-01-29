import { FunctionComponent } from 'react';

import { GeneralLoadSavedRoutes } from 'screens/settings/properties/general-load-saved-routes/GeneralLoadSavedRoutes';
import { Navigate, Route, Routes } from 'react-router-dom';
import { SettingsView } from 'screens/settings/settings-view/SettingsView';
import { GeneralLanguage } from 'screens/settings/properties/general-language/GeneralLanguage';
import { AppearanceTheme } from 'screens/settings/properties/appearance-theme/AppearanceTheme';

export const Settings: FunctionComponent = () => {
    return (
        <Routes>
            <Route index={true} element={<SettingsView />} />
            <Route path="routes" element={<GeneralLoadSavedRoutes />} />
            <Route path="language" element={<GeneralLanguage />} />
            <Route path="theme" element={<AppearanceTheme />} />
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
};
