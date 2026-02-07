import { useState, useEffect } from 'react';
import { ref, set, onValue, update, get } from 'firebase/database';
import { db } from '../logic/firebase';
import { GameState, Player, Vote } from '../logic/types';
import { assignRoles, calculateScores } from '../logic/gameOps';

// Helper to generate a short room ID (e.g., 4 uppercase letters)
const generateRoomId = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = 0; i < 4; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};

// Helper to generate a player ID
const generatePlayerId = () => Math.random().toString(36).substr(2, 9);

export const useMultiplayerGame = () => {
    const [roomId, setRoomId] = useState<string | null>(null);
    const [myPlayerId, setMyPlayerId] = useState<string | null>(null);
    const [isHost, setIsHost] = useState(false);

    // Game State (Synced from Firebase)
    const [gameState, setGameState] = useState<GameState>({
        phase: 'SETUP',
        players: [],
        votes: [],
        currentPlayerIndex: 0,
    });

    // Create a new room
    const createRoom = async (playerName: string) => {
        const newRoomId = generateRoomId();
        const newPlayerId = generatePlayerId();

        const initialGameState: GameState = {
            phase: 'SETUP',
            players: [{ id: newPlayerId, name: playerName, score: 0 }],
            votes: [],
            currentPlayerIndex: 0,
        };

        await set(ref(db, `rooms/${newRoomId}`), {
            gameState: initialGameState,
            hostId: newPlayerId,
            createdAt: Date.now()
        });

        setRoomId(newRoomId);
        setMyPlayerId(newPlayerId);
        setIsHost(true);
    };

    // Join an existing room
    const joinRoom = async (roomIdInput: string, playerName: string) => {
        const rId = roomIdInput.toUpperCase();
        const roomRef = ref(db, `rooms/${rId}`);
        const snapshot = await get(roomRef);

        if (!snapshot.exists()) {
            throw new Error('Room not found');
        }

        const currentData = snapshot.val();
        // Check if game already started? (Optional constraint)

        const newPlayerId = generatePlayerId();
        const newPlayer: Player = { id: newPlayerId, name: playerName, score: 0 };

        const updatedPlayers = [...(currentData.gameState.players || []), newPlayer];

        await update(ref(db, `rooms/${rId}/gameState`), {
            players: updatedPlayers
        });

        setRoomId(rId);
        setMyPlayerId(newPlayerId);
        // Check if host (re-joining logic could go here, but for now assume new player is not host)
    };

    // Sync Game State
    useEffect(() => {
        if (!roomId) return;

        const gameRef = ref(db, `rooms/${roomId}/gameState`);
        const unsubscribe = onValue(gameRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                setGameState({
                    ...data,
                    votes: data.votes || []
                });
            }
        });

        return () => unsubscribe();
    }, [roomId]);


    // --- Game Actions (Only Host usually, or specific players) ---

    const startGame = () => {
        if (!roomId || !isHost) return;
        if (gameState.players.length < 2) return;

        const playersWithRoles = assignRoles(gameState.players);

        update(ref(db, `rooms/${roomId}/gameState`), {
            phase: 'ACTING',
            players: playersWithRoles,
            currentPlayerIndex: 0,
            votes: []
        });
    };



    // Called when the current actor finishes acting and we move to VOTING
    const startTurnVoting = () => {
        if (!roomId) return;
        // Ideally only host or current actor calls this
        update(ref(db, `rooms/${roomId}/gameState`), {
            phase: 'VOTING'
        });
    };

    // Called when a player submits a vote
    // Note: In multiplayer, we might want to wait for ALL votes.
    // This function needs to be smarter: "Submit MY vote".
    // We need a way to track *who* has voted in the turn.
    // For simplicity efficiently, let's append to votes. 
    // AND check if we have enough votes to proceed.

    // BUT `votes` in GameState is global history or current turn?
    // In types.ts `votes: Vote[]`. Usually strict history.
    // Let's assume we append.
    const submitMyVote = async (vote: Vote) => {
        if (!roomId) return;

        // We need to transact or just push?
        // Let's just update the list. Race conditions are possible but rare for 5 players.
        // Better: use a sub-collection for current turn votes if we want to be safe, 
        // but let's stick to the simple `update` of the whole array for now or use `runTransaction`.
        // To keep it simple: Read latest, append, write. (Or relies on single host logic).

        // Actually, let's just push to a "tempVotes" or similar?
        // Existing logic expects `votes` to contain everything.
        // Let's just Add the vote to the list.

        const currentVotes = gameState.votes || [];
        const updatedVotes = [...currentVotes, vote];

        await update(ref(db, `rooms/${roomId}/gameState`), {
            votes: updatedVotes
        });

        // CHECK if all needed votes are in.
        // Voters = Players - Actor.
        // Count votes for this specific turn (targetPlayerId == currentActorId)
        const currentActor = gameState.players[gameState.currentPlayerIndex];
        const votesForThisTurn = updatedVotes.filter(v =>
            v.targetPlayerId === currentActor.id &&
            // Maybe filter by "turn index"? Or just targetPlayer is enough for now if 1 round.
            // If multiple rounds, we need uniqueness. Assumes 1 round for now.
            true
        );

        const neededVotes = gameState.players.length - 1;

        if (votesForThisTurn.length >= neededVotes) {
            // Turn Complete -> Next Player or Results
            // Only Host should trigger this transition to avoid conflicts?
            // Or anyone who triggers the last vote.

            // Let's do it here.
            const nextIndex = gameState.currentPlayerIndex + 1;

            if (nextIndex >= gameState.players.length) {
                // Game Over
                const updatedPlayers = calculateScores(gameState.players, updatedVotes);
                await update(ref(db, `rooms/${roomId}/gameState`), {
                    phase: 'RESULTS',
                    players: updatedPlayers, // With scores
                    currentPlayerIndex: 0
                });
            } else {
                // Next Turn
                await update(ref(db, `rooms/${roomId}/gameState`), {
                    phase: 'ACTING', // Start new turn
                    currentPlayerIndex: nextIndex
                });
            }
        }
    };

    const nextRound = () => {
        if (!roomId || !isHost) return;
        // Reset for next game
        const playersWithRoles = assignRoles(gameState.players.map(p => ({ ...p, score: 0 }))); // Reset scores? Or keep?
        // Usually keep scores? Let's reset scores for "New Game"

        update(ref(db, `rooms/${roomId}/gameState`), {
            phase: 'ACTING',
            players: playersWithRoles,
            currentPlayerIndex: 0,
            votes: []
        });
    };

    const resetGame = () => {
        if (!roomId || !isHost) return;
        update(ref(db, `rooms/${roomId}/gameState`), {
            phase: 'SETUP',
            votes: [],
            currentPlayerIndex: 0
        });
    };


    return {
        gameState,
        roomId,
        myPlayerId,
        isHost,
        createRoom,
        joinRoom,
        startGame,
        startTurnVoting,
        submitMyVote, // Replaces submitTurnVotes (which handled logic locally)
        nextRound,
        resetGame
    };
};
