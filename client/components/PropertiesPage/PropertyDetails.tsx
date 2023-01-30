import React, { FC } from 'react'
import { Property } from '../../types';

export interface PropertyDetailsProps {
    property: Property | null;
    isOpen: boolean;
    onClose: () => void;
    
}

export const PropertyDetails: FC<PropertyDetailsProps> = ({
    property,
    isOpen,
    onClose,
}) => {
    return (
        <div className='h-full bg-gray-700 flex flex-col items-stretch p-6 space-y-6'>
            {property?.name}
        </div>
    );
}