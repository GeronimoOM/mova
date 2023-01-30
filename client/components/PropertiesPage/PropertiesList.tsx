import React, { FC, useState } from 'react';
import { useAppDispatch, useIsFetchingProperties, useProperties } from '../../store';
import { setSelectedProperty } from '../../store/properties';
import { PartOfSpeech, Property } from '../../types';

export const PropertiesList: FC = () => {
    const [selectedPartOfSpeech, setSelectedPartOfSpeech] = useState<PartOfSpeech | undefined>();
    const properties = useProperties(selectedPartOfSpeech);
    const isLoading = useIsFetchingProperties();
    const dispatch = useAppDispatch();

    return (
        <div className='h-screen flex flex-col items-center overflow-y-scroll'>
            <div className='w-full max-w-[60rem] px-3'>
                {properties.map((property) => (
                    <PropertyCard key={property.id} property={property} 
                        onClick={(property) => dispatch(setSelectedProperty(property.id))}/>
                ))}
            </div>
        </div>
    );
}

interface PropertyCardProps {
    property: Property;
    onClick: (property: Property) => void;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, onClick }) => {
    return (
        <div className='h-32 m-1 p-2 bg-gray-700 text-white flex flex-row'
            onClick={() => onClick(property)}
        >
            {property.name}
                   
            
        </div>
    )
}
