import React, { useState, useEffect } from 'react';
import { Player, Vote } from '../../logic/types';
import { ThemeReveal } from './ThemeReveal';
import { RoleCheck } from './RoleCheck';
import { ActingReference } from './ActingReference';
import { Voting } from './Voting';

interface TurnFlowProps {
    actor: Player;
    players: Player[]; // All players
    myPlayerId: string;
    votes: Vote[]; // Global votes from GameState
    phase: 'ACTING' | 'VOTING'; // Global Phase from GameState
    onStartVoting: () => void; // Trigger to move to voting phase
    onSubmitVote: (vote: Vote) => void;
}

type SubPhase = 'THEME_REVEAL' | 'ROLE_CHECK' | 'ACTING';

export const TurnFlow: React.FC<TurnFlowProps> = ({
    actor,
    players,
    myPlayerId,
    votes,
    phase,
    onStartVoting,
    onSubmitVote
}) => {
    // Local state for the 'ACTING' sub-phases.
    const [localPhase, setLocalPhase] = useState<SubPhase>('THEME_REVEAL');

    // Reset local phase when actor changes
    useEffect(() => {
        setLocalPhase('THEME_REVEAL');
    }, [actor.id]);

    const handleRevealNext = () => setLocalPhase('ROLE_CHECK');
    const handleRoleCheckNext = () => setLocalPhase('ACTING');
    const handleFinishActing = () => {
        onStartVoting();
    };

    const myVote = (votes || []).find(v => v.voterId === myPlayerId && v.targetPlayerId === actor.id);
    const hasVoted = !!myVote;

    // --- RENDER LOGIC ---

    // 1. If Global Phase is VOTING, everyone (except actor?) is Voting.
    if (phase === 'VOTING') {
        const isMe = actor.id === myPlayerId;

        if (isMe) {
            return (
                <div className="flex flex-col h-full justify-center items-center space-y-8 animate-fade-in p-4 text-center">
                    <h2 className="text-2xl font-bold text-white">投票タイム</h2>
                    <p className="text-slate-400">みんなが投票しています...</p>
                    <div className="animate-pulse text-4xl">🗳️</div>
                </div>
            );
        }

        // Check if I am a player (spectators?)
        const me = players.find(p => p.id === myPlayerId);
        if (!me) return <div>Spectating...</div>;

        return (
            <Voting
                voter={me}
                target={actor}
                hasVoted={hasVoted}
                onSubmitVote={onSubmitVote}
            />
        );
    }

    // 2. If Global Phase is ACTING, we go through the local sequence.

    if (localPhase === 'THEME_REVEAL') {
        return <ThemeReveal actor={actor} onNext={handleRevealNext} />;
    }

    if (localPhase === 'ROLE_CHECK') {
        return <RoleCheck player={actor} myPlayerId={myPlayerId} onNext={handleRoleCheckNext} />;
    }

    if (localPhase === 'ACTING') {
        return <ActingReference actor={actor} myPlayerId={myPlayerId} onNext={handleFinishActing} />;
    }

    return null;
};
