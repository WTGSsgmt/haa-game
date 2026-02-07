import { Player, Theme, Vote } from './types';
import { THEMES } from '../data/themes';

export const getRandomTheme = (): Theme => {
    const randomIndex = Math.floor(Math.random() * THEMES.length);
    return THEMES[randomIndex];
};

export const shuffleArray = <T>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
};

// Update: assignRoles now assigns a THEME and an Act to each player.
// Argument 'theme' is removed or unused if we pick random for each.
export const assignRoles = (players: Player[]): Player[] => {
    return players.map((p) => {
        // Pick a random theme
        const theme = getRandomTheme();
        // Pick a random act from that theme
        const act = theme.acts[Math.floor(Math.random() * theme.acts.length)];

        return {
            ...p,
            assignedTheme: theme,
            assignedActId: act.id
        };
    });
};

export const calculateScores = (players: Player[], votes: Vote[]): Player[] => {
    const newPlayers = players.map(p => ({ ...p })); // Keep existing score
    // For this implementation let's assume 'score' tracks total game score. 
    // But here we might just return the *added* score or update the player object.
    // Let's simple add to existing score.

    // 1. Correct Guess: Voter gets 1 pt
    votes.forEach(vote => {
        const target = players.find(p => p.id === vote.targetPlayerId);
        // Check if target exists and if the guessed ID matches their assigned Act ID.
        // Since Acts are A-H, ID check is sufficient even if themes differ (A matches A).
        // BUT we should ensure we are checking the right context. 
        // The vote should probably carry context or we trust the ID match is enough.
        // (A in 'Haa' == A in 'Nande' for ID purposes 'A'). Correct.
        if (target && target.assignedActId === vote.guessedActId) {
            // Voter gets point
            const voterIndex = newPlayers.findIndex(p => p.id === vote.voterId);
            if (voterIndex >= 0) {
                newPlayers[voterIndex].score += 1;
            }
            // Target gets point (Acting point)
            const targetIndex = newPlayers.findIndex(p => p.id === vote.targetPlayerId);
            if (targetIndex >= 0) {
                newPlayers[targetIndex].score += 1;
            }
        }
    });

    return newPlayers;
};
