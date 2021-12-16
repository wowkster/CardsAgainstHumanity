import { useAuth } from 'hooks'
import MainLayout from 'pages/MainLayout'
import React from 'react'
import { Navigate } from 'react-router-dom'

const Home = React.lazy(() => import('pages/home/Home'))
const LoginLayout = React.lazy(() => import('pages/login/LoginLayout'))
const Login = React.lazy(() => import('pages/login/Login'))
const SignUp = React.lazy(() => import('pages/login/SignUp'))
const UsernamePrompt = React.lazy(() => import('pages/login/UsernamePrompt'))
const LoginCallback = React.lazy(() => import('pages/login/LoginCallback'))
const FourOhFour = React.lazy(() => import('pages/404'))

const routes = (loggedIn: boolean) => [
    {
        path: '/',
        element: !loggedIn ? <Navigate to='/login' /> : <MainLayout />,
        children: [
            { path: '', element: <Home /> },
            // { path: 'room', element: <Room /> },
            // { path: 'settings', element: <Settings /> },
        ]
    },
    {
        path: '/login',
        element: <LoginLayout />,
        children: [
            { path: '', element: <Login /> },
            { path: 'register', element: <SignUp /> },
            { path: 'username', element: <UsernamePrompt /> },
            { path: 'callback', element: <LoginCallback /> },
        ]
    },
    {
        path: '/*',
        element: <FourOhFour/>
    }
]

export default routes
