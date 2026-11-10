import { createRoot } from 'react-dom/client'
import './index.css'
import 'material-symbols/rounded.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router';
import router from './routes/routes.tsx';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
    <QueryClientProvider client={queryClient}>
        <RouterProvider router={router}/>
    </QueryClientProvider>
)
