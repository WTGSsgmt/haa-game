
import { useMultiplayerGame } from './hooks/useMultiplayerGame';
import { Layout } from './components/Layout';
import { Lobby } from './components/Lobby';
import { Setup } from './components/GamePhase/Setup';
import { TurnFlow } from './components/GamePhase/TurnFlow';
import { Results } from './components/GamePhase/Results';

function App() {
  const {
    gameState,
    roomId,
    myPlayerId,
    isHost,
    createRoom,
    joinRoom,
    startGame,
    startTurnVoting,
    submitMyVote,
    nextRound,
    resetGame
  } = useMultiplayerGame();

  const { phase, players, currentPlayerIndex, votes } = gameState;

  // 1. No Room -> Lobby
  if (!roomId || !myPlayerId) {
    return (
      <Layout>
        <Lobby onCreateRoom={createRoom} onJoinRoom={joinRoom} />
      </Layout>
    );
  }

  // 2. Room Joined -> Game Logic
  return (
    <Layout>
      {phase === 'SETUP' && (
        <Setup
          players={players}
          isHost={isHost}
          roomId={roomId}
          onStartGame={startGame}
        />
      )}

      {(phase === 'ACTING' || phase === 'VOTING') && (
        <TurnFlow
          actor={players[currentPlayerIndex]}
          players={players}
          myPlayerId={myPlayerId}
          votes={votes}
          phase={phase}
          onStartVoting={startTurnVoting}
          onSubmitVote={submitMyVote}
        />
      )}

      {phase === 'RESULTS' && (
        <Results
          players={players}
          votes={votes}
          onNextRound={nextRound}
          onReset={resetGame}
        />
      )}

      {/* Fallback / Loading State */}
      {!['SETUP', 'ACTING', 'VOTING', 'RESULTS'].includes(phase) && (
        <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-4">
          <div className="animate-spin text-4xl">⌛</div>
          <div>
            <p>Loading Game State...</p>
            <p className="text-xs mt-2 text-slate-500">Phase: {phase || 'undefined'}</p>
            <p className="text-xs text-slate-500">Room: {roomId}</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="text-xs text-blue-400 underline mt-4"
          >
            Reload App
          </button>
        </div>
      )}
    </Layout>
  );
}

export default App;
