import HomePage from "@/components/HomePage";
import About from "@/components/About";
import {createRouter, createWebHistory} from "vue-router";
import HelpPage from "@/components/HelpPage";

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
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router