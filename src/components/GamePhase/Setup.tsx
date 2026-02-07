import React from 'react';
import { Player } from '../../logic/types';
import { Button } from '../Button';

interface SetupProps {
    players: Player[];
    isHost: boolean;
    roomId: string;
    onStartGame: () => void;
}

export const Setup: React.FC<SetupProps> = ({ players, isHost, roomId, onStartGame }) => {
    return (
        <div className="flex flex-col h-full space-y-6 animate-fade-in p-4">
            <div className="text-center space-y-2 mt-4">
                <h2 className="text-3xl font-bold text-white">待機中...</h2>
                <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 inline-block">
                    <p className="text-xs text-slate-500 mb-1">Room ID</p>
                    <p className="text-4xl font-black text-white tracking-widest">{roomId}</p>
                </div>
                <p className="text-sm text-slate-400 mt-2">
                    {isHost ? '全員揃ったら開始してください' : 'ホストが開始するのを待っています'}
                </p>
            </div>

            <div className="flex-1 overflow-y-auto bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                <h3 className="text-slate-400 text-xs mb-3 font-bold uppercase tracking-wider">
                    参加者リスト ({players.length})
                </h3>
                <div className="space-y-2">
                    {players.map((player) => (
                        <div
                            key={player.id}
                            className="flex justify-between items-center bg-slate-700/50 p-3 rounded-lg border border-slate-600 animate-slide-in"
                        >
                            <span className="font-bold text-white">{player.name}</span>
                        </div>
                    ))}
                    {players.length === 0 && (
                        <p className="text-slate-500 text-center py-4">参加者を待っています...</p>
                    )}
                </div>
            </div>

            <div className="pb-4">
                {isHost && (
                    <Button onClick={onStartGame} disabled={players.length < 2} fullWidth>
                        ゲーム開始
                    </Button>
                )}
            </div>
        </div>
    );
};
