import React from 'react'
import Loadable from "react-loadable"
import "babel-polyfill";

const loadingComponent = ({ error, pastDelay }) => {
    if (error) {
      return <div>出错了,请刷新重试!</div>;
    } else if (pastDelay) {
      return <div />;
    } else {
      return null;
    }
};

let config = [
    {
        name: '/',
        path: '/',
        exact: true,
        component: Loadable({
            loader: () => import('../components/index/index.js'),
            loading: loadingComponent,
            delay: 300,
        })
    },
    {
        name: 'home',
        path: '/home',
        exact: true,
        component: Loadable({
            loader: () => import('../components/articles/articles.js'),
            loading: loadingComponent,
            delay: 300,
        })
    },
    {
        name: 'hot',
        path: '/hot',
        exact: true,
        component: Loadable({
            loader: () => import('../components/articles/articles.js'),
            loading: loadingComponent,
            delay: 300,
        })
    },
    {
        name: 'timeLine',
        path: '/timeLine',
        exact: true,
        component: Loadable({
            loader: () => import('../components/timeLine/timeLine.js'),
            loading: loadingComponent,
            delay: 300,
        })
    },
    {
        name: 'photoAlbum',
        path: '/photoAlbum',
        exact: true,
        component: Loadable({
            loader: () => import('../components/photoAlbum/index.js'),
            loading: loadingComponent,
            delay: 300,
        })
    },
    {
        name: 'life',
        path: '/life',
        exact: true,
        component: Loadable({
            loader: () => import('../components/life/life.js'),
            loading: loadingComponent,
            delay: 300,
        })
    },
    {
        name: 'message',
        path: '/message',
        exact: true,
        component: Loadable({
            loader: () => import('../pages/MessageBoard/MessageBoard.js'),
            loading: () => <div />
        })
    },
    {
        name: 'about',
        path: '/about',
        exact: true,
        component: Loadable({
            loader: () => import('../components/about/index.js'),
            loading: loadingComponent,
            delay: 300,
        })
    },
    {
        name: 'articles',
        path: '/articles',
        exact: true,
        component: Loadable({
            loader: () => import('../pages/articles/articles.js'),
            loading: loadingComponent,
            delay: 300,
        })
    },
    {
        name: 'articleDetail',
        path: '/articleDetail',
        exact: true,
        component: Loadable({
            loader: () => import('../pages/articleDetail/articleDetail.js'),
            loading: () => <div />
        })
    },
    {
        name: 'project',
        path: '/project',
        exact: true,
        component: Loadable({
            loader: () => import('../components/project/project.js'),
            loading: loadingComponent,
            delay: 300,
        })
    },
    {
        name: 'links',
        path: '/links',
        exact: true,
        component: Loadable({
            loader: () => import('../pages/links/links.js'),
            loading: loadingComponent,
            delay: 300,
        })
    },
]

export default config