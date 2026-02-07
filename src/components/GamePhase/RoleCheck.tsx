
import React, { useState } from 'react';
import { Button } from '../Button';
import { Player } from '../../logic/types';

interface RoleCheckProps {
    player: Player; // The Actor
    myPlayerId: string; // Me
    onNext: () => void;
}

export const RoleCheck: React.FC<RoleCheckProps> = ({ player, myPlayerId, onNext }) => {
    const [revealed, setRevealed] = useState(false);
    const isMe = player.id === myPlayerId;

    const assignedAct = player.assignedTheme?.acts.find(a => a.id === player.assignedActId);
    const themeTitle = player.assignedTheme?.title;

    if (!isMe) {
        return (
            <div className="flex flex-col h-full space-y-4 animate-fade-in p-4">
                <div className="text-center space-y-2">
                    <p className="text-sm text-slate-400">
                        {player.name}さんが役割を確認中...
                    </p>
                    <h2 className="text-2xl font-bold text-pink-400">
                        お題: {themeTitle}
                    </h2>
                </div>

                <div className="flex-1 overflow-y-auto">
                    <div className="grid grid-cols-2 gap-3">
                        {player.assignedTheme?.acts.map(act => (
                            <div key={act.id} className="bg-slate-800/50 p-3 rounded-lg border border-slate-700 flex flex-col items-center justify-center text-center opacity-70">
                                <div className="text-lg font-bold text-slate-300 mb-1">{act.id}</div>
                                <div className="text-xs text-slate-400">{act.label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="text-center text-xs text-slate-500 animate-pulse">
                    演技の準備ができるまでお待ちください
                </div>
            </div>
        );
    }

    if (!revealed) {
        return (
            <div className="flex flex-col h-full justify-center items-center space-y-8 animate-fade-in">
                <div className="text-center space-y-4">
                    <p className="text-red-400 font-bold bg-red-900/30 px-4 py-2 rounded-full border border-red-500/30">
                        あなたの番です
                    </p>
                    <div className="text-4xl font-bold text-white mb-4">{player.name}</div>
                    <p className="text-slate-400 text-sm">
                        お題: 「{themeTitle}」<br />
                        役割を確認してください。
                    </p>
                </div>
                <Button onClick={() => setRevealed(true)} className="px-12">
                    確認する
                </Button>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full justify-center items-center space-y-8 animate-fade-in relative overflow-hidden">
            <div className="text-center space-y-2 z-10 w-full px-4">
                <p className="text-slate-400">あなたのお題</p>
                <h2 className="text-3xl font-bold text-pink-400 mb-6">{themeTitle}</h2>

                <div className="bg-slate-800 p-8 rounded-2xl shadow-2xl border border-slate-700 w-full max-w-sm mx-auto transform transition-all hover:scale-105">
                    <div className="text-6xl font-black text-white mb-4">{assignedAct?.id}</div>
                    <div className="text-xl font-bold text-pink-300">{assignedAct?.label}</div>
                </div>

                <p className="text-slate-500 text-sm mt-8">
                    確認したら「演技開始」を押してください
                </p>
            </div>

            <Button onClick={onNext} className="w-full max-w-xs z-10" variant="primary">
                演技開始
            </Button>
        </div>
    );
};
