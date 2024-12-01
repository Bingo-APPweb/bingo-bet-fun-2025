import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Trophy, Bell, MessageSquare, Video, Heart, Share2, ThumbsUp } from 'lucide-react';

const CompleteInterface = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showChat, setShowChat] = useState(true);

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Top Navigation */}
      <nav className='bg-white border-b p-4'>
        <div className='max-w-7xl mx-auto flex justify-between items-center'>
          <div className='flex items-center gap-2'>
            <img src='/api/placeholder/40/40' alt='BingoBetFun' className='h-10 w-10 rounded' />
            <span className='text-xl font-bold text-blue-600'>BingoBetFun</span>
          </div>
          <Button onClick={() => setIsLoggedIn(!isLoggedIn)}>
            {isLoggedIn ? 'Logout' : 'Login'}
          </Button>
        </div>
      </nav>

      {/* Main Content */}
      <div className='max-w-7xl mx-auto p-4 md:p-6'>
        <div className='grid grid-cols-1 lg:grid-cols-12 gap-6'>
          {/* Game Column */}
          <div className='lg:col-span-6 space-y-6'>
            {/* Game Status */}
            <Card>
              <CardHeader>
                <CardTitle>Current Game</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='grid grid-cols-3 gap-4 text-center'>
                  <div>
                    <Users className='h-5 w-5 mx-auto mb-1' />
                    <div className='text-2xl font-bold'>156</div>
                    <div className='text-sm text-gray-500'>Players</div>
                  </div>
                  <div>
                    <Trophy className='h-5 w-5 mx-auto mb-1' />
                    <div className='text-2xl font-bold'>3</div>
                    <div className='text-sm text-gray-500'>Winners</div>
                  </div>
                  <div>
                    <Bell className='h-5 w-5 mx-auto mb-1' />
                    <div className='text-2xl font-bold'>42</div>
                    <div className='text-sm text-gray-500'>Numbers</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Bingo Card */}
            <Card>
              <CardHeader>
                <CardTitle className='flex justify-between'>
                  <span>Your Card</span>
                  <span className='text-sm bg-blue-100 px-3 py-1 rounded-full'>
                    Last Number: 42
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='grid grid-cols-5 gap-2'>
                  {Array(25)
                    .fill(null)
                    .map((_, i) => (
                      <Button
                        key={i}
                        variant={Math.random() > 0.7 ? 'secondary' : 'outline'}
                        className='aspect-square text-lg font-bold'
                      >
                        {Math.floor(Math.random() * 75) + 1}
                      </Button>
                    ))}
                </div>
                <div className='flex justify-between mt-4'>
                  <Button variant='default'>Start Game</Button>
                  <Button variant='secondary'>
                    <Trophy className='h-4 w-4 mr-2' />
                    BINGO!
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stream Column */}
          <div className='lg:col-span-6 space-y-6'>
            {/* Stream Preview */}
            <Card>
              <CardHeader>
                <CardTitle className='flex justify-between items-center'>
                  <div className='flex items-center gap-2'>
                    <Video className='h-5 w-5' />
                    Live Stream
                  </div>
                  <div className='flex items-center gap-4 text-sm'>
                    <div className='flex items-center gap-1'>
                      <Users className='h-4 w-4' />
                      1.2k
                    </div>
                    <div className='flex items-center gap-1'>
                      <Heart className='h-4 w-4' />
                      3.4k
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <div className='aspect-video bg-gray-900 rounded-lg flex items-center justify-center text-white'>
                Stream Preview
              </div>
              <div className='p-4 flex justify-between items-center'>
                <div className='flex gap-4'>
                  <Button variant='ghost' size='sm'>
                    <ThumbsUp className='h-4 w-4 mr-1' />
                    Like
                  </Button>
                  <Button variant='ghost' size='sm'>
                    <Share2 className='h-4 w-4 mr-1' />
                    Share
                  </Button>
                </div>
                <Button variant='ghost' size='sm' onClick={() => setShowChat(!showChat)}>
                  <MessageSquare className='h-4 w-4 mr-1' />
                  {showChat ? 'Hide Chat' : 'Show Chat'}
                </Button>
              </div>
            </Card>

            {/* Chat */}
            {showChat && (
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <MessageSquare className='h-5 w-5' />
                    Live Chat
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='h-[300px] bg-gray-50 rounded-lg p-4 mb-4 overflow-y-auto space-y-2'>
                    {Array(5)
                      .fill(null)
                      .map((_, i) => (
                        <div key={i} className='flex gap-2'>
                          <img
                            src='/api/placeholder/24/24'
                            alt='avatar'
                            className='h-6 w-6 rounded-full'
                          />
                          <div>
                            <span className='font-medium mr-2'>Player {i + 1}</span>
                            <span className='text-sm text-gray-600'>Great game everyone!</span>
                          </div>
                        </div>
                      ))}
                  </div>
                  <div className='flex gap-2'>
                    <input
                      type='text'
                      placeholder='Type a message...'
                      className='flex-1 px-3 py-2 border rounded-lg'
                    />
                    <Button>Send</Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompleteInterface;
