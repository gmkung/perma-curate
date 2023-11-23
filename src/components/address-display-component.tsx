import React from 'react';
import { references } from '@/utils/chains';  // Adjust the path according to your folder structure
import { chainColorMap, statusColorMap } from '@/utils/colorMappings'

interface AddressDisplayComponentProps {
    address: string;
}

const AddressDisplayComponent: React.FC<AddressDisplayComponentProps> = ({ address }) => {
    const parts = address.split(':');
    const keyForReference = `${parts[0]}:${parts[1]}`;
    const reference = references.find(ref => `${ref.namespaceId}:${ref.id}` === keyForReference);
    return (
        <div className="mt-1">
            {parts[2]+" "}
            <span className={`px-1 py-0 text-white rounded ${chainColorMap[keyForReference] || 'bg-gray-400'}`}>
                {reference?.label}
            </span>
        </div>
    );
};

export default AddressDisplayComponent;
