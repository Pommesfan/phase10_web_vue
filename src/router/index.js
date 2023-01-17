import HomePage from "@/components/HomePage";
import About from "@/components/About";
import {createRouter, createWebHistory} from "vue-router";
import HelpPage from "@/components/HelpPage";
import Game from "@/components/GamePage";

const routes = [
    {
        path: '/',
        name: 'HomePage',
        component: HomePage
    },
    {
        path: '/about',
        name: 'AboutPage',
        component: About
    },
    {
        path: '/help',
        name: 'HelpPage',
        component: HelpPage
    },
    {
        path: '/game',
        name: 'GamePage',
        component: Game
    }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router