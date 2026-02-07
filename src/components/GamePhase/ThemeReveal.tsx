import React from 'react';
import { Player } from '../../logic/types';
import { Button } from '../Button';

interface ThemeRevealProps {
    actor: Player;
    onNext: () => void;
}

export const ThemeReveal: React.FC<ThemeRevealProps> = ({ actor, onNext }) => {
    const themeTitle = actor.assignedTheme?.title;

    return (
        <div className="flex flex-col h-full justify-center items-center space-y-8 animate-fade-in relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 pointer-events-none" />

            <div className="text-center space-y-4 z-10">
                <p className="text-slate-400 text-sm">現在のプレイヤー</p>
                <h2 className="text-4xl font-bold text-white mb-8">{actor.name}</h2>

                <div className="py-8">
                    <p className="text-slate-400 text-sm mb-2">今回のお題</p>
                    <div className="text-5xl font-black text-pink-500 tracking-wider p-4 bg-pink-500/10 rounded-2xl border border-pink-500/20 shadow-lg shadow-pink-500/20">
                        {themeTitle}
                    </div>
                </div>

                <p className="text-slate-500 text-sm max-w-xs mx-auto">
                    全員でお題を確認しましたか？<br />
                    次は演技者が役割（Act）を秘密裏に確認します。<br />
                    スマホを演技者に渡してください。
                </p>
            </div>

            <Button onClick={onNext} className="px-12 z-10">
                役割を確認する（本人へ）
            </Button>
        </div>
    );
};
