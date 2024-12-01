import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { useEffect, useState } from 'react';

export function FirestoreDebugger() {
  const [data, setData] = useState<any>({});

  useEffect(() => {
    // Monitorar coleção de jogos
    const unsubGames = onSnapshot(collection(db, 'games'), (snapshot) => {
      const games: any = {};
      snapshot.forEach((doc) => {
        games[doc.id] = doc.data();
      });
      setData((prev) => ({ ...prev, games }));
    });

    // Monitorar coleção de usuários
    const unsubUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
      const users: any = {};
      snapshot.forEach((doc) => {
        users[doc.id] = doc.data();
      });
      setData((prev: any) => ({ ...prev, games }));
      setData((prev: any) => ({ ...prev, users }));
    });

    return () => {
      unsubGames();
      unsubUsers();
    };
  }, []);

  return (
    <div className='fixed bottom-4 right-4 p-4 bg-white shadow-lg rounded-lg max-w-md max-h-96 overflow-auto'>
      <h3 className='font-bold mb-2'>Firestore Data</h3>
      <pre className='text-xs'>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
