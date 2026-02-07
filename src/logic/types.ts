import { Theme, Act } from '../data/themes';
export type { Theme, Act };

export type PlayerId = string;

export interface Player {
    id: PlayerId;
    name: string;
    assignedActId?: string; // Which act (A-H) they are assigned
    assignedTheme?: Theme; // [NEW] Each player has their own theme
    score: number;
}

export interface Vote {
    voterId: PlayerId;
    targetPlayerId: PlayerId;
    guessedActId: string;
}

export type GamePhase =
    | 'SETUP'
    | 'ROLE_ASSIGNMENT'
    | 'ACTING'
    | 'VOTING'
    | 'RESULTS';

export interface GameState {
    phase: GamePhase;
    players: Player[];
    currentTheme?: Theme;
    votes: Vote[];
    currentPlayerIndex: number; // For turn-based phases
}
