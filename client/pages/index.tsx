import type { NextPage } from 'next';
import Head from 'next/head'
import { useState } from 'react';
import { NavBar, NavBarTab } from '../components/NavBar';
import { WordsPage } from '../components/WordsPage';
import { useSelectedLanguage } from '../store';

const Home: NextPage = () => {
    const [selectedTab, setSelectedTab] = useState<NavBarTab>('dictionary');
    const selectedLanguage = useSelectedLanguage();

    return (
        <div>
            <Head>
                <title>Mova</title>
            </Head>
            <NavBar selectedTab={selectedTab} onSelectedTab={setSelectedTab} />
            {selectedLanguage && (
                <main className='ml-[15rem]'>
                    {selectedTab === 'dictionary' && <WordsPage />}
                </main>
            )}
        </div>
    );
};

export default Home;
