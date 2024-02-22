import { OpenFeatureProvider } from '@openfeature/react-sdk';
import { OpenFeature } from '@openfeature/web-sdk';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import useInitApp from 'hooks/useInitApp';
import router from 'navigation/Router';
import React, { StrictMode } from 'react';
import { RouterProvider } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { queryClient } from 'state/api/config';
import { openFeatureProvider } from './helpers/feature-flags';
import CWLoadingSpinner from './views/components/component_kit/new_designs/CWLoadingSpinner';

const Splash = () => {
  return (
    <div className="Splash">
      {/* This can be a moving bobber, atm it is still */}
      <CWLoadingSpinner />
    </div>
  );
};

OpenFeature.setProvider(openFeatureProvider);

const App = () => {
  const { customDomain, isLoading } = useInitApp();

  return (
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <OpenFeatureProvider client={undefined}>
          {isLoading ? (
            <Splash />
          ) : (
            <RouterProvider router={router(customDomain)} />
          )}
          <ToastContainer />
          <ReactQueryDevtools />
        </OpenFeatureProvider>
      </QueryClientProvider>
    </StrictMode>
  );
};

export default App;
