// hooks/useEnergyContext.ts
import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';

interface EnergyData {
    id: number;
    timestamp: string;
    local_time: string;
    fridge_kwh: number;
    oven_kwh: number;
    lights_kwh: number;
    ev_charger_kwh: number;
}

interface EnergyContextType {
    data: EnergyData[] | null;
    loading: boolean;
    error: string | null;
    selectedTimezone: string;
    updateTimezone: (newTimezone: string) => Promise<void>;
    refreshData: () => Promise<void>;
}

const EnergyContext = createContext<EnergyContextType | undefined>(undefined);

export function EnergyProvider({ children }: { children: React.ReactNode }) {
    const [data, setData] = useState<EnergyData[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedTimezone, setSelectedTimezone] = useState<string>(
        Intl.DateTimeFormat().resolvedOptions().timeZone
    );

    const fetchData = useCallback(async (timezone: string) => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(
                `https://expoprep.onrender.com/data?timezone=${timezone}`
            );
            const result = await response.json();

            if (result.success) {
                setData(result.data);
            } else {
                setError(result.message || 'Failed to fetch data');
            }
        } catch (err) {
            setError('Failed to fetch data. Please try again.');
        } finally {
            setLoading(false);
        }
    }, []);

    // Initial data fetch
    useEffect(() => {
        fetchData(selectedTimezone);
    }, []);

    const updateTimezone = useCallback(async (newTimezone: string) => {
        setSelectedTimezone(newTimezone);
        await fetchData(newTimezone);
    }, [fetchData]);

    const refreshData = useCallback(async () => {
        await fetchData(selectedTimezone);
    }, [fetchData, selectedTimezone]);

    const value = useMemo(() => ({
        data,
        loading,
        error,
        selectedTimezone,
        updateTimezone,
        refreshData
    }), [data, loading, error, selectedTimezone, updateTimezone, refreshData]);

    return (
        <EnergyContext.Provider value={value}>
            {children}
            </EnergyContext.Provider>
    );
}

export function useEnergy() {
    const context = useContext(EnergyContext);
    if (context === undefined) {
        throw new Error('useEnergy must be used within an EnergyProvider');
    }
    return context;
}