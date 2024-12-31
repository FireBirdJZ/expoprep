import { useEffect, useState } from 'react';

export default function useWaterFacts() {
    const [currentFact, setCurrentFact] = useState<string>('');

    const facts = [
        'Water covers 71% of the Earth’s surface.',
        'The average person uses 101 gallons of water per day.',
        'Only 3% of the Earth’s water is fresh.',
        'A human body is about 60% water.',
    ];

    useEffect(() => {
        setCurrentFact(facts[Math.floor(Math.random() * facts.length)]);
    }, []);

    return { currentFact };
}
