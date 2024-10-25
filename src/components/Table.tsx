import { useEffect, useState } from "react";
import Card from "./Card";

const Table = () => {
    const cards = ["C01", "C02", "C03", "C04", "C05", "C06", "C07", "C08", "C09", "C10", "CC1J", "CC2Q", "CC3K", "D01", "D02", "D03", "D04", "D05", "D06", "D07", "D08", "D09", "D10", "DC1J", "DC2Q", "DC3K", "H01", "H02", "H03", "H04", "H05", "H06", "H07", "H08", "H09", "H10", "HC1J", "HC2Q", "HC3K", "S01", "S02", "S03", "S04", "S05", "S06", "S07", "S08", "S09", "S10", "SC1J", "SC2Q", "SC3K"];

    const [playersCards, setPlayersCards] = useState<string[][]>([[],[],[],[]]);
    const [middleCards, setMiddleCards] = useState<string[]>([]);
    const [middleCardsCount, setMiddleCardsCount] = useState(3);
    const [winner, setWinner] = useState<string | null>(null);
    const [showBotCards, setShowBotCards] = useState(false);

    const [debug, setDebug] = useState("");

    useEffect(() => {
        const shuffledCards = [...cards].sort(() => Math.random() - 0.5);
        setPlayersCards([
            shuffledCards.slice(0, 2),
            shuffledCards.slice(2, 4),
            shuffledCards.slice(4, 6),
            shuffledCards.slice(6, 8),
        ]);
        setMiddleCards(shuffledCards.slice(8, 13));
    }, []);

    // TODO
    const fold = () => {};
    
    const check = () => {
        if (middleCardsCount === 4) {
            setMiddleCardsCount(middleCardsCount + 1);
            determineWinner();
            showBotsCards();
        } else if (middleCardsCount === 3) {
            setMiddleCardsCount(middleCardsCount + 1);
        }
    };

    // TODO
    const raise = () => {};

    const showBotsCards = () => {
        setShowBotCards(true);
    };

    const shuffle = (array: string[]) => {
        array.sort(() => Math.random() - 0.5);
        return array;
    }
    
    const replay = () => {
        const shuffledCards = shuffle(cards);
        setPlayersCards([
            shuffledCards.slice(0, 2),
            shuffledCards.slice(2, 4),
            shuffledCards.slice(4, 6),
            shuffledCards.slice(6, 8),
        ]);
        setMiddleCards(shuffledCards.slice(8, 13));
        setMiddleCardsCount(3);
        setWinner(null);
        setShowBotCards(false);
    };

const evaluateHand = (hand: string[]): { score: number; description: string } => {
    const values = hand.map(card => card.slice(1)); 
    let score = 0;
    let handType = "";

    const valueCounts = values.reduce((acc, value) => {
        acc[value] = (acc[value] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const counts = Object.values(valueCounts);
    if (counts.includes(2)) { 
        score = 100;
        handType = "Pair";
    } 
    if (counts.filter(count => count === 2).length === 2) { 
        score = 1000;
        handType = "Double pair";
    } 
    if (counts.includes(3)) { 
        score = 10000;
        handType = "Three of a kind";
    } 
    if (counts.includes(4)) {
        score = 100000;
        handType = "Four of a kind";
    } 
    if (handType === "") {
        handType = "High card";
    }

    for (const [value, count] of Object.entries(valueCounts)) {
        if (value === "C1J") {
            score += 11;
        } else if (value === "C2Q") {
            score += 12; 
        } else if (value === "C3K") {
            score += 13; 
        } else if (value === "C01") {
            score += 14; 
        } else {
            score += parseInt(value); 
        }
    }

    return { score, description: handType };
};

    const determineWinner = () => {
        const playersHand = playersCards.map(player => [...player, ...middleCards]);
        let highestScore = -1;
        let winningPlayerIndex = -1;

        playersHand.forEach((hand, index) => {
            const playerResult = evaluateHand(hand);
            console.log(`Player ${index + 1} hand: ${hand.join(', ')} - Score: ${playerResult.score} (${playerResult.description})`);
            
            if (playerResult.score > highestScore) {
                highestScore = playerResult.score;
                winningPlayerIndex = index;
            }
        });

        if (winningPlayerIndex !== -1) {
            setWinner(`Player ${winningPlayerIndex + 1} wins with a ${evaluateHand(playersHand[winningPlayerIndex]).description}`);
        }
    };

    return (
        <div className="relative w-full h-screen flex justify-center items-center">

            <div className="flex space-x-4 absolute top-1/2 transform -translate-y-1/2">
                {middleCards.slice(0, middleCardsCount).map((card, index) => (
                    <Card key={index} title={card} />
                ))}
                <p>{debug}</p>
            </div>

            <div className="flex space-x-4 absolute bottom-8">
                {playersCards[0].map((card, index) => (
                    <Card key={index} title={card} />
                ))}
            </div>

            <div className="flex flex-col space-y-4 absolute left-8 top-1/2 transform -translate-y-1/2">
                {playersCards[1].map((card, index) => (
                    <Card key={index} title={showBotCards ? card : "back"} /> 
                ))}
            </div>

            <div className="flex space-x-4 absolute top-8">
                {playersCards[2].map((card, index) => (
                    <Card key={index} title={showBotCards ? card : "back"} />
                ))}
            </div>

            <div className="flex flex-col space-y-4 absolute right-8 top-1/2 transform -translate-y-1/2">
                {playersCards[3].map((card, index) => (
                    <Card key={index} title={showBotCards ? card : "back"} />
                ))}
            </div>

            <div className="absolute bottom-16 flex space-x-4">
                <button onClick={check} className="px-4 py-2 bg-green-500 text-white rounded">Check</button>
                <button onClick={replay} className="px-4 py-2 bg-yellow-500 text-white rounded">New</button>
            </div>

            {winner && (
                <div className="absolute bottom-32 text-xl font-bold text-white bg-black px-4 py-2 rounded">
                    {winner}
                </div>
            )}
        </div>
    );
};

export default Table;