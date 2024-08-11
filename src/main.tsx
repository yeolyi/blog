import './index.css';

import { createRoot } from 'react-dom/client';
import { createBrowserRouter, Link, RouterProvider } from 'react-router-dom';

import { mdxComponents } from './components/mdx';
import Test from './test.mdx';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <div>
        <h1>Hello World</h1>
        <Link to="about">About Us</Link>
      </div>
    ),
  },
  {
    path: 'about',
    element: <Test components={mdxComponents} />,
  },
]);

createRoot(document.getElementById('root')!).render(
  <RouterProvider router={router} />,
);
