import { useEffect, useState } from "react";
import Card from "./Card";

const SimplePoker = () => {
    const [playersCards, setPlayersCards] = useState<string[][]>([[], []]);
    const [showBotCards, setShowBotCards] = useState(false);
    const [clickedCards, setClickedCards] = useState<boolean[]>([]);
    const [drawCount, setDrawCount] = useState(0);
    const [debug, setDebug] = useState("");
    const [showPopup, setShowPopup] = useState(false);
    const [helpPopup, setHelpPopup] = useState(false); // State for help popup

    const cards = [
        "C01", "C07", "C08", "C09", "C10",
        "CC1J", "CC2Q", "CC3K", "D01", "D07",
        "D08", "D09", "D10", "DC1J", "DC2Q",
        "DC3K", "H01", "H07", "H08", "H09",
        "H10", "HC1J", "HC2Q", "HC3K", "S01",
        "S07", "S08", "S09", "S10", "SC1J",
        "SC2Q", "SC3K"
    ];

    const initializeGame = () => {
        const shuffledCards = [...cards].sort(() => Math.random() - 0.5);
        setPlayersCards([shuffledCards.slice(0, 4), shuffledCards.slice(4, 8)]);
        setClickedCards(new Array(4).fill(false));
        setDrawCount(0);
        setDebug("");
        setShowBotCards(false);
        setShowPopup(false);
        setHelpPopup(false); // Reset help popup state
    };

    useEffect(() => {
        initializeGame();
    }, []);

    const handleClick = (index: number) => {
        setClickedCards(prev => {
            const newClickedCards = [...prev];
            newClickedCards[index] = !newClickedCards[index];
            return newClickedCards;
        });
    };

    const drawNewCards = () => {
        if (drawCount >= 3) {
            toggleBotCards();
            determineWinner();
            return;
        }

        const usedCards = [...playersCards[0], ...playersCards[1]];
        const remainingCards = cards.filter(card => !usedCards.includes(card));
        const shuffledRemainingCards = [...remainingCards].sort(() => Math.random() - 0.5);
        const newPlayerCards = playersCards[0].map((card, index) => (
            clickedCards[index] ? card : shuffledRemainingCards.pop() || card
        ));
        
        setPlayersCards([newPlayerCards, playersCards[1]]);
        setDrawCount(drawCount + 1);
    };

    const toggleBotCards = () => {
        setShowBotCards(prev => !prev);
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
        if (counts.includes(4)) {
            score = 100000;
            handType = "Four of a kind";
        } else if (counts.includes(3)) {
            score = 10000;
            handType = "Three of a kind";
        } else if (counts.filter(count => count === 2).length === 2) {
            score = 1000;
            handType = "Double pair";
        } else if (counts.includes(2)) {
            score = 100;
            handType = "Pair";
        } else {
            handType = "High card";
        }

        const getValueScore = (value: string): number => {
            if (value === "01") return 14;
            else if (value === "C3K") return 13;
            else if (value === "C2Q") return 12;
            else if (value === "C1J") return 11;
            return parseInt(value, 10);
        };

        const highestCardValue = Math.max(...values.map(getValueScore));
        score += highestCardValue;

        return { score, description: handType };
    };

    const determineWinner = () => {
        toggleBotCards();
        const playerResult = evaluateHand(playersCards[0]);
        const botResult = evaluateHand(playersCards[1]);

        let resultMessage = `Player: ${playerResult.description} | `;
        resultMessage += `Bot: ${botResult.description} — `;

        if (playerResult.score > botResult.score) {
            resultMessage += "Player wins!";
        } else if (playerResult.score < botResult.score) {
            resultMessage += "Bot wins!";
        } else {
            resultMessage += "It's a tie!";
        }

        setDebug(resultMessage);
        setShowPopup(true);
    };

    const resetGame = () => {
        initializeGame();
    };

    const toggleHelpPopup = () => {
        setHelpPopup(prev => !prev);
    };

    return (
        <div className="h-screen">
            <div className="flex space-x-4 top-8">
                {playersCards[1].map((card, index) => (
                    <div onClick={determineWinner} key={index}>
                        <Card title={showBotCards ? card : "back"} />
                    </div>
                ))}
            </div>

            <div className="flex space-x-4 bottom-8 mt-10">
                {playersCards[0].map((card, index) => (
                    <div 
                        key={index} 
                        onClick={() => handleClick(index)}
                        className={clickedCards[index] ? "opacity-50" : ""}
                    >
                        <Card title={card} />
                    </div>
                ))}
            </div>
            <div>
                <button onClick={drawNewCards} className="mt-4 p-2 mr-10 bg-green-500 text-white rounded">
                    Draw
                </button>
                <button onClick={resetGame} className="mt-4 p-2 mr-10 bg-purple-500 text-white rounded">
                    Rejouer
                </button>
                <button onClick={toggleHelpPopup} className="mt-4 p-2 bg-blue-500 text-white rounded">
                    Help
                </button>
            </div>

            {showPopup && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-xl font-bold mb-4">Game Result</h2>
                        <p>{ debug}</p>
                        <button 
                            onClick={() => setShowPopup(false)} 
                            className="mt-4 p-2 bg-blue-500 text-white rounded"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            {helpPopup && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-xl font-bold mb-4">Help</h2>
                        <p>In this game, you can lock cards by clicking on them. Locked cards will not be changed during the drawing phase.</p>
                        <p>You can also click on your opponent's cards to compare them with your own.</p>
                        <button 
                            onClick={toggleHelpPopup} 
                            className="mt-4 p-2 bg-blue-500 text-white rounded"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SimplePoker;