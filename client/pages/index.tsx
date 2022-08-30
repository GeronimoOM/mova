import type { NextPage } from 'next';
import { useState } from 'react';
import { NavBar, NavBarTab } from '../components/NavBar';
import { WordsPage } from '../components/WordsPage';
import { useSelectedLanguage } from '../store';

const Home: NextPage = () => {
    const [selectedTab, setSelectedTab] = useState<NavBarTab>('dictionary');
    const selectedLanguage = useSelectedLanguage();

    return (
        <div className='flex flex-row h-full'>
            <NavBar selectedTab={selectedTab} onSelectedTab={setSelectedTab} />
            {selectedLanguage && (
                <main className='w-full h-full'>
                    {selectedTab === 'dictionary' && <WordsPage />}
                </main>
            )}
        </div>
    );
};

export default Home;
