import React, { useState } from 'react';
import { Button } from './Button';

interface LobbyProps {
    onCreateRoom: (playerName: string) => void;
    onJoinRoom: (roomId: string, playerName: string) => void;
}

export const Lobby: React.FC<LobbyProps> = ({ onCreateRoom, onJoinRoom }) => {
    const [name, setName] = useState('');
    const [roomId, setRoomId] = useState('');
    const [mode, setMode] = useState<'MENU' | 'JOIN'>('MENU');

    const handleCreate = () => {
        if (!name) return;
        onCreateRoom(name);
    };

    const handleJoin = async () => {
        if (!name || !roomId) return;
        try {
            await onJoinRoom(roomId, name);
        } catch (e) {
            alert('その部屋は存在しません、またはエラーが発生しました');
            console.error(e);
        }
    };

    return (
        <div className="flex flex-col h-full justify-center items-center space-y-8 animate-fade-in p-4">
            <div className="text-center space-y-2">
                <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-violet-500">
                    Haa Game
                </h1>
                <p className="text-slate-400">Online Multiplayer</p>
            </div>

            <div className="w-full max-w-xs space-y-4">
                <div>
                    <label className="block text-xs text-slate-500 mb-1 ml-1">プレイヤー名</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="あなたの名前"
                        className="w-full bg-slate-800 border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-pink-500 outline-none transition-all"
                    />
                </div>

                {mode === 'MENU' && (
                    <div className="space-y-3 pt-4">
                        <Button
                            onClick={handleCreate}
                            disabled={!name}
                            fullWidth
                            className="bg-gradient-to-r from-pink-500 to-purple-600"
                        >
                            ルームを作成
                        </Button>
                        <Button
                            onClick={() => setMode('JOIN')}
                            disabled={!name}
                            variant="secondary"
                            fullWidth
                        >
                            ルームに参加
                        </Button>
                    </div>
                )}

                {mode === 'JOIN' && (
                    <div className="space-y-3 pt-4 animate-fade-in">
                        <div>
                            <label className="block text-xs text-slate-500 mb-1 ml-1">ルームID</label>
                            <input
                                type="text"
                                value={roomId}
                                onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                                placeholder="ABCD"
                                maxLength={4}
                                className="w-full bg-slate-800 border-slate-700 rounded-lg p-3 text-center text-2xl font-bold tracking-widest text-white focus:ring-2 focus:ring-blue-500 outline-none uppercase"
                            />
                        </div>
                        <Button onClick={handleJoin} disabled={!name || roomId.length < 4} fullWidth>
                            参加する
                        </Button>
                        <button
                            onClick={() => setMode('MENU')}
                            className="text-slate-500 text-sm hover:text-white w-full py-2"
                        >
                            戻る
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
