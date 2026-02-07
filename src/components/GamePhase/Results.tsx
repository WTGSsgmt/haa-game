import React from 'react';
import { Button } from '../Button';
import { Player, Vote } from '../../logic/types';

interface ResultsProps {
    players: Player[];
    votes: Vote[];
    onNextRound: () => void;
    onReset: () => void;
}

export const Results: React.FC<ResultsProps> = ({ players, votes, onNextRound, onReset }) => {
    // Sort players by score
    const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

    return (
        <div className="flex flex-col h-full space-y-6 animate-fade-in pb-8">
            <div className="text-center pt-4">
                <p className="text-slate-400 text-sm">結果発表</p>
                <h2 className="text-3xl font-black text-white">最終結果</h2>
            </div>

            <div className="flex-1 overflow-y-auto space-y-6 px-1">
                {/* Results List */}
                <div className="space-y-4">
                    {players.map(p => {
                        const assignedTheme = p.assignedTheme;
                        const assignedAct = assignedTheme?.acts.find(a => a.id === p.assignedActId);

                        // Who voted for this player correctly?
                        const correctVoters = votes
                            .filter(v => v.targetPlayerId === p.id && v.guessedActId === p.assignedActId)
                            .map(v => players.find(pl => pl.id === v.voterId)?.name);

                        return (
                            <div key={p.id} className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
                                <div className="flex justify-between items-start mb-2 border-b border-slate-700 pb-2">
                                    <div>
                                        <span className="font-bold text-lg text-white block">{p.name}</span>
                                        <span className="text-xs text-slate-400">{assignedTheme?.title}</span>
                                    </div>
                                    <span className="text-pink-400 font-bold text-xl ml-2 text-right">
                                        {assignedAct?.id}<br />
                                        <span className="text-sm font-normal text-white">{assignedAct?.label}</span>
                                    </span>
                                </div>
                                <div className="text-xs text-slate-400">
                                    正解者: {correctVoters.length > 0 ? correctVoters.join(', ') : 'なし'}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Scoreboard */}
                <div className="bg-slate-900/50 p-4 rounded-xl">
                    <h3 className="text-center text-slate-300 font-bold mb-3">現在のスコア</h3>
                    <div className="space-y-2">
                        {sortedPlayers.map((p, i) => (
                            <div key={p.id} className="flex justify-between items-center text-sm">
                                <div className="flex items-center gap-2">
                                    <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold
                     ${i === 0 ? 'bg-yellow-500 text-slate-900' : 'bg-slate-700 text-slate-400'}
`}>
                                        {i + 1}
                                    </span>
                                    <span>{p.name}</span>
                                </div>
                                <span className="font-bold text-pink-400">{p.score} pt</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex gap-4">
                <Button onClick={onReset} variant="secondary" className="flex-1">
                    タイトルへ
                </Button>
                <Button onClick={onNextRound} className="flex-1">
                    次のゲームへ
                </Button>
            </div>
        </div>
    );
};
