import { useState } from 'react';
import { GameState, Vote } from '../logic/types';
import { assignRoles, calculateScores } from '../logic/gameOps';


const generateId = () => Math.random().toString(36).substr(2, 9);

export const useGame = () => {
    const [gameState, setGameState] = useState<GameState>({
        phase: 'SETUP',
        players: [],
        votes: [],
        currentPlayerIndex: 0,
    });

    const addPlayer = (name: string) => {
        setGameState(prev => ({
            ...prev,
            players: [...prev.players, { id: generateId(), name, score: 0 }],
        }));
    };

    const removePlayer = (id: string) => {
        setGameState(prev => ({
            ...prev,
            players: prev.players.filter(p => p.id !== id),
        }));
    };

    const startGame = () => {
        if (gameState.players.length < 2) return;
        // New: Assign random themes per player
        const playersWithRoles = assignRoles(gameState.players);
        setGameState(prev => ({
            ...prev,
            phase: 'ACTING',
            // currentTheme: theme, // Removed
            players: playersWithRoles,
            currentPlayerIndex: 0,
            votes: [],
        }));
    };

    // Phase 2: Turn-Based Acting & Voting
    // Flow: Acting (Player X) -> Voting (For Player X) -> Acting (Player X+1) ...

    // Call this when Actor finishes acting and everyone is ready to vote
    const startTurnVoting = () => {
        setGameState(prev => ({ ...prev, phase: 'VOTING' }));
    };

    // Call this when voting for the current actor is done
    const submitTurnVotes = (newVotes: Vote[]) => {
        setGameState(prev => {
            const allVotes = [...prev.votes, ...newVotes];
            // Check if this was the last player
            const nextIndex = prev.currentPlayerIndex + 1;

            if (nextIndex >= prev.players.length) {
                // Game Over -> Results
                const updatedPlayers = calculateScores(prev.players, allVotes);
                return {
                    ...prev,
                    votes: allVotes,
                    players: updatedPlayers,
                    phase: 'RESULTS',
                    currentPlayerIndex: 0
                };
            } else {
                // Next Player's Turn
                return {
                    ...prev,
                    votes: allVotes,
                    phase: 'ACTING',
                    currentPlayerIndex: nextIndex
                };
            }
        });
    };

    const resetGame = () => {
        setGameState(prev => ({
            ...prev,
            phase: 'SETUP',
            votes: [],
            currentPlayerIndex: 0,
            // phase: 'SETUP' // Removed duplicate
        }));
    };

    const nextRound = () => {
        const playersWithRoles = assignRoles(gameState.players);
        setGameState(prev => ({
            ...prev,
            phase: 'ACTING',
            players: playersWithRoles,
            currentPlayerIndex: 0,
            votes: [],
        }));
    };

    return {
        gameState,
        addPlayer,
        removePlayer,
        startGame,

        startTurnVoting,    // Go from Acting to Voting
        submitTurnVotes,    // Submit votes and go to next player/End
        nextRound,
        resetGame,
    };
};
