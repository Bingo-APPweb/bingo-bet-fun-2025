import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Trophy, Users, Star, Activity, TrendingUp } from 'lucide-react';

const PlayerDashboard = () => {
  const [playerStats, setPlayerStats] = useState({
    gamesPlayed: 0,
    wins: 0,
    winRate: 0,
    favoritePatterns: [],
    recentGames: [],
  });

  const [streamStats, setStreamStats] = useState({
    viewers: 0,
    engagement: 0,
    participants: 0,
    currentGame: null,
  });

  // Simulated stats update - replace with real Firebase data
  useEffect(() => {
    const interval = setInterval(() => {
      setStreamStats((prev) => ({
        viewers: Math.floor(Math.random() * 1000) + 500,
        engagement: (Math.random() * 100).toFixed(1),
        participants: Math.floor(Math.random() * 100) + 50,
        currentGame: 'Game #12345',
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className='p-6 max-w-7xl mx-auto'>
      <h2 className='text-3xl font-bold mb-6 text-blue-600'>Player Dashboard</h2>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        {/* Player Stats */}
        <Card>
          <CardHeader className='flex flex-row items-center justify-between pb-2'>
            <CardTitle className='text-sm font-medium'>Games Played</CardTitle>
            <Trophy className='h-4 w-4 text-yellow-500' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{playerStats.gamesPlayed}</div>
            <p className='text-xs text-muted-foreground'>Win Rate: {playerStats.winRate}%</p>
          </CardContent>
        </Card>

        {/* Active Viewers */}
        <Card>
          <CardHeader className='flex flex-row items-center justify-between pb-2'>
            <CardTitle className='text-sm font-medium'>Active Viewers</CardTitle>
            <Users className='h-4 w-4 text-blue-500' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{streamStats.viewers}</div>
            <p className='text-xs text-muted-foreground'>Live Now</p>
          </CardContent>
        </Card>

        {/* Engagement Rate */}
        <Card>
          <CardHeader className='flex flex-row items-center justify-between pb-2'>
            <CardTitle className='text-sm font-medium'>Engagement</CardTitle>
            <Activity className='h-4 w-4 text-green-500' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{streamStats.engagement}%</div>
            <p className='text-xs text-muted-foreground'>Average interaction rate</p>
          </CardContent>
        </Card>

        {/* Active Participants */}
        <Card>
          <CardHeader className='flex flex-row items-center justify-between pb-2'>
            <CardTitle className='text-sm font-medium'>Players</CardTitle>
            <TrendingUp className='h-4 w-4 text-purple-500' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{streamStats.participants}</div>
            <p className='text-xs text-muted-foreground'>In current game</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Games and Achievements */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-6'>
        <Card>
          <CardHeader>
            <CardTitle>Recent Games</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {playerStats.recentGames.map((game, i) => (
                <div key={i} className='flex items-center justify-between border-b pb-2'>
                  <span>{game.id}</span>
                  <span className={game.won ? 'text-green-500' : 'text-red-500'}>
                    {game.won ? 'Won' : 'Lost'}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Achievements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-2 gap-4'>
              {[
                { name: 'First Win', icon: Trophy },
                { name: 'Speed King', icon: Activity },
                { name: 'Pattern Master', icon: Star },
                { name: 'Social Star', icon: Users },
              ].map((achievement, i) => (
                <div key={i} className='flex items-center gap-2 p-2 bg-gray-50 rounded-lg'>
                  <achievement.icon className='h-5 w-5 text-yellow-500' />
                  <span className='text-sm font-medium'>{achievement.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PlayerDashboard;
