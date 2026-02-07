import React, { useState } from 'react';
import { Button } from '../Button';
import { Player, Vote } from '../../logic/types';

interface VotingProps {
    voter: Player; // Yourself
    target: Player; // Actor
    hasVoted: boolean; // [NEW] Did I already vote?
    onSubmitVote: (vote: Vote) => void;
}

export const Voting: React.FC<VotingProps> = ({ voter, target, hasVoted, onSubmitVote }) => {
    const [selectedActId, setSelectedActId] = useState<string | null>(null);

    const theme = target.assignedTheme;
    if (!theme) return null;

    const acts = theme.acts;

    const handleSubmit = () => {
        if (!selectedActId) return;

        onSubmitVote({
            voterId: voter.id,
            targetPlayerId: target.id,
            guessedActId: selectedActId,
        });
    };

    if (hasVoted) {
        return (
            <div className="flex flex-col h-full justify-center items-center space-y-8 animate-fade-in p-4 text-center">
                <h2 className="text-2xl font-bold text-white">投票完了！</h2>
                <p className="text-slate-400">他のプレイヤーの投票を待っています...</p>
                <div className="animate-pulse text-4xl">⏳</div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full space-y-6 animate-fade-in pb-8">
            <div className="text-center pt-4">
                <h2 className="text-2xl font-bold text-white mb-1">投票タイム</h2>
                <p className="text-xs text-slate-500">{target.name}さんの演技は何だった？</p>
            </div>

            <div className="flex-1 overflow-y-auto space-y-6 px-1">
                <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 text-center">
                    <div className="mb-4">
                        <span className="text-slate-400 text-sm">お題</span>
                        <div className="font-bold text-xl text-white">{theme.title}</div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        {acts.map(act => {
                            const isSelected = selectedActId === act.id;
                            return (
                                <button
                                    key={act.id}
                                    onClick={() => setSelectedActId(act.id)}
                                    className={`
                      p-3 rounded-lg font-bold text-sm flex flex-col justify-center items-center transition-all border-2
                      ${isSelected
                                            ? 'bg-pink-500 border-pink-500 text-white shadow-lg shadow-pink-500/30'
                                            : 'bg-slate-700 border-slate-700 text-slate-300 hover:border-slate-500'}
                    `}
                                >
                                    <span className="text-lg block mb-1">{act.id}</span>
                                    <span className="text-xs opacity-80">{act.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            <Button onClick={handleSubmit} disabled={!selectedActId} fullWidth>
                投票を確定
            </Button>
        </div>
    );
};
