import React from 'react';
import { Button } from '../Button';
import { Player } from '../../logic/types';

interface ActingReferenceProps {
    actor: Player;
    myPlayerId: string;
    onNext: () => void;
}

export const ActingReference: React.FC<ActingReferenceProps> = ({ actor, myPlayerId, onNext }) => {
    const isMe = actor.id === myPlayerId;
    const theme = actor.assignedTheme;

    if (!theme) return null;

    return (
        <div className="flex flex-col h-full space-y-6 animate-fade-in pb-8">
            <div className="text-center pt-4">
                <p className="text-xs text-slate-500 mb-1">演技中</p>
                <h2 className="text-3xl font-bold text-pink-400">{actor.name}</h2>
                <div className="mt-2 text-xl font-bold text-white bg-slate-800 py-2 px-4 rounded-lg inline-block">
                    お題: {theme.title}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 px-1">
                <div className="grid grid-cols-2 gap-3">
                    {theme.acts.map(act => (
                        <div key={act.id} className="bg-slate-800/50 p-3 rounded-lg border border-slate-700 flex flex-col items-center justify-center text-center">
                            <div className="text-lg font-bold text-slate-300 mb-1">{act.id}</div>
                            <div className="text-xs text-slate-400">{act.label}</div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="pt-2 text-center">
                {isMe ? (
                    <Button onClick={onNext} className="w-full bg-pink-600 hover:bg-pink-700 shadow-lg shadow-pink-500/20">
                        演技終了 (投票へ)
                    </Button>
                ) : (
                    <div className="text-slate-400 animate-pulse bg-slate-800 py-3 rounded-lg">
                        演技しています... 注目してください
                    </div>
                )}
            </div>
        </div>
    );
};
