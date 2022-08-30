export interface WordSearchBarProps {
    query: string | null;
    onQueryChange: (query: string | null) => void;
}

export const WordSearchBar: React.FC<WordSearchBarProps> = ({ query, onQueryChange }) => {
    return (
        <input type='text' className=' block w-full p-2.5 bg-gray-50 border border-gray-300 
        text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500' 
        value={query ?? ''} 
        onChange={(e) => onQueryChange(e.target.value.length ? e.target.value : null)} />
    )
}

