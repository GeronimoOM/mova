import type { NextPage } from 'next';
import { Button } from '../components/Button';
import { WordList } from '../components/WordList';
import { words } from '../data/words';

const Home: NextPage = () => {
    return (
        <div>
            <WordList words={words} selected={null} onSelect={() => {}} isLoading={false} isError={false} />
            <Button text='Save' onClick={() => console.log('Clicked')} />
        </div>
    );
};

export default Home;
