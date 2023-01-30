import React, { useState } from 'react';
import { useAppDispatch, useSelectedProperty } from '../../store';
import { setSelectedProperty } from '../../store/properties';
import { PageWithSidebar } from '../PageWithSidebar';
import { PropertiesList } from './PropertiesList';
import { PropertyDetails } from './PropertyDetails';

export const PropertiesPage: React.FC = () => {
    const selectedProperty = useSelectedProperty();

    const dispatch = useAppDispatch();

    const [isCreatingProperty, setIsCreatingProperty] = useState(false);
    const isDetailsOpen = isCreatingProperty || selectedProperty !== null;

    const handleCloseDetails = () => {
        setIsCreatingProperty(false);
        dispatch(setSelectedProperty(null));
    };

    const mainContent = (
        <PropertiesList />
    );

    const sidebarContent = (
        <PropertyDetails
            property={selectedProperty}
            isOpen={isDetailsOpen}
            onClose={handleCloseDetails}
        />
    );

    return (
        <PageWithSidebar
            mainContent={mainContent}
            sidebarContent={sidebarContent}
            isSidebarOpen={isDetailsOpen}
        />
    )
}
