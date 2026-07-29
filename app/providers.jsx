"use client";

import { ProgressProvider } from "@bprogress/next/app";

export const Providers = ({ children }) => {
    return (
        <>
            <ProgressProvider height="4px" color="#00FFFF" options={{ showSpinner: false }} shallowRouting>
                {children}
            </ProgressProvider>
        </>
    );
};
